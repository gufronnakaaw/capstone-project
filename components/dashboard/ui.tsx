"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function Modal({
  title,
  eyebrow,
  onClose,
  children,
}: {
  title: string;
  eyebrow: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-primary/50 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="grid size-9 shrink-0 place-items-center border ink-rule">
            <X size={17} />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function Notice({ tone = "error", children }: { tone?: "error" | "info"; children: ReactNode }) {
  const style =
    tone === "error"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : "border-primary/30 bg-secondary text-primary";
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`border p-3 text-sm font-semibold ${style}`}>
      {children}
    </p>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs font-bold">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export function Pager({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-end gap-3 text-xs font-semibold text-muted-foreground">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="grid size-9 place-items-center border ink-rule disabled:opacity-40"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="tabular-nums">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="grid size-9 place-items-center border ink-rule disabled:opacity-40"
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export const wibDateToIso = (value: string) => new Date(`${value}T00:00:00+07:00`).toISOString();

export const isoToWibDate = (iso: string) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" }).format(new Date(iso));

export const toStatusKey = (status: string) => status.toLowerCase().replace("_", "-");

export const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : "Terjadi kesalahan, coba lagi.";
