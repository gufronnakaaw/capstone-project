"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
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

export function PublicBookList({ books }: { books: Book[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua koleksi");
  const categories = [
    "Semua koleksi",
    ...Array.from(new Set(books.map((book) => book.category))),
  ];
  const results = useMemo(
    () =>
      books.filter(
        (book) =>
          (category === "Semua koleksi" || book.category === category) &&
          `${book.title} ${book.author}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [books, category, query],
  );

  return (
    <section aria-label="Daftar buku">
      <div className="flex flex-col gap-3 border-b ink-rule py-5 sm:flex-row sm:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border ink-rule bg-card px-4 focus-within:border-primary">
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <span className="sr-only">Cari judul atau penulis</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Cari judul atau penulis..."
          />
        </label>
        <div className="rounded-lg border ink-rule bg-card px-4 sm:min-w-48">
          <Select
            value={category}
            onValueChange={(value) => {
              if (value) setCategory(value);
            }}
          >
            <SelectTrigger
              aria-label="Filter kategori"
              className="w-full border-0 bg-transparent px-0 text-sm font-semibold text-primary shadow-none focus-visible:ring-0 data-[size=default]:h-12"
            >
              <SelectValue placeholder="Pilih kategori" />
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
      </div>
      <div className="flex items-center justify-between py-5 text-xs font-medium text-muted-foreground">
        <p aria-live="polite">
          Menampilkan <strong className="text-primary">{results.length}</strong>{" "}
          judul
        </p>
        <p className="hidden sm:block">Pilih buku untuk melihat detail</p>
      </div>
      <div className="border-t ink-rule">
        {results.map((book, index) => (
          <article
            key={book.id}
            className="group grid grid-cols-[3.75rem_minmax(0,1fr)_auto] items-center gap-3 border-b ink-rule py-4 transition-colors hover:bg-secondary/40 sm:grid-cols-[2rem_4.5rem_minmax(0,1fr)_8rem_6rem] sm:gap-5 sm:py-5"
          >
            <span className="hidden self-start pt-2 text-xs font-semibold text-muted-foreground tabular-nums sm:block">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Link
              href={`/buku/${book.id}`}
              className="relative block aspect-[3/4] overflow-hidden rounded bg-secondary"
            >
              <Image
                src={book.coverUrl}
                alt={`Sampul ${book.title}`}
                fill
                sizes="72px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
                {book.category}
              </p>
              <h2 className="mt-1 text-base font-semibold leading-tight tracking-tight text-primary sm:text-xl">
                <Link href={`/buku/${book.id}`}>{book.title}</Link>
              </h2>
              <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                {book.author}
              </p>
            </div>
            <p className="hidden self-center text-xs leading-5 text-muted-foreground sm:block">
              ISBN
              <br />
              <span className="font-semibold text-primary tabular-nums">
                {book.isbn}
              </span>
            </p>
            <div className="flex h-full flex-col items-end justify-between gap-2 py-1 text-right">
              <span
                className={`text-[10px] font-semibold sm:text-xs ${book.availableStock ? "text-primary" : "text-destructive"}`}
              >
                {book.availableStock
                  ? `${book.availableStock} tersedia`
                  : "Habis"}
              </span>
              <Link
                href={`/buku/${book.id}`}
                aria-label={`Lihat ${book.title}`}
                className="grid size-7 place-items-center rounded-full text-primary transition-colors hover:bg-secondary"
              >
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!results.length && (
        <div className="rounded-lg bg-secondary p-10 text-center">
          <p className="font-semibold text-primary">
            Belum ada buku yang cocok.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Coba kata kunci atau kategori lain.
          </p>
        </div>
      )}
    </section>
  );
}
