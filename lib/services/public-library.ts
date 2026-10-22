import type { Activity, Book, Photo, Proker } from "@/lib/mock-data/types";
import { prisma } from "@/lib/prisma";
import type { CatalogBook } from "@/lib/types/api";

const UNCATEGORIZED = "Belum dikategorikan";
const MISSING_ISBN = "—";
const HERO_PHOTO_LIMIT = 8;

const workProgramStatus = {
  PLANNED: "planned",
  ONGOING: "ongoing",
  COMPLETED: "completed",
} as const;

const bookSelect = {
  id: true,
  title: true,
  author: true,
  isbn: true,
  cover_url: true,
  stock: true,
  available_stock: true,
  published_year: true,
  synopsis: true,
  created_at: true,
  category: { select: { name: true } },
} as const;

type BookRow = {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  cover_url: string;
  stock: number;
  available_stock: number;
  published_year: number;
  synopsis: string;
  created_at: Date;
  category: { name: string } | null;
};

type ActivityRow = {
  id: string;
  title: string;
  slug: string;
  date: Date;
  description: string;
  full_description: string;
  cover_photo_id: string | null;
  created_at: Date;
  photos: { id: string }[];
};

type PhotoRow = {
  id: string;
  url: string;
  caption: string;
  related_activity_id: string | null;
  created_at: Date;
};

type ProgramRow = {
  id: string;
  title: string;
  description: string;
  period: string;
  status: keyof typeof workProgramStatus;
  progress: number;
  created_at: Date;
};

const mapBook = (row: BookRow): Book => ({
  id: row.id,
  title: row.title,
  author: row.author,
  category: row.category?.name ?? UNCATEGORIZED,
  isbn: row.isbn ?? MISSING_ISBN,
  coverUrl: row.cover_url,
  stock: row.stock,
  availableStock: row.available_stock,
  publishedYear: row.published_year,
  synopsis: row.synopsis,
  createdAt: row.created_at.toISOString(),
});

const mapActivity = (row: ActivityRow): Activity => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  date: row.date.toISOString(),
  description: row.description,
  fullDescription: row.full_description,
  coverPhotoId: row.cover_photo_id ?? "",
  photoIds: row.photos.map((photo) => photo.id),
  createdAt: row.created_at.toISOString(),
});

const mapPhoto = (row: PhotoRow): Photo => ({
  id: row.id,
  url: row.url,
  caption: row.caption,
  relatedActivityId: row.related_activity_id,
  createdAt: row.created_at.toISOString(),
});

const mapProker = (row: ProgramRow): Proker => ({
  id: row.id,
  title: row.title,
  description: row.description,
  period: row.period,
  status: workProgramStatus[row.status],
  progress: row.progress,
  createdAt: row.created_at.toISOString(),
});

export async function getCatalogBooks(): Promise<CatalogBook[]> {
  return prisma.book.findMany({
    where: { deleted_at: null },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      author: true,
      isbn: true,
      cover_url: true,
      stock: true,
      available_stock: true,
      published_year: true,
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function getPublicBook(id: string): Promise<Book | null> {
  const row = await prisma.book.findFirst({
    where: { id, deleted_at: null },
    select: bookSelect,
  });
  return row ? mapBook(row) : null;
}

export async function getPublicActivities(): Promise<Activity[]> {
  const rows = await prisma.activity.findMany({
    where: { deleted_at: null },
    orderBy: { date: "desc" },
    select: activitySelect,
  });
  return rows.map(mapActivity);
}

export async function getPublicActivity(slug: string): Promise<Activity | null> {
  const row = await prisma.activity.findFirst({
    where: { slug, deleted_at: null },
    select: activitySelect,
  });
  return row ? mapActivity(row) : null;
}

export async function getPublicPhotos(): Promise<Photo[]> {
  const rows = await prisma.photo.findMany({
    where: { deleted_at: null },
    orderBy: { created_at: "asc" },
    select: photoSelect,
  });
  return rows.map(mapPhoto);
}

export async function getPublicProkers(): Promise<Proker[]> {
  const rows = await prisma.workProgram.findMany({
    where: { deleted_at: null },
    orderBy: [{ start_date: { sort: "asc", nulls: "last" } }, { created_at: "asc" }],
  });
  return rows.map(mapProker);
}

const activitySelect = {
  id: true,
  title: true,
  slug: true,
  date: true,
  description: true,
  full_description: true,
  cover_photo_id: true,
  created_at: true,
  photos: {
    where: { deleted_at: null },
    orderBy: [{ sort_order: "asc" as const }, { created_at: "asc" as const }],
    select: { id: true },
  },
};

const photoSelect = {
  id: true,
  url: true,
  caption: true,
  related_activity_id: true,
  created_at: true,
} as const;

export async function getHomeData() {
  const [activities, photos, programs] = await Promise.all([
    getPublicActivities(),
    getPublicPhotos(),
    getPublicProkers(),
  ]);

  return {
    photos,
    heroPhotos: photos.slice(0, HERO_PHOTO_LIMIT),
    activities,
    programs: programs.slice(0, 4),
  };
}
