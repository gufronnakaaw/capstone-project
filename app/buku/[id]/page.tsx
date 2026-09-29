import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/library/site-header";
import { Footer } from "@/components/library/footer";
import { libraryService } from "@/lib/services/library-service";

export default async function BookDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = libraryService.getBook(id);
  if (!book)
    return (
      <>
        <SiteHeader />
        <main
          id="konten-utama"
          className="mx-auto min-h-[60vh] max-w-4xl px-5 py-20"
        >
          <h1 className="text-4xl font-semibold text-primary">
            Buku tidak ditemukan.
          </h1>
          <Link href="/buku" className="link-arrow mt-6">
            Kembali ke koleksi
          </Link>
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <SiteHeader />
      <main
        id="konten-utama"
        className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16"
      >
        <Link href="/buku" className="link-arrow text-sm">
          <ArrowLeft size={16} />
          Kembali ke koleksi
        </Link>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(16rem,.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <div className="relative aspect-[3/4] max-w-md overflow-hidden rounded-lg bg-secondary">
            <Image
              src={book.coverUrl}
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              alt={`Sampul ${book.title}`}
              className="object-cover"
            />
          </div>
          <article className="lg:py-5">
            <p className="eyebrow">
              {book.category} · {book.publishedYear}
            </p>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.04] tracking-[-.06em] text-primary text-balance sm:text-6xl">
              {book.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{book.author}</p>
            <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground">
              {book.synopsis}
            </p>
            <dl className="mt-9 grid gap-5 border-y ink-rule py-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  ISBN
                </dt>
                <dd className="mt-2 font-semibold text-primary tabular-nums">
                  {book.isbn}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Ketersediaan
                </dt>
                <dd className="mt-2 font-semibold text-primary">
                  {book.availableStock} dari {book.stock} eksemplar
                </dd>
              </div>
            </dl>
            <Link href="/dashboard/pinjaman" className="button-primary mt-8">
              Pinjam sebagai anggota <ArrowUpRight size={17} />
            </Link>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
