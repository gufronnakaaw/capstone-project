"use client";

import { useState, type FormEvent } from "react";
import useSWR from "swr";
import { formatDate, StatusBadge } from "@/components/library/ui";
import { apiRequest, fetcher, revalidateApi } from "@/lib/client/api";
import { Modal, Notice, Pager, messageOf, toStatusKey } from "../ui";
import type { BookRow, LoanRow, MemberRow, Page } from "../types";

export function Transactions() {
  const [activeOnly, setActiveOnly] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: "error" | "info"; text: string } | null>(null);

  const params = new URLSearchParams({ page: String(page), page_size: "10" });
  if (activeOnly) params.set("active", "true");
  if (q.trim()) params.set("q", q.trim());
  const { data, error } = useSWR<Page<LoanRow>>(`/api/loans?${params.toString()}`, fetcher, {
    keepPreviousData: true,
  });

  async function handleReturn(loan: LoanRow) {
    setBusyId(loan.id);
    setNotice(null);
    try {
      await apiRequest("POST", `/api/loans/${loan.id}/return`);
      await revalidateApi();
      setNotice({ tone: "info", text: `"${loan.book.title}" sudah dikembalikan.` });
    } catch (err) {
      setNotice({ tone: "error", text: messageOf(err) });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Meja sirkulasi</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Pinjam & kembali</h1>
        </div>
        <button
          type="button"
          onClick={() => setBorrowOpen(true)}
          className="inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-sm font-extrabold text-primary-foreground"
        >
          Catat peminjaman
        </button>
      </div>

      <div className="mt-7 flex flex-col gap-3 border-y ink-rule py-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setPage(1);
          }}
          placeholder="Cari judul buku atau nama anggota..."
          className="form-input sm:max-w-sm"
          aria-label="Cari transaksi"
        />
        <div className="flex gap-2">
          {[
            { value: true, label: "Sedang dipinjam" },
            { value: false, label: "Semua" },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                setActiveOnly(option.value);
                setPage(1);
              }}
              className={`border px-3 py-2 text-xs font-bold ${activeOnly === option.value ? "border-primary bg-primary text-primary-foreground" : "ink-rule bg-card"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="mt-5">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}
      {error && (
        <div className="mt-5">
          <Notice>Transaksi belum bisa dimuat.</Notice>
        </div>
      )}

      <div className="mt-5 overflow-x-auto border ink-rule bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b ink-rule bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Buku</th>
              <th className="p-4">Anggota</th>
              <th className="p-4">Dipinjam</th>
              <th className="p-4">Jatuh tempo</th>
              <th className="p-4">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {(data?.data ?? []).map((loan) => (
              <tr key={loan.id} className="border-b ink-rule last:border-0">
                <td className="p-4 font-semibold text-primary">{loan.book.title}</td>
                <td className="p-4">
                  {loan.member.name}
                  <span className="block text-xs text-muted-foreground">{loan.member.member_code}</span>
                </td>
                <td className="p-4">{formatDate(loan.borrowed_at)}</td>
                <td className="p-4">{formatDate(loan.due_at)}</td>
                <td className="p-4">
                  <StatusBadge status={toStatusKey(loan.status)} />
                </td>
                <td className="p-4 text-right">
                  {!loan.returned_at && (
                    <button
                      type="button"
                      disabled={busyId === loan.id}
                      onClick={() => handleReturn(loan)}
                      className="min-h-9 border border-primary px-3 text-xs font-semibold text-primary hover:bg-secondary disabled:opacity-50"
                    >
                      Tandai kembali
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && !data.data.length && (
          <p className="p-6 text-sm text-muted-foreground">Belum ada transaksi yang cocok.</p>
        )}
      </div>

      {data && <Pager page={page} totalPages={data.meta.total_pages} onChange={setPage} />}

      {borrowOpen && (
        <BorrowDialog
          onClose={() => setBorrowOpen(false)}
          onDone={() => {
            setBorrowOpen(false);
            setNotice({ tone: "info", text: "Peminjaman berhasil dicatat." });
          }}
        />
      )}
    </>
  );
}

function BorrowDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [memberQ, setMemberQ] = useState("");
  const [bookQ, setBookQ] = useState("");
  const [member, setMember] = useState<MemberRow | null>(null);
  const [book, setBook] = useState<BookRow | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const memberParams = new URLSearchParams({ status: "ACTIVE", page_size: "8" });
  if (memberQ.trim()) memberParams.set("q", memberQ.trim());
  const { data: members } = useSWR<Page<MemberRow>>(`/api/members?${memberParams.toString()}`, fetcher, {
    keepPreviousData: true,
  });

  const bookParams = new URLSearchParams({ available: "true", page_size: "8" });
  if (bookQ.trim()) bookParams.set("q", bookQ.trim());
  const { data: books } = useSWR<Page<BookRow>>(`/api/books?${bookParams.toString()}`, fetcher, {
    keepPreviousData: true,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!member || !book) {
      setError("Pilih anggota dan buku terlebih dahulu.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await apiRequest("POST", "/api/loans", { book_id: book.id, member_id: member.id });
      await revalidateApi();
      onDone();
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal title="Catat peminjaman" eyebrow="Sirkulasi" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Notice>{error}</Notice>}

        <div>
          <p className="text-xs font-bold">1. Pilih anggota</p>
          {member ? (
            <div className="mt-2 flex items-center justify-between gap-3 border ink-rule bg-secondary p-3 text-sm">
              <span>
                <strong className="text-primary">{member.name}</strong> · {member.member_code}
              </span>
              <button type="button" onClick={() => setMember(null)} className="text-xs font-semibold text-primary underline">
                Ganti
              </button>
            </div>
          ) : (
            <>
              <input
                value={memberQ}
                onChange={(event) => setMemberQ(event.target.value)}
                placeholder="Cari nama atau ID anggota"
                className="form-input mt-2"
              />
              <ul className="mt-2 max-h-44 divide-y ink-rule overflow-y-auto border ink-rule">
                {(members?.data ?? []).map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => setMember(item)} className="flex w-full justify-between p-3 text-left text-sm hover:bg-secondary">
                      <span>{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.member_code}</span>
                    </button>
                  </li>
                ))}
                {members && !members.data.length && <li className="p-3 text-sm text-muted-foreground">Anggota aktif tidak ditemukan.</li>}
              </ul>
            </>
          )}
        </div>

        <div>
          <p className="text-xs font-bold">2. Pilih buku</p>
          {book ? (
            <div className="mt-2 flex items-center justify-between gap-3 border ink-rule bg-secondary p-3 text-sm">
              <span>
                <strong className="text-primary">{book.title}</strong> · {book.available_stock} tersedia
              </span>
              <button type="button" onClick={() => setBook(null)} className="text-xs font-semibold text-primary underline">
                Ganti
              </button>
            </div>
          ) : (
            <>
              <input
                value={bookQ}
                onChange={(event) => setBookQ(event.target.value)}
                placeholder="Cari judul atau penulis"
                className="form-input mt-2"
              />
              <ul className="mt-2 max-h-44 divide-y ink-rule overflow-y-auto border ink-rule">
                {(books?.data ?? []).map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => setBook(item)} className="flex w-full justify-between p-3 text-left text-sm hover:bg-secondary">
                      <span>{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.available_stock} tersedia</span>
                    </button>
                  </li>
                ))}
                {books && !books.data.length && <li className="p-3 text-sm text-muted-foreground">Tidak ada buku yang tersedia.</li>}
              </ul>
            </>
          )}
        </div>

        <button type="submit" disabled={pending} className="button-primary w-full disabled:opacity-60">
          {pending ? "Menyimpan..." : "Catat peminjaman"}
        </button>
      </form>
    </Modal>
  );
}
