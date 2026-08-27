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

const HEADLINE = "Meat. Fire. Family.";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const copyY = useTransform(scrollYProgress, [0, 0.55], ["0%", "-30%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const words = HEADLINE.split(" ");

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-char"
    >
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { scale: imageScale, y: imageY }}
        initial={reduced ? false : { opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: EASE }}
      >
        <Image
          src="/images/food-05.jpg"
          alt="A loaded braai board of flame-grilled steak, chicken wings and boerewors on a red slatted table at Zaba's"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* bottom-weighted scrim + subtle ember vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-char via-char/55 to-char/20" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 100%, rgba(200,16,46,0.18) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-40 sm:px-8 sm:pb-32"
        style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <motion.p
          className="eyebrow mb-5"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
        >
          Shisanyama · Braai · Chillas
        </motion.p>

        <h1 className="font-display text-4xl uppercase leading-[1.08] text-bone sm:text-6xl lg:text-7xl">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1">
              <motion.span
                className="inline-block"
                initial={reduced ? false : { y: "112%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.5 + i * 0.07,
                  ease: EASE,
                }}
              >
                {word}
              </motion.span>
              {i < words.length - 1 && <span>&nbsp;</span>}
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-ash sm:text-lg"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
        >
          Real meat over real fire. Pull up a chair, order off the grill, and
          stay for the vibe — this is how we braai.
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
            className="bg-ember px-8 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:bg-flame"
          >
            View the Menu
          </Link>
          <Link
            href="/contact"
            data-cursor="Book"
            className="border border-bone px-8 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-flame hover:text-flame"
          >
            Book a Table
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-6 z-10 hidden flex-col items-center gap-3 sm:flex"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
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
