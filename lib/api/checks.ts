import { prisma } from "@/lib/prisma";
import { badRequest, conflict } from "./errors";

export async function assertActiveCategory(id: string) {
  const category = await prisma.category.findFirst({
    where: { id, deleted_at: null },
    select: { id: true },
  });
  if (!category) throw badRequest("Kategori tidak ditemukan");
}

export async function assertActiveActivity(id: string) {
  const activity = await prisma.activity.findFirst({
    where: { id, deleted_at: null },
    select: { id: true },
  });
  if (!activity) throw badRequest("Kegiatan tidak ditemukan");
}

export async function assertActiveMember(id: string) {
  const member = await prisma.member.findFirst({
    where: { id, deleted_at: null },
    select: { id: true, status: true },
  });
  if (!member) throw badRequest("Anggota tidak ditemukan");
  return member;
}

export async function assertUserLinkAvailable(member_id: string, exceptUserId?: string) {
  const linked = await prisma.user.findFirst({
    where: {
      member_id,
      deleted_at: null,
      ...(exceptUserId ? { NOT: { id: exceptUserId } } : {}),
    },
    select: { id: true },
  });
  if (linked) throw conflict("Anggota ini sudah terhubung dengan akun lain");
}
