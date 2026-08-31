import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import Eyebrow from "@/components/Eyebrow";
import { getSiteSettings } from "@/lib/queries";
import {
  DEFAULT_ADDRESS,
  DEFAULT_MAP_LINK,
  WA_BOOKING_DEFAULT,
  waLink,
  withDefault,
} from "@/lib/site-defaults";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Shisanyama culture at Zaba's — real wood fire, shared boards, and the community around the braai in Cato Manor, Durban.",
  openGraph: {
    title: "Our Story · Zaba's Shisanyama",
    images: ["/images/logo.png"],
  },
};

/**
 * Every caption on this page describes what is actually in its photograph —
 * the counter and its posted trading hours, the boards, the crew in Zaba's
 * shirts, the sign on the building. Nothing about the business is inferred;
 * the one unknown (the founding story) is a marked placeholder.
 */
const STEPS = [
  {
    n: "01",
    title: "Pick your cut",
    note: "Chops, wors, steak and offal in the counter fridge. You choose, they weigh it.",
    image: "/images/venue-butchery.jpg",
    alt: "The butchery counter at Zaba's, its display fridge filled with chops, sausage and cuts of meat",
  },
  {
    n: "02",
    title: "It comes out on a board",
    note: "Charred at the edges, salt on the side, your slip still sitting on the table.",
    image: "/images/food-05.jpg",
    alt: "A wooden board of flame-charred chicken, steak and wors on a red table, till slips beside it",
  },
  {
    n: "03",
    title: "Everybody reaches in",
    note: "Hands, not cutlery. You carve as you go and nobody leaves hungry.",
    image: "/images/food-06.jpg",
    alt: "Several hands carving and taking grilled meat from a shared wooden board",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const address = withDefault(settings?.address, DEFAULT_ADDRESS);
  const mapLink = withDefault(settings?.mapLink, DEFAULT_MAP_LINK);

  return (
    <div className="pt-16 sm:pt-20">
      {/* ------------------------------- lead ------------------------------- */}
      <Section tone="char" className="!pb-14 sm:!pb-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-7" data-reveal-group>
            <div data-reveal className="mb-5 flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              <Eyebrow>Our Story</Eyebrow>
            </div>

            {/* The descender room belongs on the heading, not the mask: with
                display leading at 0.95 the glyphs overflow the line box, and
                padding on the clipping parent would let the hidden state peek
                out from under the mask. */}
            <div className="overflow-hidden">
              <h1
                data-mask
                className="display-xl pb-2 text-[2.9rem] text-bone sm:pb-3 sm:text-6xl lg:text-7xl"
              >
                Burn the meat, feed the people
              </h1>
            </div>

            <p
              data-reveal
              className="mt-7 max-w-xl text-[0.9375rem] leading-relaxed text-ash sm:text-lg"
            >
              That is the whole idea, translated straight out of isiZulu. A
              shisanyama is the butcher, the fire and the chill spot rolled
              into one — and Zaba&rsquo;s runs all three, every day, in Cato
              Manor.
            </p>

            <dl
              data-reveal
              className="mt-10 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-hair bg-hair"
            >
              {/* Two words per cell: at 320px each cell is ~92px wide, and
                  anything longer wraps to three cramped lines. */}
              {[
                ["Fire", "Wood coals"],
                ["Board", "Shared, always"],
                ["Bar", "Cold drinks"],
              ].map(([k, v]) => (
                <div key={k} className="bg-smoke px-3 py-4 sm:px-4 sm:py-5">
                  <dt className="label-mono text-gold">{k}</dt>
                  <dd className="mt-2 text-[0.8125rem] leading-snug text-bone sm:text-sm">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <figure>
              <div
                data-reveal-image
                className="photo-frame relative aspect-[4/5] rounded-2xl border border-hair"
              >
                <Image
                  src="/images/team-braai.jpg"
                  alt="A man in a Zaba's Shisanyama shirt laughing behind the brick braai as smoke rises off the coals"
                  fill
                  /* Above the fold on this route — carries the LCP. */
                  priority
                  quality={80}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 z-[2] h-2/5 bg-gradient-to-t from-char/85 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 z-[3] p-5 sm:p-6">
                  <p className="label-mono text-gold">
                    The man behind the coals
                  </p>
                </figcaption>
              </div>
            </figure>
          </div>
        </div>
      </Section>

      {/* ------------------------------ the story ---------------------------- */}
      <Section tone="smoke">
        <div className="grid gap-7 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            {/* Sticky only where there is column height to be sticky in. The
                standfirst detail is desktop-only — on a phone it is just a
                third of a screen between the reader and the story. */}
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-4">
                <Eyebrow className="shrink-0">Shisanyama, explained</Eyebrow>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-hair lg:hidden"
                />
              </div>
              <div className="rule mt-5 hidden max-w-[8rem] lg:block" />
              <p className="mt-5 hidden text-[0.8125rem] leading-relaxed text-ash lg:block">
                Cato Manor, Durban
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6" data-reveal-group>
            <p
              data-reveal
              className="dropcap text-[1.0625rem] leading-[1.75] text-ash sm:text-lg sm:leading-[1.8]"
            >
              Shisanyama means &ldquo;burn the meat&rdquo;, and in townships
              across South Africa it means far more than a grill. You choose
              your meat at the counter, it goes straight onto the coals, and
              you eat it with your hands at a long table full of people you
              came with and people you have only just met.
            </p>

            <blockquote data-reveal className="my-10 border-l-2 border-ember pl-6 sm:my-12 sm:pl-8">
              <p className="display-xl text-[1.75rem] leading-[1.2] text-bone sm:text-[2.25rem]">
                The butcher, the fire and the chill spot — rolled into one.
              </p>
            </blockquote>

            <p
              data-reveal
              className="text-[1.0625rem] leading-[1.75] text-ash sm:text-lg sm:leading-[1.8]"
            >
              At Zaba&rsquo;s we keep it the way it is supposed to be. Real
              wood fire, meat cut generously, pap and chakalaka on the side,
              music on, and nobody rushing you out the door. Weekends are
              loud. That is the point.
            </p>

            {/* The Zaba's-specific history — founding year, founder,
                neighbourhood — is client-supplied. Tracked in
                CONTENT-TODO.md. Delete this block the day the copy lands. */}
            <aside
              data-reveal
              className="mt-10 rounded-2xl border border-dashed border-hair bg-char/50 px-5 py-6 sm:px-7"
            >
              <p className="label-mono text-ash/70">TODO — client copy</p>
              <p className="mt-3 text-sm leading-relaxed text-ash sm:text-base">
                The Zaba&rsquo;s chapter belongs here: who started it, when,
                and where it all began.
              </p>
            </aside>
          </div>
        </div>
      </Section>

      {/* ------------------------------ how it goes -------------------------- */}
      <Section tone="char">
        <SectionHeading eyebrow="How it goes" title="Counter, board, table" />
        <ol className="grid gap-10 sm:gap-8 md:grid-cols-3" data-reveal-group>
          {STEPS.map((s) => (
            <li key={s.n} data-reveal>
              <div
                data-reveal-image
                className="photo-frame relative aspect-[4/5] rounded-2xl border border-hair"
              >
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  quality={78}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-5 flex items-baseline gap-4">
                <span className="label-mono text-ember">{s.n}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-hair" />
              </div>
              <h3 className="display-xl mt-3 text-2xl text-bone sm:text-[1.75rem]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{s.note}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* -------------------------------- the crew --------------------------- */}
      <Section tone="smoke">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-5" data-reveal-group>
            <Eyebrow data-reveal className="mb-4">
              The crew
            </Eyebrow>
            <div className="overflow-hidden">
              <h2
                data-mask
                className="display-xl pb-2 text-[2.5rem] sm:pb-3 sm:text-5xl"
              >
                Someone is always at the fire
              </h2>
            </div>
            <p
              data-reveal
              className="mt-6 text-[0.9375rem] leading-relaxed text-ash sm:text-base"
            >
              The braai runs on people, not machines — tongs in hand, black
              Zaba&rsquo;s shirts, and a running commentary you get for free
              with your order.
            </p>
          </div>

          <figure className="lg:col-span-7">
            <div
              data-reveal-image
              className="photo-frame relative aspect-[4/5] rounded-2xl border border-hair sm:aspect-[3/2]"
            >
              {/* The source is portrait and the crew sit low in the frame, so
                  the wide crop is anchored below centre to keep faces in. */}
              <Image
                src="/images/team-crew.jpg"
                alt="Three Zaba's Shisanyama staff in branded shirts standing at the brick braai, one holding tongs"
                fill
                quality={78}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-[center_55%]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 z-[2] h-1/3 bg-gradient-to-t from-char/85 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 z-[3] p-5 sm:p-6">
                <p className="label-mono text-gold">Tongs down, hands up</p>
              </figcaption>
            </div>
          </figure>
        </div>
      </Section>

      {/* --------------------------------- close ----------------------------- */}
      <Section tone="char">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <figure className="lg:col-span-5">
            <div
              data-reveal-image
              className="photo-frame relative aspect-[4/3] rounded-2xl border border-hair lg:aspect-[4/5]"
            >
              <Image
                src="/images/venue-sign.jpg"
                alt="The Zaba's Shisanyama sign mounted on the brick face of the building"
                fill
                quality={78}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </figure>

          <div className="lg:col-span-6 lg:col-start-7" data-reveal-group>
            <Eyebrow data-reveal className="mb-4">
              Taste it yourself
            </Eyebrow>
            <div className="overflow-hidden">
              <h2
                data-mask
                className="display-xl pb-2 text-[2.75rem] sm:pb-3 sm:text-5xl lg:text-[3.5rem]"
              >
                The fire&rsquo;s already going
              </h2>
            </div>

            <p data-reveal className="mt-6 text-[0.9375rem] leading-relaxed text-ash sm:text-base">
              Come find us — the sign is hard to miss.
            </p>

            <address
              data-reveal
              className="mt-6 not-italic text-[0.9375rem] leading-relaxed text-bone sm:text-base"
            >
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Map"
                className="tap-target transition-colors duration-300 hover:text-flame"
              >
                {address}
              </a>
            </address>

            {/* Full-width stack on a phone: the labels are too wide to sit
                side by side at 375px, and two ragged pills read as a mistake. */}
            <div
              data-reveal
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
            >
              <Link
                href="/menu"
                data-cursor="Menu"
                className="rounded-full bg-ember px-7 py-4 text-center text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:bg-flame sm:px-8"
              >
                View the Menu
              </Link>
              <a
                href={waLink(WA_BOOKING_DEFAULT, settings?.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Book"
                className="rounded-full border border-bone/40 px-7 py-4 text-center text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-flame hover:text-flame sm:px-8"
              >
                Book a Table
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
