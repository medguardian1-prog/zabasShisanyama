"use client";

import { useState, useTransition } from "react";
import type { Enquiry, EnquiryStatus } from "@/lib/types";
import { setEnquiryStatus } from "@/app/admin/actions/mutations";
import { toast } from "@/components/admin/Toaster";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<Enquiry["type"], string> = {
  booking: "Booking",
  contact: "Message",
  "large-order": "Large order",
};

export default function EnquiriesInbox({ enquiries }: { enquiries: Enquiry[] }) {
  const [filter, setFilter] = useState<EnquiryStatus | "all">("new");
  const list =
    filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div className="mt-4">
      <div className="flex gap-1">
        {(["new", "handled", "archived", "all"] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded px-4 py-2.5 text-sm capitalize",
              filter === f ? "bg-ember text-bone" : "text-ash hover:text-bone"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {list.map((e) => (
          <EnquiryCard key={e.id} enquiry={e} />
        ))}
      </ul>

      {!list.length && (
        <p className="mt-6 text-sm text-ash">Nothing here right now.</p>
      )}
    </div>
  );
}

function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  const [pending, startTransition] = useTransition();

  const setStatus = (status: EnquiryStatus) =>
    startTransition(async () => {
      const res = await setEnquiryStatus(enquiry.id, status);
      if (res.ok) toast(status === "handled" ? "Marked handled." : "Archived.");
      else toast(res.error, true);
    });

  const phoneDigits = enquiry.phone?.replace(/[^\d]/g, "") ?? "";
  const created = new Date(enquiry.createdAt);

  return (
    <li className="admin-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-bone">{enquiry.name}</p>
          <p className="mt-0.5 text-xs uppercase tracking-wider text-gold">
            {TYPE_LABELS[enquiry.type]}
            {enquiry.status !== "new" && (
              <span className="ml-2 text-ash">· {enquiry.status}</span>
            )}
          </p>
        </div>
        <time
          dateTime={enquiry.createdAt}
          className="shrink-0 text-xs text-ash"
        >
          {Number.isNaN(created.getTime())
            ? ""
            : created.toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "short",
              })}
        </time>
      </div>

      <dl className="mt-3 space-y-1 text-sm text-ash">
        {enquiry.eventDate && (
          <div>
            <dt className="inline text-bone">Date: </dt>
            <dd className="inline">{enquiry.eventDate.slice(0, 10)}</dd>
          </div>
        )}
        {enquiry.partySize && (
          <div>
            <dt className="inline text-bone">Party: </dt>
            <dd className="inline">{enquiry.partySize} people</dd>
          </div>
        )}
        {enquiry.email && (
          <div>
            <dt className="inline text-bone">Email: </dt>
            <dd className="inline">
              <a href={`mailto:${enquiry.email}`} className="underline">
                {enquiry.email}
              </a>
            </dd>
          </div>
        )}
        {enquiry.message && (
          <div className="pt-1">
            <dd className="whitespace-pre-wrap">{enquiry.message}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {enquiry.phone && (
          <>
            <a
              href={`tel:${enquiry.phone}`}
              className="btn-ember px-3 py-2 text-xs"
            >
              Call
            </a>
            {phoneDigits && (
              <a
                href={`https://wa.me/${phoneDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-quiet px-3 py-2 text-xs"
              >
                WhatsApp
              </a>
            )}
          </>
        )}
        {enquiry.status !== "handled" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => setStatus("handled")}
            className="rounded px-2.5 py-2 text-xs text-ash transition-colors hover:text-bone disabled:opacity-50"
          >
            Mark handled
          </button>
        )}
        {enquiry.status !== "archived" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => setStatus("archived")}
            className="rounded px-2.5 py-2 text-xs text-ash transition-colors hover:text-bone disabled:opacity-50"
          >
            Archive
          </button>
        )}
      </div>
    </li>
  );
}
