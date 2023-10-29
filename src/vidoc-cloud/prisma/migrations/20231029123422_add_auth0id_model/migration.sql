/*
  Warnings:

  - You are about to drop the column `auth0Id` on the `User` table. All the data in the column will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_auth0Id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "auth0Id",
ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "UserAuth0Id" (
    "id" TEXT NOT NULL,
    "auth0Id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAuth0Id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth0Id_id_key" ON "UserAuth0Id"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth0Id_auth0Id_key" ON "UserAuth0Id"("auth0Id");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth0Id_auth0Id_userId_key" ON "UserAuth0Id"("auth0Id", "userId");

-- AddForeignKey
ALTER TABLE "UserAuth0Id" ADD CONSTRAINT "UserAuth0Id_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
