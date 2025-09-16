import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
require("dotenv").config();

export interface MyPayload extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const whiteLists = ["/", "/register", "/login"];
  if (whiteLists.find((item) => "/api" + item === req.originalUrl)) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as MyPayload;
    // console.log(">> check token:", decoded);

    req.user = decoded; // gắn user vào request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// ...roles de truyen nhieu roles vao check
const vertifyRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // nếu chưa có user từ middleware auth
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // nếu role của user không nằm trong roles được cho phép
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next(); // pass qua middleware tiếp theo
  };
};

export { auth, vertifyRole };
