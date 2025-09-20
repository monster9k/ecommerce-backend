import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import { createCart, getCarts } from "../controllers/cartController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let cartRouter = (app: Express) => {
  router.use(auth);
  // Cart
  router.post("/api/cart", createCart);
  router.get("/api/cart", getCarts);

  return app.use("/", router);
};

export default cartRouter;
