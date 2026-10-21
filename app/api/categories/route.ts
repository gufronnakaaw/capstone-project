import { requireRole } from "@/lib/api/auth-guard";
import { conflict } from "@/lib/api/errors";
import { apiRoute, json, readJson } from "@/lib/api/route";
import { prisma } from "@/lib/prisma";
import { categoryCreate } from "@/lib/validators/category";
import { slugify } from "@/lib/utils/slug";

export const GET = apiRoute(async () => {
  const categories = await prisma.category.findMany({
    where: { deleted_at: null },
    select: { id: true, name: true, slug: true, sort_order: true },
    orderBy: [{ sort_order: "asc" }, { name: "asc" }],
  });
  return json({ data: categories });
});

export const POST = apiRoute(async (request) => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const body = await readJson(request, categoryCreate);
  const slug = slugify(body.name);

  const duplicate = await prisma.category.findFirst({
    where: {
      deleted_at: null,
      OR: [{ name: { equals: body.name, mode: "insensitive" } }, { slug }],
    },
    select: { id: true },
  });
  if (duplicate) throw conflict("Nama atau slug kategori sudah dipakai");

  const category = await prisma.category.create({
    data: { name: body.name, slug, sort_order: body.sort_order },
  });
  return json({ data: category }, 201);
});
