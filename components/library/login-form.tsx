"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { useState, type FormEvent } from "react";

const roleHome = {
  ADMIN: "/admin",
  LIBRARIAN: "/pustakawan",
  MEMBER: "/dashboard",
} as const;

type Role = keyof typeof roleHome;

export function LoginForm({ signedIn }: { signedIn: { name: string; role: Role } | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const result = await signIn("credentials", { email, password, redirect: false });
    if (!result || result.error) {
      setError("Email atau kata sandi salah.");
      setPending(false);
      return;
    }

    const response = await fetch("/api/me");
    const payload = await response.json();
    const role = payload?.data?.user?.role as Role | undefined;

    router.push(role ? roleHome[role] : "/");
    router.refresh();
  }

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.refresh();
  }

  return (
    <main id="konten-utama" className="mx-auto min-h-[70vh] max-w-md px-5 py-16 sm:px-8">
      <p className="eyebrow">Ruang anggota dan staff</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">Masuk</h1>

      {signedIn ? (
        <div className="mt-8 space-y-5">
          <p className="text-sm leading-7 text-muted-foreground">
            Anda masuk sebagai <strong className="text-primary">{signedIn.name}</strong>.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={roleHome[signedIn.role]} className="button-primary">
              Buka ruang saya
            </Link>
            <button type="button" onClick={handleSignOut} className="button-secondary">
              Keluar
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-xs font-bold">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-input mt-2"
            />
          </label>
          <label className="block text-xs font-bold">
            Kata sandi
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-input mt-2"
            />
          </label>
          {error && (
            <p role="alert" className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <button type="submit" disabled={pending} className="button-primary w-full disabled:opacity-60">
            {pending ? "Memproses..." : "Masuk"}
          </button>
        </form>
      )}
    </main>
  );
}
