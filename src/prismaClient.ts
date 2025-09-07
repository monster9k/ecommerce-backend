import { PrismaClient } from "./generated/prisma";
// nen la import trong 1 file xong rồi dùng ở các file khac do tao nhieu lan

const prisma = new PrismaClient();

export default prisma;
