import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Staff Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-5">
      <Image
        src="/images/logo.jpg"
        alt="Zaba's Shisanyama logo"
        width={72}
        height={72}
        sizes="72px"
        className="h-18 w-18 rounded object-cover"
      />
      <h1 className="mt-6 text-lg font-semibold text-bone">Staff login</h1>
      <p className="mt-1 text-sm text-ash">Enter the staff password.</p>
      <LoginForm />
    </main>
  );
}
