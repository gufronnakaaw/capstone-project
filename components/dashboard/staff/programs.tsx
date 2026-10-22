"use client";

import { useState, type FormEvent } from "react";
import useSWR from "swr";
import { formatDate, StatusBadge } from "@/components/library/ui";
import { apiRequest, fetcher, revalidateApi } from "@/lib/client/api";
import { Field, Modal, Notice, isoToWibDate, messageOf, wibDateToIso } from "../ui";
import type { ActivityRow, Page, WorkProgramRow } from "../types";

export function Programs() {
  return (
    <>
      <p className="eyebrow">Konten perpustakaan</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Kegiatan & program</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <Activities />
        <WorkPrograms />
      </div>
    </>
  );
}

type Feedback = { tone: "error" | "info"; text: string } | null;

function Activities() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ActivityRow | null>(null);
  const [notice, setNotice] = useState<Feedback>(null);
  const { data, error } = useSWR<Page<ActivityRow>>("/api/activities?page_size=100", fetcher);

  async function remove(activity: ActivityRow) {
    if (!window.confirm(`Hapus kegiatan "${activity.title}"?`)) return;
    try {
      await apiRequest("DELETE", `/api/activities/${activity.id}`);
      await revalidateApi();
      setNotice({ tone: "info", text: `Kegiatan "${activity.title}" dihapus.` });
    } catch (err) {
      setNotice({ tone: "error", text: messageOf(err) });
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Kalender kegiatan</p>
          <h2 className="mt-2 text-xl font-semibold text-primary">Kegiatan</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-sm font-extrabold text-primary-foreground"
        >
          Tambah kegiatan
        </button>
      </div>

      {notice && (
        <div className="mt-4">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}
      {error && (
        <div className="mt-4">
          <Notice>Kegiatan belum bisa dimuat.</Notice>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {(data?.data ?? []).map((activity) => (
          <div key={activity.id} className="flex items-center justify-between gap-3 border ink-rule bg-card p-4">
            <div>
              <p className="font-heading text-lg font-semibold">{activity.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(activity.date)}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(activity);
                  setFormOpen(true);
                }}
                className="min-h-9 border ink-rule px-3 text-xs font-semibold text-primary hover:bg-secondary"
              >
                Ubah
              </button>
              <button
                type="button"
                onClick={() => remove(activity)}
                className="min-h-9 border border-destructive/40 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {data && !data.data.length && <p className="rounded-lg bg-secondary p-6 text-sm text-muted-foreground">Belum ada kegiatan.</p>}
      </div>

      {formOpen && (
        <ActivityForm
          activity={editing}
          onClose={() => setFormOpen(false)}
          onSaved={(text) => {
            setFormOpen(false);
            setNotice({ tone: "info", text });
          }}
        />
      )}
    </section>
  );
}

function ActivityForm({
  activity,
  onClose,
  onSaved,
}: {
  activity: ActivityRow | null;
  onClose: () => void;
  onSaved: (text: string) => void;
}) {
  const [title, setTitle] = useState(activity?.title ?? "");
  const [slug, setSlug] = useState(activity?.slug ?? "");
  const [date, setDate] = useState(activity ? isoToWibDate(activity.date) : "");
  const [description, setDescription] = useState(activity?.description ?? "");
  const [fullDescription, setFullDescription] = useState(activity?.full_description ?? "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const payload = {
      title: title.trim(),
      date: wibDateToIso(date),
      description: description.trim(),
      full_description: fullDescription.trim(),
      ...(slug.trim() ? { slug: slug.trim() } : {}),
    };

    try {
      if (activity) {
        await apiRequest("PATCH", `/api/activities/${activity.id}`, payload);
        await revalidateApi();
        onSaved(`Kegiatan "${payload.title}" berhasil diperbarui.`);
      } else {
        await apiRequest("POST", "/api/activities", payload);
        await revalidateApi();
        onSaved(`Kegiatan "${payload.title}" berhasil ditambahkan.`);
      }
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal title={activity ? "Ubah kegiatan" : "Tambah kegiatan"} eyebrow="Kegiatan" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Notice>{error}</Notice>}
        <Field label="Judul kegiatan">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tanggal">
            <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
          </Field>
          <Field label="Slug (opsional)">
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="form-input" placeholder="dibuat dari judul" />
          </Field>
        </div>
        <Field label="Deskripsi singkat">
          <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" />
        </Field>
        <Field label="Deskripsi lengkap">
          <textarea required rows={5} value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="form-input" />
        </Field>
        <button type="submit" disabled={pending} className="button-primary w-full disabled:opacity-60">
          {pending ? "Menyimpan..." : "Simpan kegiatan"}
        </button>
      </form>
    </Modal>
  );
}

function WorkPrograms() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<WorkProgramRow | null>(null);
  const [notice, setNotice] = useState<Feedback>(null);
  const { data, error } = useSWR<{ data: WorkProgramRow[] }>("/api/work-programs", fetcher);

  async function remove(program: WorkProgramRow) {
    if (!window.confirm(`Hapus program "${program.title}"?`)) return;
    try {
      await apiRequest("DELETE", `/api/work-programs/${program.id}`);
      await revalidateApi();
      setNotice({ tone: "info", text: `Program "${program.title}" dihapus.` });
    } catch (err) {
      setNotice({ tone: "error", text: messageOf(err) });
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Program kerja</p>
          <h2 className="mt-2 text-xl font-semibold text-primary">Program</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-sm font-extrabold text-primary-foreground"
        >
          Tambah program
        </button>
      </div>

      {notice && (
        <div className="mt-4">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}
      {error && (
        <div className="mt-4">
          <Notice>Program kerja belum bisa dimuat.</Notice>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {(data?.data ?? []).map((program) => (
          <div key={program.id} className="flex items-center justify-between gap-3 border ink-rule bg-card p-4">
            <div>
              <p className="font-heading text-lg font-semibold">{program.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {program.period} · {program.progress}%
              </p>
              <div className="mt-2">
                <StatusBadge status={program.status.toLowerCase()} />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(program);
                  setFormOpen(true);
                }}
                className="min-h-9 border ink-rule px-3 text-xs font-semibold text-primary hover:bg-secondary"
              >
                Ubah
              </button>
              <button
                type="button"
                onClick={() => remove(program)}
                className="min-h-9 border border-destructive/40 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {data && !data.data.length && <p className="rounded-lg bg-secondary p-6 text-sm text-muted-foreground">Belum ada program.</p>}
      </div>

      {formOpen && (
        <ProgramForm
          program={editing}
          onClose={() => setFormOpen(false)}
          onSaved={(text) => {
            setFormOpen(false);
            setNotice({ tone: "info", text });
          }}
        />
      )}
    </section>
  );
}

function ProgramForm({
  program,
  onClose,
  onSaved,
}: {
  program: WorkProgramRow | null;
  onClose: () => void;
  onSaved: (text: string) => void;
}) {
  const [title, setTitle] = useState(program?.title ?? "");
  const [description, setDescription] = useState(program?.description ?? "");
  const [period, setPeriod] = useState(program?.period ?? "");
  const [startDate, setStartDate] = useState(program?.start_date ? isoToWibDate(program.start_date) : "");
  const [endDate, setEndDate] = useState(program?.end_date ? isoToWibDate(program.end_date) : "");
  const [status, setStatus] = useState<WorkProgramRow["status"]>(program?.status ?? "PLANNED");
  const [progress, setProgress] = useState(String(program?.progress ?? 0));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const payload = {
      title: title.trim(),
      description: description.trim(),
      period: period.trim(),
      start_date: startDate ? wibDateToIso(startDate) : null,
      end_date: endDate ? wibDateToIso(endDate) : null,
      status,
      progress: Number(progress),
    };

    try {
      if (program) {
        await apiRequest("PATCH", `/api/work-programs/${program.id}`, payload);
        await revalidateApi();
        onSaved(`Program "${payload.title}" berhasil diperbarui.`);
      } else {
        await apiRequest("POST", "/api/work-programs", payload);
        await revalidateApi();
        onSaved(`Program "${payload.title}" berhasil ditambahkan.`);
      }
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal title={program ? "Ubah program" : "Tambah program"} eyebrow="Program kerja" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Notice>{error}</Notice>}
        <Field label="Nama program">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" />
        </Field>
        <Field label="Periode (teks)">
          <input required value={period} onChange={(e) => setPeriod(e.target.value)} className="form-input" placeholder="Contoh: Jan–Des 2026" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mulai">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" />
          </Field>
          <Field label="Selesai">
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value as WorkProgramRow["status"])} className="form-input">
              <option value="PLANNED">Direncanakan</option>
              <option value="ONGOING">Berjalan</option>
              <option value="COMPLETED">Selesai</option>
            </select>
          </Field>
          <Field label="Kemajuan (%)">
            <input required type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(e.target.value)} className="form-input" />
          </Field>
        </div>
        <Field label="Deskripsi">
          <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" />
        </Field>
        <button type="submit" disabled={pending} className="button-primary w-full disabled:opacity-60">
          {pending ? "Menyimpan..." : "Simpan program"}
        </button>
      </form>
    </Modal>
  );
}
