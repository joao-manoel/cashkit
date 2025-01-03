/*
  Warnings:

  - You are about to drop the column `categorysId` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_categorysId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "categorysId",
ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categorys"("id") ON DELETE SET NULL ON UPDATE CASCADE;
