"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import useSWR from "swr";
import { apiRequest, fetcher, revalidateApi } from "@/lib/client/api";
import { Field, Notice, messageOf } from "../ui";
import type { ActivityRow, Page, PhotoRow } from "../types";

type Feedback = { tone: "error" | "info"; text: string } | null;

export function Gallery() {
  const [notice, setNotice] = useState<Feedback>(null);
  const { data, error } = useSWR<Page<PhotoRow>>("/api/photos?page_size=100", fetcher);

  async function remove(photo: PhotoRow) {
    if (!window.confirm("Hapus foto ini dari galeri?")) return;
    try {
      await apiRequest("DELETE", `/api/photos/${photo.id}`);
      await revalidateApi();
      setNotice({ tone: "info", text: "Foto dihapus." });
    } catch (err) {
      setNotice({ tone: "error", text: messageOf(err) });
    }
  }

  async function makeCover(photo: PhotoRow) {
    if (!photo.related_activity_id) return;
    try {
      await apiRequest("PATCH", `/api/activities/${photo.related_activity_id}`, { cover_photo_id: photo.id });
      await revalidateApi();
      setNotice({ tone: "info", text: "Foto dijadikan sampul kegiatan." });
    } catch (err) {
      setNotice({ tone: "error", text: messageOf(err) });
    }
  }

  return (
    <>
      <p className="eyebrow">Dokumentasi</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Galeri</h1>

      <UploadForm onUploaded={() => setNotice({ tone: "info", text: "Foto berhasil ditambahkan." })} onError={(text) => setNotice({ tone: "error", text })} />

      {notice && (
        <div className="mt-6">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}
      {error && (
        <div className="mt-6">
          <Notice>Galeri belum bisa dimuat.</Notice>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(data?.data ?? []).map((photo) => (
          <figure key={photo.id} className="overflow-hidden border ink-rule bg-card">
            <div className="relative aspect-[4/3] bg-secondary">
              <Image src={photo.url} alt={photo.caption} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
            </div>
            <figcaption className="space-y-3 p-4">
              <p className="text-sm font-semibold text-primary">{photo.caption}</p>
              <p className="text-xs text-muted-foreground">{photo.activity ? photo.activity.title : "Tidak terkait kegiatan"}</p>
              <div className="flex flex-wrap gap-2">
                {photo.activity && (
                  <button type="button" onClick={() => makeCover(photo)} className="min-h-9 border ink-rule px-3 text-xs font-semibold text-primary hover:bg-secondary">
                    Jadikan sampul
                  </button>
                )}
                <button type="button" onClick={() => remove(photo)} className="min-h-9 border border-destructive/40 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10">
                  Hapus
                </button>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      {data && !data.data.length && <p className="mt-8 rounded-lg bg-secondary p-6 text-sm text-muted-foreground">Belum ada foto.</p>}
    </>
  );
}

function UploadForm({ onUploaded, onError }: { onUploaded: () => void; onError: (text: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [activityId, setActivityId] = useState("");
  const [pending, setPending] = useState(false);
  const { data: activities } = useSWR<Page<ActivityRow>>("/api/activities?page_size=100", fetcher);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    setPending(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const uploaded = await apiRequest<{ data: { url: string } }>("POST", "/api/uploads", form);
      await apiRequest("POST", "/api/photos", {
        url: uploaded.data.url,
        caption: caption.trim(),
        related_activity_id: activityId || null,
      });
      await revalidateApi();
      setFile(null);
      setCaption("");
      setActivityId("");
      (event.target as HTMLFormElement).reset();
      onUploaded();
    } catch (err) {
      onError(messageOf(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 border ink-rule bg-card p-5 sm:grid-cols-2 sm:p-7">
      <Field label="Berkas foto (JPEG, PNG, atau WebP, maks. 5 MB)">
        <input
          required
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="form-input"
        />
      </Field>
      <Field label="Keterangan foto">
        <input required value={caption} onChange={(e) => setCaption(e.target.value)} className="form-input" />
      </Field>
      <Field label="Kegiatan terkait (opsional)">
        <select value={activityId} onChange={(e) => setActivityId(e.target.value)} className="form-input">
          <option value="">Tidak terkait kegiatan</option>
          {(activities?.data ?? []).map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.title}
            </option>
          ))}
        </select>
      </Field>
      <div className="flex items-end">
        <button type="submit" disabled={pending || !file} className="button-primary w-full disabled:opacity-60">
          {pending ? "Mengunggah..." : "Unggah foto"}
        </button>
      </div>
    </form>
  );
}
