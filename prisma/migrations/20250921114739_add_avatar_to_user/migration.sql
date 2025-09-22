-- AlterTable
ALTER TABLE `Product` ADD COLUMN `imagePublicId` VARCHAR(191) NULL,
    ADD COLUMN `imgaeUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatarPublicId` VARCHAR(191) NULL,
    ADD COLUMN `avatarUrl` VARCHAR(191) NULL;
