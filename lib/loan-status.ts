import { prisma } from "@/lib/prisma";

export const LOAN_PERIOD_DAYS = 14;
const DUE_SOON_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export const loanDueDate = (borrowedAt: Date) => new Date(borrowedAt.getTime() + LOAN_PERIOD_DAYS * DAY_MS);

export async function syncLoanStatuses(now: Date = new Date()) {
  const soon = new Date(now.getTime() + DUE_SOON_DAYS * DAY_MS);

  await prisma.$transaction([
    prisma.loan.updateMany({
      where: { returned_at: null, deleted_at: null, due_at: { lt: now }, status: { not: "OVERDUE" } },
      data: { status: "OVERDUE" },
    }),
    prisma.loan.updateMany({
      where: { returned_at: null, deleted_at: null, due_at: { gte: now, lte: soon }, status: "BORROWED" },
      data: { status: "DUE_SOON" },
    }),
    prisma.loan.updateMany({
      where: { returned_at: null, deleted_at: null, due_at: { gt: soon }, status: { in: ["DUE_SOON", "OVERDUE"] } },
      data: { status: "BORROWED" },
    }),
  ]);
}
