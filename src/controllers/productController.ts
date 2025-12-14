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
    const { productName, description, size, color, price, stock } = req.body;

    const variant = await prisma.productVariant.findUnique({
      where: { id: Number(id) },
      include: { product: true },
    });
    if (!variant) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = variant.product.imageUrl;
    let imagePublicId = variant.product.imagePublicId;

    if (req.file) {
      // Xóa ảnh cũ trên Cloudinary nếu có
      if (variant.product.imagePublicId) {
        await cloudinary.uploader.destroy(variant.product.imagePublicId);
      }

      // Upload ảnh mới (multer-cloudinary đã handle rồi, req.file có sẵn)
      const file = req.file as any;
      imageUrl = file.path;
      imagePublicId = file.filename;
    }

    const updatedProduct = await editProductService(Number(variant.productId), {
      productName,
      description,
      imageUrl: imageUrl ?? "",
      imagePublicId: imagePublicId ?? "",
    });

    const updatedVariant = await editProductVariantService(
      Number(id),
      size || null,
      color || null,
      Number(price),
      Number(stock)
    );

    const result = {
      id: updatedVariant.variant?.id,
      productId: updatedProduct.product?.id,
      productName: updatedProduct.product?.name,
      categoryName: updatedProduct.product?.category?.name,
      description: updatedProduct.product?.description ?? "",
      size: updatedVariant.variant?.size ?? "-",
      color: updatedVariant.variant?.color ?? "-",
      price: Number(updatedVariant.variant?.price),
      stock: updatedVariant.variant?.stock,
      imageUrl: updatedProduct.product?.imageUrl,
    };

    if (updatedProduct.success) {
      return res.json(result);
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
