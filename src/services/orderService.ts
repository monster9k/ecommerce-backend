import prisma from "../prismaClient";

export const createOrderService = async (
  userId: number,
  totalPrice: number,
  status: string
) => {
  try {
    const order = await prisma.order.create({
      data: { userId, totalPrice, status },
    });
    return { success: true, order };
  } catch (error) {
    return { success: false, error };
  }
};

export const getOrdersService = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, user: true },
    });
    return { success: true, orders };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateOrderService = async (id: number, status: string) => {
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return { success: true, order: updated };
  } catch (error) {
    return { success: false, error };
  }
};

export const deleteOrderService = async (id: number) => {
  try {
    await prisma.order.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
