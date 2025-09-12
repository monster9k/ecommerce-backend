import prisma from "../prismaClient";
import bcrypt from "bcryptjs";
require("dotenv").config();

const jwt = require("jsonwebtoken");

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

const loginUserService = async (email: string, password: string) => {
  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      let checkHashPassword = await bcrypt.compare(password, user.password);
      if (!checkHashPassword) {
        return {
          success: false,
          message: "Wrong password",
        };
      } else {
        const { password: _, ...safeUser } = user;
        const payload = safeUser;
        const access_token = jwt.sign(payload, process.env.JWT_SERECT, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          access_token,
          success: true,
          message: "Login succeessfully",
          user: safeUser,
        };
      }
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

const getUserService = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createAt: true,
      },
      orderBy: { createAt: "desc" },
    });
    return {
      success: true,
      users: users,
    };
  } catch (e) {
    console.log(e);
  }
};

export { createUserService, loginUserService, getUserService };
