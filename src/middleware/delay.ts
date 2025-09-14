import { Request, Response, NextFunction } from "express";

const delay = (req: Request, res: Response, next: NextFunction) => {
  setTimeout(() => {
    const token = req.headers["authorization"]?.split(" ")[1]; // nen check authorization có tồn tại hay không
    console.log(">> check token: ", token);
    next();
  }, 3000);
};

export { delay };
