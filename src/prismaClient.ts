import { PrismaClient } from "../src/generated/prisma"; // đường dẫn đúng với project của bạn

const prisma = new PrismaClient();

//xoa du lieu
// async function main() {
//   // 1. Xóa theo thứ tự quan hệ
//   await prisma.orderItem.deleteMany();
//   await prisma.order.deleteMany();

//   await prisma.cartItem.deleteMany();
//   await prisma.cart.deleteMany();

//   await prisma.productVariant.deleteMany();
//   await prisma.product.deleteMany();
//   await prisma.category.deleteMany();

//   // 2. Xóa user nhưng giữ admin
//   await prisma.user.deleteMany({
//     where: {
//       role: { not: "admin" },
//     },
//   });

//   console.log("Reset data thành công (giữ admin)");
// }

// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect());

export default prisma;
