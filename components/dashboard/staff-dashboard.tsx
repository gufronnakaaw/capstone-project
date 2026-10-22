"use client";

import { BookCopy, CalendarDays, ClipboardList, Images, Library, Users } from "lucide-react";
import { Books } from "./staff/books";
import { Gallery } from "./staff/gallery";
import { Members } from "./staff/members";
import { Programs } from "./staff/programs";
import { StaffOverview } from "./staff/overview";
import { Transactions } from "./staff/transactions";
import { type AppRole, RequireRole } from "./require-role";
import { DashboardShell, type NavItem } from "./shell";

type Area = "pustakawan" | "admin";
type View = "overview" | "transactions" | "books" | "members" | "programs" | "gallery";

const navFor = (area: Area): NavItem[] => {
  const base = area === "admin" ? "/admin" : "/pustakawan";
  const items: NavItem[] = [
    { href: base, label: "Ringkasan", icon: Library },
    { href: `${base}/transaksi`, label: "Transaksi", icon: ClipboardList },
    { href: `${base}/buku`, label: "Koleksi buku", icon: BookCopy },
    { href: `${base}/anggota`, label: "Data anggota", icon: Users },
  ];
  if (area === "admin") {
    items.push(
      { href: "/admin/kegiatan", label: "Kegiatan & program", icon: CalendarDays },
      { href: "/admin/galeri", label: "Dokumentasi", icon: Images },
    );
  }
  return items;
};

export function StaffDashboard({ area, view }: { area: Area; view: View }) {
  const roles: AppRole[] = area === "admin" ? ["ADMIN"] : ["ADMIN", "LIBRARIAN"];

  return (
    <RequireRole roles={roles}>
      {(me) => (
        <DashboardShell
          label={area === "admin" ? "Ruang pengelola" : "Meja pustakawan"}
          nav={navFor(area)}
          name={me.user.name}
          roleLabel={me.user.role === "ADMIN" ? "Administrator" : "Pustakawan"}
        >
          {view === "overview" && <StaffOverview area={area} />}
          {view === "transactions" && <Transactions />}
          {view === "books" && <Books />}
          {view === "members" && <Members />}
          {view === "programs" && <Programs />}
          {view === "gallery" && <Gallery />}
        </DashboardShell>
      )}
    </RequireRole>
  );
}
