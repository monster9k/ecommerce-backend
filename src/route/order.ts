import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import {
  createOrder,
  getOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let orderRouter = (app: Express) => {
  router.use(auth);
  // Order
  router.post("/api/order", createOrder);
  router.get("/api/all-oders", getAllOrders);
  router.get("/api/order", getOrders);
  router.get("/api/order/:id", getOrderById);
  router.put("/api/order/:id", updateOrderStatus);
  router.delete("/api/order/:id", deleteOrder);
  return app.use("/", router);
};

export default orderRouter;
