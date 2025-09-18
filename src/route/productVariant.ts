import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import {
  createProductVariant,
  getProductVariants,
  editProductVariant,
  deleteProductVariant,
} from "../controllers/productVariantController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let productVariantRouter = (app: Express) => {
  router.use(auth);
  // ProductVariant
  router.post("/api/product-variant", createProductVariant);
  router.get("/api/product-variant", getProductVariants);
  router.put("/api/product-variant/:id", editProductVariant);
  router.delete("/api/product-variant/:id", deleteProductVariant);
  return app.use("/", router);
};

export default productVariantRouter;
