import { Request, Response } from "express";
import {
  addCartItemService,
  getCartItemsService,
  updateCartItemService,
  deleteCartItemService,
} from "../services/cartItemService";
import prisma from "../prismaClient";

export const addCartItem = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let cart = await prisma.cart.findFirst({
    where: { userId: req.user.id },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.user.id },
    });
  }
  const { productVariantId, quantity } = req.body;
  const result = await addCartItemService(
    Number(cart.id),
    Number(productVariantId),
    Number(quantity)
  );
  if (!result.success) return res.status(500).json(result);
  res.json(result);
};

export const getCartItems = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let cart = await prisma.cart.findFirst({
    where: { userId: req.user.id },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.user.id },
    });
  }
  const result = await getCartItemsService(Number(cart.id));
  console.log(result);
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
