import { z } from "zod";
import { isoUtc, memberStatusEnum, optionalSearch, pagination, text } from "./common";

export const memberCreate = z.object({
  name: text(100),
  member_code: text(30),
  contact: text(30),
  address: text(300),
  join_date: isoUtc,
  status: memberStatusEnum.default("ACTIVE"),
});

export const memberUpdate = memberCreate.partial();

export const memberQuery = pagination.extend({
  q: optionalSearch,
  status: memberStatusEnum.optional(),
});
