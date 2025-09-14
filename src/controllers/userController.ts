import { Request, Response } from "express";

import {
  loginUserService,
  getUserService,
  createUserService,
} from "../services/userService";
import { AuthRequest } from "../middleware/auth";

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

let getAccountInfo = (req: AuthRequest, res: Response) => {
  return res.status(200).json(req.user);
};

export { createUser, loginUser, getUser, getAccountInfo };
