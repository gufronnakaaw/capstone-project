/*
  Warnings:

  - You are about to drop the column `category` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_member_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_member_id_fkey";

-- DropIndex
DROP INDEX "Book_category_idx";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "category",
ADD COLUMN     "category_id" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "isbn" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Proker" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ANGGOTA',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "member_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_member_id_key" ON "users"("member_id");

-- CreateIndex
CREATE INDEX "Book_category_id_idx" ON "Book"("category_id");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
