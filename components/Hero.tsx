"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LINES = ["Meat.", "Fire.", "Family."];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const copyY = useTransform(scrollYProgress, [0, 0.55], ["0%", "-30%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const panelY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-char"
    >
      {/* ambient backdrop — heavily blurred + darkened so the small source
          photo becomes a colour field instead of a stretched thumbnail */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={reduced ? undefined : { scale: bgScale, y: bgY }}
        initial={reduced ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <Image
          src="/images/food-05.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover blur-2xl brightness-[0.5] saturate-[1.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-char via-char/70 to-char/40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 22% 78%, rgba(200,16,46,0.22) 0%, transparent 55%), radial-gradient(60% 50% at 85% 30%, rgba(232,84,31,0.1) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* entrance fade: cover fades out so the backdrop paints immediately */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-char"
        initial={reduced ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.6, ease: EASE }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-36 sm:px-8 sm:pb-24 lg:pb-28">
        <div className="grid items-end gap-14 lg:grid-cols-12">
          {/* type block */}
          <motion.div
            className="lg:col-span-7"
            style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
          >
            <motion.div
              className="mb-7 flex items-center gap-4"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            >
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <p className="eyebrow">Shisanyama · Braai · Chillas</p>
            </motion.div>

            <h1 className="font-display uppercase leading-[0.92] tracking-[0.01em] text-bone">
              {LINES.map((line, i) => (
                <span
                  key={line}
                  className="block overflow-hidden pb-[0.06em]"
                >
                  <motion.span
                    className={
                      "block text-[clamp(3.5rem,13vw,9.5rem)] " +
                      (i === 1 ? "text-ember" : "")
                    }
                    initial={reduced ? false : { y: "112%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.15,
                      delay: 0.5 + i * 0.12,
                      ease: EASE,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="mt-7 max-w-md text-base leading-relaxed text-ash sm:text-lg"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
            >
              Real meat over real fire. Pull up a chair, order off the grill,
              and stay for the vibe — this is how we braai.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.25, ease: EASE }}
            >
              <Link
                href="/menu"
                data-cursor="Menu"
                className="group relative overflow-hidden bg-ember px-8 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone shadow-[0_12px_40px_-12px_rgba(200,16,46,0.7)] transition-colors duration-300 hover:bg-flame"
              >
                View the Menu
              </Link>
              <Link
                href="/contact"
                data-cursor="Book"
                className="border border-bone/50 px-8 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone backdrop-blur-sm transition-colors duration-300 hover:border-flame hover:text-flame"
              >
                Book a Table
              </Link>
            </motion.div>
          </motion.div>

          {/* framed photo panel — shown near its native size so it stays sharp */}
          <motion.div
            className="hidden lg:col-span-4 lg:col-start-9 lg:block"
            style={reduced ? undefined : { y: panelY }}
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.9, ease: EASE }}
          >
            <figure className="frame-offset">
              <div className="photo-frame relative aspect-[4/5] border border-hair">
                <Image
                  src="/images/food-05.jpg"
                  alt="A loaded braai board of flame-grilled steak, chicken wings and boerewors on a red slatted table at Zaba's"
                  fill
                  priority
                  sizes="(min-width: 1024px) 30vw, 0px"
                  className="object-cover"
                />
                <div className="absolute inset-0 z-[2] bg-gradient-to-t from-char/60 via-transparent to-transparent" />
              </div>
              <figcaption className="mt-4 flex items-center justify-between text-[0.6875rem] uppercase tracking-[0.22em] text-ash">
                <span>Off the fire, daily</span>
                <span className="text-gold">Zaba&rsquo;s</span>
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-10 right-6 z-10 hidden flex-col items-center gap-3 sm:flex"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        aria-hidden="true"
      >
        <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-ash [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="scroll-cue-line block h-12 w-px bg-gold" />
      </motion.div>
    </section>
  );
}
