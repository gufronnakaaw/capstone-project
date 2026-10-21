import { requireRole } from "@/lib/api/auth-guard";
import { assertActiveActivity } from "@/lib/api/checks";
import { apiRoute, json, pageMeta, readJson, readQuery } from "@/lib/api/route";
import { prisma } from "@/lib/prisma";
import { photoCreate, photoQuery } from "@/lib/validators/photo";

export const GET = apiRoute(async (request) => {
  const { page, page_size, activity_id } = readQuery(request, photoQuery);

  const where = {
    deleted_at: null,
    ...(activity_id ? { related_activity_id: activity_id } : {}),
  };

  const [photos, total] = await prisma.$transaction([
    prisma.photo.findMany({
      where,
      include: { activity: { select: { id: true, slug: true, title: true } } },
      orderBy: [{ created_at: "asc" }],
      skip: (page - 1) * page_size,
      take: page_size,
    }),
    prisma.photo.count({ where }),
  ]);

  return json({ data: photos, meta: pageMeta(page, page_size, total) });
});

export const POST = apiRoute(async (request) => {
  await requireRole(["ADMIN"]);
  const body = await readJson(request, photoCreate);

  if (body.related_activity_id) await assertActiveActivity(body.related_activity_id);

  const photo = await prisma.photo.create({
    data: {
      url: body.url,
      caption: body.caption,
      sort_order: body.sort_order,
      related_activity_id: body.related_activity_id ?? null,
    },
  });
  return json({ data: photo }, 201);
});
