import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/api/auth-guard";
import { assertActiveMember, assertUserLinkAvailable } from "@/lib/api/checks";
import { conflict, notFound } from "@/lib/api/errors";
import { apiRoute, json, readJson } from "@/lib/api/route";
import { userSelect } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { userUpdate } from "@/lib/validators/user";

type Params = { id: string };

export const PATCH = apiRoute<Params>(async (request, params) => {
  const admin = await requireRole(["ADMIN"]);
  const { id } = await params;
  const body = await readJson(request, userUpdate);

  const current = await prisma.user.findFirst({ where: { id, deleted_at: null }, select: { id: true } });
  if (!current) throw notFound("Pengguna tidak ditemukan");

  if (id === admin.id && (body.is_active === false || (body.role !== undefined && body.role !== "ADMIN"))) {
    throw conflict("Tidak bisa menonaktifkan atau menurunkan peran akun sendiri");
  }

  if (body.member_id) {
    await assertActiveMember(body.member_id);
    await assertUserLinkAvailable(body.member_id, id);
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: body.name,
      role: body.role,
      is_active: body.is_active,
      member_id: body.member_id,
      ...(body.password ? { password_hash: await bcrypt.hash(body.password, 10) } : {}),
    },
    select: userSelect,
  });
  return json({ data: user });
});
