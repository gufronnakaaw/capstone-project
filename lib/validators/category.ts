import { z } from "zod";
import { text } from "./common";

export const categoryCreate = z.object({
  name: text(100),
  sort_order: z.number().int().min(0).default(0),
});

export const categoryUpdate = z.object({
  name: text(100).optional(),
  sort_order: z.number().int().min(0).optional(),
});
