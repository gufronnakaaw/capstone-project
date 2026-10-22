"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import useSWR from "swr";
import { ApiClientError, fetcher } from "@/lib/client/api";
import { Notice } from "./ui";

export type AppRole = "ADMIN" | "LIBRARIAN" | "MEMBER";

export type Me = {
  user: { id: string; name: string; email: string; role: AppRole; member_id: string | null };
  member: {
    id: string;
    name: string;
    member_code: string;
    contact: string;
    address: string;
    join_date: string;
    status: string;
    active_loan_count: number;
    has_overdue: boolean;
  } | null;
};

export const roleHome: Record<AppRole, string> = {
  ADMIN: "/admin",
  LIBRARIAN: "/pustakawan",
  MEMBER: "/dashboard",
};

export function RequireRole({ roles, children }: { roles: AppRole[]; children: (me: Me) => ReactNode }) {
  const router = useRouter();
  const { data, error } = useSWR<{ data: Me }>("/api/me", fetcher);
  const me = data?.data;
  const allowed = me ? roles.includes(me.user.role) : false;
  const unauthenticated = error instanceof ApiClientError && error.status === 401;

  useEffect(() => {
    if (unauthenticated) router.replace("/login");
    else if (me && !allowed) router.replace(roleHome[me.user.role]);
  }, [unauthenticated, me, allowed, router]);

  if (error && !unauthenticated) {
    return <Notice>Data akun belum bisa dimuat. Coba muat ulang halaman.</Notice>;
  }
  if (!me || !allowed) {
    return <p className="py-20 text-center text-sm text-muted-foreground">Memeriksa akses...</p>;
  }
  return <>{children(me)}</>;
}
