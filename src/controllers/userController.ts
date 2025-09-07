import { Request, Response } from "express";
import { createUserService } from "../services/userService";

let createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  let result = await createUserService(username, email, password);

  return res.status(200).json({
    result,
  });
};

export { createUser };
