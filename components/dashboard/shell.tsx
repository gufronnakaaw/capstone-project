"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export function DashboardShell({
  label,
  nav,
  name,
  roleLabel,
  children,
}: {
  label: string;
  nav: NavItem[];
  name: string;
  roleLabel: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 text-sidebar-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2.5 border-b border-sidebar-border px-2 pb-6 text-lg font-bold tracking-tight text-primary">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen size={19} />
          </span>
          Pusaka Aksara.
        </Link>
        <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground">{label}</p>
        <nav aria-label={`Navigasi ${label}`} className="mt-3 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
              >
                <Icon size={17} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-sidebar-border px-2 pt-5">
          <p className="text-sm font-semibold">{name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{roleLabel}</p>
          <Link href="/" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Kembali ke situs <ArrowUpRight size={14} />
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b ink-rule bg-card">
          <div className="flex h-[4.5rem] items-center justify-between gap-4 px-5 sm:px-8">
            <p className="eyebrow">{label}</p>
            <div className="flex items-center gap-3">
              <p className="hidden text-xs font-semibold text-muted-foreground sm:block">{name}</p>
              <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Lihat situs <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
          <nav aria-label={`Navigasi ${label} seluler`} className="flex gap-2 overflow-x-auto border-t ink-rule px-5 py-2 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold ${pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main id="konten-utama" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
