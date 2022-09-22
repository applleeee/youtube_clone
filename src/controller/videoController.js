import Video from "../models/video";
import Comment from "../models/Comment";
import User from "../models/User";
import moment from "moment";
import { async } from "regenerator-runtime";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "", videos });
};

export const watch = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id).populate("owner").populate("comments");
  console.log(video);
  if (video) {
    return res.render("watch", { pageTitle: video.title, video });
  } else {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
};

//비디오 정보 수정
export const getEdit = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.session.user;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "권한이 없습니다");
    return res.status(403).redirect("/");
  }
  return res.render("edit-video", {
    pageTitle: `${video.title}`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.session.user;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

//비디오 업로드
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "동영상 업로드" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  const now = moment().format("YY-MM-DD");
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbnail: thumb[0].path.replace(/[\\]/g, "/"),
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
      createdAt: now,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "동영상 업로드",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.session.user;
  const user = await User.findById(_id);
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  await user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

export const search = async (req, res) => {
  const keyword = req.query.keyword;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "검색", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

// 영상 댓글 작성
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }

  const userDB = await User.findById(user._id);

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });

  video.comments.push(comment._id);
  userDB.comments.push(comment._id);
  video.save();
  userDB.save();
  return res.status(201).json({ newCommentId: comment._id });
};

// 영상 댓글 삭제
export const deleteComment = async (req, res) => {
  const userId = req.session.user._id;
  const videoId = req.params.id;
  const commentId = req.body.commentId;

  const comment = await Comment.findById(commentId).populate("owner");
  const video = await Video.findById(videoId);
  const user = await User.findById(userId);

  if (String(userId) !== String(comment.owner._id)) {
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res.status(404).redirect("/");
  }

  video.comments.splice(video.comments.indexOf(commentId), 1);
  user.comments.splice(user.comments.indexOf(commentId), 1);
  await video.save();
  await user.save();
  await Comment.findByIdAndDelete(commentId);

  return res.sendStatus(200);
};
