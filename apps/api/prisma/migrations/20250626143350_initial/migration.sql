-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'DEBIT', 'CREDIT', 'MONEY');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'MONEY';
