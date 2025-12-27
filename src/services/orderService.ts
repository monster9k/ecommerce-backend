import prisma from "../prismaClient";

export const createOrderService = async (userId: number, data: any) => {
  const { fullName, phone, address, totalPrice, paymentMethod } = data;

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: { productVariant: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Chạy Transaction để đảm bảo toàn vẹn dữ liệu
  // (Mọi thao tác trong này: Tạo đơn, Trừ kho, Xóa giỏ -> Thành công cùng lúc hoặc Thất bại cùng lúc)
  const result = await prisma.$transaction(async (tx) => {
    // Kiem tra ton kho truoc khi tao don
    for (const item of cart.items) {
      if (item.productVariant.stock < item.quantity) {
        throw new Error(
          `Sản phẩm (ID: ${item.productVariant.productId}) Variant (ID: ${item.productVariant.id}) không đủ hàng. Còn lại: ${item.productVariant.stock}`
        );
      }
    }

    // Tao 1 Order moi
    const order = await tx.order.create({
      data: {
        userId: userId,
        totalPrice: totalPrice,
        status: "PENDING", // Trạng thái mặc định khi mới đặt
        shippingAddress: `${address} - (Người nhận: ${fullName})`, // Format địa chỉ kèm tên người nhận
        phone: phone,

        // --- CÁC TRƯỜNG THANH TOÁN MỚI ---
        paymentMethod: paymentMethod,
        isPaid: false, // Mặc định là chưa thanh toán
        // ---------------------------------

        items: {
          create: cart.items.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            priceAtPurchase: item.productVariant.price, // Lưu giá tại thời điểm mua để chốt doanh thu (tránh giá sp thay đổi sau này)
          })),
        },
      },
    });

    // Tru ton kho (stock) cua tung san pham
    for (const item of cart.items) {
      await tx.productVariant.update({
        where: { id: item.productVariant.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Xoa sach item trong gio hang khi dat thanh cong
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });

  return result;
};
