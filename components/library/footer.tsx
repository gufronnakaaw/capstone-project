import Link from "next/link";
import { BookOpen, MapPin } from "lucide-react";

const links = [
  { label: "Koleksi buku", href: "/buku" },
  { label: "Kegiatan", href: "/kegiatan" },
  { label: "Program kerja", href: "/proker" },
  { label: "Galeri", href: "/galeri" },
  { label: "Ruang anggota", href: "/dashboard" },
];

export function Footer() {
  return (
    <footer className="border-t ink-rule bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 sm:py-10 md:grid-cols-[minmax(0,1fr)_minmax(15rem,.7fr)] md:gap-12 lg:px-12">
        <div className="max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary"
          >
            <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <BookOpen size={16} strokeWidth={1.8} />
            </span>
            <span className="text-lg font-bold tracking-[-.04em]">
              ruang baca desa.
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Ruang kecil untuk buku, cerita, dan warga yang ingin tumbuh bersama.
          </p>
          <nav
            aria-label="Tautan footer"
            className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-primary"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-muted-foreground hover:underline hover:underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <address className="not-italic border-t ink-rule pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0 lg:pl-12">
          <p className="eyebrow">Temui kami</p>
          <div className="mt-3 flex items-center gap-2.5 text-primary">
            <MapPin
              className="shrink-0 text-accent"
              size={18}
              strokeWidth={1.8}
            />
            <p className="text-xl font-semibold tracking-[-.04em]">
              Balai Desa Sukamaju
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Pintu kami terbuka untukmu.
          </p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Senin–Jumat · 08.00–15.00
            <br />
            Sabtu · 08.00–12.00
          </p>
        </address>
      </div>
    </footer>
  );
}
