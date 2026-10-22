"use client";

import { useState, type FormEvent } from "react";
import useSWR from "swr";
import { formatDate, StatusBadge } from "@/components/library/ui";
import { apiRequest, fetcher, revalidateApi } from "@/lib/client/api";
import { Field, Modal, Notice, Pager, isoToWibDate, messageOf, wibDateToIso } from "../ui";
import type { MemberRow, Page } from "../types";

type Draft = {
  name: string;
  member_code: string;
  contact: string;
  address: string;
  join_date: string;
  status: "ACTIVE" | "INACTIVE";
};

const emptyDraft = (): Draft => ({
  name: "",
  member_code: "",
  contact: "",
  address: "",
  join_date: new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" }).format(new Date()),
  status: "ACTIVE",
});

const toDraft = (member: MemberRow): Draft => ({
  name: member.name,
  member_code: member.member_code,
  contact: member.contact,
  address: member.address,
  join_date: isoToWibDate(member.join_date),
  status: member.status,
});

export function Members() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | "ACTIVE" | "INACTIVE">("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MemberRow | null>(null);
  const [notice, setNotice] = useState<{ tone: "error" | "info"; text: string } | null>(null);

  const params = new URLSearchParams({ page: String(page), page_size: "10" });
  if (q.trim()) params.set("q", q.trim());
  if (status) params.set("status", status);
  const { data, error } = useSWR<Page<MemberRow>>(`/api/members?${params.toString()}`, fetcher, {
    keepPreviousData: true,
  });

  async function remove(member: MemberRow) {
    if (!window.confirm(`Hapus data anggota "${member.name}"?`)) return;
    try {
      await apiRequest("DELETE", `/api/members/${member.id}`);
      await revalidateApi();
      setNotice({ tone: "info", text: `Data "${member.name}" dihapus.` });
    } catch (err) {
      setNotice({ tone: "error", text: messageOf(err) });
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Akurasi data</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Data anggota</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-sm font-extrabold text-primary-foreground"
        >
          Tambah anggota
        </button>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setPage(1);
          }}
          placeholder="Cari nama atau ID anggota..."
          className="form-input sm:max-w-sm"
          aria-label="Cari anggota"
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "" | "ACTIVE" | "INACTIVE");
            setPage(1);
          }}
          className="form-input sm:w-44"
          aria-label="Filter status"
        >
          <option value="">Semua status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="INACTIVE">Tidak aktif</option>
        </select>
      </div>

      {notice && (
        <div className="mt-5">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}
      {error && (
        <div className="mt-5">
          <Notice>Data anggota belum bisa dimuat.</Notice>
        </div>
      )}

      <div className="mt-5 overflow-x-auto border ink-rule bg-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b ink-rule bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Anggota</th>
              <th className="p-4">Kontak</th>
              <th className="p-4">Bergabung</th>
              <th className="p-4">Pinjaman aktif</th>
              <th className="p-4">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {(data?.data ?? []).map((member) => (
              <tr key={member.id} className="border-b ink-rule last:border-0">
                <td className="p-4">
                  <strong className="block text-primary">{member.name}</strong>
                  <span className="text-xs text-muted-foreground">{member.member_code}</span>
                </td>
                <td className="p-4">{member.contact}</td>
                <td className="p-4">{formatDate(member.join_date)}</td>
                <td className="p-4 tabular-nums">
                  {member.active_loan_count}
                  {member.has_overdue && <span className="ml-2 text-xs font-bold text-destructive">terlambat</span>}
                </td>
                <td className="p-4">
                  <StatusBadge status={member.status === "ACTIVE" ? "active" : "inactive"} />
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(member);
                        setFormOpen(true);
                      }}
                      className="min-h-9 border ink-rule px-3 text-xs font-semibold text-primary hover:bg-secondary"
                    >
                      Ubah
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(member)}
                      className="min-h-9 border border-destructive/40 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && !data.data.length && <p className="p-6 text-sm text-muted-foreground">Belum ada anggota yang cocok.</p>}
      </div>

      {data && <Pager page={page} totalPages={data.meta.total_pages} onChange={setPage} />}

      {formOpen && (
        <MemberForm
          member={editing}
          onClose={() => setFormOpen(false)}
          onSaved={(message) => {
            setFormOpen(false);
            setNotice({ tone: "info", text: message });
          }}
        />
      )}
    </>
  );
}

function MemberForm({
  member,
  onClose,
  onSaved,
}: {
  member: MemberRow | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [draft, setDraft] = useState<Draft>(member ? toDraft(member) : emptyDraft());
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const set = <K extends keyof Draft>(key: K) => (value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const payload = {
      name: draft.name.trim(),
      member_code: draft.member_code.trim(),
      contact: draft.contact.trim(),
      address: draft.address.trim(),
      join_date: wibDateToIso(draft.join_date),
      status: draft.status,
    };

    try {
      if (member) {
        await apiRequest("PATCH", `/api/members/${member.id}`, payload);
        await revalidateApi();
        onSaved(`Data "${payload.name}" berhasil diperbarui.`);
      } else {
        await apiRequest("POST", "/api/members", payload);
        await revalidateApi();
        onSaved(`"${payload.name}" berhasil didaftarkan.`);
      }
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal title={member ? "Ubah data anggota" : "Tambah anggota"} eyebrow="Validasi anggota" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Notice>{error}</Notice>}
        <Field label="Nama lengkap">
          <input required value={draft.name} onChange={(e) => set("name")(e.target.value)} className="form-input" placeholder="Contoh: Dwi Anggraini" />
        </Field>
        <Field label="ID anggota">
          <input required value={draft.member_code} onChange={(e) => set("member_code")(e.target.value)} className="form-input" placeholder="Contoh: PDS-0005" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nomor kontak">
            <input required value={draft.contact} onChange={(e) => set("contact")(e.target.value)} className="form-input" />
          </Field>
          <Field label="Tanggal bergabung">
            <input required type="date" value={draft.join_date} onChange={(e) => set("join_date")(e.target.value)} className="form-input" />
          </Field>
        </div>
        <Field label="Alamat">
          <input required value={draft.address} onChange={(e) => set("address")(e.target.value)} className="form-input" />
        </Field>
        <Field label="Status">
          <select value={draft.status} onChange={(e) => set("status")(e.target.value as Draft["status"])} className="form-input">
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Tidak aktif</option>
          </select>
        </Field>
        <button type="submit" disabled={pending} className="button-primary w-full disabled:opacity-60">
          {pending ? "Menyimpan..." : "Simpan data"}
        </button>
      </form>
    </Modal>
  );
}
