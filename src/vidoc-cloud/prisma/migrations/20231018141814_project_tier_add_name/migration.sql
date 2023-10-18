/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ProjectTier` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProjectTier" ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTier_name_key" ON "ProjectTier"("name");
