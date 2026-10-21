import { notFound } from "@/lib/api/errors";
import { apiRoute, json } from "@/lib/api/route";
import { photoSelect } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";

type Params = { slug: string };

export const GET = apiRoute<Params>(async (_request, params) => {
  const { slug } = await params;

  const activity = await prisma.activity.findFirst({
    where: { slug, deleted_at: null },
    include: {
      cover_photo: { select: photoSelect },
      photos: {
        where: { deleted_at: null },
        orderBy: [{ sort_order: "asc" }, { created_at: "asc" }],
        select: photoSelect,
      },
    },
  });
  if (!activity) throw notFound("Kegiatan tidak ditemukan");

  return json({ data: activity });
});
