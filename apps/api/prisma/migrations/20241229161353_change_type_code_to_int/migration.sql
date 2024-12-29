/*
  Warnings:

  - Changed the type of `code` on the `signin_codes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "signin_codes" DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "signin_codes_code_key" ON "signin_codes"("code");
