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

// Get all cartss
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
