import { requireRole } from "@/lib/api/auth-guard";
import { badRequest } from "@/lib/api/errors";
import { apiRoute, json, readJson } from "@/lib/api/route";
import { prisma } from "@/lib/prisma";
import { workProgramCreate } from "@/lib/validators/work-program";

export const GET = apiRoute(async () => {
  const programs = await prisma.workProgram.findMany({
    where: { deleted_at: null },
    orderBy: [{ start_date: { sort: "asc", nulls: "last" } }, { created_at: "asc" }],
  });
  return json({ data: programs });
});

export const POST = apiRoute(async (request) => {
  await requireRole(["ADMIN"]);
  const body = await readJson(request, workProgramCreate);

  if (body.start_date && body.end_date && new Date(body.end_date) < new Date(body.start_date)) {
    throw badRequest("Tanggal selesai tidak boleh sebelum tanggal mulai");
  }

  const program = await prisma.workProgram.create({ data: body });
  return json({ data: program }, 201);
});
