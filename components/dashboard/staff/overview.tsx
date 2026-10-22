"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import useSWR from "swr";
import { formatDate, StatusBadge } from "@/components/library/ui";
import { fetcher } from "@/lib/client/api";
import { Notice, toStatusKey } from "../ui";
import type { LoanRow, Page, Summary } from "../types";

export function StaffOverview({ area }: { area: "pustakawan" | "admin" }) {
  const base = area === "admin" ? "/admin" : "/pustakawan";
  const { data: summary, error } = useSWR<{ data: Summary }>("/api/dashboard/summary", fetcher);
  const { data: queue } = useSWR<Page<LoanRow>>("/api/loans?active=true&page_size=8", fetcher);

  if (error) return <Notice>Ringkasan belum bisa dimuat.</Notice>;

  const s = summary?.data;
  const cards = [
    { label: "Pinjaman terlambat", value: s?.loans_overdue },
    { label: "Segera jatuh tempo", value: s?.loans_due_soon },
    { label: "Pinjaman berjalan", value: s?.loans_active },
    { label: "Anggota aktif", value: s?.members_active },
    { label: "Judul di katalog", value: s?.books_total },
    { label: "Kegiatan mendatang", value: s?.activities_upcoming },
  ];

  return (
    <>
      <p className="eyebrow">Ringkasan</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.055em] text-primary sm:text-5xl">
        Yang perlu diperhatikan hari ini.
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border ink-rule bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-primary tabular-nums">
              {card.value === undefined ? "—" : String(card.value).padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4 border-b ink-rule pb-4">
          <div>
            <p className="eyebrow">Antrean layanan</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary">Pinjaman aktif</h2>
          </div>
          <Link href={`${base}/transaksi`} className="link-arrow text-sm">
            Buka transaksi <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {(queue?.data ?? []).map((loan) => (
            <div key={loan.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border ink-rule bg-card p-4">
              <div>
                <p className="font-semibold text-primary">{loan.book.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {loan.member.name} · {loan.member.member_code} · jatuh tempo {formatDate(loan.due_at)}
                </p>
              </div>
              <StatusBadge status={toStatusKey(loan.status)} />
            </div>
          ))}
          {queue && !queue.data.length && (
            <p className="rounded-lg bg-secondary p-6 text-sm text-muted-foreground">Tidak ada pinjaman aktif.</p>
          )}
        </div>
      </section>
    </>
  );
}
