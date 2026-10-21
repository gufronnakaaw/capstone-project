export const categorySelect = { id: true, name: true, slug: true } as const;

export const photoSelect = { id: true, url: true, caption: true, sort_order: true } as const;

export const loanInclude = {
  book: { select: { id: true, title: true, author: true, cover_url: true } },
  member: { select: { id: true, name: true, member_code: true } },
} as const;

export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  is_active: true,
  member_id: true,
  created_at: true,
  updated_at: true,
} as const;

export function serializeMember<T extends { loans: { due_at: Date }[] }>(member: T, now: Date) {
  const { loans, ...rest } = member;
  return {
    ...rest,
    active_loan_count: loans.length,
    has_overdue: loans.some((loan) => loan.due_at < now),
  };
}
