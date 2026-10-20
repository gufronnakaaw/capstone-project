'use client';

import { ArrowUpRight, BookOpen, ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const publicRoutes = [
  { label: 'Koleksi', href: '/buku' },
  { label: 'Kegiatan', href: '/kegiatan' },
  { label: 'Program', href: '/proker' },
  { label: 'Galeri', href: '/galeri' },
];

const roleRoutes = [
  { label: 'Anggota', href: '/dashboard' },
  { label: 'Pustakawan', href: '/pustakawan' },
  { label: 'Admin', href: '/admin' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    const updateHeader = () => setHasScrolled(window.scrollY > 12);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  const usesDefaultSurface = !isHome || hasScrolled || mobileOpen;

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-background transition-colors duration-300 ${usesDefaultSurface ? 'ink-rule' : 'border-transparent'}`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-primary"
          aria-label="Pusaka Aksara, beranda"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen size={19} strokeWidth={1.8} />
          </span>
          <span className="text-[1.05rem] font-bold tracking-[-.04em]">
            Pusaka Aksara<span className="text-muted-foreground">.</span>
          </span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 lg:flex"
        >
          {publicRoutes.map((route) => {
            const active =
              pathname === route.href || pathname.startsWith(`${route.href}/`);
            return (
              <Link
                key={route.href}
                href={route.href}
                aria-current={active ? 'page' : undefined}
                className={`border-b-2 py-6 text-sm font-semibold transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/buku"
            className="button-primary hidden min-h-9 px-3.5 text-xs sm:inline-flex"
          >
            Jelajahi buku <ArrowUpRight size={15} />
          </Link>
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setRolesOpen((value) => !value)}
              aria-expanded={rolesOpen}
              aria-controls="role-menu"
              className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs font-semibold text-primary hover:bg-secondary"
            >
              Mode{' '}
              <ChevronDown
                size={14}
                className={
                  rolesOpen
                    ? 'rotate-180 transition-transform'
                    : 'transition-transform'
                }
              />
            </button>
            {rolesOpen && (
              <div
                id="role-menu"
                className="absolute right-0 top-11 w-48 rounded-lg border ink-rule bg-card p-2 shadow-[0_18px_48px_-24px_rgba(25,51,43,.4)]"
              >
                <p className="px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Masuk sebagai
                </p>
                {roleRoutes.map((role) => (
                  <Link
                    onClick={() => setRolesOpen(false)}
                    className="block rounded-md px-2 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
                    key={role.href}
                    href={role.href}
                  >
                    {role.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg border ink-rule text-primary lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Navigasi seluler"
          className="border-t ink-rule bg-card px-5 pb-6 pt-3 sm:px-8 lg:hidden"
        >
          <div className="mx-auto max-w-7xl">
            {publicRoutes.map((route) => {
              const active =
                pathname === route.href ||
                pathname.startsWith(`${route.href}/`);
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`block border-b ink-rule py-3.5 text-sm font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {route.label}
                </Link>
              );
            })}
            <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Akses demo
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {roleRoutes.map((role) => (
                <Link
                  key={role.href}
                  href={role.href}
                  onClick={() => setMobileOpen(false)}
                  className="button-secondary min-h-9 px-3 text-xs"
                >
                  {role.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
