"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/actions/auth";

const S = {
  strokeWidth: 1.8,
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Icon({ d, extra }: { d: string; extra?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true" {...S}>
      <path d={d} />
      {extra}
    </svg>
  );
}

const links = [
  {
    href: "/admin",
    label: "Today",
    icon: <Icon d="M3 11.5 12 4l9 7.5M5.5 9.8V20h13V9.8" />,
  },
  {
    href: "/admin/menu",
    label: "Menu",
    icon: <Icon d="M4 6h16M4 12h16M4 18h10" />,
  },
  {
    href: "/admin/specials",
    label: "Specials",
    icon: (
      <Icon d="M12 3c1.8 2.8 1 4.4-.2 6C10.5 10.7 10 12 10.6 14c-2-1-3.4-2.6-3.5-4.9C5.4 10.7 4.5 12.6 4.5 15a7.5 7.5 0 0 0 15 0c0-5-4.2-7.4-7.5-12Z" />
    ),
  },
  {
    href: "/admin/hours",
    label: "Hours",
    icon: <Icon d="M12 7v5l3.2 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    icon: (
      <Icon
        d="M4 5.5h16v13H4zM4 15l4.5-4.5 4 4L15.5 12l4.5 4.5"
        extra={<circle cx="9" cy="9" r="1.3" />}
      />
    ),
  },
  {
    href: "/admin/events",
    label: "Events",
    icon: <Icon d="M4 6.5h16v13H4zM4 10.5h16M8 4v4M16 4v4" />,
  },
  {
    href: "/admin/enquiries",
    label: "Inbox",
    icon: <Icon d="M3 13h5l2 3h4l2-3h5M5 6h14l2 7v5H3v-5z" />,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <Icon
        d="M10.3 4.3a2 2 0 0 1 3.4 0l.5.9a2 2 0 0 0 2 1l1-.2a2 2 0 0 1 1.8 3l-.6.8a2 2 0 0 0 0 2.4l.6.8a2 2 0 0 1-1.8 3l-1-.2a2 2 0 0 0-2 1l-.5.9a2 2 0 0 1-3.4 0l-.5-.9a2 2 0 0 0-2-1l-1 .2a2 2 0 0 1-1.8-3l.6-.8a2 2 0 0 0 0-2.4l-.6-.8a2 2 0 0 1 1.8-3l1 .2a2 2 0 0 0 2-1z"
        extra={<circle cx="12" cy="12" r="2.6" />}
      />
    ),
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 border-b border-hair bg-char/95 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.jpg"
            alt="Zaba's Shisanyama logo"
            width={26}
            height={26}
            sizes="26px"
            className="h-[26px] w-[26px] rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-bone">
            Zaba&rsquo;s <span className="text-ash">Staff</span>
          </span>
        </Link>
        <div className="flex items-center">
          <Link
            href="/"
            className="hidden px-3 py-2 text-xs text-ash transition-colors hover:text-bone sm:inline-flex"
          >
            View site ↗
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="px-3 py-2 text-xs text-ash transition-colors hover:text-bone"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
      <nav
        aria-label="Admin"
        className="no-scrollbar mx-auto flex max-w-4xl gap-0.5 overflow-x-auto px-3"
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
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[0.8125rem] transition-colors",
                active
                  ? "border-ember text-bone"
                  : "border-transparent text-ash hover:text-bone"
              )}
            >
              {l.icon}
              {l.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
