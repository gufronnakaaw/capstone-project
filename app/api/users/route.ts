import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/api/auth-guard";
import { assertActiveMember, assertUserLinkAvailable } from "@/lib/api/checks";
import { conflict } from "@/lib/api/errors";
import { apiRoute, json, pageMeta, readJson, readQuery } from "@/lib/api/route";
import { userSelect } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { userCreate, userQuery } from "@/lib/validators/user";

type UserWhere = NonNullable<Parameters<typeof prisma.user.findMany>[0]>["where"];

export const GET = apiRoute(async (request) => {
  await requireRole(["ADMIN"]);
  const { page, page_size, q, role } = readQuery(request, userQuery);

  const where: UserWhere = {
    deleted_at: null,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(role ? { role } : {}),
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { name: "asc" },
      skip: (page - 1) * page_size,
      take: page_size,
    }),
    prisma.user.count({ where }),
  ]);

  return json({ data: users, meta: pageMeta(page, page_size, total) });
});

export const POST = apiRoute(async (request) => {
  await requireRole(["ADMIN"]);
  const body = await readJson(request, userCreate);

  const duplicate = await prisma.user.findFirst({
    where: { email: body.email, deleted_at: null },
    select: { id: true },
  });
  if (duplicate) throw conflict("Email sudah terdaftar");

  if (body.member_id) {
    await assertActiveMember(body.member_id);
    await assertUserLinkAvailable(body.member_id);
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      role: body.role,
      member_id: body.member_id ?? null,
      password_hash: await bcrypt.hash(body.password, 10),
    },
    select: userSelect,
  });
  return json({ data: user }, 201);
});
