<<<<<<< HEAD
import express from "express";
import { home, search } from "../controller/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controller/userControlloer";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
=======
import express from "express";
import { home, search } from "../controller/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controller/userControlloer";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
>>>>>>> 3d56e735527d06c899ce66371cd52eb613986432
