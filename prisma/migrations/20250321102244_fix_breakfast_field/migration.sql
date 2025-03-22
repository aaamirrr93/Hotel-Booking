/*
  Warnings:

  - You are about to drop the column `breakFastIncluded` on the `booking` table. All the data in the column will be lost.
  - Added the required column `breakFastIncluded` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `breakFastIncluded`,
    ADD COLUMN `breakFastIncluded` BOOLEAN NOT NULL,
    ADD COLUMN `userEmail` VARCHAR(191) NOT NULL;
