/*
  Warnings:

  - You are about to alter the column `totalPrice` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `totalPrice` DOUBLE NOT NULL,
    MODIFY `paymentIntentId` VARCHAR(191) NULL;
