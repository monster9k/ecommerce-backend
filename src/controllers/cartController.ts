import { Request, Response } from "express";
import {
  addToCartService,
  getCartByUserIdService,
  updateCartItemService,
  removeCartItemService,
} from "../services/cartService";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const { productVariantId, quantity } = req.body;

    if (!productVariantId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const item = await addToCartService(
      Number(userId),
      Number(productVariantId),
      Number(quantity)
    );
    res.status(200).json({ message: "Added to cart", item });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCarts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // xac thuc jwt
    // console.log(userId);
    const cart = await getCartByUserIdService(Number(userId));
    // console.log(cart);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // cartItemId
    const { quantity } = req.body;
    const userId = (req as any).user.id;

    const updatedItem = await updateCartItemService(
      userId,
      Number(id),
      Number(quantity)
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Xóa sản phẩm
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await removeCartItemService(Number(id));
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
