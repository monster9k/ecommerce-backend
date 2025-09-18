import prisma from "../prismaClient";

const createCategoryService = async (name: string) => {
  try {
    const category = await prisma.category.create({
      data: { name },
    });
    return category;
  } catch (error) {
    throw new Error("Error creating category");
  }
};

const getCategoriesService = async () => {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
};

const editCategoryService = async (id: number, name: string) => {
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return updatedCategory;
  } catch (error) {
    throw new Error("Error updating category");
  }
};

const deleteCategoryService = async (id: number) => {
  try {
    const deletedCategory = await prisma.category.delete({
      where: { id },
    });
    return deletedCategory;
  } catch (error) {
    throw new Error("Error deleting category");
  }
};
export {
  createCategoryService,
  getCategoriesService,
  editCategoryService,
  deleteCategoryService,
};
