import { Request, Response } from "express";
import { createStyleService } from "../services/styleService";

export const createStyle = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const style = await createStyleService(name);
    res.status(201).json(style);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getStyle = () => {};
