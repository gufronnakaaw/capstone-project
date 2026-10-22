import { requireRole } from "@/lib/api/auth-guard";
import { conflict, notFound } from "@/lib/api/errors";
import { apiRoute, json, pageMeta, readJson, readQuery } from "@/lib/api/route";
import { loanInclude } from "@/lib/api/serializers";
import { loanDueDate, syncLoanStatuses } from "@/lib/loan-status";
import { prisma } from "@/lib/prisma";
import { loanCreate, loanQuery } from "@/lib/validators/loan";

type LoanWhere = NonNullable<Parameters<typeof prisma.loan.findMany>[0]>["where"];

export const GET = apiRoute(async (request) => {
  const { page, page_size, q, status, active } = readQuery(request, loanQuery);
  await syncLoanStatuses();

  const where: LoanWhere = {
    deleted_at: null,
    ...(active === "true" ? { returned_at: null } : {}),
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { book: { title: { contains: q, mode: "insensitive" } } },
            { member: { name: { contains: q, mode: "insensitive" } } },
            { member: { member_code: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [loans, total] = await prisma.$transaction([
    prisma.loan.findMany({
      where,
      include: loanInclude,
      orderBy: { due_at: "asc" },
      skip: (page - 1) * page_size,
      take: page_size,
    }),
    prisma.loan.count({ where }),
  ]);

  return json({ data: loans, meta: pageMeta(page, page_size, total) });
});

export const POST = apiRoute(async (request) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const body = await readJson(request, loanCreate);
  const now = new Date();

  const loan = await prisma.$transaction(async (tx) => {
    const book = await tx.book.findFirst({
      where: { id: body.book_id, deleted_at: null },
      select: { id: true },
    });
    if (!book) throw notFound("Buku tidak ditemukan");

    const member = await tx.member.findFirst({
      where: { id: body.member_id, deleted_at: null },
      select: { id: true, status: true },
    });
    if (!member) throw notFound("Anggota tidak ditemukan");
    if (member.status !== "ACTIVE") throw conflict("Anggota tidak aktif");

    const duplicate = await tx.loan.findFirst({
      where: { book_id: body.book_id, member_id: body.member_id, returned_at: null, deleted_at: null },
      select: { id: true },
    });
    if (duplicate) throw conflict("Anggota ini masih meminjam buku yang sama");

    const reserved = await tx.book.updateMany({
      where: { id: book.id, deleted_at: null, available_stock: { gt: 0 } },
      data: { available_stock: { decrement: 1 } },
    });
    if (reserved.count !== 1) throw conflict("Stok buku sedang habis");

    return tx.loan.create({
      data: {
        book_id: body.book_id,
        member_id: body.member_id,
        borrowed_at: now,
        due_at: loanDueDate(now),
        status: "BORROWED",
      },
      include: loanInclude,
    });
  });

  return json({ data: loan }, 201);
});
