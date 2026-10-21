import { z } from "zod";
import { optionalSearch, pagination, text } from "./common";

export const bookCreate = z.object({
  title: text(200),
  author: text(150),
  category_id: z.string().min(1).nullish(),
  isbn: text(20).nullish(),
  cover_url: z.url(),
  stock: z.number().int().min(0).max(100000),
  published_year: z.number().int().min(1000).max(2100),
  synopsis: text(5000),
});

export const bookUpdate = bookCreate.partial();

export const bookQuery = pagination.extend({
  q: optionalSearch,
  category_id: z.string().min(1).optional(),
  available: z.enum(["true", "false"]).optional(),
});
