import { requireRole } from "@/lib/api/auth-guard";
import { conflict } from "@/lib/api/errors";
import { apiRoute, json, pageMeta, readJson, readQuery } from "@/lib/api/route";
import { serializeMember } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { memberCreate, memberQuery } from "@/lib/validators/member";

type MemberWhere = NonNullable<Parameters<typeof prisma.member.findMany>[0]>["where"];

const activeLoansInclude = {
  loans: {
    where: { returned_at: null, deleted_at: null },
    select: { due_at: true },
  },
} as const;

export const GET = apiRoute(async (request) => {
  const { page, page_size, q, status } = readQuery(request, memberQuery);
  const now = new Date();

  const where: MemberWhere = {
    deleted_at: null,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { member_code: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
  };

  const [members, total] = await prisma.$transaction([
    prisma.member.findMany({
      where,
      include: activeLoansInclude,
      orderBy: { name: "asc" },
      skip: (page - 1) * page_size,
      take: page_size,
    }),
    prisma.member.count({ where }),
  ]);

  return json({
    data: members.map((member) => serializeMember(member, now)),
    meta: pageMeta(page, page_size, total),
  });
});

export const POST = apiRoute(async (request) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const body = await readJson(request, memberCreate);

  const duplicate = await prisma.member.findFirst({
    where: { member_code: body.member_code, deleted_at: null },
    select: { id: true },
  });
  if (duplicate) throw conflict("ID anggota sudah dipakai");

  const member = await prisma.member.create({
    data: body,
    include: activeLoansInclude,
  });
  return json({ data: serializeMember(member, new Date()) }, 201);
});
