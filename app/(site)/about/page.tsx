import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Shisanyama culture at Zaba's — real wood fire, shared boards, and the community around the braai.",
  openGraph: {
    title: "Our Story · Zaba's Shisanyama",
    images: ["/images/logo.jpg"],
  },
};

export default function AboutPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <Section tone="char">
        <div className="max-w-3xl">
          <SectionHeading eyebrow="Our Story" title="Burn the meat, feed the people" />
          <div className="space-y-6 text-base leading-relaxed text-ash sm:text-lg" data-reveal-group>
            <p data-reveal>
              Shisanyama is isiZulu for &ldquo;burn the meat&rdquo; — and in
              townships across South Africa it means much more than a grill.
              It&rsquo;s the butcher, the fire and the chill spot rolled into
              one: you choose your meat, it goes straight onto the coals, and
              you eat it with your hands at a long table full of people you
              came with and people you just met.
            </p>
            <p data-reveal>
              At Zaba&rsquo;s, we keep it the way it&rsquo;s supposed to be.
              Real wood fire, meat cut generously, pap and chakalaka on the
              side, music on, and nobody rushing you out the door. Weekends
              are loud. That&rsquo;s the point.
            </p>
            <p data-reveal>
              {/* Zaba's-specific history — founding year, founder, neighbourhood — is client-supplied */}
              TODO — the Zaba&rsquo;s story: who started it, when, and where
              it all began.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="smoke">
        <div className="grid gap-8 md:grid-cols-2">
          <figure>
            <div data-reveal-image className="relative aspect-[4/3] overflow-hidden bg-char">
              <Image
                src="/images/food-06.jpg"
                alt="Hands carving ribs and grilled meat on a shared wooden board"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-[0.6875rem] uppercase tracking-[0.22em] text-ash">
              Shared, always
            </figcaption>
          </figure>
          <figure className="md:mt-16">
            <div data-reveal-image className="relative aspect-[3/4] overflow-hidden bg-char">
              <Image
                src="/images/food-01.webp"
                alt="Friends sharing a pile of flame-grilled chicken and ribs on a wooden board"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-[0.6875rem] uppercase tracking-[0.22em] text-ash">
              Come hungry, leave happy
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section tone="char">
        <div className="mx-auto max-w-2xl text-center" data-reveal-group>
          <p className="eyebrow mb-4" data-reveal>
            Taste it yourself
          </p>
          <div className="overflow-hidden">
            <h2
              data-mask
              className="font-display text-3xl uppercase leading-[1.08] sm:text-4xl"
            >
              The fire&rsquo;s already going
            </h2>
          </div>
          <div className="mt-10" data-reveal>
            <Link
              href="/menu"
              data-cursor="Menu"
              className="inline-block bg-ember px-8 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:bg-flame"
            >
              View the Menu
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
