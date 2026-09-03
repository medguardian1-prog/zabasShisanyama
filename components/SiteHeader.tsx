"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { waLink, WA_ENQUIRY_DEFAULT } from "@/lib/site-defaults";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "Our Story" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 24);
    if (y > 400) {
      const delta = y - lastY.current;
      if (delta > 6) setHidden(true);
      else if (delta < 0) setHidden(false);
    } else {
      setHidden(false);
    }
    lastY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        // backdrop-blur on a fixed header repaints the whole strip on every
        // scroll frame; phones get a near-opaque bar instead, which looks the
        // same over a dark site and scrolls cleanly.
        scrolled || open
          ? "border-b border-hair bg-char/95 sm:bg-char/90 sm:backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
        hidden && !open && "-translate-y-full"
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link
          href="/"
          className="flex min-h-[44px] items-center gap-3"
          aria-label="Zaba's Shisanyama — home"
        >
          <Image
            src="/images/logo.png"
            alt="Zaba's Shisanyama logo"
            width={44}
            height={44}
            sizes="44px"
            priority
            className="h-10 w-10 object-contain sm:h-11 sm:w-11"
          />
          <span className="display-xl text-2xl text-bone">
            Zaba&rsquo;s
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-[0.75rem] uppercase tracking-[0.18em] transition-colors duration-300",
                pathname === l.href
                  ? "text-ember"
                  : "text-bone hover:text-flame"
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={waLink(WA_ENQUIRY_DEFAULT)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center rounded-full bg-ember px-5 py-2.5 text-[0.75rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:bg-flame"
          >
            WhatsApp Us
          </a>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={cn(
              "h-px w-6 bg-bone transition-transform duration-300",
              open && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-px w-6 bg-bone transition-transform duration-300",
              open && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="animate-fade-in flex h-[calc(100dvh-4rem)] flex-col gap-2 overflow-y-auto border-t border-hair bg-char px-5 py-8 lg:hidden"
        >
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "border-b border-hair py-4 display-xl text-3xl",
                pathname === l.href ? "text-ember" : "text-bone"
              )}
            >
              <span className="mr-4 text-[0.6875rem] tracking-[0.22em] text-gold">
                0{i + 1}
              </span>
              {l.label}
            </Link>
          ))}
          <a
            href={waLink(WA_ENQUIRY_DEFAULT)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-ember px-6 py-4 text-center text-[0.8125rem] uppercase tracking-[0.18em] text-bone"
          >
            WhatsApp Us
          </a>
        </nav>
      )}
    </header>
  );
}
