import prisma from "../prismaClient";

export const createStyleService = async (name: string) => {
  try {
    const style = await prisma.style.create({
      data: { name },
    });
    return style;
  } catch (error) {
    throw new Error("Error creating style");
  }
};
