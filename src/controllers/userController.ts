import { Request, Response } from "express";

import {
  loginUserService,
  getUserService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "../services/userService";

let createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  let result = await createUserService(username, email, password);

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
  const { username, email } = req.body;

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
    const user = await updateUserService(Number(id), username, email);
    return res.status(200).json(user);
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
