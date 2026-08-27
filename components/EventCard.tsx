import Image from "next/image";
import type { SiteEvent } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

export default function EventCard({ event }: { event: SiteEvent }) {
  return (
    <article className="group border border-hair bg-smoke transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_28px_70px_-30px_rgba(0,0,0,0.9)]">
      <div className="photo-frame relative aspect-[16/10]">
        <Image
          src={event.image || "/images/event.jpg"}
          alt={
            event.image
              ? `${event.title} at Zaba's Shisanyama`
              : "A performer on stage in front of the crowd at a Zaba's night event"
          }
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          quality={65}
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
