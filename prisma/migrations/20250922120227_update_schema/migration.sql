/*
  Warnings:

  - You are about to drop the column `imgaeUrl` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `imgaeUrl`,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL;
