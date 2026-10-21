/*
  Warnings:

  - You are about to drop the column `coverPhotoId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `fullDescription` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `availableStock` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `publishedYear` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `borrowedAt` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `dueAt` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `returnedAt` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `joinDate` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `memberCode` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `relatedActivityId` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Proker` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Proker` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cover_photo_id]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[member_code]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `full_description` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cover_url` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `published_year` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `book_id` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borrowed_at` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_at` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_id` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `join_date` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_code` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Proker` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PUSTAKAWAN', 'ANGGOTA');

-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_relatedActivityId_fkey";

-- DropIndex
DROP INDEX "Loan_bookId_idx";

-- DropIndex
DROP INDEX "Loan_memberId_idx";

-- DropIndex
DROP INDEX "Member_memberCode_key";

-- DropIndex
DROP INDEX "Photo_relatedActivityId_idx";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "coverPhotoId",
DROP COLUMN "createdAt",
DROP COLUMN "fullDescription",
DROP COLUMN "updatedAt",
ADD COLUMN     "cover_photo_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "full_description" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "availableStock",
DROP COLUMN "coverUrl",
DROP COLUMN "createdAt",
DROP COLUMN "publishedYear",
DROP COLUMN "updatedAt",
ADD COLUMN     "available_stock" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "cover_url" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "published_year" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "bookId",
DROP COLUMN "borrowedAt",
DROP COLUMN "createdAt",
DROP COLUMN "dueAt",
DROP COLUMN "memberId",
DROP COLUMN "returnedAt",
ADD COLUMN     "book_id" TEXT NOT NULL,
ADD COLUMN     "borrowed_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "due_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "member_id" TEXT NOT NULL,
ADD COLUMN     "returned_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "createdAt",
DROP COLUMN "joinDate",
DROP COLUMN "memberCode",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "join_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "member_code" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "createdAt",
DROP COLUMN "relatedActivityId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "related_activity_id" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Proker" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "year" INTEGER;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ANGGOTA',
    "member_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_member_id_key" ON "User"("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_cover_photo_id_key" ON "Activity"("cover_photo_id");

-- CreateIndex
CREATE INDEX "Activity_date_idx" ON "Activity"("date");

-- CreateIndex
CREATE INDEX "Book_category_idx" ON "Book"("category");

-- CreateIndex
CREATE INDEX "Loan_member_id_idx" ON "Loan"("member_id");

-- CreateIndex
CREATE INDEX "Loan_book_id_idx" ON "Loan"("book_id");

-- CreateIndex
CREATE UNIQUE INDEX "Member_member_code_key" ON "Member"("member_code");

-- CreateIndex
CREATE INDEX "Photo_related_activity_id_idx" ON "Photo"("related_activity_id");

-- CreateIndex
CREATE INDEX "Photo_created_at_idx" ON "Photo"("created_at");

-- CreateIndex
CREATE INDEX "Proker_status_idx" ON "Proker"("status");

-- CreateIndex
CREATE INDEX "Proker_year_idx" ON "Proker"("year");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_cover_photo_id_fkey" FOREIGN KEY ("cover_photo_id") REFERENCES "Photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_related_activity_id_fkey" FOREIGN KEY ("related_activity_id") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
