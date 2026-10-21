import { z } from "zod";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new ApiError(400, "BAD_REQUEST", message, details);
export const unauthorized = (message = "Login diperlukan") =>
  new ApiError(401, "UNAUTHORIZED", message);
export const forbidden = (message = "Akses ditolak") =>
  new ApiError(403, "FORBIDDEN", message);
export const notFound = (message = "Data tidak ditemukan") =>
  new ApiError(404, "NOT_FOUND", message);
export const conflict = (message: string) =>
  new ApiError(409, "CONFLICT", message);

const prismaErrors: Record<string, { status: number; code: string; message: string }> = {
  P2002: { status: 409, code: "CONFLICT", message: "Data sudah dipakai" },
  P2003: { status: 409, code: "CONFLICT", message: "Data masih terhubung dengan data lain" },
  P2004: { status: 409, code: "CONFLICT", message: "Data melanggar aturan database" },
  P2014: { status: 409, code: "CONFLICT", message: "Data masih terhubung dengan data lain" },
  P2025: { status: 404, code: "NOT_FOUND", message: "Data tidak ditemukan" },
};

export function toErrorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(
      { error: { code: error.code, message: error.message, details: error.details ?? null } },
      { status: error.status },
    );
  }

  if (error instanceof z.ZodError) {
    return Response.json(
      { error: { code: "VALIDATION_ERROR", message: "Data tidak valid", details: error.issues } },
      { status: 400 },
    );
  }

  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
  const mapped = prismaErrors[code];
  if (mapped) {
    return Response.json(
      { error: { code: mapped.code, message: mapped.message, details: null } },
      { status: mapped.status },
    );
  }

  console.error(error);
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan pada server", details: null } },
    { status: 500 },
  );
}
