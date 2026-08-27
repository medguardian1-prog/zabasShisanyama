"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import Eyebrow from "@/components/Eyebrow";

gsap.registerPlugin(ScrollTrigger);

/** Local fallbacks when no featured items carry uploaded photos yet. */
const FALLBACK_IMAGES = [
  "/images/food-07.jpg",
  "/images/food-02.jpg",
  "/images/food-03.jpg",
  "/images/food-04.jpg",
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

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const distance = () => track.scrollWidth - window.innerWidth;
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
    return () => mm.revert();
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
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 sm:px-8 lg:h-screen lg:snap-none lg:items-center lg:overflow-visible lg:px-0"
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
                    "Lamb chops & steamed bread",
                    "Boerewors & pap board",
                    "Grilled wings tray",
                    "Chicken stew plate",
                  ][i]
                }
                detail="Straight off the fire."
                price=""
                image={src}
                alt={
                  [
                    "Grilled lamb chops with steamed bread and chilli relish on a wooden board",
                    "Boerewors coils, roast meat and pap on a wooden serving board",
                    "A takeaway tray of flame-grilled chicken wings with bread and fresh sides",
                    "A plate of chicken stew with rice and sides from the Zaba's kitchen",
                  ][i]
                }
              />
            ))}

        {/* end spacer so the last card clears the pin */}
        <div className="w-6 shrink-0 lg:w-24" aria-hidden="true" />
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
    <article className="group w-[78vw] max-w-sm shrink-0 snap-start lg:w-[26vw]">
      <div className="relative aspect-[3/4] overflow-hidden bg-char">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 26vw, 78vw"
          className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-char/85 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 text-[0.6875rem] tracking-[0.22em] text-gold">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg uppercase text-bone">{name}</h3>
          {detail && <p className="mt-1 text-sm text-ash">{detail}</p>}
        </div>
        {price && <p className="shrink-0 text-sm font-semibold text-ember">{price}</p>}
      </div>
    </article>
  );
}
