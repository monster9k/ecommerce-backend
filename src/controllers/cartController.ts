import { Request, Response } from "express";
import { createCartService, getCartsService } from "../services/cartService";

export const createCart = async (req: Request, res: Response) => {
  const dataId = req.user?.id;
  const result = await createCartService(Number(dataId));
  console.log(result);
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
