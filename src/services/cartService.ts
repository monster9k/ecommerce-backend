import prisma from "../prismaClient";

// Create Cart
export const addToCartService = async (
  userId: number,
  productVariantId: number,
  quantity: Number
) => {
  try {
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    // check xem cart da co chua neu chua thi tao lai cho chac
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // kiem tra xem san pham bien the nay da co trong gio chua
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId: productVariantId,
      },
    });

    if (existingItem) {
      // Nếu có rồi -> Cộng dồn số lượng
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: Number(existingItem.quantity) + Number(quantity) },
      });
    } else {
      // Nếu chưa có -> Tạo mới
      return await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId,
          quantity: Number(quantity),
        },
      });
    }
  } catch (error) {
    return { success: false, error };
  }
};

// Get all cartss
export const getCartByUserIdService = async (userId: number) => {
  return await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: {
                include: { images: { take: 1 } }, // Lấy tên và 1 ảnh sản phẩm
              },
            },
          },
        },
        orderBy: { id: "desc" }, // Mới thêm lên đầu
      },
    },
  });
};

export const updateCartItemService = async (
  userId: number,
  cartItemId: number,
  quantity: number
) => {
  // Cần check xem cartItem đó có thuộc về userId này không để bảo mật (bỏ qua cho đơn giản)
  if (quantity <= 0) {
    return await prisma.cartItem.delete({ where: { id: cartItemId } });
  }
  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};

export const removeCartItemService = async (cartItemId: number) => {
  return await prisma.cartItem.delete({ where: { id: cartItemId } });
};
