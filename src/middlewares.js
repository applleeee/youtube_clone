<<<<<<< HEAD
import multer from "multer";

// locals: 템플릿에서 사용가능
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "youtube_clone";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "권한이 없습니다");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "권한이 없습니다");
    return res.redirect("/");
  }
};

export const avaterUpload = multer({
  dest: "uploads/avaters",
  limits: { fileSize: 30000000 },
});

export const videoUpload = multer({
  dest: "uploads/videos",
  limits: { fileSize: 100000000 },
});
=======
import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "youtube_clone";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const avaterUpload = multer({
  dest: "uploads/avaters",
  limits: { fileSize: 30000000 },
});

export const videoUpload = multer({
  dest: "uploads/videos",
  limits: { fileSize: 100000000 },
});
>>>>>>> 3d56e735527d06c899ce66371cd52eb613986432
