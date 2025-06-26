/*
  Warnings:

  - Changed the type of `due_date` on the `invoices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "due_date",
ADD COLUMN     "due_date" INTEGER NOT NULL;
