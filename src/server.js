<<<<<<< HEAD
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
app.use("/uploads", express.static("uploads")); //uploads폴더 전체에 접근가능하게
app.use("/assets", express.static("assets"));
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", rootRouter);
app.use("/api", apiRouter);

export default app;
=======
import express from "express";
import morgan from "morgan";
import session from "express-session";
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

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads")); //uploads폴더 전체에 접근가능하게
app.use("/assets", express.static("assets"));
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", rootRouter);
app.use("/api", apiRouter);

export default app;
>>>>>>> 3d56e735527d06c899ce66371cd52eb613986432
