import { requireRole } from "@/lib/api/auth-guard";
import { badRequest, conflict, notFound } from "@/lib/api/errors";
import { apiRoute, json, readJson } from "@/lib/api/route";
import { photoSelect } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { activityUpdate } from "@/lib/validators/activity";

type Params = { id: string };

export const PATCH = apiRoute<Params>(async (request, params) => {
  await requireRole(["ADMIN"]);
  const { id } = await params;
  const body = await readJson(request, activityUpdate);

  const current = await prisma.activity.findFirst({ where: { id, deleted_at: null } });
  if (!current) throw notFound("Kegiatan tidak ditemukan");

  if (body.slug && body.slug !== current.slug) {
    const duplicate = await prisma.activity.findFirst({
      where: { slug: body.slug, deleted_at: null, NOT: { id } },
      select: { id: true },
    });
    if (duplicate) throw conflict("Slug kegiatan sudah dipakai");
  }

  if (body.cover_photo_id) {
    const cover = await prisma.photo.findFirst({
      where: { id: body.cover_photo_id, related_activity_id: id, deleted_at: null },
      select: { id: true },
    });
    if (!cover) throw badRequest("Cover harus berupa foto dari kegiatan ini");
  }

  const activity = await prisma.activity.update({
    where: { id },
    data: body,
    include: { cover_photo: { select: photoSelect } },
  });
  return json({ data: activity });
});

export const DELETE = apiRoute<Params>(async (_request, params) => {
  await requireRole(["ADMIN"]);
  const { id } = await params;

  const current = await prisma.activity.findFirst({ where: { id, deleted_at: null }, select: { id: true } });
  if (!current) throw notFound("Kegiatan tidak ditemukan");

  const photoCount = await prisma.photo.count({
    where: { related_activity_id: id, deleted_at: null },
  });
  if (photoCount > 0) throw conflict("Hapus foto kegiatan ini terlebih dahulu sebelum menghapus kegiatan");

  await prisma.activity.update({ where: { id }, data: { deleted_at: new Date() } });
  return json({ data: { id, deleted: true } });
});
