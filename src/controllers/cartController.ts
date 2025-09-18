import { Request, Response } from "express";
import {
  createCartService,
  getCartsService,
  deleteCartService,
} from "../services/cartService";

export const createCart = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const result = await createCartService(Number(userId));
  if (!result.success) {
    return res.status(500).json(result);
  }
  res.json(result);
};

export const getCarts = async (req: Request, res: Response) => {
  const result = await getCartsService();
  if (!result.success) {
    return res.status(500).json(result);
  }
  res.json(result);
};

export const deleteCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteCartService(Number(id));
  if (!result.success) {
    return res.status(500).json(result);
  }
  res.json(result);
};
