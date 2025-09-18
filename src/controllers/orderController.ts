import { Request, Response } from "express";
import {
  createOrderService,
  getOrdersService,
  updateOrderService,
  deleteOrderService,
} from "../services/orderService";

export const createOrder = async (req: Request, res: Response) => {
  const { userId, totalPrice, status } = req.body;
  const result = await createOrderService(
    Number(userId),
    Number(totalPrice),
    status
  );
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};

export const getOrders = async (req: Request, res: Response) => {
  const result = await getOrdersService();
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};

export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await updateOrderService(Number(id), status);
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteOrderService(Number(id));
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};
