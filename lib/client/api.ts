import { mutate } from "swr";

export class ApiClientError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

async function parse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      body?.error?.message ?? "Terjadi kesalahan, coba lagi.",
      body?.error?.details,
    );
  }
  return body as T;
}

export async function fetcher<T>(url: string): Promise<T> {
  return parse<T>(await fetch(url));
}

export async function apiRequest<T>(
  method: "POST" | "PATCH" | "DELETE",
  url: string,
  payload?: unknown,
): Promise<T> {
  const isFormData = payload instanceof FormData;
  const response = await fetch(url, {
    method,
    headers: isFormData || payload === undefined ? undefined : { "Content-Type": "application/json" },
    body: payload === undefined ? undefined : isFormData ? payload : JSON.stringify(payload),
  });
  return parse<T>(response);
}

export const revalidateApi = () =>
  mutate((key) => typeof key === "string" && key.startsWith("/api/"));
