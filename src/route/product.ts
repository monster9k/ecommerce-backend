import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";
import upload from "../config/cloudinary";
import {
  getProductDashBoard,
  createProductDashBoard,
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

  router.get("/api/productDB", getProductDashBoard);
  router.post(
    "/api/productDB",
    upload.array("image", 3),
    createProductDashBoard
  );
  router.get("/api/product", getProducts);
  router.get("/api/product/:id", getProductById);
  router.put("/api/productDB/:id", upload.array("image", 3), editProduct);
  router.delete("/api/productDB/:id", upload.single("image"), deleteProduct);
  return app.use("/", router);
};

export default productRouter;
