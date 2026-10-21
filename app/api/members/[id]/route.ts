import { requireRole } from "@/lib/api/auth-guard";
import { conflict, notFound } from "@/lib/api/errors";
import { apiRoute, json, readJson } from "@/lib/api/route";
import { serializeMember } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { memberUpdate } from "@/lib/validators/member";

type Params = { id: string };

const activeLoansInclude = {
  loans: {
    where: { returned_at: null, deleted_at: null },
    select: { due_at: true },
  },
} as const;

export const GET = apiRoute<Params>(async (_request, params) => {
  const { id } = await params;
  const now = new Date();

  const member = await prisma.member.findFirst({
    where: { id, deleted_at: null },
    include: {
      loans: {
        where: { deleted_at: null },
        orderBy: { borrowed_at: "desc" },
        include: { book: { select: { id: true, title: true, author: true } } },
      },
    },
  });
  if (!member) throw notFound("Anggota tidak ditemukan");

  const { loans, ...rest } = member;
  const activeLoans = loans.filter((loan) => loan.returned_at === null);

  return json({
    data: {
      ...serializeMember({ ...rest, loans: activeLoans }, now),
      active_loans: activeLoans,
      loan_history: loans,
    },
  });
});

export const PATCH = apiRoute<Params>(async (request, params) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const { id } = await params;
  const body = await readJson(request, memberUpdate);

  const current = await prisma.member.findFirst({ where: { id, deleted_at: null } });
  if (!current) throw notFound("Anggota tidak ditemukan");

  if (body.member_code && body.member_code !== current.member_code) {
    const duplicate = await prisma.member.findFirst({
      where: { member_code: body.member_code, deleted_at: null, NOT: { id } },
      select: { id: true },
    });
    if (duplicate) throw conflict("ID anggota sudah dipakai");
  }

  const member = await prisma.member.update({
    where: { id },
    data: body,
    include: activeLoansInclude,
  });
  return json({ data: serializeMember(member, new Date()) });
});

export const DELETE = apiRoute<Params>(async (_request, params) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const { id } = await params;

  const current = await prisma.member.findFirst({ where: { id, deleted_at: null }, select: { id: true } });
  if (!current) throw notFound("Anggota tidak ditemukan");

  const activeLoans = await prisma.loan.count({
    where: { member_id: id, returned_at: null, deleted_at: null },
  });
  if (activeLoans > 0) throw conflict("Anggota masih memiliki pinjaman aktif dan tidak bisa dihapus");

  await prisma.$transaction([
    prisma.user.updateMany({ where: { member_id: id }, data: { member_id: null } }),
    prisma.member.update({ where: { id }, data: { deleted_at: new Date() } }),
  ]);
  return json({ data: { id, deleted: true } });
});
