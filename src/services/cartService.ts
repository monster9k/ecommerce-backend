import prisma from "../prismaClient";

// Create Cart
export const createCartService = async (userId: number) => {
  try {
    const newCart = await prisma.cart.create({
      data: { userId },
    });
    return { success: true, cart: newCart };
  } catch (error) {
    return { success: false, error };
  }
};

// Get all carts
export const getCartsService = async () => {
  try {
    const carts = await prisma.cart.findMany({
      include: { items: true, user: true },
    });
    return { success: true, carts };
  } catch (error) {
    return { success: false, error };
  }
};

// Delete Cart
export const deleteCartService = async (id: number) => {
  try {
    await prisma.cart.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
