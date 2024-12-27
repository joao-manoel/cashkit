/*
  Warnings:

  - You are about to drop the column `walletId` on the `categorys` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "categorys" DROP CONSTRAINT "categorys_walletId_fkey";

-- AlterTable
ALTER TABLE "categorys" DROP COLUMN "walletId";
