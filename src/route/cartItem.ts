import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import {
  addCartItem,
  getCartItems,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cartItemController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let cartItemRouter = (app: Express) => {
  router.use(auth);
  // CartItem
  router.post("/api/cart-item", addCartItem);
  router.get("/api/cart-item", getCartItems);
  router.put("/api/cart-item/:id", updateCartItem);
  router.delete("/api/cart-item/:id", deleteCartItem);
  return app.use("/", router);
};

export default cartItemRouter;
