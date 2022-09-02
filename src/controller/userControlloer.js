import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Video from "../models/video";

//회원가입-------
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "회원가입" });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password1, password2, location } = req.body;
  const pageTitle = "회원가입";
  //   username,email이 db에 이미 있는지 확인
  const exists = await User.exists({ $or: [{ username }, { email }] });

  if (password1 !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "중복된 아이디/이메일",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password: password1,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "회원가입",
      errorMessage: error._message,
    });
  }
};

//로그인---------
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "로그인" });
};

export const postLogin = async (req, res) => {
  const { username, password1 } = req.body;
  //1 계정존재 확인
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "로그인",
      errorMessage: "계정이 존재하지 않습니다.",
    });
  }

  //2 비번 확인
  const ok = await bcrypt.compare(password1, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "로그인",
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }
  //세션에 유저 정보 추가
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

//깃허브 계정 로그인(https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps) 참고
export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_signup: false, //계정 연결 창에서 회원가입 여부
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code, //깃허브에게 로그인 요청 후 받은 코드(url에 표시)
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  //fetch로 깃허브 서버에 post 요청(access token을 받기 위해)
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const access_token = tokenRequest.access_token;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = await emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avaterUrl: userData.avater_url,
        username: userData.name
          ? userData.name
          : "User" + Math.floor(Math.random() * 10000),
        name: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
//로그아웃
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
//회원정보 수정
export const getEdit = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "프로필 수정" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avaterUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avaterUrl: file ? file.path : avaterUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  const UserName = await User.findOne({ name });
  const UserEmail = await User.findOne({ email });

  if (UserName.name === name || UserEmail.email === email) {
    return res.render("users/edit-profile", {
      pageTitle: "프로필 수정",
      errorMessage: "이름 또는 이메일이 변경되지 않았습니다",
    });
  }
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

//비밀번호 변경
export const getChangePassword = (req, res) => {
  return res.render("users/change-password", { pageTitle: "비밀번호 변경" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirm },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    //기존 비밀번호 일치 확인
    return res.status(400).render("users/change-password", {
      pageTitle: "비밀번호 변경",
      errorMessage: "기존 비밀번호가 일치하지 않습니다",
    });
  }
  //새 비밀번호와 비밀번호 확인 일치하는지 확인
  if (newPassword !== newPasswordConfirm) {
    return res.status(400).render("users/change-password", {
      pageTitle: "비밀번호 변경",
      errorMessage: "비밀번호를 다시 확인해 주십시오",
    });
  }
  //기존 비밀번호와 새 비밀번호가 같은지 확인
  if (newPassword == oldPassword) {
    return res.status(400).render("users/change-password", {
      pageTitle: "비밀번호 변경",
      errorMessage: "기존 비밀번호와 같습니다",
    });
  }
  //수정된 비밀번호 저장
  user.password = newPassword;
  await user.save();
  req.session.destroy();
  return res.redirect("/");
};

export const seeProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    res.status(404).render("404", { pageTitle: "User not found" });
  }
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  });
};
