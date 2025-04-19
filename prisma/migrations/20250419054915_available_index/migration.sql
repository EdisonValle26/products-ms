/*
  Warnings:

  - You are about to drop the column `availabled` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_availabled_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "availabled",
ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Product_available_idx" ON "Product"("available");
