import { auth } from "@/auth";
import { Footer } from "@/components/library/footer";
import { LoginForm } from "@/components/library/login-form";
import { SiteHeader } from "@/components/library/site-header";

export default async function LoginPage() {
  const session = await auth();
  const signedIn = session?.user
    ? {
        name: session.user.name ?? session.user.email ?? "Pengguna",
        role: session.user.role,
      }
    : null;

  return (
    <>
      <SiteHeader />
      <LoginForm signedIn={signedIn} />
      <Footer />
    </>
  );
}
