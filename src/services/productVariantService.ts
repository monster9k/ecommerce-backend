import prisma from "../prismaClient";

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

export const deleteProductVariantService = async (id: number) => {
  try {
    await prisma.productVariant.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
