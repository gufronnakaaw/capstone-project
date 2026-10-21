import type { z } from "zod";
import { badRequest, toErrorResponse } from "./errors";

export function apiRoute<P = Record<string, string>>(
  handler: (request: Request, params: Promise<P>) => Promise<Response>,
) {
  return async (request: Request, context?: { params: Promise<P> }) => {
    try {
      return await handler(request, context?.params ?? Promise.resolve({} as P));
    } catch (error) {
      return toErrorResponse(error);
    }
  };
}

export const json = (data: unknown, status = 200) => Response.json(data, { status });

export const pageMeta = (page: number, page_size: number, total: number) => ({
  page,
  page_size,
  total,
  total_pages: Math.max(1, Math.ceil(total / page_size)),
});

export async function readJson<T extends z.ZodType>(request: Request, schema: T): Promise<z.output<T>> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    throw badRequest("Body harus berupa JSON yang valid");
  }
  return schema.parse(payload) as z.output<T>;
}

export function readQuery<T extends z.ZodType>(request: Request, schema: T): z.output<T> {
  return schema.parse(Object.fromEntries(new URL(request.url).searchParams)) as z.output<T>;
}
