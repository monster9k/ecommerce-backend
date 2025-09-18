import { PrismaClient } from "../src/generated/prisma"; // đường dẫn đúng với project của bạn

const prisma = new PrismaClient();

// async function main() {
//   console.log("🌱 Seeding database...");

//   // 1. Category (chỉ thêm nếu chưa tồn tại)
//   await prisma.category.createMany({
//     data: [
//       { name: "Áo" },
//       { name: "Quần" },
//       { name: "Giày" },
//       { name: "Phụ kiện" },
//     ],
//     skipDuplicates: true, // không tạo lại nếu đã tồn tại
//   });

//   // 2. Lấy lại category từ DB (dùng findFirst thay vì findUnique)
//   const catAo = await prisma.category.findFirst({ where: { name: "Áo" } });
//   const catQuan = await prisma.category.findFirst({ where: { name: "Quần" } });
//   const catGiay = await prisma.category.findFirst({ where: { name: "Giày" } });
//   const catPhuKien = await prisma.category.findFirst({
//     where: { name: "Phụ kiện" },
//   });

//   if (!catAo || !catQuan || !catGiay || !catPhuKien) {
//     throw new Error("❌ Category chưa tạo đủ!");
//   }

//   // 3. Product (dùng id động từ category)
//   await prisma.product.createMany({
//     data: [
//       {
//         name: "Áo thun trắng basic",
//         description: "Thoáng mát, dễ mặc",
//         categoryId: catAo.id,
//       },
//       {
//         name: "Quần jeans xanh",
//         description: "Form slimfit, co giãn nhẹ",
//         categoryId: catQuan.id,
//       },
//       {
//         name: "Giày sneaker trắng",
//         description: "Thời trang, dễ phối đồ",
//         categoryId: catGiay.id,
//       },
//       {
//         name: "Nón lưỡi trai đen",
//         description: "Phong cách streetwear",
//         categoryId: catPhuKien.id,
//       },
//     ],
//     skipDuplicates: true,
//   });

//   // 4. Lấy lại product từ DB
//   const spAo = await prisma.product.findFirst({
//     where: { name: "Áo thun trắng basic" },
//   });
//   const spQuan = await prisma.product.findFirst({
//     where: { name: "Quần jeans xanh" },
//   });
//   const spGiay = await prisma.product.findFirst({
//     where: { name: "Giày sneaker trắng" },
//   });
//   const spNon = await prisma.product.findFirst({
//     where: { name: "Nón lưỡi trai đen" },
//   });

//   if (!spAo || !spQuan || !spGiay || !spNon) {
//     throw new Error("❌ Product chưa tạo đủ!");
//   }

//   // 5. ProductVariant
//   await prisma.productVariant.createMany({
//     data: [
//       {
//         productId: spAo.id,
//         size: "S",
//         color: "Trắng",
//         price: 120000,
//         stock: 20,
//       },
//       {
//         productId: spAo.id,
//         size: "M",
//         color: "Trắng",
//         price: 120000,
//         stock: 30,
//       },
//       {
//         productId: spQuan.id,
//         size: "30",
//         color: "Xanh",
//         price: 350000,
//         stock: 20,
//       },
//       {
//         productId: spGiay.id,
//         size: "41",
//         color: "Trắng",
//         price: 350000,
//         stock: 10,
//       },
//       {
//         productId: spNon.id,
//         size: "Free",
//         color: "Đen",
//         price: 89990,
//         stock: 40,
//       },
//     ],
//     skipDuplicates: true,
//   });

//   console.log("✅ Seed done!");
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

export default prisma;
