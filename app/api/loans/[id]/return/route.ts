import { requireRole } from "@/lib/api/auth-guard";
import { conflict, notFound } from "@/lib/api/errors";
import { apiRoute, json } from "@/lib/api/route";
import { loanInclude } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";

type Params = { id: string };

export const POST = apiRoute<Params>(async (_request, params) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const { id } = await params;
  const now = new Date();

  const loan = await prisma.$transaction(async (tx) => {
    const current = await tx.loan.findFirst({
      where: { id, deleted_at: null },
      select: { id: true, book_id: true, returned_at: true },
    });
    if (!current) throw notFound("Pinjaman tidak ditemukan");
    if (current.returned_at) throw conflict("Pinjaman sudah dikembalikan");

    const closed = await tx.loan.updateMany({
      where: { id, returned_at: null },
      data: { returned_at: now, status: "RETURNED" },
    });
    if (closed.count !== 1) throw conflict("Pinjaman sudah dikembalikan");

    await tx.book.update({
      where: { id: current.book_id },
      data: { available_stock: { increment: 1 } },
    });

    return tx.loan.findUniqueOrThrow({ where: { id }, include: loanInclude });
  });

  return json({ data: loan });
});
