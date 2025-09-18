import { Request, Response } from "express";
import {
  addCartItemService,
  getCartItemsService,
  updateCartItemService,
  deleteCartItemService,
} from "../services/cartItemService";

export const addCartItem = async (req: Request, res: Response) => {
  const { cartId, productVariantId, quantity } = req.body;
  const result = await addCartItemService(
    Number(cartId),
    Number(productVariantId),
    Number(quantity)
  );
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};

export const getCartItems = async (req: Request, res: Response) => {
  const { cartId } = req.params;
  const result = await getCartItemsService(Number(cartId));
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};

export const updateCartItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const result = await updateCartItemService(Number(id), Number(quantity));
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteCartItemService(Number(id));
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};
