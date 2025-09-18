import prisma from "../prismaClient";
import { Request, Response } from "express";
import {
  createProductService,
  getProductService,
  getProductByIdService,
  editProductService,
  deleteProductService,
} from "../services/productService";
// Product

export const createProduct = async (req: Request, res: Response) => {
  const { categoryId, name, description } = req.body;
  console.log(categoryId, name, description);
  const category = await prisma.category.findUnique({
    where: { id: Number(categoryId) },
  });
  if (!category) {
    return res.status(400).json({ message: "Invalid categoryId" });
  }
  const newProduct = await createProductService(categoryId, name, description);

  if (newProduct && newProduct.success) {
    return res.status(201).json(newProduct.product);
  }
};
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getProductService();
    if (products.success) {
      res.status(200).json(products.products);
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(Number(id));
    if (product.success) {
      return res.status(200).json(product.product);
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
export const editProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryId, name, description } = req.body;

    const updatedProduct = await editProductService(Number(id), {
      categoryId,
      name,
      description,
    });

    if (updatedProduct.success) {
      return res.json(updatedProduct.product);
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteProductService(Number(id));

    if (deleted.success) {
      return res.json({ message: `Product ${id} deleted successfully` });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
