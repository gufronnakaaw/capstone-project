import { getCurrentUser } from "@/lib/api/auth-guard";
import { badRequest } from "@/lib/api/errors";
import { apiRoute, json, readJson } from "@/lib/api/route";
import { loadProfile } from "@/lib/api/profile";
import { prisma } from "@/lib/prisma";
import { meUpdate } from "@/lib/validators/me";

export const GET = apiRoute(async () => {
  const user = await getCurrentUser();
  return json({ data: await loadProfile(user.id) });
});

export const PATCH = apiRoute(async (request) => {
  const user = await getCurrentUser();
  const body = await readJson(request, meUpdate);

  if (body.contact !== undefined && !user.member_id) {
    throw badRequest("Akun ini belum terhubung dengan data anggota");
  }

  await prisma.$transaction(async (tx) => {
    if (body.name !== undefined) {
      await tx.user.update({ where: { id: user.id }, data: { name: body.name } });
    }
    if (user.member_id && (body.name !== undefined || body.contact !== undefined)) {
      await tx.member.update({
        where: { id: user.member_id },
        data: { name: body.name, contact: body.contact },
      });
    }
  });

  return json({ data: await loadProfile(user.id) });
});
