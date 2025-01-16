/*
  Warnings:

  - Added the required column `branch` to the `Bank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bank" ADD COLUMN     "branch" TEXT NOT NULL;
