import prisma from "../prismaClient";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

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

let hashUserPassword = async (password: string) => {
  try {
    let hashPassword = await bcrypt.hashSync(password, salt);
    return hashPassword;
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
      let hashPassWordFromBcrypt = await hashUserPassword(password);

      const result = await prisma.user.create({
        data: {
          username,
          email,
          password: hashPassWordFromBcrypt as string,
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
