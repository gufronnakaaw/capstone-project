import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { forbidden, unauthorized } from "./errors";

export type AppRole = "ADMIN" | "LIBRARIAN" | "MEMBER";

export async function getCurrentUser() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw unauthorized();

  const user = await prisma.user.findFirst({
    where: { id, deleted_at: null, is_active: true },
    select: { id: true, name: true, email: true, role: true, member_id: true },
  });
  if (!user) throw unauthorized("Sesi tidak valid");
  return user;
}

export async function requireRole(roles: AppRole[]) {
  const user = await getCurrentUser();
  if (!roles.includes(user.role)) throw forbidden();
  return user;
}
