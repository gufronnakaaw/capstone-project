import { z } from "zod";
import { pagination, text } from "./common";

const blobUrl = z
  .url()
  .refine((value) => new URL(value).hostname.endsWith(".public.blob.vercel-storage.com"), {
    message: "URL foto harus berasal dari Vercel Blob",
  });

export const photoCreate = z.object({
  url: blobUrl,
  caption: text(300),
  related_activity_id: z.string().min(1).nullish(),
  sort_order: z.number().int().min(0).default(0),
});

export const photoUpdate = z.object({
  caption: text(300).optional(),
  related_activity_id: z.string().min(1).nullable().optional(),
  sort_order: z.number().int().min(0).optional(),
});

export const photoQuery = pagination.extend({
  activity_id: z.string().min(1).optional(),
});
