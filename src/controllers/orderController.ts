import { Request, Response } from "express";
import {
  createOrderService,
  getOrdersByUserService,
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
