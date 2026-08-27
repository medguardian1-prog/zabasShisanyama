import type { OpeningHoursRow } from "@/lib/types";
import { dayName, formatTime, getOpenStatus } from "@/lib/hours";
import { cn } from "@/lib/utils";

export default function HoursWidget({ hours }: { hours: OpeningHoursRow[] }) {
  if (!hours.length) {
    return (
      <p className="text-sm text-ash">
        Opening hours coming soon — call ahead to check we&rsquo;re on the
        fire.
      </p>
    );
  }

  const status = getOpenStatus(hours);

  return (
    <div>
      {status && (
        <p
          className={cn(
            "mb-6 inline-flex items-center gap-2.5 text-sm font-semibold",
            status.open ? "text-bone" : "text-ash"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "h-2 w-2 rounded-full",
              status.open ? "bg-flame" : "bg-ash"
            )}
          />
          {status.label}
        </p>
      )}
      {status?.note && <p className="mb-4 text-sm text-gold">{status.note}</p>}
      <ul className="divide-y divide-hair text-sm">
        {hours.map((h) => (
          <li key={h.id} className="flex justify-between gap-8 py-2.5">
            <span className="text-ash">{dayName(h.dayOfWeek)}</span>
            <span className="text-bone">
              {h.closed
                ? "Closed"
                : `${formatTime(h.opens)} – ${formatTime(h.closes)}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
