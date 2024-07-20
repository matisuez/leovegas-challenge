/*
  Warnings:

  - You are about to drop the column `accesstoken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "accesstoken",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true;
