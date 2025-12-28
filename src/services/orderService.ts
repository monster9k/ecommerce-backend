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

export const getOrdersByUserService = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" }, // Sắp xếp đơn mới nhất lên đầu
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  images: true, // Lấy ảnh sản phẩm để hiển thị
                },
              },
            },
          },
        },
      },
    },
  });

  return orders;
};

export const getAllOrdersAdminService = async (search?: string) => {
  // Xây dựng điều kiện lọc (Where clause)
  let whereCondition: any = {};

  if (search) {
    const searchNum = Number(search);

    // Nếu search là số -> Tìm theo Order ID hoặc User ID
    if (!isNaN(searchNum)) {
      whereCondition = {
        OR: [
          { id: searchNum }, // Tìm theo mã đơn
          { userId: searchNum }, // Tìm theo mã user
        ],
      };
    } else {
      // Nếu search là chữ -> Tìm theo Username hoặc Email hoặc SĐT người nhận
      whereCondition = {
        OR: [
          { user: { username: { contains: search } } }, // Tìm theo tên user
          { user: { email: { contains: search } } }, // Tìm theo email
          { phone: { contains: search } }, // Tìm theo sđt giao hàng
        ],
      };
    }
  }

  const orders = await prisma.order.findMany({
    where: whereCondition,
    orderBy: { createdAt: "desc" }, // Mới nhất lên đầu
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
        },
      },
      items: true, // Lấy items để tính tổng số lượng (itemCount)
    },
  });

  return orders;
};

// 2. ADMIN: Cập nhật đơn hàng (Status, Payment)
export const updateOrderAdminService = async (orderId: number, data: any) => {
  // data bao gồm: status, isPaid, shippingAddress...
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: data,
  });
  return updatedOrder;
};

// 3. ADMIN: Xóa đơn hàng
export const deleteOrderAdminService = async (orderId: number) => {
  // Dùng transaction để đảm bảo xóa sạch OrderItem trước khi xóa Order
  // (Tuy nhiên Prisma có thể config cascade delete, nhưng viết code cho chắc)
  const result = await prisma.$transaction(async (tx) => {
    // Xóa item con trước
    await tx.orderItem.deleteMany({
      where: { orderId: orderId },
    });

    // Xóa đơn hàng
    const deleted = await tx.order.delete({
      where: { id: orderId },
    });

    return deleted;
  });

  return result;
};
