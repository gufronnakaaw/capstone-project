import { requireRole } from "@/lib/api/auth-guard";
import { badRequest, notFound } from "@/lib/api/errors";
import { apiRoute, json, readJson } from "@/lib/api/route";
import { prisma } from "@/lib/prisma";
import { workProgramUpdate } from "@/lib/validators/work-program";

type Params = { id: string };

export const PATCH = apiRoute<Params>(async (request, params) => {
  await requireRole(["ADMIN"]);
  const { id } = await params;
  const body = await readJson(request, workProgramUpdate);

  const current = await prisma.workProgram.findFirst({ where: { id, deleted_at: null } });
  if (!current) throw notFound("Program kerja tidak ditemukan");

  const startDate = body.start_date !== undefined ? body.start_date : current.start_date;
  const endDate = body.end_date !== undefined ? body.end_date : current.end_date;
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    throw badRequest("Tanggal selesai tidak boleh sebelum tanggal mulai");
  }

  const program = await prisma.workProgram.update({ where: { id }, data: body });
  return json({ data: program });
});

export const DELETE = apiRoute<Params>(async (_request, params) => {
  await requireRole(["ADMIN"]);
  const { id } = await params;

  const current = await prisma.workProgram.findFirst({ where: { id, deleted_at: null }, select: { id: true } });
  if (!current) throw notFound("Program kerja tidak ditemukan");

  await prisma.workProgram.update({ where: { id }, data: { deleted_at: new Date() } });
  return json({ data: { id, deleted: true } });
});
