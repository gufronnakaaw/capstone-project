import { z } from "zod";
import { loanStatusEnum, optionalSearch, pagination } from "./common";

export const loanCreate = z.object({
  book_id: z.string().min(1),
  member_id: z.string().min(1),
});

export const loanQuery = pagination.extend({
  q: optionalSearch,
  status: loanStatusEnum.optional(),
});
