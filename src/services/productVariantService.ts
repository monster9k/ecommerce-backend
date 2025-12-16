import prisma from "../prismaClient";
import { v2 as cloudinary } from "cloudinary";

export const createProductVariantService = async (
  productId: number,
  size: string | null,
  color: string | null,
  price: number,
  stock: number
) => {
  try {
    const newVariant = await prisma.productVariant.create({
      data: {
        productId,
        size,
        color,
        price,
        stock,
      },
    });

    return { success: true, variant: newVariant };
  } catch (error) {
    console.error("Error creating product variant:", error);
    return { success: false, error };
  }
};

export const getProductVariantsService = async () => {
  try {
    const variants = await prisma.productVariant.findMany({
      include: { product: true }, // để lấy thêm thông tin sản phẩm
    });
    return { success: true, variants };
  } catch (error) {
    return { success: false, error };
  }
};

export const editProductVariantService = async (
  id: number,
  size: string | null,
  color: string | null,
  price: number,
  stock: number
) => {
  try {
    const updated = await prisma.productVariant.update({
      where: { id },
      data: {
        ...(size && { size }),
        ...(color && { color }),
        ...(price && { price: Number(price) }),
        ...(stock && { stock: Number(stock) }),
      },
    });
    return { success: true, variant: updated };
  } catch (error) {
    return { success: false, error };
  }
};

export const deleteVariantService = async (variantId: number) => {
  try {
    // Lấy variant
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      return { success: false, message: "Variant not found" };
    }

    const productId = variant.productId;

    // Xóa variant
    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    // Kiểm tra còn variant không
    const remainCount = await prisma.productVariant.count({
      where: { productId },
    });

    //  Nếu còn → dừng ở đây
    if (remainCount > 0) {
      return {
        success: true,
        productDeleted: false,
      };
    }

    // Nếu không còn variant → xóa product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    // xóa ảnh cloudinary
    for (const img of product?.images || []) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    // xóa toàn bộ dữ liệu liên quan
    await prisma.$transaction([
      prisma.productStyle.deleteMany({ where: { productId } }),
      prisma.productImage.deleteMany({ where: { productId } }),
      prisma.product.delete({ where: { id: productId } }),
    ]);

    return {
      success: true,
      productDeleted: true,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
