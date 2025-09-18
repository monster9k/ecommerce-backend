import prisma from "../prismaClient";

export const addOrderItemService = async (
  orderId: number,
  productVariantId: number,
  quantity: number,
  priceAtPurchase: number
) => {
  try {
    const item = await prisma.orderItem.create({
      data: { orderId, productVariantId, quantity, priceAtPurchase },
    });
    return { success: true, item };
  } catch (error) {
    return { success: false, error };
  }
};

export const getOrderItemsService = async (orderId: number) => {
  try {
    const items = await prisma.orderItem.findMany({
      where: { orderId },
      include: { productVariant: true },
    });
    return { success: true, items };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateOrderItemService = async (id: number, quantity: number) => {
  try {
    const updated = await prisma.orderItem.update({
      where: { id },
      data: { quantity },
    });
    return { success: true, item: updated };
  } catch (error) {
    return { success: false, error };
  }
};

export const deleteOrderItemService = async (id: number) => {
  try {
    await prisma.orderItem.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
