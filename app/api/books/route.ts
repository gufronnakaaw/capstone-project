import { requireRole } from "@/lib/api/auth-guard";
import { assertActiveCategory } from "@/lib/api/checks";
import { conflict } from "@/lib/api/errors";
import { apiRoute, json, pageMeta, readJson, readQuery } from "@/lib/api/route";
import { categorySelect } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { bookCreate, bookQuery } from "@/lib/validators/book";

type BookWhere = NonNullable<Parameters<typeof prisma.book.findMany>[0]>["where"];

export const GET = apiRoute(async (request) => {
  const { page, page_size, q, category_id, available } = readQuery(request, bookQuery);

  const where: BookWhere = {
    deleted_at: null,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { author: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category_id ? { category_id } : {}),
    ...(available === "true" ? { available_stock: { gt: 0 } } : {}),
  };

  const [books, total] = await prisma.$transaction([
    prisma.book.findMany({
      where,
      include: { category: { select: categorySelect } },
      orderBy: { title: "asc" },
      skip: (page - 1) * page_size,
      take: page_size,
    }),
    prisma.book.count({ where }),
  ]);

  return json({ data: books, meta: pageMeta(page, page_size, total) });
});

export const POST = apiRoute(async (request) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const body = await readJson(request, bookCreate);

  if (body.isbn) {
    const duplicate = await prisma.book.findFirst({
      where: { isbn: body.isbn, deleted_at: null },
      select: { id: true },
    });
    if (duplicate) throw conflict("ISBN sudah terdaftar");
  }
  if (body.category_id) await assertActiveCategory(body.category_id);

  const book = await prisma.book.create({
    data: {
      ...body,
      category_id: body.category_id ?? null,
      isbn: body.isbn ?? null,
      available_stock: body.stock,
    },
    include: { category: { select: categorySelect } },
  });
  return json({ data: book }, 201);
});
