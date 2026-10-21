/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Loan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proker` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "member_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "loan_status" AS ENUM ('BORROWED', 'DUE_SOON', 'OVERDUE', 'RETURNED');

-- CreateEnum
CREATE TYPE "work_program_status" AS ENUM ('PLANNED', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'LIBRARIAN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_cover_photo_id_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_book_id_fkey";

-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_member_id_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_related_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_member_id_fkey";

-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_member_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'MEMBER',
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ(3);

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Loan";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "Photo";

-- DropTable
DROP TABLE "Proker";

-- DropEnum
DROP TYPE "LoanStatus";

-- DropEnum
DROP TYPE "MemberStatus";

-- DropEnum
DROP TYPE "ProkerStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "category_id" TEXT,
    "isbn" TEXT,
    "cover_url" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 1,
    "available_stock" INTEGER NOT NULL DEFAULT 1,
    "published_year" INTEGER NOT NULL,
    "synopsis" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "member_code" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "join_date" TIMESTAMPTZ(3) NOT NULL,
    "status" "member_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "borrowed_at" TIMESTAMPTZ(3) NOT NULL,
    "due_at" TIMESTAMPTZ(3) NOT NULL,
    "returned_at" TIMESTAMPTZ(3),
    "status" "loan_status" NOT NULL DEFAULT 'BORROWED',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date" TIMESTAMPTZ(3) NOT NULL,
    "description" TEXT NOT NULL,
    "full_description" TEXT NOT NULL,
    "cover_photo_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "related_activity_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_programs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "start_date" TIMESTAMPTZ(3),
    "end_date" TIMESTAMPTZ(3),
    "status" "work_program_status" NOT NULL DEFAULT 'PLANNED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "work_programs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "books_category_id_idx" ON "books"("category_id");

-- CreateIndex
CREATE INDEX "loans_member_id_idx" ON "loans"("member_id");

-- CreateIndex
CREATE INDEX "loans_book_id_idx" ON "loans"("book_id");

-- CreateIndex
CREATE INDEX "loans_status_idx" ON "loans"("status");

-- CreateIndex
CREATE INDEX "activities_date_idx" ON "activities"("date");

-- CreateIndex
CREATE INDEX "photos_related_activity_id_idx" ON "photos"("related_activity_id");

-- CreateIndex
CREATE INDEX "photos_created_at_idx" ON "photos"("created_at");

-- CreateIndex
CREATE INDEX "work_programs_status_idx" ON "work_programs"("status");

-- CreateIndex
CREATE INDEX "work_programs_start_date_idx" ON "work_programs"("start_date");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_cover_photo_id_fkey" FOREIGN KEY ("cover_photo_id") REFERENCES "photos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_related_activity_id_fkey" FOREIGN KEY ("related_activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
