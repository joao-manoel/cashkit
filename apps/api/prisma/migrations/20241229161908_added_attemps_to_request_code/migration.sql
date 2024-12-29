/*
  Warnings:

  - Added the required column `attempts` to the `signin_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "signin_codes" ADD COLUMN     "attempts" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
