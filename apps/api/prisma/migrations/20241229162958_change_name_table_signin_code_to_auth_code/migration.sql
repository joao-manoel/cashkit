/*
  Warnings:

  - You are about to drop the `signin_codes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "signin_codes" DROP CONSTRAINT "signin_codes_user_id_fkey";

-- DropTable
DROP TABLE "signin_codes";

-- CreateTable
CREATE TABLE "auth_code" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "auth_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_code_code_key" ON "auth_code"("code");

-- AddForeignKey
ALTER TABLE "auth_code" ADD CONSTRAINT "auth_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
