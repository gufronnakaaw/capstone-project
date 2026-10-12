'use client';

import { activities, books, loans } from '@/lib/mock-data/library';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  House,
  Search,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { StatusBadge, formatDate } from './ui';

type MemberView =
  | 'overview'
  | 'loans'
  | 'profile'
  | 'books'
  | 'members'
  | 'programs';

const navigation = [
  { href: '/dashboard', label: 'Beranda', view: 'overview', icon: House },
  {
    href: '/dashboard/pinjaman',
    label: 'Pinjaman',
    view: 'loans',
    icon: BookOpenCheck,
  },
  { href: '/buku', label: 'Cari buku', view: 'books', icon: Search },
] as const;

export function MemberWorkspace({ view }: { view: MemberView }) {
  const active = loans.filter(
    (loan) => loan.memberId === 'member-01' && loan.status !== 'returned',
  );
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b ink-rule bg-card">
        <div className="mx-auto flex h-[4.5rem] items-center justify-between px-5 sm:px-8 lg:max-w-none lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-primary"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen size={17} />
            </span>
            Pusakanagara.
          </Link>
          <Link
            href="/dashboard/profil"
            aria-current={view === 'profile' ? 'page' : undefined}
            className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold ${view === 'profile' ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-primary'}`}
          >
            <UserRound size={16} />
            Siti Rahma
          </Link>
        </div>
      </header>
      <div className="lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)]">
        <aside className="hidden border-r ink-rule bg-card lg:block">
          <nav
            aria-label="Navigasi anggota"
            className="sticky top-0 flex min-h-[calc(100dvh-4.5rem)] flex-col px-5 py-8"
          >
            <p className="eyebrow px-3">Ruang anggota</p>
            <div className="mt-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const activeItem = view === item.view;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={activeItem ? 'page' : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${activeItem ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-primary'}`}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-auto rounded-lg bg-secondary p-4">
              <p className="text-xs font-semibold text-primary">
                Butuh bantuan?
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Datang ke Pusakanagara, Baregbeg, Ciamis saat jam kunjung.
              </p>
            </div>
          </nav>
        </aside>
        <main
          id="konten-utama"
          className="mx-auto w-full max-w-6xl px-5 py-10 pb-24 sm:px-8 lg:px-10 lg:py-14 lg:pb-14"
        >
          {view === 'overview' && <MemberOverview active={active} />}
          {view === 'loans' && <MemberLoans active={active} />}
          {view === 'profile' && <MemberProfile />}
        </main>
      </div>
      <nav
        aria-label="Navigasi anggota"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t ink-rule bg-card px-3 pb-[max(.55rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_-24px_rgba(25,51,43,.35)] lg:hidden"
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          const activeItem = view === item.view;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activeItem ? 'page' : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[10px] font-semibold transition-colors ${activeItem ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}
            >
              <Icon size={17} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function MemberOverview({ active }: { active: typeof loans }) {
  const loan = active[0];
  const book = books.find((item) => item.id === loan?.bookId);
  const completed = loans.filter(
    (item) => item.memberId === 'member-01' && item.status === 'returned',
  );
  const nextActivity = activities[0];
  return (
    <>
      <p className="eyebrow">Ruang anggota · PDS-0001</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.055em] text-primary sm:text-5xl">
        Halo, Siti.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
        Lihat pinjamanmu, cari buku baru, atau cek kegiatan yang akan datang.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-primary-foreground/65">
                Pinjaman aktif
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                {book && loan ? book.title : 'Belum ada buku yang dipinjam'}
              </h2>
              {book && (
                <p className="mt-2 text-sm text-primary-foreground/70">
                  oleh {book.author}
                </p>
              )}
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-foreground/10">
              <BookOpenCheck size={20} />
            </span>
          </div>
          {loan ? (
            <div className="mt-7 rounded-lg bg-primary-foreground/10 px-4 py-3">
              <p className="text-xs font-medium text-primary-foreground/65">
                Jatuh tempo
              </p>
              <p className="mt-1 text-sm font-semibold">
                {formatDate(loan.dueAt)}
              </p>
            </div>
          ) : (
            <p className="mt-7 max-w-sm text-sm leading-6 text-primary-foreground/70">
              Kamu bisa mulai dari katalog dan memilih bacaan yang tersedia.
            </p>
          )}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            {loan ? (
              <StatusBadge status={loan.status} />
            ) : (
              <span className="text-xs text-primary-foreground/70">
                Koleksi siap dijelajahi
              </span>
            )}
            <Link
              href={loan ? '/dashboard/pinjaman' : '/buku'}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-card px-4 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
            >
              {loan ? 'Lihat detail pinjaman' : 'Cari buku'}{' '}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        <section className="rounded-xl border ink-rule bg-card p-6 sm:p-8">
          <p className="eyebrow">Mulai dari sini</p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-primary">
            Temukan buku berikutnya.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Telusuri koleksi berdasarkan judul, penulis, atau kategori.
          </p>
          <Link href="/buku" className="button-primary mt-7 w-full">
            <Search size={16} />
            Cari buku
          </Link>
          <div className="mt-7 border-t ink-rule pt-5">
            <p className="text-xs font-semibold text-muted-foreground">
              Butuh bantuan?
            </p>
            <p className="mt-2 text-sm leading-6 text-primary">
              Datang ke Pusakanagara, Baregbeg, Ciamis saat jam kunjung.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[.8fr_.8fr_1.4fr]">
        <div className="rounded-lg border ink-rule bg-card p-5">
          <p className="text-xs text-muted-foreground">Sedang dipinjam</p>
          <p className="mt-3 text-3xl font-semibold text-primary tabular-nums">
            {active.length.toString().padStart(2, '0')}
          </p>
        </div>
        <div className="rounded-lg border ink-rule bg-card p-5">
          <p className="text-xs text-muted-foreground">Buku selesai dibaca</p>
          <p className="mt-3 text-3xl font-semibold text-primary tabular-nums">
            {completed.length.toString().padStart(2, '0')}
          </p>
        </div>
        <section className="rounded-lg border ink-rule bg-card p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-secondary text-primary">
              <CalendarDays size={16} />
            </span>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Kegiatan terdekat
              </p>
              <h2 className="mt-1 text-base font-semibold text-primary">
                {nextActivity.title}
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {formatDate(nextActivity.date)} · Pusakanagara, Baregbeg, Ciamis
              </p>
              <Link href="/kegiatan" className="link-arrow mt-3 text-xs">
                Lihat kegiatan <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function MemberLoans({ active }: { active: typeof loans }) {
  const history = loans.filter(
    (loan) => loan.memberId === 'member-01' && loan.status === 'returned',
  );
  return (
    <>
      <p className="eyebrow">Pinjaman saya</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.055em] text-primary sm:text-5xl">
        Buku yang sedang kamu bawa.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
        Periksa tanggal pengembalian agar pinjamanmu tetap lancar.
      </p>
      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-primary">Pinjaman aktif</h2>
          <span className="text-xs font-medium text-muted-foreground">
            {active.length} buku
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {active.map((loan) => (
            <MemberLoanCard key={loan.id} loan={loan} />
          ))}
          {!active.length && (
            <div className="rounded-xl bg-secondary p-6">
              <p className="font-semibold text-primary">
                Belum ada pinjaman aktif.
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Cari buku yang ingin kamu bawa pulang di katalog.
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="mt-10 border-t ink-rule pt-8">
        <h2 className="text-lg font-semibold text-primary">Riwayat baca</h2>
        <div className="mt-3 divide-y ink-rule">
          {history.map((loan) => {
            const book = books.find((item) => item.id === loan.bookId);
            return (
              <article
                className="flex items-center justify-between gap-4 py-4"
                key={loan.id}
              >
                <div>
                  <p className="font-semibold text-primary">{book?.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Dikembalikan{' '}
                    {loan.returnedAt ? formatDate(loan.returnedAt) : '—'}
                  </p>
                </div>
                <StatusBadge status={loan.status} />
              </article>
            );
          })}
          {!history.length && (
            <p className="py-4 text-sm text-muted-foreground">
              Belum ada riwayat buku yang selesai dibaca.
            </p>
          )}
        </div>
      </section>
      <Link href="/buku" className="button-primary mt-8">
        Jelajahi koleksi <ArrowUpRight size={16} />
      </Link>
    </>
  );
}

function MemberLoanCard({ loan }: { loan: (typeof loans)[number] }) {
  const book = books.find((item) => item.id === loan.bookId);
  return (
    <article className="rounded-xl border ink-rule bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div>
        <p className="text-xl font-semibold tracking-tight text-primary">
          {book?.title}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          oleh {book?.author}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
          <Clock3 size={15} />
          Kembalikan sebelum {formatDate(loan.dueAt)}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4 sm:mt-0 sm:flex-col sm:items-end">
        <StatusBadge status={loan.status} />
        <Link href="/buku" className="link-arrow text-xs">
          Cari buku lain <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}

function MemberProfile() {
  return (
    <>
      <p className="eyebrow">Keanggotaan</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.055em] text-primary sm:text-5xl">
        Profil saya
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Informasi yang tercatat di perpustakaan.
      </p>
      <dl className="mt-8 max-w-2xl divide-y ink-rule rounded-xl border ink-rule bg-card px-6">
        <div className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr]">
          <dt className="text-sm text-muted-foreground">Nama lengkap</dt>
          <dd className="font-semibold text-primary">Siti Rahma</dd>
        </div>
        <div className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr]">
          <dt className="text-sm text-muted-foreground">Nomor anggota</dt>
          <dd className="font-semibold text-primary tabular-nums">PDS-0001</dd>
        </div>
        <div className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr]">
          <dt className="text-sm text-muted-foreground">Kontak</dt>
          <dd className="font-semibold text-primary">0812-5550-0188</dd>
        </div>
      </dl>
      <Link href="/dashboard" className="link-arrow mt-7 text-sm">
        Kembali ke beranda <ChevronRight size={16} />
      </Link>
    </>
  );
}
