import express from "express";
import { Express } from "express";

import { auth, vertifyRole } from "../middleware/auth";
import { createStyle, getStyle } from "../controllers/styleController";
let router = express.Router();

let styleRouter = (app: Express) => {
  router.use(auth);
  router.post("/api/style", createStyle);
  router.get("/api/style", getStyle);
  return app.use("/", router);
};

export default styleRouter;
