import { z } from "zod";
import { text } from "./common";

export const meUpdate = z.object({
  name: text(100).optional(),
  contact: text(30).optional(),
});

export const meLoanQuery = z.object({
  status: z.enum(["active", "history"]).optional(),
});
