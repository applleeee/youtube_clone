import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./Router/rootRouter";
import userRouter from "./Router/userRouter";
import videoRouter from "./Router/videoRouter";
import apiRouter from "./Router/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));
// app.use(express.text()); 웹에서 온 텍스트 읽음(두 가지 이상 정보 받아 객체 형태로 만들 수가 없음)
app.use(express.json()); // 대신 .json 사용

//세션 사용(express-session) 로그인한 유저 정보 저장
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);
app.use(flash()); // locals에 message 생성(템플릿에서 사용 가능)
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads")); //uploads폴더 전체에 접근가능하게..
app.use("/assets", express.static("assets"));
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", rootRouter);
app.use("/api", apiRouter);

export default app;
