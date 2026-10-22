import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/library/site-header";
import { Footer } from "@/components/library/footer";
import { formatDate } from "@/components/library/ui";
import { getPublicActivities, getPublicPhotos } from "@/lib/services/public-library";

export const revalidate = 60;

export default async function ActivitiesPage() {
  const [activities, photos] = await Promise.all([getPublicActivities(), getPublicPhotos()]);
  const featured = activities[0];
  const imageFor = (id: string) => photos.find((photo) => photo.id === id);

  return (
    <>
      <SiteHeader />
      <main id="konten-utama" className="min-h-screen">
        <section className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-20 lg:px-12">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="eyebrow">Kalender warga</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-.06em] text-primary text-balance sm:text-6xl">
                Ada banyak cara untuk berkumpul.
              </h1>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted-foreground lg:justify-self-end">
              Kegiatan kecil, cerita yang panjang. Temukan acara yang ingin kamu
              ikuti atau baca kembali hari-hari yang pernah kita lewati.
            </p>
          </div>
        </section>

        {featured && (
          <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <article className="grid overflow-hidden rounded-xl bg-secondary lg:grid-cols-[1.25fr_.75fr]">
              <Link
                href={`/kegiatan/${featured.slug}`}
                className="relative block aspect-[16/10] overflow-hidden bg-border lg:aspect-auto lg:min-h-[430px]"
              >
                {imageFor(featured.coverPhotoId) && (
                  <Image
                    src={imageFor(featured.coverPhotoId)!.url}
                    alt={imageFor(featured.coverPhotoId)!.caption}
                    fill
                    loading="eager"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />
                )}
              </Link>
              <div className="flex flex-col justify-between p-6 sm:p-10">
                <div>
                  <p className="eyebrow">
                    Kegiatan mendatang · {formatDate(featured.date)}
                  </p>
                  <h2 className="mt-7 text-3xl font-semibold leading-[1.12] tracking-[-.045em] text-primary sm:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                    {featured.description}
                  </p>
                </div>
                <Link
                  href={`/kegiatan/${featured.slug}`}
                  className="link-arrow mt-10 text-sm"
                >
                  Lihat kegiatan <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          </section>
        )}

        <section className="mx-auto grid max-w-7xl gap-9 px-5 py-20 sm:px-8 lg:grid-cols-[.55fr_1.45fr] lg:gap-16 lg:px-12 lg:py-28">
          <div>
            <p className="eyebrow">Selanjutnya & sebelumnya</p>
            <h2 className="mt-4 max-w-xs text-3xl font-semibold leading-tight tracking-tight text-primary">
              Setiap pertemuan punya cerita.
            </h2>
          </div>
          <div className="border-t ink-rule">
            {activities.slice(1).map((activity) => {
              const photo = imageFor(activity.coverPhotoId);
              return (
                <article
                  key={activity.id}
                  className="group grid gap-4 border-b ink-rule py-6 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                >
                  <Link
                    href={`/kegiatan/${activity.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden rounded-lg bg-secondary"
                  >
                    {photo && (
                      <Image
                        src={photo.url}
                        alt={photo.caption}
                        fill
                        sizes="160px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </Link>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {formatDate(activity.date)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-primary sm:text-2xl">
                      <Link href={`/kegiatan/${activity.slug}`}>
                        {activity.title}
                      </Link>
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <Link
                    href={`/kegiatan/${activity.slug}`}
                    className="hidden rounded-full border ink-rule p-2 text-primary transition-colors hover:bg-secondary sm:block"
                    aria-label={`Buka ${activity.title}`}
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
