"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only cursor accent: a small ember flame that blooms over cards and
 * links. Gated behind (pointer: fine) and reduced-motion.
 */
export default function GalleryCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (fine && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;

    let cancelled = false;
    let teardown: (() => void) | null = null;

    (async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      const onOver = (e: PointerEvent) => {
        const hit = (e.target as HTMLElement).closest("[data-cursor]");
        gsap.to(el, {
          scale: hit ? 1 : 0,
          opacity: hit ? 1 : 0,
          duration: hit ? 0.4 : 0.25,
          ease: hit ? "back.out(2)" : "power3.out",
        });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });

      teardown = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] flex h-10 w-10 scale-0 items-center justify-center opacity-0"
      style={{ willChange: "transform", marginLeft: -20, marginTop: -20 }}
    >
      <span
        className="absolute inset-0 rounded-full blur-md"
        style={{ background: "rgba(232,84,31,0.55)" }}
      />
      <svg
        viewBox="0 0 24 24"
        className="relative h-6 w-6 drop-shadow-[0_0_6px_rgba(232,84,31,0.9)]"
        aria-hidden="true"
      >
        <path
          fill="#F5F1EA"
          d="M13.4 2.1c.3 2.6-.7 4.3-2.2 5.8-1.6 1.6-3.5 3-3.5 5.9a5.3 5.3 0 0 0 10.6.3c0-1.9-.7-3.2-1.6-4.5.2 1-.2 2-.9 2.6.2-2.6-.9-4.6-2.4-6.2.4-1.3.4-2.6 0-3.9Z"
        />
        <path
          fill="#E8541F"
          d="M12.2 12.3c1 .9 1.6 2 1.6 3.1a2.4 2.4 0 0 1-4.8.1c0-1.3.9-2 1.6-2.8.4-.4.8-.9 1-1.5.3.4.5.7.6 1.1Z"
        />
      </svg>
    </div>
  );
}
