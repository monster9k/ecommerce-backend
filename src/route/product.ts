import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import {
  createProduct,
  getProducts,
  editProduct,
  deleteProduct,
  getProductById,
} from "../controllers/productController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let productRouter = (app: Express) => {
  router.use(auth);
  // Product
  router.post("/api/product", createProduct);
  router.get("/api/product", getProducts);
  router.get("/api/product/:id", getProductById);
  router.put("/api/product/:id", editProduct);
  router.delete("/api/product/:id", deleteProduct);
  return app.use("/", router);
};

export default productRouter;
