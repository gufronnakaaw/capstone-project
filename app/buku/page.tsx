import { SiteHeader } from "@/components/library/site-header";
import { PublicBookList } from "@/components/library/public-book-list";
import { Footer } from "@/components/library/footer";
import { getCatalogBooks } from "@/lib/services/public-library";

export const revalidate = 60;

export default async function BooksPage() {
  const books = await getCatalogBooks();

  return (
    <>
      <SiteHeader />
      <main
        id="konten-utama"
        className="mx-auto min-h-screen max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="grid gap-6 border-b ink-rule pb-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="eyebrow">Katalog terbuka</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-.06em] text-primary text-balance sm:text-6xl">
              Bacaan baru menunggu ditemukan.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground lg:justify-self-end">
            Cari berdasarkan judul atau penulis, lalu lihat ketersediaannya sebelum datang ke
            perpustakaan.
          </p>
        </div>
        <div className="mt-4">
          <PublicBookList initialBooks={books} />
        </div>
      </main>
      <Footer />
    </>
  );
}
