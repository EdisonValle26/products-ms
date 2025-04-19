/*
  Warnings:

  - You are about to drop the column `avalible` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "avalible",
ADD COLUMN     "availabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Product_availabled_idx" ON "Product"("availabled");
