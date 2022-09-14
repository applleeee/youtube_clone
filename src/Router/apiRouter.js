<<<<<<< HEAD
import express from "express";
import { registerView } from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);

export default apiRouter;
=======
import express from "express";
import { registerView } from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);

export default apiRouter;
>>>>>>> 3d56e735527d06c899ce66371cd52eb613986432
