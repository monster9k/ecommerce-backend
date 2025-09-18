import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import {
  addOrderItem,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem,
} from "../controllers/orderItemController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let orderItemRouter = (app: Express) => {
  router.use(auth);
  // OrderItem
  router.post("/api/order-item", addOrderItem);
  router.get("/api/order-item", getOrderItems);
  router.put("/api/order-item/:id", updateOrderItem);
  router.delete("/api/order-item/:id", deleteOrderItem);

  return app.use("/", router);
};

export default orderItemRouter;
