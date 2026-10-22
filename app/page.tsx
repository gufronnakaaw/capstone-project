import { Footer } from '@/components/library/footer';
import { SiteHeader } from '@/components/library/site-header';
import { ProkerCard, formatDate } from '@/components/library/ui';
import { HomeHeroCarousel } from '@/components/library/home-hero-carousel';
import { getHomeData } from '@/lib/services/public-library';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60;

export default async function Home() {
  const { photos, heroPhotos, activities, programs } = await getHomeData();

  return (
    <div className="min-h-screen overflow-x-clip">
      <SiteHeader />
      <main id="konten-utama">
        <section className="border-b ink-rule">
          <div className="mx-auto grid max-w-7xl lg:min-h-[min(730px,calc(100dvh-4.5rem))] lg:grid-cols-[1.03fr_.97fr]">
            <div className="px-5 pb-10 pt-14 sm:px-8 sm:pt-20 lg:flex lg:flex-col lg:justify-center lg:pl-12 lg:pr-16 lg:pb-16 lg:pt-20 xl:pr-20">
              <div className="max-w-[31rem]">
                <h1 className="max-w-[30rem] text-[clamp(2.85rem,4.65vw,5.25rem)] font-semibold leading-[1.08] tracking-[-.06em] text-primary text-balance">
                  Cerita punya{' '}
                  <span className="font-editorial font-normal italic tracking-[-.055em]">
                    rumah
                  </span>{' '}
                  di sini.
                </h1>
                <p className="mt-6 max-w-[27rem] text-[.95rem] leading-7 text-muted-foreground sm:text-base sm:leading-7">
                  Singgah untuk mencari buku. Tinggal untuk belajar, bertemu,
                  dan berbagi cerita bersama warga.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/buku" className="button-primary">
                    Jelajahi koleksi <ArrowUpRight size={17} />
                  </Link>
                  <Link href="/dashboard" className="button-secondary">
                    Ruang anggota <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
            <HomeHeroCarousel photos={heroPhotos} />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32 lg:px-12 lg:pb-32 lg:pt-36">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <p className="eyebrow">Kalender warga</p>
              <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[1.07] tracking-[-.055em] text-primary text-balance sm:text-5xl">
                Selalu ada alasan untuk datang.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                Dari membaca bersama hingga berbagi cerita, setiap pertemuan
                memberi ruang untuk kenal lebih dekat.
              </p>
              <Link href="/kegiatan" className="link-arrow mt-7 text-sm">
                Semua kegiatan <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="min-w-0">
              {activities[0] &&
                (() => {
                  const activity = activities[0];
                  const photo = photos.find(
                    (item) => item.id === activity.coverPhotoId,
                  );
                  return (
                    <article className="group border-b ink-rule pb-8">
                      <Link
                        href={`/kegiatan/${activity.slug}`}
                        className="relative block aspect-[16/9] overflow-hidden rounded-xl bg-secondary"
                      >
                        {photo && (
                          <Image
                            src={photo.url}
                            alt={photo.caption}
                            fill
                            sizes="(max-width: 1024px) 100vw, 65vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                          />
                        )}
                        <span className="absolute left-4 top-4 rounded-md bg-card px-3 py-2 text-[11px] font-bold text-primary sm:left-6 sm:top-6">
                          Kegiatan mendatang
                        </span>
                      </Link>
                      <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">
                            {formatDate(activity.date)}
                          </p>
                          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
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
                          aria-label={`Lihat ${activity.title}`}
                          className="grid size-10 shrink-0 place-items-center rounded-full border ink-rule text-primary transition-colors hover:bg-secondary"
                        >
                          <ArrowUpRight size={19} />
                        </Link>
                      </div>
                    </article>
                  );
                })()}
              <div className="-mr-5 mt-6 flex snap-x gap-4 overflow-x-auto pb-3 pr-5 sm:-mr-8 sm:pr-8 lg:-mr-12 lg:pr-12">
                {activities.slice(1).map((activity) => {
                  const photo = photos.find(
                    (item) => item.id === activity.coverPhotoId,
                  );
                  return (
                    <article
                      key={activity.id}
                      className="group w-[min(70vw,16rem)] shrink-0 snap-start"
                    >
                      <Link
                        href={`/kegiatan/${activity.slug}`}
                        className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-secondary"
                      >
                        {photo && (
                          <Image
                            src={photo.url}
                            alt={photo.caption}
                            fill
                            sizes="(max-width: 640px) 70vw, 256px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                      </Link>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {formatDate(activity.date)}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold leading-snug tracking-tight text-primary">
                        <Link href={`/kegiatan/${activity.slug}`}>
                          {activity.title}
                        </Link>
                      </h3>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary/70">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Yang kami rawat</p>
                <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.07] tracking-[-.055em] text-primary text-balance sm:text-5xl">
                  Lebih dari sekadar rak buku.
                </h2>
              </div>
              <Link href="/proker" className="link-arrow shrink-0 text-sm">
                Lihat semua program <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {programs.slice(0, 4).map((program, index) => (
                <div
                  key={program.id}
                  className={index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
                >
                  <ProkerCard proker={program} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div>
            <p className="eyebrow">Punya kartu baca?</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.07] tracking-[-.055em] text-primary text-balance sm:text-5xl">
              Buku yang baik selalu menemukan pembacanya.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">
              Masuk ke ruang anggota untuk memantau pinjaman dan menemukan
              bacaan selanjutnya.
            </p>
            <Link href="/dashboard" className="button-primary mt-7">
              Masuk ruang anggota <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
