import { Request, Response } from "express";
import {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  deleteOrderService,
} from "../services/orderService";

export const createOrder = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const result = await createOrderService(req.user.id);
  if (!result.success) return res.status(400).json(result);
  res.json(result.order);
};

export const getOrders = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const orders = await getOrdersService(req.user.id);
  res.json(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const order = await getOrderByIdService(Number(req.params.id), req.user.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { status } = req.body;
  const order = await updateOrderStatusService(
    Number(req.params.id),
    status,
    req.user.id
  );
  res.json(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  await deleteOrderService(Number(req.params.id), req.user.id);
  res.json({ success: true });
};
