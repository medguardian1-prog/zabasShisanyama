import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Staff Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center px-5">
      <Link
        href="/"
        className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[0.75rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone sm:left-8 sm:top-7"
      >
        <span aria-hidden="true">←</span> Back to the site
      </Link>

      <div className="admin-card w-full max-w-sm p-8 text-center sm:p-10">
        <Image
          src="/images/logo.jpg"
          alt="Zaba's Shisanyama logo"
          width={72}
          height={72}
          sizes="72px"
          className="mx-auto h-18 w-18 rounded-full object-cover ring-2 ring-hair"
        />
        <h1 className="mt-6 font-display text-xl uppercase tracking-wide text-bone">
          Staff login
        </h1>
        <p className="mt-1.5 text-sm text-ash">Enter the staff password.</p>
        <LoginForm />
      </div>

      <p className="mt-6 text-[0.6875rem] text-ash/70">
        Zaba&rsquo;s Shisanyama · staff only
      </p>
    </main>
  );
}
