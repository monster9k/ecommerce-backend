import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import { createOrder } from "../controllers/orderController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let orderRouter = (app: Express) => {
  router.use(auth);
  // Order
  router.post("/api/order/create", createOrder);
  return app.use("/", router);
};

export default orderRouter;
