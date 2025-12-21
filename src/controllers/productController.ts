import prisma from "../prismaClient";
import { Request, Response } from "express";
import {
  createProductService,
  getProductDBService,
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
    const { categoryId, productName, description, variants, styles } = req.body;

    // 1. check category
    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });
    if (!category) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    // 2. parse variants
    const parsedVariants = JSON.parse(variants || "[]");
    if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      return res.status(400).json({ message: "Variants are required" });
    }

    // 3. create product
    const product = await prisma.product.create({
      data: {
        categoryId: Number(categoryId),
        name: productName,
        description,
      },
    });

    // 4. images
    const files = req.files as Express.Multer.File[];
    if (files?.length) {
      await prisma.productImage.createMany({
        data: files.map((f) => ({
          productId: product.id,
          imageUrl: f.path,
          publicId: f.filename,
        })),
      });
    }

    // 5. create variants (CORE FIX)
    await prisma.productVariant.createMany({
      data: parsedVariants.map((v: any) => ({
        productId: product.id,
        size: v.size ?? null,
        color: v.color ?? null,
        price: Number(v.price),
        stock: Number(v.stock),
      })),
    });

    // 6. styles
    if (styles?.length) {
      const styleIds = Array.isArray(styles) ? styles : [styles];
      await prisma.productStyle.createMany({
        data: styleIds.map((id: string) => ({
          productId: product.id,
          styleId: Number(id),
        })),
      });
    }

    // 7. response
    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        variants: true,
        images: true,
        styles: { include: { style: true } },
      },
    });

    const flat = fullProduct!.variants.map((v) => ({
      id: v.id,
      productId: product.id,
      productName: fullProduct!.name,
      categoryName: fullProduct!.category.name,
      description: fullProduct!.description,
      size: v.size,
      color: v.color,
      price: v.price,
      stock: v.stock,
      imageUrl: fullProduct!.images[0]?.imageUrl ?? "",
      styles: fullProduct!.styles.map((s) => s.style.name),
    }));

    return res.status(201).json(flat);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
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
    const {
      page = 1,
      limit = 9,
      categoryId,
      minPrice,
      maxPrice,
      size,
      color,
      styles,
    } = req.query;

    const where: any = {};

    //filter variants
    where.variants = {
      some: {
        ...(size && { size: String(size) }),
        ...(color && { color: String(color) }),
        ...(minPrice || maxPrice
          ? {
              price: {
                ...(minPrice && { gte: Number(minPrice) }),
                ...(maxPrice && { lte: Number(maxPrice) }),
              },
            }
          : {}),
      },
    };

    if (req.query.categoryId) {
      where.categoryId = Number(req.query.categoryId);
    }

    //filtes styles
    if (styles) {
      // neu truyền array thì bth còn nếu truyền vào 1 thì tự động chuyển thành array
      const styleArray = Array.isArray(styles) ? styles : [styles];
      where.styles = {
        some: {
          name: { in: styleArray as string[] },
        },
      };
    }
    //promise all chay 2 luog ss
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          // Lấy ảnh
          id: true,
          name: true,
          images: {
            select: { id: true, imageUrl: true }, // Chỉ lấy url và id của ảnh cho nhẹ
            take: 1,
          },

          variants: {
            select: { price: true },
            take: 1, // Chỉ lấy 1 giá đại diện
          },
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getProductByIdService(Number(id));
    if (result.success) {
      return res.status(200).json(result.product);
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
export const editProduct = async (req: Request, res: Response) => {
  try {
    const variantId = Number(req.params.id);
    const { productName, description, size, color, price, stock, styles } =
      req.body;

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: { include: { images: true } } },
    });

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    const productId = variant.productId;

    //  Update PRODUCT (chỉ khi có data)
    if (productName || description) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          ...(productName && { name: productName }),
          ...(description && { description }),
        },
      });
    }

    //  Update VARIANT
    await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        size,
        color,
        price: Number(price),
        stock: Number(stock),
      },
    });

    //  Update STYLES (chỉ khi gửi lên)
    if (Array.isArray(styles)) {
      await prisma.productStyle.deleteMany({ where: { productId } });
      await prisma.productStyle.createMany({
        data: styles.map((id: number) => ({
          productId,
          styleId: Number(id),
        })),
      });
    }

    //  Update IMAGES (chỉ khi upload mới)
    const files = req.files as Express.Multer.File[];
    if (files?.length) {
      for (const img of variant.product.images) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId);
        }
      }

      await prisma.productImage.deleteMany({ where: { productId } });
      await prisma.productImage.createMany({
        data: files.map((file) => ({
          productId,
          imageUrl: file.path,
          publicId: file.filename,
        })),
      });
    }

    //  Trả về TOÀN BỘ variants
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
      productId,
      productName: fullProduct!.name,
      description: fullProduct!.description,
      categoryName: fullProduct!.category.name,
      size: v.size,
      color: v.color,
      price: v.price,
      stock: v.stock,
      imageUrl: fullProduct!.images[0]?.imageUrl ?? "",
      styles: fullProduct!.styles.map((s) => s.style.name),
    }));

    res.json(flatData);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
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
