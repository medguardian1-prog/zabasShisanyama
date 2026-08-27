import Image from "next/image";
import type { SiteEvent } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

export default function EventCard({ event }: { event: SiteEvent }) {
  return (
    <article className="group bg-smoke">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.image || "/images/event.jpg"}
          alt={
            event.image
              ? `${event.title} at Zaba's Shisanyama`
              : "A performer on stage in front of the crowd at a Zaba's night event"
          }
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-char/70 to-transparent" />
      </div>
      <div className="p-6 sm:p-8">
        <p className="eyebrow mb-3">{formatEventDate(event.eventDate)}</p>
        <h3 className="font-display text-xl uppercase leading-[1.12] text-bone sm:text-2xl">
          {event.title}
        </h3>
        {event.description && (
          <p className="mt-3 text-sm leading-relaxed text-ash">
            {event.description}
          </p>
        )}
      </div>
    </article>
  );
}
