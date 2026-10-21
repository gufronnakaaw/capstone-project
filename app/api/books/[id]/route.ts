import { requireRole } from "@/lib/api/auth-guard";
import { assertActiveCategory } from "@/lib/api/checks";
import { conflict, notFound } from "@/lib/api/errors";
import { apiRoute, json, readJson } from "@/lib/api/route";
import { categorySelect } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { bookUpdate } from "@/lib/validators/book";

type Params = { id: string };

export const GET = apiRoute<Params>(async (_request, params) => {
  const { id } = await params;
  const book = await prisma.book.findFirst({
    where: { id, deleted_at: null },
    include: { category: { select: categorySelect } },
  });
  if (!book) throw notFound("Buku tidak ditemukan");
  return json({ data: book });
});

export const PATCH = apiRoute<Params>(async (request, params) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const { id } = await params;
  const body = await readJson(request, bookUpdate);

  const current = await prisma.book.findFirst({ where: { id, deleted_at: null } });
  if (!current) throw notFound("Buku tidak ditemukan");

  if (body.isbn) {
    const duplicate = await prisma.book.findFirst({
      where: { isbn: body.isbn, deleted_at: null, NOT: { id } },
      select: { id: true },
    });
    if (duplicate) throw conflict("ISBN sudah terdaftar");
  }
  if (body.category_id) await assertActiveCategory(body.category_id);

  let available_stock: number | undefined;
  if (body.stock !== undefined) {
    const borrowed = current.stock - current.available_stock;
    if (body.stock < borrowed) {
      throw conflict(`Total stok tidak boleh kurang dari ${borrowed} eksemplar yang sedang dipinjam`);
    }
    available_stock = body.stock - borrowed;
  }

  const book = await prisma.book.update({
    where: { id },
    data: { ...body, available_stock },
    include: { category: { select: categorySelect } },
  });
  return json({ data: book });
});

export const DELETE = apiRoute<Params>(async (_request, params) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const { id } = await params;

  const current = await prisma.book.findFirst({ where: { id, deleted_at: null }, select: { id: true } });
  if (!current) throw notFound("Buku tidak ditemukan");

  const activeLoans = await prisma.loan.count({
    where: { book_id: id, returned_at: null, deleted_at: null },
  });
  if (activeLoans > 0) throw conflict("Buku masih dipinjam dan tidak bisa dihapus");

  await prisma.book.update({ where: { id }, data: { deleted_at: new Date() } });
  return json({ data: { id, deleted: true } });
});
