-- Constraint yang tidak bisa dideklarasikan lewat Prisma schema.
-- Jalankan setelah `prisma migrate dev` berhasil.
--
-- psql "$DATABASE_URL" -f prisma/sql/constraints.sql

-- 1. Stok buku tidak boleh negatif dan tidak boleh melebihi total stok.
ALTER TABLE "books" DROP CONSTRAINT IF EXISTS "books_available_stock_check";
ALTER TABLE "books"
  ADD CONSTRAINT "books_available_stock_check"
  CHECK ("available_stock" >= 0 AND "available_stock" <= "stock");

-- 2. Progress program kerja harus 0-100.
ALTER TABLE "work_programs" DROP CONSTRAINT IF EXISTS "work_programs_progress_check";
ALTER TABLE "work_programs"
  ADD CONSTRAINT "work_programs_progress_check"
  CHECK ("progress" >= 0 AND "progress" <= 100);

-- 3. Unique hanya untuk data yang belum di-soft-delete,
--    sehingga data yang sama boleh diinput ulang setelah dihapus.
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_active_key"
  ON "users" (lower("email"))
  WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "users_member_id_active_key"
  ON "users" ("member_id")
  WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "members_member_code_active_key"
  ON "members" ("member_code")
  WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "books_isbn_active_key"
  ON "books" ("isbn")
  WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "categories_name_active_key"
  ON "categories" (lower("name"))
  WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_active_key"
  ON "categories" ("slug")
  WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "activities_slug_active_key"
  ON "activities" ("slug")
  WHERE "deleted_at" IS NULL;

-- 4. Satu anggota hanya boleh punya satu pinjaman aktif per buku.
CREATE UNIQUE INDEX IF NOT EXISTS "loans_active_book_member_key"
  ON "loans" ("book_id", "member_id")
  WHERE "returned_at" IS NULL AND "deleted_at" IS NULL;
