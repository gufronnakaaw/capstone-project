import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import {
  activities,
  books,
  loans,
  members,
  photos,
  prokers,
} from "../lib/mock-data/library";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const memberStatus = {
  active: "ACTIVE",
  overdue: "ACTIVE",
  inactive: "INACTIVE",
} as const;

const loanStatus = {
  borrowed: "BORROWED",
  "due-soon": "DUE_SOON",
  overdue: "OVERDUE",
  returned: "RETURNED",
} as const;

const workProgramStatus = {
  planned: "PLANNED",
  ongoing: "ONGOING",
  completed: "COMPLETED",
} as const;

const date = (value: string) => new Date(value);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const categoryRows = Array.from(new Set(books.map((book) => book.category))).map(
  (name, index) => ({
    id: `category-${slugify(name)}`,
    name,
    slug: slugify(name),
    sort_order: index,
  }),
);

const categoryIdByName = new Map(
  categoryRows.map((category) => [category.name, category.id]),
);

const photoOrder = new Map<string, number>();
for (const activity of activities) {
  activity.photoIds.forEach((photoId, index) => {
    if (!photoOrder.has(photoId)) photoOrder.set(photoId, index);
  });
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi di .env");
  }

  const password_hash = await bcrypt.hash(password, 10);
  const existing = await prisma.user.findFirst({
    where: { email, deleted_at: null },
    select: { id: true },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { password_hash, role: "ADMIN", is_active: true },
    });
  } else {
    await prisma.user.create({
      data: { name: "Administrator", email, password_hash, role: "ADMIN" },
    });
  }
}

async function main() {
  await prisma.loan.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();
  await prisma.member.deleteMany();
  await prisma.workProgram.deleteMany();

  await prisma.category.createMany({ data: categoryRows });

  await prisma.book.createMany({
    data: books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category_id: categoryIdByName.get(book.category) ?? null,
      isbn: book.isbn,
      cover_url: book.coverUrl,
      stock: book.stock,
      available_stock: book.availableStock,
      published_year: book.publishedYear,
      synopsis: book.synopsis,
      created_at: date(book.createdAt),
    })),
  });

  await prisma.member.createMany({
    data: members.map((member) => ({
      id: member.id,
      name: member.name,
      member_code: member.memberCode,
      contact: member.contact,
      address: member.address,
      join_date: date(member.joinDate),
      status: memberStatus[member.status],
      created_at: date(member.createdAt),
    })),
  });

  await prisma.activity.createMany({
    data: activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      slug: activity.slug,
      date: date(activity.date),
      description: activity.description,
      full_description: activity.fullDescription,
      cover_photo_id: null,
      created_at: date(activity.createdAt),
    })),
  });

  await prisma.photo.createMany({
    data: photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
      related_activity_id: photo.relatedActivityId,
      sort_order: photoOrder.get(photo.id) ?? 0,
      created_at: date(photo.createdAt),
    })),
  });

  await Promise.all(
    activities.map((activity) =>
      prisma.activity.update({
        where: { id: activity.id },
        data: { cover_photo_id: activity.coverPhotoId },
      }),
    ),
  );

  await prisma.loan.createMany({
    data: loans.map((loan) => ({
      id: loan.id,
      book_id: loan.bookId,
      member_id: loan.memberId,
      borrowed_at: date(loan.borrowedAt),
      due_at: date(loan.dueAt),
      returned_at: loan.returnedAt ? date(loan.returnedAt) : null,
      status: loanStatus[loan.status],
      created_at: date(loan.createdAt),
    })),
  });

  await prisma.workProgram.createMany({
    data: prokers.map((proker) => ({
      id: proker.id,
      title: proker.title,
      description: proker.description,
      period: proker.period,
      status: workProgramStatus[proker.status],
      progress: proker.progress,
      created_at: date(proker.createdAt),
    })),
  });

  await seedAdmin();

  console.log(
    `Seed selesai: ${books.length} buku, ${members.length} anggota, ${loans.length} pinjaman, ${activities.length} kegiatan, ${photos.length} foto, ${prokers.length} proker.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
