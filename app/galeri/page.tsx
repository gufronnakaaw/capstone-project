import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/library/site-header";
import { Footer } from "@/components/library/footer";
import { libraryService } from "@/lib/services/library-service";

export default function GalleryPage() {
  const photos = libraryService.getPhotos();
  const activities = libraryService.getActivities();
  return (
    <>
      <SiteHeader />
      <main
        id="konten-utama"
        className="mx-auto min-h-screen max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="grid gap-5 border-b ink-rule pb-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="eyebrow">Dokumentasi perpustakaan</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-.06em] text-primary text-balance sm:text-6xl">
              Hari-hari yang ingin diingat.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground lg:justify-self-end">
            Dari rak yang dibuka pagi-pagi hingga pertemuan kecil yang menjadi
            kenangan bersama.
          </p>
        </div>
        <section
          aria-label="Foto kegiatan"
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {photos.map((photo, index) => {
            const activity = activities.find(
              (item) => item.id === photo.relatedActivityId,
            );
            return (
              <figure
                key={photo.id}
                className={`group overflow-hidden rounded-lg bg-card ${index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}`}
              >
                <div
                  className={`relative overflow-hidden bg-secondary ${index === 0 ? "aspect-[4/3] sm:aspect-[16/10] lg:h-[calc(100%-5rem)] lg:aspect-auto" : "aspect-[4/3]"}`}
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption}
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes={
                      index === 0
                        ? "(max-width: 1024px) 100vw, 65vw"
                        : "(max-width: 640px) 100vw, 33vw"
                    }
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="flex min-h-20 items-center justify-between gap-4 border border-t-0 ink-rule px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
                  <span>{photo.caption}</span>
                  {activity && (
                    <Link
                      className="shrink-0 rounded-full p-2 text-primary hover:bg-secondary"
                      href={`/kegiatan/${activity.slug}`}
                      aria-label={`Lihat kegiatan ${activity.title}`}
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}
