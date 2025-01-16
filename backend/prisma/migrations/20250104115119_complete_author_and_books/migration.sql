/*
  Warnings:

  - You are about to drop the column `books` on the `Author` table. All the data in the column will be lost.
  - Added the required column `bio` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePic` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `published` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Author" DROP COLUMN "books",
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "profilePic" TEXT NOT NULL,
ADD COLUMN     "published" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
