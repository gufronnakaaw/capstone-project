import type { Activity, Photo, Proker } from "@/lib/mock-data/types";
import { prisma } from "@/lib/prisma";

const HERO_PHOTO_LIMIT = 8;

const workProgramStatus = {
  PLANNED: "planned",
  ONGOING: "ongoing",
  COMPLETED: "completed",
} as const;

export async function getHomeData() {
  const [activityRows, photoRows, programRows] = await Promise.all([
    prisma.activity.findMany({
      where: { deleted_at: null },
      orderBy: { date: "desc" },
      include: {
        photos: {
          where: { deleted_at: null },
          orderBy: [{ sort_order: "asc" }, { created_at: "asc" }],
          select: { id: true },
        },
      },
    }),
    prisma.photo.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: "asc" },
    }),
    prisma.workProgram.findMany({
      where: { deleted_at: null },
      orderBy: [{ start_date: { sort: "asc", nulls: "last" } }, { created_at: "asc" }],
      take: 4,
    }),
  ]);

  const photos: Photo[] = photoRows.map((photo) => ({
    id: photo.id,
    url: photo.url,
    caption: photo.caption,
    relatedActivityId: photo.related_activity_id,
    createdAt: photo.created_at.toISOString(),
  }));

  const activities: Activity[] = activityRows.map((activity) => ({
    id: activity.id,
    title: activity.title,
    slug: activity.slug,
    date: activity.date.toISOString(),
    description: activity.description,
    fullDescription: activity.full_description,
    coverPhotoId: activity.cover_photo_id ?? "",
    photoIds: activity.photos.map((photo) => photo.id),
    createdAt: activity.created_at.toISOString(),
  }));

  const programs: Proker[] = programRows.map((program) => ({
    id: program.id,
    title: program.title,
    description: program.description,
    period: program.period,
    status: workProgramStatus[program.status],
    progress: program.progress,
    createdAt: program.created_at.toISOString(),
  }));

  const heroPhotos = photos.slice(0, HERO_PHOTO_LIMIT);

  return { photos, heroPhotos, activities, programs };
}
