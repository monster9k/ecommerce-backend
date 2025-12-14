import prisma from "../prismaClient";
import { Request, Response } from "express";
import {
  createProductService,
  getProductDBService,
  getProductService,
  getProductByIdService,
  editProductService,
  deleteProductService,
} from "../services/productService";
import {
  createProductVariantService,
  editProductVariantService,
} from "../services/productVariantService";
// Product
import { v2 as cloudinary } from "cloudinary";

export const createProductDashBoard = async (req: Request, res: Response) => {
  try {
    const { categoryId, name, description, size, color, price, stock, styles } =
      req.body;

    //  check category
    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });
    if (!category) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    //  create product
    const productData = await createProductService(
      Number(categoryId),
      name,
      description
    );
    if (!productData?.success) {
      return res.status(500).json({ message: "Failed to create product" });
    }

    const product = productData.product;

    //  save images
    const files = req.files as Express.Multer.File[];
    if (files?.length) {
      await prisma.productImage.createMany({
        data: files.map((file) => ({
          productId: product.id,
          imageUrl: file.path,
          publicId: file.filename,
        })),
      });
    }

    // create variant
    await createProductVariantService(
      product.id,
      size || null,
      color || null,
      Number(price) || 0,
      Number(stock) || 0
    );

    //  assign styles
    if (styles?.length) {
      await prisma.productStyle.createMany({
        data: styles.map((styleId: number) => ({
          productId: product.id,
          styleId: Number(styleId),
        })),
      });
    }

    //  QUERY LẠI FULL PRODUCT

    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        variants: true,
        images: true,
        styles: { include: { style: true } },
      },
    });

    if (!fullProduct) {
      return res
        .status(500)
        .json({ message: "Product not found after create" });
    }

    //  FLATTEN GIỐNG GET
    const flatData = fullProduct.variants.map((v) => ({
      id: v.id,
      productId: fullProduct.id,
      productName: fullProduct.name,
      categoryName: fullProduct.category.name,
      size: v.size,
      color: v.color,
      price: v.price,
      stock: v.stock,
      imageUrl: fullProduct.images[0]?.imageUrl ?? "",
      styles: fullProduct.styles.map((s) => s.style.name),
    }));

    // 8️⃣ return
    return res.status(201).json(flatData);
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductDashBoard = async (req: Request, res: Response) => {
  try {
    const products = await getProductDBService();
    if (products.success) {
      res.status(200).json(products.products);
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
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
    const { id } = req.params; // variant id
    const { productName, description, size, color, price, stock, styles } =
      req.body;

    const variant = await prisma.productVariant.findUnique({
      where: { id: Number(id) },
      include: { product: { include: { images: true } } },
    });
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    const productId = variant.productId;

    const updatedProduct = await editProductService(Number(productId), {
      productName,
      description,
    });

    const files = req.files as Express.Multer.File[];
    if (files?.length) {
      // xóa ảnh cũ trên cloudinary
      for (const img of variant.product.images) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId);
        }
      }

      await prisma.productImage.deleteMany({
        where: { productId },
      });

      // tạo ảnh mới
      await prisma.productImage.createMany({
        data: files.map((file) => ({
          productId,
          imageUrl: file.path,
          publicId: file.filename,
        })),
      });
    }

    if (styles) {
      await prisma.productStyle.deleteMany({
        where: { productId },
      });

      await prisma.productStyle.createMany({
        data: styles.map((styleId: number) => ({
          productId,
          styleId: Number(styleId),
        })),
      });
    }

    const updatedVariant = await editProductVariantService(
      Number(id),
      size || null,
      color || null,
      Number(price),
      Number(stock)
    );

    const fullProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        variants: true,
        images: true,
        styles: { include: { style: true } },
      },
    });

    const flatData = fullProduct!.variants.map((v) => ({
      id: v.id,
      productId: fullProduct!.id,
      productName: fullProduct!.name,
      categoryName: fullProduct!.category.name,
      size: v.size,
      color: v.color,
      price: v.price,
      stock: v.stock,
      imageUrl: fullProduct!.images[0]?.imageUrl ?? "",
      styles: fullProduct!.styles.map((s) => s.style.name),
    }));

    return res.json(flatData);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { images: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    for (const img of product.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
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
