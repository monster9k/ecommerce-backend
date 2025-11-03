import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";
import upload from "../config/cloudinary";
import {
  createProduct,
  getProductDashBoard,
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
  router.post("/api/product", upload.single("image"), createProduct);
  router.get("/api/productDB", getProductDashBoard);
  router.get("/api/product", getProducts);
  router.get("/api/product/:id", getProductById);
  router.put("/api/product/:id", upload.single("image"), editProduct);
  router.delete("/api/product/:id", upload.single("image"), deleteProduct);
  return app.use("/", router);
};

export default productRouter;
