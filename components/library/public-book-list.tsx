"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/lib/client/api";
import type { CatalogBook, Paginated } from "@/lib/types/api";

const PAGE_SIZE = 100;
const INITIAL_KEY = `/api/books?page_size=${PAGE_SIZE}`;
const ALL_CATEGORIES = "all";

export function PublicBookList({ initialBooks }: { initialBooks: CatalogBook[] }) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const params = new URLSearchParams({ page_size: String(PAGE_SIZE) });
  if (query.trim()) params.set("q", query.trim());
  if (categoryId) params.set("category_id", categoryId);
  const key = `/api/books?${params.toString()}`;

  const initialPayload: Paginated<CatalogBook> = {
    data: initialBooks,
    meta: { page: 1, page_size: PAGE_SIZE, total: initialBooks.length, total_pages: 1 },
  };

  const { data, error, isLoading } = useSWR<Paginated<CatalogBook>>(key, fetcher, {
    fallbackData: key === INITIAL_KEY ? initialPayload : undefined,
    keepPreviousData: true,
  });

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const book of initialBooks) {
      if (book.category) seen.set(book.category.id, book.category.name);
    }
    return Array.from(seen, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [initialBooks]);

  const results = data?.data ?? [];
  const total = data?.meta.total ?? results.length;

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
            value={categoryId || ALL_CATEGORIES}
            onValueChange={(value) => {
              if (value) setCategoryId(value === ALL_CATEGORIES ? "" : value);
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
                <SelectItem value={ALL_CATEGORIES}>Semua koleksi</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between py-5 text-xs font-medium text-muted-foreground">
        <p aria-live="polite">
          Menampilkan <strong className="text-primary">{total}</strong> judul
        </p>
        <p className="hidden sm:block">Pilih buku untuk melihat detail</p>
      </div>

      {error && (
        <p role="alert" className="mb-4 border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          Katalog belum bisa dimuat. Coba muat ulang halaman.
        </p>
      )}

      {isLoading && !data && <p className="py-10 text-sm text-muted-foreground">Memuat katalog...</p>}

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
                src={book.cover_url}
                alt={`Sampul ${book.title}`}
                fill
                sizes="72px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
                {book.category?.name ?? "Belum dikategorikan"}
              </p>
              <h2 className="mt-1 text-base font-semibold leading-tight tracking-tight text-primary sm:text-xl">
                <Link href={`/buku/${book.id}`}>{book.title}</Link>
              </h2>
              <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">{book.author}</p>
            </div>
            <p className="hidden self-center text-xs leading-5 text-muted-foreground sm:block">
              ISBN
              <br />
              <span className="font-semibold text-primary tabular-nums">{book.isbn ?? "—"}</span>
            </p>
            <div className="flex h-full flex-col items-end justify-between gap-2 py-1 text-right">
              <span
                className={`text-[10px] font-semibold sm:text-xs ${book.available_stock ? "text-primary" : "text-destructive"}`}
              >
                {book.available_stock ? `${book.available_stock} tersedia` : "Habis"}
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

      {!isLoading && !results.length && (
        <div className="rounded-lg bg-secondary p-10 text-center">
          <p className="font-semibold text-primary">Belum ada buku yang cocok.</p>
          <p className="mt-2 text-sm text-muted-foreground">Coba kata kunci atau kategori lain.</p>
        </div>
      )}
    </section>
  );
}
