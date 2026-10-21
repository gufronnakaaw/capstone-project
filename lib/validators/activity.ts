import { z } from "zod";
import { isoUtc, pagination, slugField, text } from "./common";

export const activityCreate = z.object({
  title: text(200),
  slug: slugField.optional(),
  date: isoUtc,
  description: text(500),
  full_description: text(5000),
});

export const activityUpdate = z.object({
  title: text(200).optional(),
  slug: slugField.optional(),
  date: isoUtc.optional(),
  description: text(500).optional(),
  full_description: text(5000).optional(),
  cover_photo_id: z.string().min(1).nullable().optional(),
});

export const activityQuery = pagination.extend({
  period: z.enum(["upcoming", "past"]).optional(),
});
