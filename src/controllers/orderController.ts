import { Request, Response } from "express";
import {
  createOrderService,
  deleteOrderAdminService,
  getAllOrdersAdminService,
  getOrdersByUserService,
  updateOrderAdminService,
} from "../services/orderService";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; //xac thuc jwt
    const { fullName, phone, address, totalPrice, paymentMethod } = req.body;

    if (!fullName || !phone || !address) {
      return res.status(400).json({
        message: "Missing required fields (fullName, phone, address)",
      });
    }

    const newOrder = await createOrderService(Number(userId), {
      fullName,
      phone,
      address,
      totalPrice,
      paymentMethod,
    });

    return res.status(201).json({
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Lấy userId từ token đã xác thực

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await getOrdersByUserService(Number(userId));

    return res.status(200).json({
      message: "Get orders successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
// [GET] /api/admin/orders?search=...
export const getAllOrdersAdmin = async (req: Request, res: Response) => {
  try {
    // Lấy từ khóa search từ query param
    const search = req.query.search as string;

    const orders = await getAllOrdersAdminService(search);

    // Map dữ liệu để khớp với Interface Frontend (OrderDataType)
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      user: order.user, // Prisma đã include user
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      shippingAddress: order.shippingAddress,
      phone: order.phone,
      paymentMethod: order.paymentMethod,
      isPaid: order.isPaid,
      // Tính tổng số lượng sản phẩm
      itemCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
    }));

    return res.status(200).json({
      message: "Get all orders successfully",
      data: formattedOrders,
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

// [PUT] /api/admin/orders/:id
export const updateOrderAdmin = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const { status, isPaid } = req.body; // Lấy các trường cần update

    if (!orderId) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const updatedOrder = await updateOrderAdminService(orderId, {
      status,
      isPaid,
      // Có thể thêm shippingAddress nếu muốn cho admin sửa địa chỉ
    });

    return res.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

// [DELETE] /api/admin/orders/:id
export const deleteOrderAdmin = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);

    if (!orderId) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    await deleteOrderAdminService(orderId);

    return res.status(200).json({
      message: "Order deleted successfully",
      data: { id: orderId }, // Trả về ID để FE lọc bỏ khỏi state
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
