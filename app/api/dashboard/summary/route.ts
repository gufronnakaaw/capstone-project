import { requireRole } from "@/lib/api/auth-guard";
import { apiRoute, json } from "@/lib/api/route";
import { syncLoanStatuses } from "@/lib/loan-status";
import { prisma } from "@/lib/prisma";

export const GET = apiRoute(async () => {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const now = new Date();
  await syncLoanStatuses(now);

  const [
    books_total,
    loans_active,
    loans_overdue,
    loans_due_soon,
    members_active,
    activities_upcoming,
    work_programs_active,
  ] = await Promise.all([
    prisma.book.count({ where: { deleted_at: null } }),
    prisma.loan.count({ where: { returned_at: null, deleted_at: null } }),
    prisma.loan.count({ where: { returned_at: null, deleted_at: null, status: "OVERDUE" } }),
    prisma.loan.count({ where: { returned_at: null, deleted_at: null, status: "DUE_SOON" } }),
    prisma.member.count({ where: { deleted_at: null, status: "ACTIVE" } }),
    prisma.activity.count({ where: { deleted_at: null, date: { gte: now } } }),
    prisma.workProgram.count({ where: { deleted_at: null, status: { in: ["PLANNED", "ONGOING"] } } }),
  ]);

  return json({
    data: {
      books_total,
      loans_active,
      loans_overdue,
      loans_due_soon,
      members_active,
      activities_upcoming,
      work_programs_active,
    },
  });
});
