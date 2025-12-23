import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import {
  addToCart,
  getCarts,
  updateCartItem,
} from "../controllers/cartController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let cartRouter = (app: Express) => {
  router.use(auth);
  // Cart
  router.get("/api/cart", getCarts);
  router.post("/api/cart/add", addToCart);
  router.put("/api/cart/update/:id", updateCartItem);
  return app.use("/", router);
};

export default cartRouter;
