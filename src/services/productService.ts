import prisma from "../prismaClient";

const createProductService = async (
  categoryId: number,
  name: string,
  description: string,
  imageUrl: string,
  imagePublicId: string
) => {
  try {
    const newProduct = await prisma.product.create({
      include: { category: true },
      data: {
        categoryId: Number(categoryId),
        name,
        description,
        imageUrl,
        imagePublicId,
      },
    });
    return {
      success: true,
      product: newProduct,
    };
  } catch (error) {
    console.error("Error creating product:", error);
  }
};

const getProductService = async () => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    return { success: true, products };
  } catch (error) {
    throw new Error("Error fetching products");
  }
};

const getProductByIdService = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
    if (!product) {
      return { success: false, message: "Product not found" };
    }
    return { success: true, product };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

const editProductService = async (
  id: number,
  data: {
    categoryId?: number | string;
    name?: string;
    description?: string;
    imageUrl?: string;
    imagePublicId?: string;
  }
) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...(data.categoryId && { categoryId: Number(data.categoryId) }),
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.imagePublicId && { imagePublicId: data.imagePublicId }),
      },
      include: { category: true },
    });
    return { success: true, product: updatedProduct };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

const deleteProductService = async (id: number) => {
  try {
    await prisma.productVariant.deleteMany({
      where: { productId: Number(id) },
    });

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export {
  createProductService,
  getProductService,
  getProductByIdService,
  editProductService,
  deleteProductService,
};
