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
import { v2 as cloudinary } from "cloudinary";
export const createProduct = async (req: Request, res: Response) => {
  const { categoryId, name, description } = req.body;
  console.log(categoryId, name, description);
  const category = await prisma.category.findUnique({
    where: { id: Number(categoryId) },
  });
  if (!category) {
    return res.status(400).json({ message: "Invalid categoryId" });
  }

  let imageUrl = "";
  let imagePublicId = "";
  if (req.file) {
    const file = req.file as any;
    imageUrl = file.path; // url ảnh
    imagePublicId = file.filename; // public_id ảnh
  }

  const newProduct = await createProductService(
    categoryId,
    name,
    description,
    imageUrl,
    imagePublicId
  );

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

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.imageUrl;
    let imagePublicId = product.imagePublicId;

    if (req.file) {
      // Xóa ảnh cũ trên Cloudinary nếu có
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      // Upload ảnh mới (multer-cloudinary đã handle rồi, req.file có sẵn)
      const file = req.file as any;
      imageUrl = file.path;
      imagePublicId = file.filename;
    }

    const updatedProduct = await editProductService(Number(id), {
      categoryId,
      name,
      description,
      imageUrl: imageUrl ?? "",
      imagePublicId: imagePublicId ?? "",
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

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    // Xóa product và các variant liên quan (nếu có)
    // đảm bảo khi xóa product thì khách hàng không thể mua các variant của product đó nữa

    const deleted = await deleteProductService(Number(id));

    console.log(deleted);
    if (deleted.success) {
      return res.json({ message: `Product ${id} deleted successfully` });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
