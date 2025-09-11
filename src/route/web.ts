import express from "express";
import { Express } from "express";
import { createUser } from "../controllers/userController";
import { loginUser } from "../controllers/userController";
let router = express.Router();

let initWebRouters = (app: Express) => {
  router.get("/api/hello", (Request, Response) => {
    Response.send("hello");
  });
  router.post("/api/register", createUser);
  router.post("/api/login", loginUser);
  return app.use("/", router);
};

export default initWebRouters;
