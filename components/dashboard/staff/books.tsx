"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import useSWR from "swr";
import { apiRequest, fetcher, revalidateApi } from "@/lib/client/api";
import { Field, Modal, Notice, Pager, messageOf } from "../ui";
import type { BookRow, CategoryRow, Page } from "../types";

type Draft = {
  title: string;
  author: string;
  category_id: string;
  isbn: string;
  cover_url: string;
  stock: string;
  published_year: string;
  synopsis: string;
};

const emptyDraft = (): Draft => ({
  title: "",
  author: "",
  category_id: "",
  isbn: "",
  cover_url: "",
  stock: "1",
  published_year: String(new Date().getFullYear()),
  synopsis: "",
});

const toDraft = (book: BookRow): Draft => ({
  title: book.title,
  author: book.author,
  category_id: book.category?.id ?? "",
  isbn: book.isbn ?? "",
  cover_url: "",
  stock: String(book.stock),
  published_year: String(book.published_year),
  synopsis: book.synopsis,
});

export function Books() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BookRow | null>(null);
  const [notice, setNotice] = useState<{ tone: "error" | "info"; text: string } | null>(null);

  const params = new URLSearchParams({ page: String(page), page_size: "10" });
  if (q.trim()) params.set("q", q.trim());
  const { data, error } = useSWR<Page<BookRow>>(`/api/books?${params.toString()}`, fetcher, {
    keepPreviousData: true,
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(book: BookRow) {
    setEditing(book);
    setFormOpen(true);
  }

  async function remove(book: BookRow) {
    if (!window.confirm(`Hapus "${book.title}" dari katalog?`)) return;
    try {
      await apiRequest("DELETE", `/api/books/${book.id}`);
      await revalidateApi();
      setNotice({ tone: "info", text: `"${book.title}" dihapus dari katalog.` });
    } catch (err) {
      setNotice({ tone: "error", text: messageOf(err) });
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Katalog perpustakaan</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Koleksi buku</h1>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-sm font-extrabold text-primary-foreground"
        >
          Tambah buku
        </button>
      </div>

      <div className="mt-7">
        <input
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setPage(1);
          }}
          placeholder="Cari judul atau penulis..."
          className="form-input sm:max-w-sm"
          aria-label="Cari buku"
        />
      </div>

      {notice && (
        <div className="mt-5">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}
      {error && (
        <div className="mt-5">
          <Notice>Koleksi belum bisa dimuat.</Notice>
        </div>
      )}

      <div className="mt-5 overflow-x-auto border ink-rule bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b ink-rule bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Buku</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">ISBN</th>
              <th className="p-4">Tersedia</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {(data?.data ?? []).map((book) => (
              <tr key={book.id} className="border-b ink-rule last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="relative block h-14 w-10 shrink-0 overflow-hidden bg-secondary">
                      <Image src={book.cover_url} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span>
                      <strong className="block text-primary">{book.title}</strong>
                      <span className="text-xs text-muted-foreground">{book.author}</span>
                    </span>
                  </div>
                </td>
                <td className="p-4">{book.category?.name ?? "Belum dikategorikan"}</td>
                <td className="p-4 tabular-nums">{book.isbn ?? "—"}</td>
                <td className="p-4 tabular-nums">
                  {book.available_stock} / {book.stock}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => openEdit(book)} className="min-h-9 border ink-rule px-3 text-xs font-semibold text-primary hover:bg-secondary">
                      Ubah
                    </button>
                    <button type="button" onClick={() => remove(book)} className="min-h-9 border border-destructive/40 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && !data.data.length && <p className="p-6 text-sm text-muted-foreground">Belum ada buku yang cocok.</p>}
      </div>

      {data && <Pager page={page} totalPages={data.meta.total_pages} onChange={setPage} />}

      {formOpen && (
        <BookForm
          book={editing}
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

function BookForm({
  book,
  onClose,
  onSaved,
}: {
  book: BookRow | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [draft, setDraft] = useState<Draft>(book ? toDraft(book) : emptyDraft());
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { data: categories } = useSWR<{ data: CategoryRow[] }>("/api/categories", fetcher);

  const set = (key: keyof Draft) => (value: string) => setDraft((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const payload = {
      title: draft.title.trim(),
      author: draft.author.trim(),
      category_id: draft.category_id || null,
      isbn: draft.isbn.trim() || null,
      stock: Number(draft.stock),
      published_year: Number(draft.published_year),
      synopsis: draft.synopsis.trim(),
      ...(draft.cover_url.trim() ? { cover_url: draft.cover_url.trim() } : {}),
    };

    try {
      if (book) {
        await apiRequest("PATCH", `/api/books/${book.id}`, payload);
        await revalidateApi();
        onSaved(`"${payload.title}" berhasil diperbarui.`);
      } else {
        await apiRequest("POST", "/api/books", payload);
        await revalidateApi();
        onSaved(`"${payload.title}" berhasil ditambahkan.`);
      }
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal title={book ? "Ubah buku" : "Tambah buku"} eyebrow="Koleksi" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Notice>{error}</Notice>}
        <Field label="Judul buku">
          <input required value={draft.title} onChange={(e) => set("title")(e.target.value)} className="form-input" />
        </Field>
        <Field label="Penulis">
          <input required value={draft.author} onChange={(e) => set("author")(e.target.value)} className="form-input" />
        </Field>
        <Field label="Kategori">
          <select value={draft.category_id} onChange={(e) => set("category_id")(e.target.value)} className="form-input">
            <option value="">Belum dikategorikan</option>
            {(categories?.data ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Jumlah stok">
            <input required type="number" min={0} value={draft.stock} onChange={(e) => set("stock")(e.target.value)} className="form-input" />
          </Field>
          <Field label="Tahun terbit">
            <input required type="number" min={1000} max={2100} value={draft.published_year} onChange={(e) => set("published_year")(e.target.value)} className="form-input" />
          </Field>
          <Field label="ISBN">
            <input value={draft.isbn} onChange={(e) => set("isbn")(e.target.value)} className="form-input" />
          </Field>
        </div>
        <Field label={book ? "URL sampul (kosongkan jika tidak diubah)" : "URL sampul (opsional)"}>
          <input type="url" value={draft.cover_url} onChange={(e) => set("cover_url")(e.target.value)} className="form-input" />
        </Field>
        <Field label="Sinopsis">
          <textarea required rows={4} value={draft.synopsis} onChange={(e) => set("synopsis")(e.target.value)} className="form-input" />
        </Field>
        <button type="submit" disabled={pending} className="button-primary w-full disabled:opacity-60">
          {pending ? "Menyimpan..." : "Simpan buku"}
        </button>
      </form>
    </Modal>
  );
}
