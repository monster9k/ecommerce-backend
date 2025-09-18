import { Request, Response } from "express";
import {
  createProductVariantService,
  getProductVariantsService,
  editProductVariantService,
  deleteProductVariantService,
} from "../services/productVariantService";
import prisma from "../prismaClient";

// Create
export const createProductVariant = async (req: Request, res: Response) => {
  const { productId, size, color, price, stock } = req.body;

  // Kiểm tra productId có tồn tại không
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });
  if (!product) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  const result = await createProductVariantService(
    Number(productId),
    size || null,
    color || null,
    Number(price),
    Number(stock)
  );

  if (result.success) {
    return res.status(201).json(result.variant);
  }
  return res.status(500).json(result.error);
};

// Get all
export const getProductVariants = async (req: Request, res: Response) => {
  const result = await getProductVariantsService();
  if (result.success) {
    return res.status(200).json(result.variants);
  }
  return res.status(500).json(result.error);
};

// Update
export const editProductVariant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { size, color, price, stock } = req.body;

  // Chỉ thêm field khi có giá trị -> tránh undefined

  const result = await editProductVariantService(
    Number(id),
    size || null,
    color || null,
    Number(price),
    Number(stock)
  );

  if (result.success) {
    return res.status(200).json(result.variant);
  }
  return res.status(500).json(result.error);
};

// Delete
export const deleteProductVariant = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteProductVariantService(Number(id));

  if (result.success) {
    return res.status(200).json({ message: "ProductVariant deleted" });
  }
  return res.status(500).json(result.error);
};
