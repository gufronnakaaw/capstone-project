-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'OVERDUE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('BORROWED', 'DUE_SOON', 'OVERDUE', 'RETURNED');

-- CreateEnum
CREATE TYPE "ProkerStatus" AS ENUM ('PLANNED', 'ONGOING', 'COMPLETED');

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 1,
    "availableStock" INTEGER NOT NULL DEFAULT 1,
    "publishedYear" INTEGER NOT NULL,
    "synopsis" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "memberCode" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "borrowedAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "returnedAt" TIMESTAMP(3),
    "status" "LoanStatus" NOT NULL DEFAULT 'BORROWED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "coverPhotoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "relatedActivityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proker" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "status" "ProkerStatus" NOT NULL DEFAULT 'PLANNED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "Member_memberCode_key" ON "Member"("memberCode");

-- CreateIndex
CREATE INDEX "Loan_memberId_idx" ON "Loan"("memberId");

-- CreateIndex
CREATE INDEX "Loan_bookId_idx" ON "Loan"("bookId");

-- CreateIndex
CREATE INDEX "Loan_status_idx" ON "Loan"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug");

-- CreateIndex
CREATE INDEX "Photo_relatedActivityId_idx" ON "Photo"("relatedActivityId");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_relatedActivityId_fkey" FOREIGN KEY ("relatedActivityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
