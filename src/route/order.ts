import express from "express";
import { Express } from "express";
import { delay } from "../middleware/delay";

import {
  createOrder,
  getOrders,
  getAllOrdersAdmin,
  updateOrderAdmin,
  deleteOrderAdmin,
} from "../controllers/orderController";

import { auth, vertifyRole } from "../middleware/auth";
let router = express.Router();

let orderRouter = (app: Express) => {
  router.use(auth);
  // Order
  router.post("/api/order/create", createOrder);

  router.get("/api/orders", getOrders);

  // 1. Lấy tất cả + Search
  router.get("/api/admin/orders", getAllOrdersAdmin);

  // 2. Cập nhật đơn hàng
  router.put("/api/admin/orders/:id", updateOrderAdmin);

  // 3. Xóa đơn hàng
  router.delete("/api/admin/orders/:id", deleteOrderAdmin);

  return app.use("/", router);
};

export default orderRouter;
