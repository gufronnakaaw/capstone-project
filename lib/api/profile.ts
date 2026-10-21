import { prisma } from "@/lib/prisma";
import { unauthorized } from "./errors";
import { serializeMember } from "./serializers";

export async function loadProfile(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deleted_at: null, is_active: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      member_id: true,
      member: {
        select: {
          id: true,
          name: true,
          member_code: true,
          contact: true,
          address: true,
          join_date: true,
          status: true,
          deleted_at: true,
          loans: {
            where: { returned_at: null, deleted_at: null },
            select: { due_at: true },
          },
        },
      },
    },
  });
  if (!user) throw unauthorized("Sesi tidak valid");

  const member = user.member && !user.member.deleted_at ? serializeMember(user.member, new Date()) : null;

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, member_id: member?.id ?? null },
    member,
  };
}
