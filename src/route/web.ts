import express from "express";
import { Express } from "express";
import { createUser } from "../controllers/userController";

let router = express.Router();

let initWebRouters = (app: Express) => {
  router.post("/api/register", createUser);
  return app.use("/", router);
};

export default initWebRouters;
