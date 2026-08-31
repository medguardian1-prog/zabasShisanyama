"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import Eyebrow from "@/components/Eyebrow";

/**
 * Used when a featured item has no uploaded photo of its own. Ordered to
 * match the printed menu: braai boards for the four platters, then the
 * client's plated shots for the two plates.
 */
const FALLBACK_IMAGES = [
  "/images/food-07.jpg",
  "/images/food-02.jpg",
  "/images/food-05.jpg",
  "/images/food-06.jpg",
  "/images/plate-beef.jpg",
  "/images/plate-chicken.jpg",
];

/**
 * "From the Fire" — pinned horizontal strip on desktop, native snap-scroll
 * swipe strip on mobile / reduced-motion. Same markup for both.
 */
export default function SignatureStrip({ items }: { items: MenuItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let cancelled = false;
    let teardown: (() => void) | null = null;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          /**
           * Measure from the children's layout boxes, not track.scrollWidth:
           * the track is `overflow: visible` on desktop, and scrollWidth does
           * not include flex content overflowing it — which left the pin
           * ending ~160px short and clipping the last card's price.
           * offsetLeft/offsetWidth are layout-based, so the running x
           * transform does not skew them.
           */
          const distance = () => {
            const first = track.firstElementChild as HTMLElement | null;
            const last = track.lastElementChild as HTMLElement | null;
            if (!first || !last) return 0;
            const content =
              last.offsetLeft + last.offsetWidth - first.offsetLeft;
            return Math.max(0, content - window.innerWidth);
          };
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      );
      // Card images settle after the trigger is created; re-measure so the
      // pin scrolls far enough to clear the last card.
      const images = Array.from(track.querySelectorAll("img"));
      const pending = images.filter((img) => !img.complete);
      let remaining = pending.length;
      const recheck = () => {
        remaining -= 1;
        if (remaining <= 0 && !cancelled) ScrollTrigger.refresh();
      };
      pending.forEach((img) => {
        img.addEventListener("load", recheck, { once: true });
        img.addEventListener("error", recheck, { once: true });
      });
      if (!pending.length) ScrollTrigger.refresh();

      teardown = () => {
        pending.forEach((img) => {
          img.removeEventListener("load", recheck);
          img.removeEventListener("error", recheck);
        });
        mm.revert();
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [items.length]);

  const slides = items.length
    ? items
    : ([] as MenuItem[]);

  return (
    <section
      ref={sectionRef}
      aria-label="Signature dishes from the fire"
      className="overflow-hidden bg-smoke py-20 sm:py-28 lg:py-0"
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory items-start gap-6 overflow-x-auto px-5 sm:px-8 lg:h-screen lg:snap-none lg:items-center lg:overflow-visible lg:px-0"
      >
        {/* intro text panel */}
        <div className="flex w-[80vw] max-w-md shrink-0 snap-start flex-col justify-center lg:w-[38vw] lg:pl-24">
          <Eyebrow className="mb-4">From the Fire</Eyebrow>
          <h2 className="font-display text-3xl uppercase leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
            The dishes people drive across town for
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ash sm:text-base">
            Every plate comes off a real wood fire. Keep scrolling — this is
            the wall of food.
          </p>
          <Link
            href="/menu"
            data-cursor="Menu"
            className="mt-8 inline-block w-fit border border-bone px-6 py-3 text-[0.75rem] uppercase tracking-[0.18em] text-bone transition-colors hover:border-flame hover:text-flame"
          >
            Full Menu
          </Link>
        </div>

        {slides.length
          ? slides.map((item, i) => (
              <StripCard
                key={item.id}
                index={i}
                name={item.name}
                detail={item.description}
                price={formatPrice(item.price)}
                image={item.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                alt={`${item.name} at Zaba's Shisanyama`}
              />
            ))
          : /* honest local fallback until featured items exist in the DB;
               names describe what the photos show — no invented prices */
            FALLBACK_IMAGES.map((src, i) => (
              <StripCard
                key={src}
                index={i}
                name={
                  [
                    "Lamb chops & pap",
                    "Boerewors board",
                    "Grilled wings tray",
                    "Chicken stew plate",
                    "Mixed grill board",
                  ][i]
                }
                detail={
                  [
                    "Lamb chops, steamed bread, chilli relish.",
                    "Wors, roast meat and pap on the board.",
                    "Grilled wings, bread and fresh sides.",
                    "Chicken stew, rice and chakalaka.",
                    "Steak, wings and wors, straight off the coals.",
                  ][i]
                }
                price=""
                image={src}
                alt={
                  [
                    "Grilled lamb chops with steamed pap and chilli relish on a wooden board",
                    "Boerewors coils, roast meat and pap on a wooden serving board",
                    "A takeaway tray of flame-grilled chicken wings with bread and fresh sides",
                    "A plate of chicken stew with rice and sides from the Zaba's kitchen",
                    "A mixed braai board of steak, wings and boerewors on a red table",
                  ][i]
                }
              />
            ))}

        {/* end spacer so the last card is fully clear of the right edge
            before the pin releases and vertical scrolling resumes */}
        <div className="w-6 shrink-0 lg:w-[10vw]" aria-hidden="true" />
      </div>
    </section>
  );
}

function StripCard({
  index,
  name,
  detail,
  price,
  image,
  alt,
}: {
  index: number;
  name: string;
  detail: string | null;
  price: string;
  image: string;
  alt: string;
}) {
  return (
    <article className="group flex w-[78vw] max-w-sm shrink-0 snap-start flex-col lg:w-[26vw]">
      <div className="photo-frame relative aspect-[3/4] border border-hair transition-colors duration-500 group-hover:border-gold/40">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 26vw, 78vw"
          quality={62}
          className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-char/85 via-transparent to-transparent" />
        <span className="absolute left-0 top-5 z-[3] border-l-2 border-gold bg-char/80 py-1.5 pl-3 pr-4 font-display text-sm tracking-[0.1em] text-gold">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      {/* fixed-height caption so every card's title and price line up */}
      <div className="mt-4 flex min-h-[6.5rem] items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg uppercase leading-tight text-bone">
            {name}
          </h3>
          {detail && (
            <p className="mt-1.5 text-sm leading-snug text-ash">{detail}</p>
          )}
        </div>
        {price && (
          <p className="shrink-0 text-sm font-semibold text-ember">{price}</p>
        )}
      </div>
    </article>
  );
}
