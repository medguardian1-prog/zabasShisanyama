"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only 72px pill cursor. Follows the pointer via gsap.quickTo and
 * blooms from scale 0 over card links and [data-cursor] elements. Gated
 * behind (pointer: fine) and reduced-motion.
 */
export default function GalleryCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("View");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!fine || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;

    let cancelled = false;
    let teardown: (() => void) | null = null;

    (async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      const onOver = (e: PointerEvent) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>(
          "[data-cursor]"
        );
        if (target) {
          setLabel(target.dataset.cursor || "View");
          gsap.to(el, {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(1.6)",
          });
        } else {
          gsap.to(el, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power3.out",
          });
        }
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
      className="pointer-events-none fixed left-0 top-0 z-[90] flex h-[72px] w-[72px] scale-0 items-center justify-center bg-ember text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-bone opacity-0"
      style={{ willChange: "transform", marginLeft: -36, marginTop: -36 }}
    >
      {label}
    </div>
  );
}
