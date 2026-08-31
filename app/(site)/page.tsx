import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import SignatureStrip from "@/components/SignatureStrip";
import SpecialCard from "@/components/SpecialCard";
import GalleryGrid from "@/components/GalleryGrid";
import EventCard from "@/components/EventCard";
import HoursWidget from "@/components/HoursWidget";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import {
  getActiveSpecials,
  getEvents,
  getFeaturedItems,
  getGalleryImages,
  getOpeningHours,
  getSiteSettings,
} from "@/lib/queries";
import {
  DEFAULT_ADDRESS,
  DEFAULT_MAP_LINK,
  DEFAULT_PHONE,
  WA_BOOKING_DEFAULT,
  waLink,
  withDefault,
} from "@/lib/site-defaults";
import { getOpenStatus, withDefaultHours } from "@/lib/hours";
import { fallbackMenu } from "@/lib/default-menu";

export const metadata: Metadata = {
  title: "Zaba's Shisanyama — Meat. Fire. Family.",
  description:
    "Flame-grilled meat, cold drinks and township energy at Zaba's Shisanyama. View the menu, see what's on, and book a table.",
  openGraph: {
    title: "Zaba's Shisanyama — Meat. Fire. Family.",
    images: ["/images/logo.png"],
  },
};

export default async function HomePage() {
  const [featured, specials, gallery, events, hours, settings] =
    await Promise.all([
      getFeaturedItems(),
      getActiveSpecials(),
      getGalleryImages(),
      getEvents(),
      getOpeningHours(),
      getSiteSettings(),
    ]);

  const todaysSpecial = specials[0];
  const displayHours = withDefaultHours(hours);
  const status = getOpenStatus(displayHours);
  const stripItems = featured.length ? featured : fallbackMenu().items.filter((i) => i.featured);

  return (
    <>
      <Hero
        statusLabel={status?.label}
        address={withDefault(settings?.address, DEFAULT_ADDRESS)}
        whatsappSetting={settings?.whatsapp}
      />

      {settings?.announcementActive && settings.announcementText && (
        <AnnouncementBanner text={settings.announcementText} />
      )}

      <Marquee />

      {/* intro */}
      <Section tone="char">
        <div className="grid gap-10 md:grid-cols-12" data-reveal-group>
          <div className="md:col-span-5">
            <p className="eyebrow mb-4" data-reveal>
              Welcome to Zaba&rsquo;s
            </p>
            <div className="overflow-hidden">
              <h2
                data-mask
                className="display-xl pb-2 text-[2.75rem] sm:pb-3 sm:text-5xl lg:text-[3.75rem]"
              >
                This is how we braai
              </h2>
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p data-reveal className="text-base leading-relaxed text-ash sm:text-lg">
              Shisanyama means &ldquo;burn the meat&rdquo; — and that&rsquo;s
              exactly what we do. Pick your cut, we throw it on the fire, and
              you eat it hot off the grill with pap, chakalaka and something
              cold from the bar. No shortcuts, no gas — just wood, smoke and
              time.
            </p>
            <Link
              href="/about"
              data-reveal
              className="tap-target mt-6 inline-block text-[0.75rem] uppercase tracking-[0.18em] text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-flame"
            >
              Our story
            </Link>
          </div>
        </div>
      </Section>

      {/* pinned signature strip */}
      <SignatureStrip items={stripItems} />

      {/* today's special */}
      {todaysSpecial && (
        <Section tone="char">
          <SpecialCard special={todaysSpecial} />
        </Section>
      )}

      {/* gallery teaser */}
      <Section tone="char">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="The Vibe" title="Straight from the yard" />
          <Link
            href="/gallery"
            data-cursor="View"
            className="tap-target mb-14 text-[0.75rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-flame sm:mb-16"
          >
            Full gallery →
          </Link>
        </div>
        <GalleryGrid images={gallery} variant="mosaic" />
      </Section>

      {/* events teaser */}
      <Section tone="smoke">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="What's On" title="Nights at Zaba's" />
          <Link
            href="/events"
            data-cursor="View"
            className="tap-target mb-14 text-[0.75rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-flame sm:mb-16"
          >
            All events →
          </Link>
        </div>
        {events.length ? (
          <div className="grid gap-8 lg:grid-cols-2" data-reveal-group>
            {events.slice(0, 2).map((e) => (
              <div key={e.id} data-reveal>
                <EventCard event={e} />
              </div>
            ))}
          </div>
        ) : (
          <p data-reveal className="max-w-md text-ash">
            Nothing on the calendar right now — follow us on socials or check
            back soon. The fire never stays quiet for long.
          </p>
        )}
      </Section>

      {/* hours + location */}
      <Section tone="char">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Hours" title="When the fire's on" />
            <HoursWidget hours={displayHours} />
          </div>
          <div>
            <SectionHeading eyebrow="Find Us" title="Pull up" />
            <div className="space-y-4 text-ash" data-reveal-group>
              <p data-reveal>{withDefault(settings?.address, DEFAULT_ADDRESS)}</p>
              <p data-reveal>
                <a
                  href={withDefault(settings?.mapLink, DEFAULT_MAP_LINK)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target text-bone underline decoration-gold underline-offset-4 transition-colors hover:text-flame"
                >
                  Open in Maps
                </a>
              </p>
              <p data-reveal>
                <a
                  href={`tel:${withDefault(settings?.phone, DEFAULT_PHONE).replace(/\s/g, "")}`}
                  className="tap-target transition-colors hover:text-flame"
                >
                  {withDefault(settings?.phone, DEFAULT_PHONE)}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* booking CTA */}
      <Section tone="ember">
        <div className="text-center" data-reveal-group>
          <p className="eyebrow mb-4 !text-bone/70" data-reveal>
            Weekends fill up fast
          </p>
          <div className="overflow-hidden">
            <h2
              data-mask
              className="display-xl pb-2 text-[2.75rem] sm:pb-3 sm:text-5xl lg:text-[3.75rem]"
            >
              Book your table at the fire
            </h2>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4" data-reveal>
            <a
              href={waLink(WA_BOOKING_DEFAULT, settings?.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Book"
              className="rounded-full bg-char px-8 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:bg-smoke"
            >
              Book on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-block rounded-full border border-bone px-8 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:bg-bone/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
