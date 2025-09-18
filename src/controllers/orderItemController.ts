import { Request, Response } from "express";
import {
  addOrderItemService,
  getOrderItemsService,
  updateOrderItemService,
  deleteOrderItemService,
} from "../services/orderItemService";

export const addOrderItem = async (req: Request, res: Response) => {
  const { orderId, productVariantId, quantity, priceAtPurchase } = req.body;
  const result = await addOrderItemService(
    Number(orderId),
    Number(productVariantId),
    Number(quantity),
    Number(priceAtPurchase)
  );
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};

export const getOrderItems = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await getOrderItemsService(Number(orderId));
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};

export const updateOrderItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const result = await updateOrderItemService(Number(id), Number(quantity));
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};

export const deleteOrderItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteOrderItemService(Number(id));
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};
