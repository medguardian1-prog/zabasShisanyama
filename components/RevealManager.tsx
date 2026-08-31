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
 *   data-reveal-image  curtain clip-path reveal (fine pointers) / fade (touch)
 *   data-parallax      scrubbed drift, strength = attribute value in %
 *
 * Hidden initial states live in CSS behind `html.gsap-ready`, added here on
 * mount — no-JS and reduced-motion visitors always see full content.
 *
 * Cost model: opacity and small translates are cheap everywhere, so the text
 * vocabulary runs on every device. Clip-path curtains and scrubbed parallax
 * are not — see the matchMedia blocks below.
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
      });

      const mm = gsap.matchMedia();

      /**
       * Hand a finished photo back to CSS.
       *
       * The hidden states are CSS rules gated on `:not([data-revealed])`, so
       * stamping the attribute is what actually releases them — only then is
       * it safe to drop the inline styles GSAP was animating. Clearing them
       * while the rules still matched used to snap the photo back to its
       * starting scale and leave it there, permanently over-zoomed.
       */
      const settle = (el: HTMLElement, img: Element | null) => {
        el.setAttribute("data-revealed", "");
        gsap.set(el, { clearProps: "opacity,transform,clipPath,willChange" });
        // Dropping the inline transform is what lets the CSS hover zoom win.
        if (img) gsap.set(img, { clearProps: "transform,willChange" });
      };

      // Fine pointers: the curtain. Animating clip-path over a CSS-filtered
      // photo forces a full re-raster of that image every frame — affordable
      // on a desktop GPU, and the settle-scale rides along with it.
      mm.add("(pointer: fine)", () => {
        document
          .querySelectorAll<HTMLElement>("[data-reveal-image]")
          .forEach((el) => {
            const img = el.querySelector("img");
            const tl = gsap.timeline({
              scrollTrigger: { trigger: el, start: "top 85%" },
              onComplete: () => settle(el, img),
            });
            tl.to(el, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.25,
              ease: "power4.inOut",
            });
            if (img) {
              tl.to(
                img,
                { scale: 1, duration: 1.6, ease: "power3.out" },
                "<0.05"
              );
            }
          });
      });

      /**
       * Touch: rise, fade and settle — the same three beats as the curtain,
       * built only from opacity and transform.
       *
       * Those two are the properties a compositor can animate without going
       * back to the rasteriser, so this costs a fraction of the clip-path
       * version while still reading as a deliberate reveal. `will-change`
       * promotes the photo for the duration so the settle-scale is a layer
       * transform rather than a re-raster at every step, and it is dropped
       * the moment the tween lands — a layer left alive on every photo is its
       * own scrolling cost.
       */
      mm.add("(pointer: coarse)", () => {
        document
          .querySelectorAll<HTMLElement>("[data-reveal-image]")
          .forEach((el) => {
            const img = el.querySelector("img");
            const tl = gsap.timeline({
              scrollTrigger: { trigger: el, start: "top 88%" },
              // Promote on the way in, not at setup. The gallery holds twelve
              // of these; hinting them all at first paint would pin twelve
              // full-width GPU layers for the life of the page, which costs
              // more than the repaint it avoids. Only what is mid-reveal
              // needs a layer, and settle() hands it straight back.
              onStart: () => {
                gsap.set(el, { willChange: "opacity, transform" });
                if (img) gsap.set(img, { willChange: "transform" });
              },
              onComplete: () => settle(el, img),
            });
            tl.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
            });
            if (img) {
              tl.to(img, { scale: 1, duration: 1.4, ease: "power2.out" }, "<");
            }
          });
      });

      // Parallax is a scrubbed transform: work on every scroll frame for the
      // whole time the element is on screen. It only earns that on a desktop
      // pointer at a width where the drift is actually visible.
      mm.add("(pointer: fine) and (min-width: 1024px)", () => {
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

      teardown = () => {
        mm.revert();
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [pathname]);

  return null;
}
