import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import EventCard from "@/components/EventCard";
import Eyebrow from "@/components/Eyebrow";
import { getEvents, getSiteSettings } from "@/lib/queries";
import { waLink } from "@/lib/site-defaults";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Live music, big nights and a full concert stage at Zaba's Shisanyama in Cato Manor, Durban — including Durban's Summer Dance.",
  openGraph: {
    title: "Events · Zaba's Shisanyama",
    images: ["/images/logo.png"],
  },
};

/**
 * Everything stated here is verifiable from the client's own event
 * photography: the printed poster (date, venue, ticketing) and the sponsor
 * board carried on each frame. Nothing is inferred.
 */
const PARTNERS = [
  "Inamandla Entertainment",
  "Durban Tourism",
  "Red Bull",
  "Martell",
  "Fitch & Leedes",
  "Zaba's Legacy",
];

const SPACES = [
  {
    image: "/images/venue-terrace.jpg",
    alt: "Velvet tub chairs around a low table on the covered terrace at Zaba's",
    title: "The terrace",
    note: "Velvet seating under cover, open to the yard.",
  },
  {
    image: "/images/venue-music-bar.jpg",
    alt: "White leather couches facing the Food, Music, Bar backdrop at Zaba's",
    title: "The lounge",
    note: "Couch seating for a group, right by the sound.",
  },
  {
    image: "/images/venue-tables.jpg",
    alt: "Round tables and chairs with ice buckets in the main bar area at Zaba's",
    title: "The bar floor",
    note: "Tables, ice buckets and the main bar.",
  },
  {
    image: "/images/venue-lounge.jpg",
    alt: "White couches and a rug in a private lounge area at Zaba's",
    title: "Private corner",
    note: "A quieter set-up for a booking.",
  },
];

export default async function EventsPage() {
  const [events, settings] = await Promise.all([
    getEvents(),
    getSiteSettings(),
  ]);

  return (
    <div className="pt-16 sm:pt-20">
      {/* lead */}
      <Section tone="char" className="!pb-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7" data-reveal-group>
            <Eyebrow data-reveal className="mb-5">
              What&rsquo;s On
            </Eyebrow>
            <div className="overflow-hidden">
              <h1
                data-mask
                className="display-xl pb-2 text-[2.75rem] text-bone sm:pb-3 sm:text-6xl lg:text-7xl"
              >
                Nights at Zaba&rsquo;s
              </h1>
            </div>
            <p
              data-reveal
              className="mt-6 max-w-xl text-base leading-relaxed text-ash sm:text-lg"
            >
              When the fire dies down the sound comes up. Zaba&rsquo;s hosts
              full-scale live events — a concert stage, proper rigging and a
              yard that fills — alongside the lounges, the bar and the braai
              running as normal.
            </p>
          </div>
          <div className="lg:col-span-5">
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-hair bg-hair">
              {[
                ["Stage", "Full concert rig"],
                ["Lounges", "Indoor & outdoor"],
                ["Kitchen", "Open all night"],
              ].map(([k, v]) => (
                <div key={k} className="bg-smoke px-4 py-5">
                  <dt className="label-mono text-gold">{k}</dt>
                  <dd className="mt-2 text-sm leading-snug text-bone">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* stage */}
      <Section tone="char" className="!pt-0">
        <figure data-reveal-image className="photo-frame relative aspect-[16/10] rounded-2xl border border-hair sm:aspect-[18/8]">
          <Image
            src="/images/event-stage.jpg"
            alt="A full concert stage with truss roof, line-array speakers and LED wall set up in the yard at Zaba's Shisanyama"
            fill
            sizes="100vw"
            quality={82}
            className="object-cover"
          />
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-char/80 via-transparent to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 z-[3] p-6 sm:p-8">
            <p className="label-mono text-gold">The yard, set up for a show</p>
          </figcaption>
        </figure>
      </Section>

      {/* upcoming, from the dashboard */}
      {events.length > 0 && (
        <Section tone="smoke">
          <SectionHeading eyebrow="Coming up" title="Next at Zaba's" />
          <div className="grid gap-8 lg:grid-cols-2" data-reveal-group>
            {events.map((e) => (
              <div key={e.id} data-reveal>
                <EventCard event={e} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* the summer dance */}
      <Section tone="smoke">
        <SectionHeading
          eyebrow="Previously"
          title="Durban's Summer Dance"
        />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div
              data-reveal-image
              className="photo-frame relative aspect-[11/14] rounded-2xl border border-hair"
            >
              <Image
                src="/images/event-poster.jpg"
                alt="Poster for Durban's Summer Dance at Zaba's Shisanyama on Saturday 29 November"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                quality={82}
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-8" data-reveal-group>
            <p data-reveal className="text-base leading-relaxed text-ash sm:text-lg">
              Zaba&rsquo;s hosted <strong className="text-bone">Durban&rsquo;s
              Summer Dance</strong> on <strong className="text-bone">Saturday
              29 November 2025</strong> — a full production in the yard with a
              concert stage, professional sound and lighting, and the lounges
              and braai running right through. Tickets were sold through
              Webtickets. Strictly no alcohol to under-18s.
            </p>

            <div className="mt-8">
              <p className="label-mono mb-4 text-gold">Presented with</p>
              <ul className="flex flex-wrap gap-2" data-reveal>
                {PARTNERS.map((p) => (
                  <li
                    key={p}
                    className="rounded-full border border-hair px-4 py-2 text-sm text-ash"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <figure data-reveal-image className="photo-frame relative aspect-[4/5] rounded-2xl border border-hair">
                <Image
                  src="/images/event-crowd.jpg"
                  alt="Three friends on a couch at Zaba's during Durban's Summer Dance, drinks in hand"
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  quality={78}
                  className="object-cover"
                />
              </figure>
              <figure data-reveal-image className="photo-frame relative aspect-[4/5] rounded-2xl border border-hair">
                <Image
                  src="/images/team-crew.jpg"
                  alt="Three of the Zaba's braai team in branded shirts at the wood-fired grill"
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  quality={78}
                  className="object-cover"
                />
              </figure>
            </div>
          </div>
        </div>
      </Section>

      {/* the spaces */}
      <Section tone="char">
        <SectionHeading
          eyebrow="The Venue"
          title="Room for a quiet drink or a full house"
        />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPACES.map((s) => (
            <li key={s.title}>
              <figure className="group">
                <div
                  data-reveal-image
                  className="photo-frame relative aspect-[4/5] rounded-2xl border border-hair transition-colors duration-500 group-hover:border-gold/40"
                >
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    quality={78}
                    className="object-cover transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 z-[2] bg-gradient-to-t from-char/85 via-transparent to-transparent" />
                </div>
                <figcaption className="mt-4">
                  <h3 className="display-xl text-xl text-bone">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ash">
                    {s.note}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Section>

      {/* the fire */}
      <Section tone="smoke">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5" data-reveal-group>
            <Eyebrow data-reveal className="mb-5">
              Behind it
            </Eyebrow>
            <div className="overflow-hidden">
              <h2
                data-mask
                className="display-xl pb-2 text-[2.5rem] text-bone sm:pb-3 sm:text-5xl"
              >
                The same fire, all night
              </h2>
            </div>
            <p data-reveal className="mt-6 text-base leading-relaxed text-ash sm:text-lg">
              Event or not, the wood fire runs and the counter stays open — you
              still pick your cut and it still goes straight on the coals.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            <figure data-reveal-image className="photo-frame relative aspect-[4/5] rounded-2xl border border-hair">
              <Image
                src="/images/team-braai.jpg"
                alt="A Zaba's braai master laughing behind the long brick wood-fired grill"
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                quality={78}
                className="object-cover"
              />
            </figure>
            <figure data-reveal-image className="photo-frame relative aspect-[4/5] rounded-2xl border border-hair">
              <Image
                src="/images/venue-butchery.jpg"
                alt="Trays of fresh chops, wors and steak in the butchery counter at Zaba's"
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                quality={78}
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section tone="char">
        <div className="overflow-hidden rounded-2xl border border-hair bg-smoke">
          <div className="grid lg:grid-cols-2">
            <div className="photo-frame relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]">
              <Image
                src="/images/venue-bar.jpg"
                alt="The main bar and seating area at Zaba's under the red roof"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={80}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12" data-reveal-group>
              <Eyebrow data-reveal className="mb-4">
                Book the space
              </Eyebrow>
              <h2 data-reveal className="display-xl text-3xl text-bone sm:text-4xl">
                Having something of your own?
              </h2>
              <p data-reveal className="mt-4 text-sm leading-relaxed text-ash sm:text-base">
                Birthdays, big groups, private functions — message us on
                WhatsApp and we&rsquo;ll sort the space, the meat and the
                sound.
              </p>
              <div data-reveal className="mt-8">
                <a
                  href={waLink(
                    "Hi Zaba's! I'd like to ask about hosting an event.",
                    settings?.whatsapp
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Book"
                  className="inline-flex rounded-full bg-ember px-8 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:bg-flame"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
