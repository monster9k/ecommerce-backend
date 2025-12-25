import { Request, Response } from "express";
import prisma from "../prismaClient";
import {
  loginUserService,
  getUserService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "../services/userService";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

let createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  let avatarUrl =
    process.env.DEFAULT_AVATAR_URL ||
    "https://res.cloudinary.com/dl6vzoiae/image/upload/v1758677497/avatar_mcka5u.jpg";

  let avatarPublicId = process.env.DEFAULT_AVATAR_ID || "avatar_mcka5u";

  // trường hợp có upload ảnh ví dụ như đăng nhập bằng fb hoặc google
  if (req.file) {
    const file = req.file as any;
    avatarUrl = file.path;
    avatarPublicId = file.filename;
  }

  let result = await createUserService(
    username,
    email,
    password,
    avatarUrl,
    avatarPublicId
  );

  return res.status(200).json(result);
};

let loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let result = await loginUserService(email, password);
  return res.status(200).json(result);
};

let getUser = async (req: Request, res: Response) => {
  let data = await getUserService();
  return res.status(200).json(data);
};

let editUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, phone, address } = req.body;

  if (!username || !email) {
    return res.status(400).json({
      success: false,
      message: "Username or Email is required",
    });
  }

  // giờ có thể truy cập req.user
  if (req.user?.role !== "admin" && req.user?.id !== Number(id)) {
    return res.status(403).json({
      success: false,
      message: "You cannot access",
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let avatarUrl = undefined;
    let avatarPublicId = undefined;

    if (req.file) {
      // Nếu có avatar cũ thì xoá khỏi Cloudinary (trừ avatar mặc định)
      if (
        user.avatarPublicId &&
        user.avatarPublicId !== process.env.DEFAULT_AVATAR_ID
      ) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }

      const file = req.file as any;
      avatarUrl = file.path;
      avatarPublicId = file.filename;
    }

    const result = await updateUserService(
      Number(id),
      username,
      email,
      phone,
      address,
      avatarUrl,
      avatarPublicId
    );
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

let deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleteUser = await deleteUserService(Number(id));
    return res.status(200).json(deleteUser);
  } catch (e: any) {
    return res.status(400).json({ message: e.messgae });
  }
};

let getAccountInfo = (req: Request, res: Response) => {
  return res.status(200).json(req.user);
};

export { createUser, loginUser, getUser, getAccountInfo, editUser, deleteUser };
