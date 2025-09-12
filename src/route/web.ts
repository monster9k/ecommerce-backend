import express from "express";
import { Express } from "express";

import { loginUser, getUser, createUser } from "../controllers/userController";
let router = express.Router();

let initWebRouters = (app: Express) => {
  router.get("/api/hello", (Request, Response) => {
    Response.send("hello");
  });
  router.post("/api/register", createUser);
  router.post("/api/login", loginUser);
  router.get("/api/getAllUser", getUser);
  return app.use("/", router);
};

export default initWebRouters;
