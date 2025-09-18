import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let orderRouter = (app: Express) => {
  router.use(auth);
  // Order
  router.post("/api/order", createOrder);
  router.get("/api/order", getOrders);
  router.put("/api/order/:id", updateOrder);
  router.delete("/api/order/:id", deleteOrder);
  return app.use("/", router);
};

export default orderRouter;
