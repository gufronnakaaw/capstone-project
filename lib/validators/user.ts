import { z } from "zod";
import { optionalSearch, pagination, text, userRoleEnum } from "./common";

const password = z.string().min(8).max(100);

export const userCreate = z.object({
  name: text(100),
  email: z
    .email()
    .transform((value) => value.trim().toLowerCase()),
  password,
  role: userRoleEnum.default("MEMBER"),
  member_id: z.string().min(1).nullish(),
});

export const userUpdate = z.object({
  name: text(100).optional(),
  role: userRoleEnum.optional(),
  is_active: z.boolean().optional(),
  password: password.optional(),
  member_id: z.string().min(1).nullable().optional(),
});

export const userQuery = pagination.extend({
  q: optionalSearch,
  role: userRoleEnum.optional(),
});
