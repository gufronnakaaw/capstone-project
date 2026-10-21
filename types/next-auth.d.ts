import type { DefaultSession } from "next-auth";

type AppRole = "ADMIN" | "LIBRARIAN" | "MEMBER";

declare module "next-auth" {
  interface User {
    role: AppRole;
    member_id: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: AppRole;
      member_id: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
    member_id: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
    member_id: string | null;
  }
}
