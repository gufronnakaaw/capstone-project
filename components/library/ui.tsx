import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { Activity, Book, Photo, Proker } from "@/lib/mock-data/types";

export function StatusBadge({ status }: { status: string }) {
  const text: Record<string, string> = {
    borrowed: "Dipinjam",
    "due-soon": "Segera jatuh tempo",
    overdue: "Terlambat",
    returned: "Dikembalikan",
    active: "Aktif",
    inactive: "Tidak aktif",
    planned: "Direncanakan",
    ongoing: "Berjalan",
    completed: "Selesai",
  };
  return (
    <span className={`status status-${status}`}>{text[status] ?? status}</span>
  );
}

export function BookCover({
  book,
  eager = false,
}: {
  book: Book;
  eager?: boolean;
}) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
      <Image
        src={book.coverUrl}
        alt={`Sampul ${book.title}`}
        fill
        loading={eager ? "eager" : "lazy"}
        sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 220px"
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <span className="absolute bottom-2 left-2 bg-background/95 px-2 py-1 text-[10px] font-extrabold text-primary">
        {book.category}
      </span>
    </div>
  );
}

export function ActivityCard({
  activity,
  photo,
}: {
  activity: Activity;
  photo?: Photo;
}) {
  return (
    <article className="group grid gap-4 border-t ink-rule pt-4 sm:grid-cols-[180px_minmax(0,1fr)]">
      <Link
        href={`/kegiatan/${activity.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-secondary"
      >
        {photo && (
          <Image
            src={photo.url}
            alt={photo.caption}
            fill
            sizes="(max-width: 640px) 100vw, 180px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <CalendarDays size={14} />
          {formatDate(activity.date)}
        </div>
        <h3 className="font-heading text-2xl font-semibold leading-tight">
          <Link
            href={`/kegiatan/${activity.slug}`}
            className="hover:text-primary"
          >
            {activity.title}
          </Link>
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          {activity.description}
        </p>
        <Link
          href={`/kegiatan/${activity.slug}`}
          className="link-arrow mt-3 text-sm"
        >
          Lihat cerita <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export function ProkerCard({ proker }: { proker: Proker }) {
  return (
    <article className="flex h-full flex-col rounded-xl border ink-rule bg-card p-6 transition-colors hover:border-primary/35">
      <div className="flex items-start justify-between gap-3">
        <span className="eyebrow">{proker.period}</span>
        <StatusBadge status={proker.status} />
      </div>
      <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-tight text-primary">
        {proker.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {proker.description}
      </p>
      <div className="mt-auto pt-9">
        <div className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
          <span>Kemajuan</span>
          <span className="text-primary tabular-nums">{proker.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${proker.progress}%` }}
          />
        </div>
      </div>
    </article>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed ink-rule bg-card p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
export const Location = () => (
  <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
    <MapPin size={13} />
    Desa Pusakanagara
  </span>
);
