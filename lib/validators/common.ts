import { z } from "zod";

export const text = (max: number) => z.string().trim().min(1).max(max);

export const optionalSearch = z.string().trim().max(100).optional();

export const isoUtc = z.iso.datetime();

export const slugField = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung");

export const pagination = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
});

export const loanStatusEnum = z.enum(["BORROWED", "DUE_SOON", "OVERDUE", "RETURNED"]);
export const memberStatusEnum = z.enum(["ACTIVE", "INACTIVE"]);
export const workProgramStatusEnum = z.enum(["PLANNED", "ONGOING", "COMPLETED"]);
export const userRoleEnum = z.enum(["ADMIN", "LIBRARIAN", "MEMBER"]);
