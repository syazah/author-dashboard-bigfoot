/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `Author` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_authorId_fkey";

-- AlterTable
ALTER TABLE "Author" DROP COLUMN "dateOfBirth";

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifsc" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
