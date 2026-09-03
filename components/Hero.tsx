"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { waLink, WA_BOOKING_DEFAULT } from "@/lib/site-defaults";

const LINES = ["Meat.", "Fire.", "Family."];

/**
 * Entrance is CSS-driven (see .hero-* in globals.css) so it plays from first
 * paint rather than after hydration — hero copy stays off the LCP critical
 * path. Framer Motion handles only the scroll-linked parallax, which never
 * hides content.
 */
export default function Hero({
  statusLabel,
  address,
  whatsappSetting,
}: {
  statusLabel?: string | null;
  address?: string;
  whatsappSetting?: string | null;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Scroll-linked transforms on a full-screen image cost a repaint every
  // frame. Worth it on a desktop GPU; on a phone it is the difference
  // between buttery and stuttering, so touch devices get a static hero.
  const [parallax, setParallax] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 640px)");
    const apply = () => setParallax(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const copyY = useTransform(scrollYProgress, [0, 0.55], ["0%", "-30%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-char"
    >
      {/* full-bleed banner */}
      <motion.div
        className="absolute inset-0"
        style={reduced || !parallax ? undefined : { scale: imgScale, y: imgY }}
      >
        {/* Art-directed: the landscape crop loses its composition inside a tall
            phone viewport, so mobile gets the original portrait framing. */}
        <div className="hero-settle absolute inset-0">
          <Image
            src="/images/hero-mobile.jpg"
            alt="Flame-grilled pork chops and ribs on a wooden board with phuthu, tomato salsa and chakalaka at Zaba's Shisanyama"
            fill
            priority
            quality={82}
            sizes="100vw"
            className="object-cover object-center brightness-[1.06] contrast-[1.08] saturate-[1.12] sm:hidden"
          />
          <Image
            src="/images/hero.jpg"
            alt=""
            aria-hidden="true"
            fill
            quality={82}
            sizes="100vw"
            className="hidden object-cover object-center brightness-[1.06] contrast-[1.08] saturate-[1.12] sm:block"
          />
        </div>
        {/* Scrims shaped to darken only where the type sits, so the board
            stays bright. Explicit stops beat Tailwind's even thirds here. */}
        {/* On phones the copy sits over the image, so the vertical scrim does
            the work and the horizontal one is dropped. */}
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(to right, #0B0A0A 0%, rgba(11,10,10,0.82) 26%, rgba(11,10,10,0.35) 48%, rgba(11,10,10,0.05) 68%, transparent 100%)",
          }}
        />
        {/* Mid-band opacity raised 2026-09-03. The previous stops (0.55 / 0.15)
            were tuned against a much darker photo; the replacement shot is
            roughly twice as bright, which left the gold eyebrow and the body
            copy sitting on lit tomato salsa and pale wood. The top ~15% is
            deliberately left clear so the board still reads above the type. */}
        <div
          className="absolute inset-0 sm:hidden"
          style={{
            background:
              "linear-gradient(to top, #0B0A0A 0%, rgba(11,10,10,0.94) 22%, rgba(11,10,10,0.78) 45%, rgba(11,10,10,0.38) 68%, transparent 90%)",
          }}
        />
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(to top, #0B0A0A 0%, rgba(11,10,10,0.55) 14%, rgba(11,10,10,0.12) 34%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 12% 78%, rgba(200,16,46,0.18) 0%, transparent 62%)",
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-32 sm:px-8 sm:pb-16 sm:pt-40"
        style={
          reduced || !parallax ? undefined : { y: copyY, opacity: copyOpacity }
        }
      >
        <div
          className="hero-rise mb-6 flex items-center gap-4"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="h-px w-12 bg-gold" aria-hidden="true" />
          <p className="eyebrow">Cato Manor, Durban · Flame-grilled daily</p>
        </div>

        <h1 className="display-xl text-bone [text-shadow:0_8px_40px_rgba(0,0,0,0.6)]">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.05em]">
              <span
                className={
                  "hero-mask block text-[clamp(3.75rem,14vw,9rem)] " +
                  (i === 1 ? "text-ember" : "")
                }
                style={{ animationDelay: `${0.16 + i * 0.07}s` }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p
            className="hero-rise max-w-md text-[0.9375rem] leading-relaxed text-bone/75 sm:text-lg"
            style={{ animationDelay: "0.22s" }}
          >
            Real meat over real fire. Pick your cut, we throw it on the coals,
            and you eat it hot off the grill with pap, chakalaka and something
            cold from the bar.
          </p>

          <div
            className="hero-rise flex flex-wrap gap-3 sm:gap-4"
            style={{ animationDelay: "0.34s" }}
          >
            <Link
              href="/menu"
              data-cursor="Menu"
              className="rounded-full bg-ember px-7 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone shadow-[0_16px_50px_-14px_rgba(200,16,46,0.8)] transition-colors duration-300 hover:bg-flame sm:px-8"
            >
              View the Menu
            </Link>
            <a
              href={waLink(WA_BOOKING_DEFAULT, whatsappSetting)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Book"
              className="rounded-full border border-bone/50 bg-char/40 px-7 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-flame hover:text-flame sm:px-8 sm:backdrop-blur-sm"
            >
              Book a Table
            </a>
          </div>
        </div>
      </motion.div>

      {/* restaurant info bar */}
      <div
        className="hero-rise relative z-10 border-t border-bone/10 bg-char/80 sm:bg-char/45 sm:backdrop-blur-md"
        style={{ animationDelay: "0.46s" }}
      >
        {/* Phones get one compact line — three stacked rows ate a third of
            the viewport. The full set returns from md up. */}
        <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-5 py-3.5 md:hidden">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-flame"
          />
          <p className="truncate text-[0.8125rem] text-bone/85">
            {statusLabel ?? "Come through"}
          </p>
          <span className="ml-auto shrink-0 text-[0.625rem] uppercase tracking-[0.18em] text-gold">
            Cato Manor
          </span>
        </div>

        <dl className="mx-auto hidden max-w-7xl divide-y divide-bone/10 px-5 sm:px-8 md:flex md:flex-row md:divide-x md:divide-y-0">
          <InfoItem label="Right now" value={statusLabel ?? "Come through"} dot />
          <InfoItem label="Find us" value={address ?? "Cato Manor, Durban"} />
          <InfoItem label="Bookings" value="WhatsApp only" />
        </dl>
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-28 right-6 z-10 hidden flex-col items-center gap-3 sm:flex"
      >
        <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-bone/60 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="scroll-cue-line block h-12 w-px bg-gold" />
      </span>
    </section>
  );
}

function InfoItem({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot?: boolean;
}) {
  return (
    <div className="flex-1 py-4 md:px-6 md:first:pl-0 md:last:pr-0">
      <dt className="text-[0.625rem] uppercase tracking-[0.22em] text-gold">
        {label}
      </dt>
      <dd className="mt-1 flex items-center gap-2 text-sm text-bone/85">
        {dot && (
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-flame"
          />
        )}
        {value}
      </dd>
    </div>
  );
}
