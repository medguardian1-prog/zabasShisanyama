import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Live nights, specials and what's on at Zaba's Shisanyama.",
  openGraph: {
    title: "Events · Zaba's Shisanyama",
    images: ["/images/logo.png"],
  },
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="pt-16 sm:pt-20">
      <Section tone="char">
        <SectionHeading eyebrow="What's On" title="Nights at Zaba's" />
        {events.length ? (
          <div className="grid gap-8 lg:grid-cols-2" data-reveal-group>
            {events.map((e) => (
              <div key={e.id} data-reveal>
                <EventCard event={e} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div data-reveal-group>
              <p data-reveal className="max-w-md text-base leading-relaxed text-ash sm:text-lg">
                Nothing on the calendar right now — but the yard never stays
                quiet for long. Follow us on socials or check back soon for
                live music, match days and holiday specials.
              </p>
            </div>
            <div data-reveal-image className="photo-frame relative aspect-[16/10] border border-hair">
              <Image
                src="/images/event.jpg"
                alt="A performer on stage in front of the crowd at a Zaba's night event"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
