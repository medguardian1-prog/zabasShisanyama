"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/actions/auth";

const links = [
  { href: "/admin", label: "Today" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/specials", label: "Specials" },
  { href: "/admin/hours", label: "Hours" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/enquiries", label: "Inbox" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 border-b border-hair bg-char">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.jpg"
            alt="Zaba's Shisanyama logo"
            width={32}
            height={32}
            sizes="32px"
            className="h-8 w-8 rounded object-cover"
          />
          <span className="text-sm font-semibold text-bone">Zaba&rsquo;s Staff</span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="rounded px-3 py-2 text-xs uppercase tracking-wider text-ash hover:text-bone"
          >
            Log out
          </button>
        </form>
      </div>
      <nav
        aria-label="Admin"
        className="no-scrollbar mx-auto flex max-w-4xl gap-1 overflow-x-auto px-3 pb-2"
      >
        {links.map((l) => {
          const active =
            l.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "shrink-0 rounded px-4 py-2.5 text-sm font-medium",
                active ? "bg-ember text-bone" : "text-ash hover:text-bone"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
