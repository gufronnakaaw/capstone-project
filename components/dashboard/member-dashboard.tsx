"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, BookOpenCheck, CalendarDays, Clock3, Library, Search, UserRound } from "lucide-react";
import useSWR from "swr";
import { formatDate, StatusBadge } from "@/components/library/ui";
import { apiRequest, fetcher, revalidateApi } from "@/lib/client/api";
import { RequireRole, type Me } from "./require-role";
import { DashboardShell, type NavItem } from "./shell";
import { Field, Notice, messageOf, toStatusKey } from "./ui";
import type { ActivityRow, LoanRow, Page } from "./types";

const nav: NavItem[] = [
  { href: "/dashboard", label: "Beranda", icon: Library },
  { href: "/dashboard/pinjaman", label: "Pinjaman saya", icon: BookOpenCheck },
  { href: "/dashboard/profil", label: "Profil saya", icon: UserRound },
  { href: "/buku", label: "Cari buku", icon: Search },
  { href: "/kegiatan", label: "Kegiatan", icon: CalendarDays },
];

type View = "overview" | "loans" | "profile";

export function MemberDashboard({ view }: { view: View }) {
  return (
    <RequireRole roles={["MEMBER"]}>
      {(me) => (
        <DashboardShell
          label="Ruang anggota"
          nav={nav}
          name={me.user.name}
          roleLabel={me.member ? `Anggota · ${me.member.member_code}` : "Akun belum terhubung anggota"}
        >
          {view === "overview" && <Overview me={me} />}
          {view === "loans" && <Loans me={me} />}
          {view === "profile" && <Profile me={me} />}
        </DashboardShell>
      )}
    </RequireRole>
  );
}

function useMyLoans() {
  return useSWR<{ data: LoanRow[] }>("/api/me/loans", fetcher);
}

function Overview({ me }: { me: Me }) {
  const { data: loansData, error } = useMyLoans();
  const { data: upcoming } = useSWR<Page<ActivityRow>>("/api/activities?period=upcoming&page_size=1", fetcher);

  if (!me.member) {
    return <Notice>Akun ini belum terhubung dengan data anggota. Hubungi pustakawan untuk dibantu.</Notice>;
  }
  if (error) return <Notice>Pinjaman belum bisa dimuat.</Notice>;

  const loans = loansData?.data ?? [];
  const active = loans.filter((loan) => !loan.returned_at);
  const history = loans.filter((loan) => loan.returned_at);
  const current = active[0];
  const nextActivity = upcoming?.data[0];

  return (
    <>
      <p className="eyebrow">Beranda</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.055em] text-primary sm:text-5xl">
        Halo, {me.member.name.split(" ")[0]}.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
        Lihat pinjamanmu, cari buku baru, atau cek kegiatan yang akan datang.
      </p>

      {me.member.has_overdue && (
        <div className="mt-6">
          <Notice>Ada pinjaman yang melewati tanggal jatuh tempo. Segera kembalikan buku ke perpustakaan.</Notice>
        </div>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[.12em] text-primary-foreground/65">Pinjaman aktif</p>
          {current ? (
            <>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{current.book.title}</h2>
              <p className="mt-2 text-sm text-primary-foreground/70">oleh {current.book.author}</p>
              <div className="mt-7 rounded-lg bg-primary-foreground/10 px-4 py-3">
                <p className="text-xs font-medium text-primary-foreground/65">Jatuh tempo</p>
                <p className="mt-1 text-sm font-semibold">{formatDate(current.due_at)}</p>
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <StatusBadge status={toStatusKey(current.status)} />
                <Link href="/dashboard/pinjaman" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-card px-4 text-sm font-semibold text-primary">
                  Lihat semua pinjaman <ArrowRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Belum ada buku yang dipinjam</h2>
              <p className="mt-7 max-w-sm text-sm leading-6 text-primary-foreground/70">
                Cari buku di katalog, lalu datang ke perpustakaan untuk meminjam.
              </p>
              <Link href="/buku" className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-lg bg-card px-4 text-sm font-semibold text-primary">
                Cari buku <ArrowRight size={16} />
              </Link>
            </>
          )}
        </section>

        <section className="rounded-xl border ink-rule bg-card p-6 sm:p-8">
          <p className="eyebrow">Kegiatan terdekat</p>
          {nextActivity ? (
            <>
              <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-primary">{nextActivity.title}</h2>
              <p className="mt-2 text-xs text-muted-foreground">{formatDate(nextActivity.date)}</p>
              <Link href={`/kegiatan/${nextActivity.slug}`} className="link-arrow mt-6 text-sm">
                Lihat kegiatan <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Belum ada kegiatan yang dijadwalkan.</p>
          )}
        </section>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border ink-rule bg-card p-5">
          <p className="text-xs text-muted-foreground">Sedang dipinjam</p>
          <p className="mt-3 text-3xl font-semibold text-primary tabular-nums">{String(active.length).padStart(2, "0")}</p>
        </div>
        <div className="rounded-lg border ink-rule bg-card p-5">
          <p className="text-xs text-muted-foreground">Buku selesai dibaca</p>
          <p className="mt-3 text-3xl font-semibold text-primary tabular-nums">{String(history.length).padStart(2, "0")}</p>
        </div>
      </div>
    </>
  );
}

function Loans({ me }: { me: Me }) {
  const { data, error } = useMyLoans();

  if (!me.member) return <Notice>Akun ini belum terhubung dengan data anggota.</Notice>;

  const loans = data?.data ?? [];
  const active = loans.filter((loan) => !loan.returned_at);
  const history = loans.filter((loan) => loan.returned_at);

  return (
    <>
      <p className="eyebrow">Pinjaman saya</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.055em] text-primary sm:text-5xl">
        Buku yang sedang kamu bawa.
      </h1>
      {error && (
        <div className="mt-6">
          <Notice>Pinjaman belum bisa dimuat.</Notice>
        </div>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-primary">Pinjaman aktif</h2>
          <span className="text-xs font-medium text-muted-foreground">{active.length} buku</span>
        </div>
        <div className="mt-4 space-y-3">
          {active.map((loan) => (
            <article key={loan.id} className="rounded-xl border ink-rule bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-xl font-semibold tracking-tight text-primary">{loan.book.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">oleh {loan.book.author}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
                  <Clock3 size={15} />
                  Kembalikan sebelum {formatDate(loan.due_at)}
                </div>
              </div>
              <div className="mt-5 sm:mt-0">
                <StatusBadge status={toStatusKey(loan.status)} />
              </div>
            </article>
          ))}
          {!active.length && (
            <div className="rounded-xl bg-secondary p-6">
              <p className="font-semibold text-primary">Belum ada pinjaman aktif.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-10 border-t ink-rule pt-8">
        <h2 className="text-lg font-semibold text-primary">Riwayat baca</h2>
        <div className="mt-3 divide-y ink-rule">
          {history.map((loan) => (
            <article key={loan.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold text-primary">{loan.book.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Dikembalikan {loan.returned_at ? formatDate(loan.returned_at) : "—"}
                </p>
              </div>
              <StatusBadge status="returned" />
            </article>
          ))}
          {!history.length && <p className="py-4 text-sm text-muted-foreground">Belum ada riwayat buku.</p>}
        </div>
      </section>
    </>
  );
}

function Profile({ me }: { me: Me }) {
  const member = me.member;
  const [name, setName] = useState(me.user.name);
  const [contact, setContact] = useState(member?.contact ?? "");
  const [message, setMessage] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      await apiRequest("PATCH", "/api/me", { name, contact });
      await revalidateApi();
      setMessage({ tone: "info", text: "Profil berhasil disimpan." });
    } catch (error) {
      setMessage({ tone: "error", text: messageOf(error) });
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <p className="eyebrow">Keanggotaan</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.055em] text-primary sm:text-5xl">Profil saya</h1>

      <dl className="mt-8 max-w-2xl divide-y ink-rule rounded-xl border ink-rule bg-card px-6">
        <div className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr]">
          <dt className="text-sm text-muted-foreground">Nomor anggota</dt>
          <dd className="font-semibold text-primary tabular-nums">{member?.member_code ?? "—"}</dd>
        </div>
        <div className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr]">
          <dt className="text-sm text-muted-foreground">Alamat</dt>
          <dd className="font-semibold text-primary">{member?.address ?? "—"}</dd>
        </div>
        <div className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr]">
          <dt className="text-sm text-muted-foreground">Bergabung</dt>
          <dd className="font-semibold text-primary">{member ? formatDate(member.join_date) : "—"}</dd>
        </div>
      </dl>

      {member && (
        <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5 border ink-rule bg-card p-5 sm:p-7">
          {message && <Notice tone={message.tone}>{message.text}</Notice>}
          <Field label="Nama lengkap">
            <input required value={name} onChange={(event) => setName(event.target.value)} className="form-input" />
          </Field>
          <Field label="Nomor kontak">
            <input required value={contact} onChange={(event) => setContact(event.target.value)} className="form-input" />
          </Field>
          <button type="submit" disabled={pending} className="button-primary disabled:opacity-60">
            {pending ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </form>
      )}
    </>
  );
}
