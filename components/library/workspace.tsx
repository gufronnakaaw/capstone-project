'use client';

import {
  activities,
  books,
  loans,
  members,
  prokers,
} from '@/lib/mock-data/library';
import type { Book, LoanStatus } from '@/lib/mock-data/types';
import {
  ArrowUpRight,
  BookCopy,
  BookOpenCheck,
  CalendarDays,
  Check,
  CircleAlert,
  ClipboardList,
  Images,
  Library,
  Menu,
  Plus,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Catalog } from './catalog';
import { MemberWorkspace } from './member-workspace';
import { StatusBadge, formatDate } from './ui';

type Role = 'member' | 'librarian' | 'admin';
const names = {
  member: 'Siti Rahma',
  librarian: 'Ratna Pustaka',
  admin: 'Dewi Lestari',
};
const sidebar = {
  member: [
    { href: '/dashboard', label: 'Beranda', icon: Library },
    {
      href: '/dashboard/pinjaman',
      label: 'Pinjaman saya',
      icon: BookOpenCheck,
    },
    { href: '/dashboard/profil', label: 'Profil saya', icon: Users },
    { href: '/buku', label: 'Cari buku', icon: BookCopy },
    { href: '/kegiatan', label: 'Kegiatan', icon: CalendarDays },
  ],
  librarian: [
    { href: '/pustakawan', label: 'Ringkasan', icon: Library },
    { href: '/pustakawan/transaksi', label: 'Transaksi', icon: ClipboardList },
    { href: '/pustakawan/buku', label: 'Koleksi buku', icon: BookCopy },
    { href: '/pustakawan/anggota', label: 'Data anggota', icon: Users },
  ],
  admin: [
    { href: '/admin', label: 'Ringkasan', icon: Library },
    { href: '/admin/transaksi', label: 'Transaksi', icon: ClipboardList },
    { href: '/admin/buku', label: 'Koleksi buku', icon: BookCopy },
    { href: '/admin/anggota', label: 'Data anggota', icon: Users },
    {
      href: '/admin/kegiatan',
      label: 'Kegiatan & program',
      icon: CalendarDays,
    },
    { href: '/admin/galeri', label: 'Dokumentasi', icon: Images },
  ],
};

export function Workspace({
  role,
  view = 'overview',
}: {
  role: Role;
  view?: 'overview' | 'loans' | 'books' | 'members' | 'programs' | 'profile';
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loanRows, setLoanRows] = useState(loans);
  const [memberRows, setMemberRows] = useState(members);
  const [addOpen, setAddOpen] = useState(false);
  const isMember = role === 'member';
  const currentLoans = isMember
    ? loanRows.filter((loan) => loan.memberId === 'member-01')
    : loanRows;
  const updateLoan = (id: string) =>
    setLoanRows((rows) =>
      rows.map((loan) =>
        loan.id === id
          ? {
              ...loan,
              status: 'returned' as LoanStatus,
              returnedAt: '2026-09-27',
            }
          : loan,
      ),
    );
  const label =
    role === 'member'
      ? 'Ruang anggota'
      : role === 'librarian'
        ? 'Meja pustakawan'
        : 'Ruang pengelola';
  if (String(role) === 'member') return <MemberWorkspace view={view} />;
  return (
    <div className="workspace-shell min-h-screen bg-background lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 border-b border-sidebar-border px-2 pb-6 text-lg font-bold tracking-tight text-primary"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenCheck size={19} />
          </span>
          Pusaka Aksara.
        </Link>
        <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground">
          {label}
        </p>
        <nav aria-label={`Navigasi ${label}`} className="mt-3 space-y-1">
          {sidebar[role].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                onClick={() => setMenuOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
                href={item.href}
                key={item.href}
              >
                <Icon size={17} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-sidebar-border px-2 pt-5">
          <p className="text-sm font-semibold">{names[role]}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {role === 'admin' ? 'Administrator' : 'Pustakawan'}
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Kembali ke situs <ArrowUpRight size={14} />
          </Link>
        </div>
      </aside>
      {menuOpen && (
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Tutup menu"
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
        />
      )}
      <main id="konten-utama" className="min-w-0">
        <header className="flex h-[4.5rem] items-center justify-between border-b ink-rule bg-card px-5 sm:px-8">
          <button
            className="grid size-10 place-items-center rounded-lg border ink-rule text-primary lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Buka menu"
          >
            <Menu size={19} />
          </button>
          <p className="eyebrow hidden lg:block">{label}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            Lihat situs publik <ArrowUpRight size={14} />
          </Link>
        </header>
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          {view === 'overview' && <Overview role={role} loanRows={loanRows} />}
          {view === 'loans' && (
            <Loans
              isMember={isMember}
              loans={currentLoans}
              onReturn={updateLoan}
            />
          )}
          {view === 'books' && <BooksManager management={!isMember} />}
          {view === 'members' && (
            <MembersManager
              rows={memberRows}
              setRows={setMemberRows}
              addOpen={addOpen}
              setAddOpen={setAddOpen}
            />
          )}
          {view === 'programs' && <ProgramsManager />}
          {view === 'profile' && <ProfileManager />}
        </div>
      </main>
    </div>
  );
}

function Overview({ role, loanRows }: { role: Role; loanRows: typeof loans }) {
  const active = loanRows.filter((loan) => loan.status !== 'returned');
  const overdue = active.filter((loan) => loan.status === 'overdue');
  const dueSoon = active.filter((loan) => loan.status === 'due-soon');
  const queue = [
    ...overdue,
    ...dueSoon,
    ...active.filter((loan) => loan.status === 'borrowed'),
  ];
  const transactionRoute =
    role === 'admin' ? '/admin/transaksi' : '/pustakawan/transaksi';
  return (
    <>
      <p className="eyebrow">Selamat datang, {names[role].split(' ')[0]}</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-.055em] text-primary sm:text-5xl">
        Yang perlu diperhatikan hari ini.
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
        Ringkasan layanan perpustakaan dan pinjaman yang sedang berjalan.
      </p>
      <div className="mt-9 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <section className="flex flex-col justify-between rounded-xl bg-secondary p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="eyebrow">Prioritas layanan</p>
            <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-primary">
              {overdue.length + dueSoon.length} perlu perhatian
            </span>
          </div>
          <div className="mt-9">
            <p className="text-6xl font-semibold tracking-[-.07em] text-primary tabular-nums">
              {overdue.length.toString().padStart(2, '0')}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary">
              Pinjaman terlambat
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Periksa dan tindak lanjuti pengembalian yang melewati tanggal
              jatuh tempo.
            </p>
          </div>
          <Link href={transactionRoute} className="link-arrow mt-10 text-sm">
            Buka transaksi <ArrowUpRight size={17} />
          </Link>
        </section>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <div className="rounded-xl border ink-rule bg-card p-5 sm:p-6">
            <p className="text-xs font-semibold text-muted-foreground">
              Pinjaman berjalan
            </p>
            <p className="mt-5 text-4xl font-semibold tracking-tight text-primary tabular-nums">
              {active.length.toString().padStart(2, '0')}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {dueSoon.length} segera jatuh tempo
            </p>
          </div>
          <div className="rounded-xl border ink-rule bg-card p-5 sm:p-6">
            <p className="text-xs font-semibold text-muted-foreground">
              Anggota aktif
            </p>
            <p className="mt-5 text-4xl font-semibold tracking-tight text-primary tabular-nums">
              {members
                .filter((member) => member.status === 'active')
                .length.toString()
                .padStart(2, '0')}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {books.length} judul dalam katalog
            </p>
          </div>
        </div>
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_.65fr]">
        <section>
          <div className="flex items-end justify-between gap-4 border-b ink-rule pb-4">
            <div>
              <p className="eyebrow">Antrian layanan</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary">
                Pinjaman aktif
              </h2>
            </div>
            <Link
              href={transactionRoute}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Lihat semua →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {queue.map((loan) => (
              <LoanRow key={loan.id} loan={loan} />
            ))}
            {!queue.length && (
              <p className="rounded-lg bg-secondary p-6 text-sm text-muted-foreground">
                Belum ada pinjaman yang perlu ditindaklanjuti.
              </p>
            )}
          </div>
        </section>
        <section className="h-fit rounded-xl border ink-rule bg-card p-6">
          <p className="eyebrow">Akurasi data</p>
          <h2 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-primary">
            Data rapi, layanan lebih lancar.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Periksa data anggota baru sebelum kartu baca dicetak. Kode anggota
            harus unik.
          </p>
          <Link
            href={role === 'admin' ? '/admin/anggota' : '/pustakawan/anggota'}
            className="link-arrow mt-6 text-sm"
          >
            Buka data anggota <ArrowUpRight size={16} />
          </Link>
        </section>
      </div>
    </>
  );
}
function LoanRow({
  loan,
  onReturn,
}: {
  loan: (typeof loans)[number];
  onReturn?: () => void;
}) {
  const book = books.find((item) => item.id === loan.bookId);
  const member = members.find((item) => item.id === loan.memberId);
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border ink-rule p-4 sm:p-5 ${loan.status === 'overdue' ? 'bg-[#fff6f2] dark:bg-[#4b302e]' : 'bg-card'}`}
    >
      <div>
        <p className="text-base font-semibold text-primary sm:text-lg">
          {book?.title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {member?.name} · Jatuh tempo {formatDate(loan.dueAt)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={loan.status} />
        {onReturn && loan.status !== 'returned' && (
          <button
            onClick={onReturn}
            className="min-h-9 rounded-md border border-primary px-3 text-xs font-semibold text-primary hover:bg-secondary"
          >
            Tandai kembali
          </button>
        )}
      </div>
    </div>
  );
}
function Loans({
  isMember,
  loans: rows,
  onReturn,
}: {
  isMember: boolean;
  loans: typeof loans;
  onReturn: (id: string) => void;
}) {
  const priority: Record<string, number> = {
    overdue: 0,
    'due-soon': 1,
    borrowed: 2,
    returned: 3,
  };
  const sorted = [...rows].sort(
    (a, b) => (priority[a.status] ?? 4) - (priority[b.status] ?? 4),
  );
  const open = rows.filter((loan) => loan.status !== 'returned').length;
  const overdue = rows.filter((loan) => loan.status === 'overdue').length;
  return (
    <>
      <p className="eyebrow">
        {isMember ? 'Riwayat pribadi' : 'Meja sirkulasi'}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
        {isMember ? 'Pinjaman saya' : 'Pinjam & kembali'}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
        {isMember
          ? 'Pantau tanggal pengembalian dan riwayat buku yang pernah kamu bawa pulang.'
          : 'Periksa status peminjaman dan selesaikan pengembalian dengan jelas.'}
      </p>
      <div className="mt-9 flex flex-wrap gap-x-8 gap-y-2 border-y ink-rule py-4 text-xs font-semibold text-muted-foreground">
        <span>
          <strong className="text-primary tabular-nums">{open}</strong> pinjaman
          berjalan
        </span>
        <span>
          <strong className="text-destructive tabular-nums">{overdue}</strong>{' '}
          terlambat
        </span>
        <span>{rows.length} transaksi tercatat</span>
      </div>
      <div className="mt-5 space-y-3">
        {sorted.map((loan) => (
          <LoanRow
            key={loan.id}
            loan={loan}
            onReturn={isMember ? undefined : () => onReturn(loan.id)}
          />
        ))}
        {!rows.length && (
          <p className="rounded-lg bg-secondary p-6 text-sm text-muted-foreground">
            Belum ada transaksi yang tercatat.
          </p>
        )}
      </div>
    </>
  );
}
function BooksManager({ management }: { management: boolean }) {
  const [rows, setRows] = useState<Book[]>(books);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const addBook = () => {
    if (!title || !author) return;
    setRows((current) => [
      ...current,
      {
        id: `book-${Date.now()}`,
        title,
        author,
        category: 'Belum dikategorikan',
        isbn: 'Belum diisi',
        coverUrl: books[0].coverUrl,
        stock: 1,
        availableStock: 1,
        publishedYear: 2026,
        synopsis: 'Data katalog baru yang menunggu dilengkapi.',
        createdAt: '2026-09-27',
      },
    ]);
    setOpen(false);
    setTitle('');
    setAuthor('');
  };
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Katalog perpustakaan</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">
            Koleksi buku
          </h1>
        </div>
        {management && (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-sm font-extrabold text-primary-foreground"
          >
            <Plus size={16} />
            Tambah buku
          </button>
        )}
      </div>
      <div className="mt-7">
        <Catalog books={rows} management={management} />
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-primary/50 p-4">
          <div className="w-full max-w-md bg-card p-6 shadow-2xl">
            <div className="flex justify-between">
              <div>
                <p className="eyebrow">Katalog baru</p>
                <h2 className="mt-2 font-heading text-2xl font-semibold">
                  Tambah buku
                </h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Tutup">
                <X />
              </button>
            </div>
            <label className="mt-5 block text-xs font-bold">
              Judul buku
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="form-input mt-2"
                placeholder="Judul buku"
              />
            </label>
            <label className="mt-4 block text-xs font-bold">
              Penulis
              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className="form-input mt-2"
                placeholder="Nama penulis"
              />
            </label>
            <button
              disabled={!title || !author}
              onClick={addBook}
              className="mt-6 min-h-10 bg-primary px-4 text-sm font-extrabold text-primary-foreground disabled:opacity-50"
            >
              Simpan draft buku
            </button>
          </div>
        </div>
      )}
    </>
  );
}
function ProgramsManager() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Konten perpustakaan</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">
            Kegiatan & program
          </h1>
        </div>
        <button className="inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-sm font-extrabold text-primary-foreground">
          <Plus size={16} />
          Tambah kegiatan
        </button>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <p className="eyebrow">Kalender kegiatan</p>
          <div className="mt-3 space-y-2">
            {activities.map((activity) => (
              <div
                className="flex items-center justify-between gap-3 border ink-rule bg-card p-4"
                key={activity.id}
              >
                <div>
                  <p className="font-heading text-lg font-semibold">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.date}
                  </p>
                </div>
                <Link
                  className="text-xs font-extrabold text-primary underline underline-offset-4"
                  href={`/kegiatan/${activity.slug}`}
                >
                  Tinjau
                </Link>
              </div>
            ))}
          </div>
        </section>
        <section>
          <p className="eyebrow">Program kerja</p>
          <div className="mt-3 space-y-2">
            {prokers.map((program) => (
              <div
                className="flex items-center justify-between gap-3 border ink-rule bg-card p-4"
                key={program.id}
              >
                <div>
                  <p className="font-heading text-lg font-semibold">
                    {program.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {program.period} · {program.progress}%
                  </p>
                </div>
                <StatusBadge status={program.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
function MembersManager({
  rows,
  setRows,
  addOpen,
  setAddOpen,
}: {
  rows: typeof members;
  setRows: React.Dispatch<React.SetStateAction<typeof members>>;
  addOpen: boolean;
  setAddOpen: (open: boolean) => void;
}) {
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const submit = () => {
    if (!name || !code) return setError('Nama dan ID anggota wajib diisi.');
    if (
      rows.some(
        (member) => member.memberCode.toLowerCase() === code.toLowerCase(),
      )
    )
      return setError('ID anggota sudah dipakai. Gunakan kode yang berbeda.');
    setRows([
      ...rows,
      {
        id: `member-${Date.now()}`,
        name,
        memberCode: code,
        contact: '—',
        address: '—',
        joinDate: '2026-09-27',
        status: 'active',
        createdAt: '2026-09-27',
      },
    ]);
    setAddOpen(false);
    setName('');
    setCode('');
    setError('');
  };
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Akurasi data</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">
            Data anggota
          </h1>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-sm font-extrabold text-primary-foreground"
        >
          <Plus size={16} />
          Tambah anggota
        </button>
      </div>
      <div className="mt-7 overflow-x-auto border ink-rule bg-card">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b ink-rule bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Anggota</th>
              <th className="p-4">Kontak</th>
              <th className="p-4">Bergabung</th>
              <th className="p-4">Pinjaman aktif</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((member) => (
              <tr className="border-b ink-rule last:border-0" key={member.id}>
                <td className="p-4">
                  <strong className="block text-primary">{member.name}</strong>
                  <span className="text-xs text-muted-foreground">
                    {member.memberCode}
                  </span>
                </td>
                <td className="p-4">{member.contact}</td>
                <td className="p-4">{formatDate(member.joinDate)}</td>
                <td className="p-4">
                  {
                    loans.filter(
                      (loan) =>
                        loan.memberId === member.id &&
                        loan.status !== 'returned',
                    ).length
                  }
                </td>
                <td className="p-4">
                  <StatusBadge status={member.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-primary/50 p-4">
          <div className="w-full max-w-md bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Validasi anggota</p>
                <h2 className="mt-2 font-heading text-2xl font-semibold">
                  Tambah data baru
                </h2>
              </div>
              <button onClick={() => setAddOpen(false)} aria-label="Tutup">
                <X />
              </button>
            </div>
            {error && (
              <p className="mt-5 flex gap-2 border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <CircleAlert size={18} />
                {error}
              </p>
            )}
            <label className="mt-5 block text-xs font-bold">
              Nama lengkap
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="form-input mt-2"
                placeholder="Contoh: Dwi Anggraini"
              />
            </label>
            <label className="mt-4 block text-xs font-bold">
              ID anggota
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="form-input mt-2"
                placeholder="Contoh: PDS-0005"
              />
            </label>
            <button
              onClick={submit}
              className="mt-6 inline-flex min-h-10 items-center gap-2 bg-primary px-4 text-sm font-extrabold text-primary-foreground"
            >
              <Check size={16} />
              Simpan data
            </button>
          </div>
        </div>
      )}
    </>
  );
}
function ProfileManager() {
  const [name, setName] = useState('Siti Rahma');
  const [contact, setContact] = useState('0812-5550-0188');
  const [saved, setSaved] = useState(false);
  return (
    <>
      <p className="eyebrow">Keanggotaan</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">
        Profil saya
      </h1>
      <div className="mt-8 max-w-xl border ink-rule bg-card p-5 sm:p-7">
        {saved && (
          <p className="mb-5 border border-primary/30 bg-secondary p-3 text-sm font-bold text-primary">
            Perubahan profil tersimpan di sesi mock ini.
          </p>
        )}
        <label className="block text-xs font-bold">
          Nama lengkap
          <input
            className="form-input mt-2"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaved(false);
            }}
          />
        </label>
        <label className="mt-5 block text-xs font-bold">
          Nomor kontak
          <input
            className="form-input mt-2"
            value={contact}
            onChange={(event) => {
              setContact(event.target.value);
              setSaved(false);
            }}
          />
        </label>
        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          ID anggota <strong>PDS-0001</strong> tidak dapat diubah untuk menjaga
          akurasi riwayat peminjaman.
        </p>
        <button
          onClick={() => setSaved(true)}
          className="mt-6 min-h-10 bg-primary px-4 text-sm font-extrabold text-primary-foreground"
        >
          Simpan perubahan
        </button>
      </div>
    </>
  );
}
