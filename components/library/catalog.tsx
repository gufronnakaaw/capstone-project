"use client";

import Link from "next/link";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Book } from "@/lib/mock-data/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCover, EmptyState } from "./ui";

export function Catalog({
  books,
  management = false,
}: {
  books: Book[];
  management?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [available, setAvailable] = useState(false);
  const [selected, setSelected] = useState<Book | null>(null);
  const [borrowed, setBorrowed] = useState<string | null>(null);
  const categories = [
    "Semua",
    ...Array.from(new Set(books.map((book) => book.category))),
  ];
  const filtered = useMemo(
    () =>
      books.filter(
        (book) =>
          (category === "Semua" || book.category === category) &&
          (!available || book.availableStock > 0) &&
          `${book.title} ${book.author}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [books, category, available, query],
  );
  return (
    <>
      <div className="flex flex-col gap-3 border-y ink-rule py-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-w-0 flex-1 items-center gap-2 border ink-rule bg-card px-3">
          <Search size={17} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none"
            placeholder="Cari judul atau penulis..."
          />
        </label>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 border ink-rule bg-card px-3 text-xs font-bold">
            <SlidersHorizontal size={14} />
            <Select
              value={category}
              onValueChange={(value) => {
                if (value) setCategory(value);
              }}
            >
              <SelectTrigger
                aria-label="Filter kategori"
                className="border-0 bg-transparent px-0 text-xs font-bold shadow-none focus-visible:ring-0 data-[size=default]:h-10"
              >
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => setAvailable(!available)}
            className={`border px-3 text-xs font-bold ${available ? "border-primary bg-primary text-primary-foreground" : "ink-rule bg-card"}`}
          >
            Tersedia
          </button>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        <strong className="text-primary">{filtered.length}</strong> buku
        ditemukan
      </p>
      {filtered.length ? (
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((book) => (
            <article className="group min-w-0" key={book.id}>
              <button
                onClick={() => setSelected(book)}
                className="block w-full text-left"
              >
                <BookCover book={book} />
                <h3 className="mt-3 truncate font-heading text-lg font-semibold group-hover:text-primary">
                  {book.title}
                </h3>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {book.author}
                </p>
              </button>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span
                  className={`text-[11px] font-bold ${book.availableStock ? "text-primary" : "text-destructive"}`}
                >
                  {book.availableStock
                    ? `${book.availableStock} tersedia`
                    : "Sedang dipinjam"}
                </span>
                {management && (
                  <Link
                    className="text-xs font-extrabold text-primary underline underline-offset-4"
                    href={`/buku/${book.id}`}
                  >
                    Atur
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState>Tidak ada buku yang cocok dengan pencarianmu.</EmptyState>
        </div>
      )}
      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-primary/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Detail buku"
        >
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto bg-card p-5 shadow-2xl sm:p-7">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 grid size-8 place-items-center border ink-rule"
              aria-label="Tutup"
            >
              <X size={17} />
            </button>
            <div className="grid gap-6 sm:grid-cols-[150px_minmax(0,1fr)]">
              <BookCover book={selected} eager />
              <div>
                <p className="eyebrow">
                  {selected.category} · {selected.publishedYear}
                </p>
                <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight">
                  {selected.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  oleh {selected.author}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {selected.synopsis}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-y-2 border-t ink-rule pt-4 text-xs">
                  <dt className="font-bold">ISBN</dt>
                  <dd>{selected.isbn}</dd>
                  <dt className="font-bold">Ketersediaan</dt>
                  <dd>
                    {selected.availableStock}/{selected.stock} eksemplar
                  </dd>
                </dl>
                <button
                  disabled={
                    !selected.availableStock || borrowed === selected.id
                  }
                  onClick={() => setBorrowed(selected.id)}
                  className="mt-6 inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-sm font-extrabold text-primary-foreground disabled:opacity-50"
                >
                  {borrowed === selected.id ? (
                    <>
                      <Check size={16} /> Permintaan tercatat
                    </>
                  ) : selected.availableStock ? (
                    "Pinjam buku ini"
                  ) : (
                    "Belum tersedia"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
