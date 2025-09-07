import prisma from "../prismaClient";

let checkUserEmail = async (userEmail: string) => {
  try {
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
};

const createUserService = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    let check = await checkUserEmail(email);
    if (check) {
      return {
        success: false,
        message: "Email already exists",
        hint: "Try logging in instead",
      };
    } else {
      const result = await prisma.user.create({
        data: {
          username,
          email,
          password,
          role: "user",
        },
      });
      return {
        success: true,
        message: "User registered successfully",
        user: result,
      };
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { createUserService };
