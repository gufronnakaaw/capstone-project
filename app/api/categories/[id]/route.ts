import { requireRole } from "@/lib/api/auth-guard";
import { conflict, notFound } from "@/lib/api/errors";
import { apiRoute, json, readJson } from "@/lib/api/route";
import { prisma } from "@/lib/prisma";
import { categoryUpdate } from "@/lib/validators/category";
import { slugify } from "@/lib/utils/slug";

type Params = { id: string };

export const PATCH = apiRoute<Params>(async (request, params) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const { id } = await params;
  const body = await readJson(request, categoryUpdate);

  const current = await prisma.category.findFirst({ where: { id, deleted_at: null } });
  if (!current) throw notFound("Kategori tidak ditemukan");

  const name = body.name ?? current.name;
  const slug = slugify(name);

  const duplicate = await prisma.category.findFirst({
    where: {
      deleted_at: null,
      NOT: { id },
      OR: [{ name: { equals: name, mode: "insensitive" } }, { slug }],
    },
    select: { id: true },
  });
  if (duplicate) throw conflict("Nama atau slug kategori sudah dipakai");

  const category = await prisma.category.update({
    where: { id },
    data: { name, slug, sort_order: body.sort_order ?? current.sort_order },
  });
  return json({ data: category });
});

export const DELETE = apiRoute<Params>(async (_request, params) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const { id } = await params;

  const current = await prisma.category.findFirst({ where: { id, deleted_at: null }, select: { id: true } });
  if (!current) throw notFound("Kategori tidak ditemukan");

  await prisma.$transaction([
    prisma.book.updateMany({ where: { category_id: id }, data: { category_id: null } }),
    prisma.category.update({ where: { id }, data: { deleted_at: new Date() } }),
  ]);
  return json({ data: { id, deleted: true } });
});
