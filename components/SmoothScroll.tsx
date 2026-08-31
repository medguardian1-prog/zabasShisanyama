"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One Lenis instance driven by GSAP's ticker — a single clock for both
 * libraries. Separate RAF loops cause ScrollTrigger pin jitter.
 *
 * Lenis and GSAP are imported dynamically inside the effect so they stay out
 * of the initial bundle; the page is fully usable (native scroll) until they
 * arrive.
 *
 * Touch devices skip Lenis entirely. Its `syncTouch` default is false, so it
 * never drives the scroll on a phone anyway — it only observes it, costing a
 * listener and a tick every frame for no visual gain. Native momentum is
 * already the smoother option there, and ScrollTrigger falls back to its own
 * scroll listener without it.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    let cancelled = false;
    let teardown: (() => void) | null = null;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      teardown = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return <>{children}</>;
}
