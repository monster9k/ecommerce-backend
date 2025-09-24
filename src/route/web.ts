import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";
import upload from "../config/cloudinary";

import {
  loginUser,
  getUser,
  createUser,
  editUser,
  deleteUser,
  getAccountInfo,
} from "../controllers/userController";
import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let initWebRouters = (app: Express) => {
  router.use(auth);
  router.get("/api/hello", (Request, Response) => {
    Response.send("hello");
  });

  // router user
  router.post("/api/register", upload.single("avatar"), createUser);
  router.post("/api/login", loginUser);
  router.get("/api/getAllUser", vertifyRole("admin"), getUser);
  router.put("/api/edit-user/:id", upload.single("avatar"), editUser);
  router.delete(
    "/api/delete-user/:id",
    vertifyRole("admin"),
    upload.single("avatar"),
    deleteUser
  );

  // get account
  router.get("/api/account", getAccountInfo);
  return app.use("/", router);
};

export default initWebRouters;
