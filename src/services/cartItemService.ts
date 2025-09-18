import prisma from "../prismaClient";

export const addCartItemService = async (
  cartId: number,
  productVariantId: number,
  quantity: number
) => {
  try {
    const item = await prisma.cartItem.create({
      data: { cartId, productVariantId, quantity },
    });
    return { success: true, item };
  } catch (error) {
    return { success: false, error };
  }
};

export const getCartItemsService = async (cartId: number) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { cartId },
      include: { productVariant: true },
    });
    return { success: true, items };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateCartItemService = async (id: number, quantity: number) => {
  try {
    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
    return { success: true, item: updated };
  } catch (error) {
    return { success: false, error };
  }
};

export const deleteCartItemService = async (id: number) => {
  try {
    await prisma.cartItem.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
