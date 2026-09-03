"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@/lib/types";
import Eyebrow from "@/components/Eyebrow";

/**
 * Photo for each featured dish, keyed by the menu item's name.
 *
 * Matched by NAME, not by card position. The previous version indexed a flat
 * list by the order cards happened to render in, so whenever the featured set
 * or the order the database returned changed, dishes silently got somebody
 * else's photo -- which is how "Phuthu & Chicken" ended up showing a board of
 * chops. Keyed lookup cannot drift like that.
 *
 * The platters are graded by size on purpose: the photos get progressively
 * fuller from 1 to 6, matching what the descriptions promise.
 *
 * Keys are lowercased and trimmed at lookup, so a staff member renaming an
 * item to "Platter For 2" still matches.
 */
const DISH_PHOTOS: Record<
  string,
  { src: string; alt: string; detail?: string }
> = {
  "platter for 1": {
    src: "/images/food-05.jpg",
    alt: "Grilled pork chops and ribs with a dish of phuthu, tomato salsa and chakalaka on a wooden board",
  },
  "platter for 2": {
    src: "/images/food-06.jpg",
    alt: "Flame-grilled chicken wings and beef ribs with pap and a tray of fresh salads on a wooden board",
  },
  "platter for 4": {
    src: "/images/food-02.jpg",
    alt: "A coil of boerewors with beef ribs, chops and grilled chicken wings on a wooden board",
  },
  "platter for 6": {
    src: "/images/food-07.jpg",
    alt: "A loaded braai board of beef ribs, chops and chicken wings with pap, three salads and thick-sliced bread",
  },
  "phuthu & beef": {
    src: "/images/plate-beef.jpg",
    alt: "Beef stew with pap, chakalaka, coleslaw, butternut and tomato salsa on a white plate",
    detail: "Beef with pap, chakalaka and fresh salads.",
  },
  "phuthu & chicken": {
    src: "/images/plate-chicken.jpg",
    alt: "A grilled chicken portion with creamy samp, beetroot and a tray of fresh sides",
    detail: "Grilled chicken with creamy samp and fresh salads.",
  },
};

/**
 * Last resort for a dish that is featured but has neither its own uploaded
 * photo nor an entry above -- a new item staff added themselves. Generic braai
 * boards only, so the picture is never actively wrong about the dish.
 */
const GENERIC_PHOTOS = [
  {
    src: "/images/food-07.jpg",
    alt: "A braai board of grilled meat with pap and salads at Zaba's Shisanyama",
  },
  {
    src: "/images/food-02.jpg",
    alt: "Boerewors, ribs and grilled meat on a wooden board at Zaba's Shisanyama",
  },
  {
    src: "/images/food-06.jpg",
    alt: "Flame-grilled wings and ribs with pap and salads at Zaba's Shisanyama",
  },
];

/**
 * Photo + accurate alt for a dish.
 *
 * A genuine staff upload always wins. But a stored path beginning `/images/`
 * is NOT a staff upload -- it is a leftover from the first-run menu import,
 * which copied whatever mapping default-menu.ts happened to have at the time.
 * Those stale rows are part of what put the wrong photo on a dish, and staff
 * have no obvious way to notice or clear them, so the curated mapping above
 * takes precedence over them. Real uploads live on Supabase storage and are
 * absolute URLs, so the two are easy to tell apart.
 */
function photoFor(
  name: string,
  uploaded: string | null,
  index: number
): { src: string; alt: string; detail?: string } {
  if (uploaded && !uploaded.startsWith("/images/")) {
    // Staff chose this photo themselves; we cannot describe what is in it.
    return { src: uploaded, alt: `${name} at Zaba's Shisanyama` };
  }
  const curated = DISH_PHOTOS[name.trim().toLowerCase()];
  if (curated) return curated;
  if (uploaded) return { src: uploaded, alt: `${name} at Zaba's Shisanyama` };
  return GENERIC_PHOTOS[index % GENERIC_PHOTOS.length];
}

/**
 * Shown only before any featured items exist in the database. These describe
 * the photographs rather than quoting the menu, so they can never contradict
 * what is actually printed on the board or priced at the counter.
 */
const LOCAL_DISHES = [
  {
    name: "Chops & phuthu",
    detail: "Pork chops and ribs with phuthu, tomato salsa and chakalaka.",
    photo: DISH_PHOTOS["platter for 1"],
  },
  {
    name: "Wings & ribs",
    detail: "Flame-grilled chicken wings and beef ribs with pap and salads.",
    photo: DISH_PHOTOS["platter for 2"],
  },
  {
    name: "Wors board",
    detail: "A coil of boerewors with ribs, chops and grilled wings.",
    photo: DISH_PHOTOS["platter for 4"],
  },
  {
    name: "The full board",
    detail: "Ribs, chops and wings with pap, three salads and thick bread.",
    photo: DISH_PHOTOS["platter for 6"],
  },
  {
    name: "Beef & pap",
    detail: "Beef stew with pap, chakalaka, coleslaw and fresh sides.",
    photo: DISH_PHOTOS["phuthu & beef"],
  },
  {
    name: "Chicken & samp",
    detail: "Grilled chicken with creamy samp, beetroot and fresh sides.",
    photo: DISH_PHOTOS["phuthu & chicken"],
  },
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
           * ending ~160px short and clipping the last card.
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
            className="mt-8 inline-block w-fit rounded-full border border-bone px-6 py-3 text-[0.75rem] uppercase tracking-[0.18em] text-bone transition-colors hover:border-flame hover:text-flame"
          >
            Full Menu
          </Link>
        </div>

        {slides.length
          ? slides.map((item, i) => {
              const photo = photoFor(item.name, item.image, i);
              return (
                <StripCard
                  key={item.id}
                  index={i}
                  name={item.name}
                  detail={item.description || photo.detail || null}
                  image={photo.src}
                  alt={photo.alt}
                />
              );
            })
          : /* Honest local fallback until featured items exist in the DB.
               Names and descriptions describe the photos themselves, so
               nothing here can contradict the printed menu. */
            LOCAL_DISHES.map((dish, i) => (
              <StripCard
                key={dish.name}
                index={i}
                name={dish.name}
                detail={dish.detail}
                image={dish.photo.src}
                alt={dish.photo.alt}
              />
            ))}

        {/* end spacer so the last card is fully clear of the right edge
            before the pin releases and vertical scrolling resumes */}
        <div className="w-6 shrink-0 lg:w-[10vw]" aria-hidden="true" />
      </div>
    </section>
  );
}

/**
 * No price here on purpose. This strip is a taster, not the menu -- prices
 * change and not every featured dish is priced on the board, so showing one
 * here risks contradicting the counter. The Full Menu link carries the prices.
 */
function StripCard({
  index,
  name,
  detail,
  image,
  alt,
}: {
  index: number;
  name: string;
  detail: string | null;
  image: string;
  alt: string;
}) {
  return (
    <article className="group flex w-[78vw] max-w-sm shrink-0 snap-start flex-col lg:w-[26vw]">
      <div className="photo-frame relative rounded-2xl aspect-[3/4] border border-hair transition-colors duration-500 group-hover:border-gold/40">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 26vw, 78vw"
          quality={62}
          className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-char/85 via-transparent to-transparent" />
        <span className="absolute left-0 top-5 z-[3] border-l-2 border-gold bg-char/80 py-1.5 pl-3 pr-4 label-mono text-gold">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      {/* fixed height so every card's title sits on the same line */}
      <div className="mt-4 min-h-[6.5rem]">
        <h3 className="display-xl text-xl text-bone">{name}</h3>
        {detail && (
          <p className="mt-1.5 text-sm leading-snug text-ash">{detail}</p>
        )}
      </div>
    </article>
  );
}
