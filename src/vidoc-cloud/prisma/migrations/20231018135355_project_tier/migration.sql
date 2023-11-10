-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "tierId" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProjectTier" (
    "id" TEXT NOT NULL,
    "maxStorageBytes" INTEGER NOT NULL,
    "referenceId" TEXT NOT NULL,

    CONSTRAINT "ProjectTier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTier_id_key" ON "ProjectTier"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTier_referenceId_key" ON "ProjectTier"("referenceId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "ProjectTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
