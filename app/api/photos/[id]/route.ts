import { del } from "@vercel/blob";
import { requireRole } from "@/lib/api/auth-guard";
import { assertActiveActivity } from "@/lib/api/checks";
import { notFound } from "@/lib/api/errors";
import { apiRoute, json, readJson } from "@/lib/api/route";
import { prisma } from "@/lib/prisma";
import { photoUpdate } from "@/lib/validators/photo";

type Params = { id: string };

const isBlobUrl = (url: string) => new URL(url).hostname.endsWith(".public.blob.vercel-storage.com");

export const PATCH = apiRoute<Params>(async (request, params) => {
  await requireRole(["ADMIN"]);
  const { id } = await params;
  const body = await readJson(request, photoUpdate);

  const current = await prisma.photo.findFirst({ where: { id, deleted_at: null } });
  if (!current) throw notFound("Foto tidak ditemukan");

  if (body.related_activity_id) await assertActiveActivity(body.related_activity_id);

  const changesActivity =
    body.related_activity_id !== undefined && body.related_activity_id !== current.related_activity_id;

  const photo = await prisma.$transaction(async (tx) => {
    if (changesActivity) {
      await tx.activity.updateMany({
        where: { cover_photo_id: id },
        data: { cover_photo_id: null },
      });
    }
    return tx.photo.update({ where: { id }, data: body });
  });

  return json({ data: photo });
});

export const DELETE = apiRoute<Params>(async (_request, params) => {
  await requireRole(["ADMIN"]);
  const { id } = await params;

  const current = await prisma.photo.findFirst({ where: { id, deleted_at: null } });
  if (!current) throw notFound("Foto tidak ditemukan");

  await prisma.$transaction([
    prisma.activity.updateMany({
      where: { cover_photo_id: id },
      data: { cover_photo_id: null },
    }),
    prisma.photo.update({ where: { id }, data: { deleted_at: new Date() } }),
  ]);

  let storageDeleted = false;
  if (isBlobUrl(current.url)) {
    try {
      await del(current.url);
      storageDeleted = true;
    } catch (error) {
      console.error("Gagal menghapus file Blob", error);
    }
  }

  return json({ data: { id, deleted: true, storage_deleted: storageDeleted } });
});
