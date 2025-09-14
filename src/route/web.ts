import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import {
  loginUser,
  getUser,
  createUser,
  getAccountInfo,
} from "../controllers/userController";
import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let initWebRouters = (app: Express) => {
  router.use(auth);
  router.get("/api/hello", (Request, Response) => {
    Response.send("hello");
  });
  router.post("/api/register", createUser);
  router.post("/api/login", loginUser);
  router.get("/api/getAllUser", vertifyRole("admin"), getUser);
  router.get("/api/account", getAccountInfo);
  return app.use("/", router);
};

export default initWebRouters;
