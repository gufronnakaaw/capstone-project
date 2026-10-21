import { put } from "@vercel/blob";
import { requireRole } from "@/lib/api/auth-guard";
import { badRequest } from "@/lib/api/errors";
import { apiRoute, json } from "@/lib/api/route";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 5 * 1024 * 1024;

export const POST = apiRoute(async (request) => {
  await requireRole(["ADMIN"]);

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw badRequest("File wajib diunggah");

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) throw badRequest("Tipe file harus JPEG, PNG, atau WebP");
  if (file.size > MAX_BYTES) throw badRequest("Ukuran file maksimal 5 MB");

  const blob = await put(`gallery/${crypto.randomUUID()}.${extension}`, file, {
    access: "public",
    contentType: file.type,
  });

  return json({ data: { url: blob.url, pathname: blob.pathname } }, 201);
});
