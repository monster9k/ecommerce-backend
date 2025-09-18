import { Request, Response } from "express";
import {
  createCategoryService,
  getCategoriesService,
  editCategoryService,
  deleteCategoryService,
} from "../services/categoryService";
// Category
let createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const category = await createCategoryService(name);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
let getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getCategoriesService();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
let editCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = await editCategoryService(Number(id), name);
    console.log(updatedCategory);
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
let deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await deleteCategoryService(Number(id));
    res.status(200).json(deletedCategory);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export { createCategory, getCategories, editCategory, deleteCategory };
