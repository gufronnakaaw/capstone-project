import { z } from "zod";
import { isoUtc, text, workProgramStatusEnum } from "./common";

export const workProgramCreate = z.object({
  title: text(200),
  description: text(2000),
  period: text(100),
  start_date: isoUtc.nullish(),
  end_date: isoUtc.nullish(),
  status: workProgramStatusEnum.default("PLANNED"),
  progress: z.number().int().min(0).max(100).default(0),
});

export const workProgramUpdate = workProgramCreate.partial();
