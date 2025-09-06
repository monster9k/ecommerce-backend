import express from "express";
import { Express } from "express";

let router = express.Router();

let initWebRouters = (app: Express) => {
  router.get("/test", (req, res) => {
    res.send("Hello Router");
  });
  return app.use("/", router);
};

export default initWebRouters;
