import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { SiteHeader } from "@/components/library/site-header";
import { Footer } from "@/components/library/footer";
import { formatDate } from "@/components/library/ui";
import { getPublicActivity, getPublicPhotos } from "@/lib/services/public-library";

export default async function ActivityDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [activity, allPhotos] = await Promise.all([getPublicActivity(slug), getPublicPhotos()]);
  if (!activity)
    return (
      <>
        <SiteHeader />
        <main
          id="konten-utama"
          className="mx-auto min-h-[60vh] max-w-4xl px-5 py-20"
        >
          <h1 className="text-4xl font-semibold text-primary">
            Kegiatan tidak ditemukan.
          </h1>
          <Link className="link-arrow mt-6" href="/kegiatan">
            Kembali ke kegiatan
          </Link>
        </main>
        <Footer />
      </>
    );
  const gallery = allPhotos.filter((photo) =>
    activity.photoIds.includes(photo.id),
  );

  return (
    <>
      <SiteHeader />
      <main
        id="konten-utama"
        className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16"
      >
        <Link href="/kegiatan" className="link-arrow text-sm">
          <ArrowLeft size={16} />
          Semua kegiatan
        </Link>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="eyebrow">Catatan kegiatan</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-.06em] text-primary text-balance sm:text-6xl">
              {activity.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground lg:justify-self-end">
            <CalendarDays size={17} />
            {formatDate(activity.date)}
          </div>
        </div>
        <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-xl bg-secondary sm:aspect-[16/8]">
          {gallery[0] && (
            <Image
              src={gallery[0].url}
              alt={gallery[0].caption}
              fill
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
          )}
        </div>
        <article className="mx-auto mt-12 max-w-2xl border-l-2 border-accent pl-6 text-base leading-8 text-foreground sm:text-lg sm:leading-9">
          <p>{activity.fullDescription}</p>
        </article>
        {gallery.length > 1 && (
          <section className="mt-20 border-t ink-rule pt-8">
            <p className="eyebrow">Dokumentasi</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {gallery.slice(1).map((photo) => (
                <figure key={photo.id}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={photo.url}
                      alt={photo.caption}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-xs text-muted-foreground">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
