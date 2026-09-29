import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/library/site-header";
import { Footer } from "@/components/library/footer";
import { StatusBadge } from "@/components/library/ui";
import { libraryService } from "@/lib/services/library-service";

export default function ProkerPage() {
  const programs = libraryService.getProkers();
  return (
    <>
      <SiteHeader />
      <main id="konten-utama" className="min-h-screen">
        <section className="border-b ink-rule bg-secondary/70">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:px-12">
            <div>
              <p className="eyebrow">Program kerja 2026</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-.06em] text-primary text-balance sm:text-6xl">
                Membuat buku lebih dekat dengan warga.
              </h1>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted-foreground lg:justify-self-end">
              Setiap program punya tujuan dan kemajuan yang bisa dilihat
              bersama. Begini cara kami menjaga ruang baca tetap hidup.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid border-t ink-rule">
            {programs.map((program, index) => (
              <article
                key={program.id}
                className="grid gap-4 border-b ink-rule py-8 sm:py-10 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(15rem,.7fr)] lg:gap-10"
              >
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="eyebrow">{program.period}</p>
                  <h2 className="mt-3 max-w-lg text-2xl font-semibold leading-tight tracking-tight text-primary sm:text-3xl">
                    {program.title}
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                    {program.description}
                  </p>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex items-center justify-between gap-4">
                    <StatusBadge status={program.status} />
                    <span className="text-2xl font-semibold tracking-tight text-primary tabular-nums">
                      {program.progress}%
                    </span>
                  </div>
                  <div
                    className="mt-5 h-1.5 rounded-full bg-secondary"
                    role="progressbar"
                    aria-label={`Kemajuan ${program.title}`}
                    aria-valuenow={program.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${program.progress}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-secondary p-6 sm:p-8">
            <p className="max-w-md text-lg font-semibold leading-snug text-primary">
              Mau ikut meramaikan ruang baca desa?
            </p>
            <Link href="/dashboard" className="button-primary">
              Kunjungi ruang anggota <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
