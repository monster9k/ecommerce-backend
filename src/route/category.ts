import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import {
  createCategory,
  getCategories,
  editCategory,
  deleteCategory,
} from "../controllers/categoryController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let categoryRouter = (app: Express) => {
  router.use(auth);
  router.post("/api/category", createCategory);
  router.get("/api/category", getCategories);
  router.put("/api/category/:id", editCategory);
  router.delete("/api/category/:id", deleteCategory);
  return app.use("/", router);
};

export default categoryRouter;
