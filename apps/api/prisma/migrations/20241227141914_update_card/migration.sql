/*
  Warnings:

  - Added the required column `name` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "limit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT NOT NULL;
