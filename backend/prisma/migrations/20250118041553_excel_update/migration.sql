/*
  Warnings:

  - Added the required column `channel` to the `Excel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `compensation` to the `Excel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Excel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Excel" ADD COLUMN     "channel" TEXT NOT NULL,
ADD COLUMN     "compensation" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
