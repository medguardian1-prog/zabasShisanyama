"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global scroll-reveal vocabulary. Page authors annotate markup with data
 * attributes; nobody writes animation code in pages.
 *
 *   data-reveal        fade + 14px drift up
 *   data-reveal-group  staggers all [data-reveal] children
 *   data-mask          heading slides up out of an overflow-hidden parent
 *   data-reveal-image  curtain clip-path reveal + settle scale
 *   data-parallax      scrubbed drift, strength = attribute value in %
 *
 * Hidden initial states live in CSS behind `html.gsap-ready`, added here on
 * mount — no-JS and reduced-motion visitors always see full content.
 */
export default function RevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;
    let teardown: (() => void) | null = null;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      document.documentElement.classList.add("gsap-ready");
      ScrollTrigger.config({ ignoreMobileResize: true });

      const ctx = gsap.context(() => {
      const grouped = new Set<Element>();

      document
        .querySelectorAll<HTMLElement>("[data-reveal-group]")
        .forEach((group) => {
          const items = group.querySelectorAll<HTMLElement>("[data-reveal]");
          items.forEach((el) => grouped.add(el));
          if (!items.length) return;
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.09,
            scrollTrigger: { trigger: group, start: "top 85%" },
          });
        });

      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (grouped.has(el)) return;
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      document.querySelectorAll<HTMLElement>("[data-mask]").forEach((el) => {
        gsap.to(el, {
          yPercent: 0,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      document
        .querySelectorAll<HTMLElement>("[data-reveal-image]")
        .forEach((el) => {
          const img = el.querySelector("img");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
          tl.to(el, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.25,
            ease: "power4.inOut",
          });
          if (img) {
            tl.to(
              img,
              {
                scale: 1,
                duration: 1.6,
                ease: "power3.out",
                onComplete: () => {
                  // restore CSS hover zoom after the reveal settles
                  gsap.set(img, { clearProps: "transform" });
                },
              },
              "<0.05"
            );
          }
        });

      document
        .querySelectorAll<HTMLElement>("[data-parallax]")
        .forEach((el) => {
          const strength = parseFloat(el.dataset.parallax || "") || 8;
          gsap.fromTo(
            el,
            { yPercent: -strength },
            {
              yPercent: strength,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });

      teardown = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [pathname]);

  return null;
}
