import { getCurrentUser } from "@/lib/api/auth-guard";
import { badRequest } from "@/lib/api/errors";
import { apiRoute, json, readQuery } from "@/lib/api/route";
import { loanInclude } from "@/lib/api/serializers";
import { syncLoanStatuses } from "@/lib/loan-status";
import { prisma } from "@/lib/prisma";
import { meLoanQuery } from "@/lib/validators/me";

export const GET = apiRoute(async (request) => {
  const user = await getCurrentUser();
  if (!user.member_id) throw badRequest("Akun ini belum terhubung dengan data anggota");

  const { status } = readQuery(request, meLoanQuery);
  await syncLoanStatuses();

  const loans = await prisma.loan.findMany({
    where: {
      member_id: user.member_id,
      deleted_at: null,
      ...(status === "active" ? { returned_at: null } : {}),
      ...(status === "history" ? { returned_at: { not: null } } : {}),
    },
    include: loanInclude,
    orderBy: { borrowed_at: "desc" },
  });

  return json({ data: loans });
});
