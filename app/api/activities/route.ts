import { requireRole } from "@/lib/api/auth-guard";
import { badRequest, conflict } from "@/lib/api/errors";
import { apiRoute, json, pageMeta, readJson, readQuery } from "@/lib/api/route";
import { photoSelect } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { activityCreate, activityQuery } from "@/lib/validators/activity";
import { slugify } from "@/lib/utils/slug";

export const GET = apiRoute(async (request) => {
  const { page, page_size, period } = readQuery(request, activityQuery);
  const now = new Date();

  const where = {
    deleted_at: null,
    ...(period === "upcoming" ? { date: { gte: now } } : {}),
    ...(period === "past" ? { date: { lt: now } } : {}),
  };

  const [activities, total] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      include: { cover_photo: { select: photoSelect } },
      orderBy: { date: period === "past" ? "desc" : "asc" },
      skip: (page - 1) * page_size,
      take: page_size,
    }),
    prisma.activity.count({ where }),
  ]);

  return json({ data: activities, meta: pageMeta(page, page_size, total) });
});

export const POST = apiRoute(async (request) => {
  await requireRole(["ADMIN"]);
  const body = await readJson(request, activityCreate);

  const slug = body.slug ?? slugify(body.title);
  if (!slug) throw badRequest("Slug tidak bisa dibuat dari judul, isi slug secara manual");

  const duplicate = await prisma.activity.findFirst({
    where: { slug, deleted_at: null },
    select: { id: true },
  });
  if (duplicate) throw conflict("Slug kegiatan sudah dipakai");

  const activity = await prisma.activity.create({
    data: { ...body, slug },
  });
  return json({ data: activity }, 201);
});
