import prisma from "../prismaClient";

export const createOrderService = async (userId: number) => {
  try {
    // Lấy giỏ hàng của user
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            productVariant: true, // để có giá, size, màu
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, message: "Cart is empty" };
    }

    // Tính tổng giá trị
    const totalPrice = cart.items.reduce((sum, item) => {
      return (
        sum + Number(item.quantity) * Number(item.productVariant.price) // lấy giá thật
      );
    }, 0);

    // Tạo order kèm orderItems
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            priceAtPurchase: item.productVariant.price, // chốt giá tại thời điểm checkout
          })),
        },
      },
      include: { items: true },
    });

    // Clear giỏ hàng
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { success: true, order };
  } catch (error) {
    return { success: false, error };
  }
};

export const getOrdersService = async (userId: number) => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
  });
};

export const getOrderByIdService = async (id: number, userId: number) => {
  return prisma.order.findFirst({
    where: { id, userId }, // để không xem order người khác
    include: { items: true },
  });
};

export const updateOrderStatusService = async (
  id: number,
  status: string,
  userId: number
) => {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
};

export const deleteOrderService = async (id: number, userId: number) => {
  await prisma.orderItem.deleteMany({
    where: { orderId: id },
  });

  return prisma.order.delete({
    where: { id },
  });
};
