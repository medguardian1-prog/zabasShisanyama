"use client";

import { useState, useTransition } from "react";
import type { OpeningHoursRow, SiteSettings } from "@/lib/types";
import { dayName } from "@/lib/hours";
import {
  importTradingHours,
  saveAnnouncement,
  saveDayHours,
} from "@/app/admin/actions/mutations";
import { toast, SAVED } from "@/components/admin/Toaster";
import { Switch } from "@/components/ui/switch";

export default function HoursManager({
  hours,
  settings,
}: {
  hours: OpeningHoursRow[];
  settings: SiteSettings | null;
}) {
  return (
    <div className="mt-4 space-y-6">
      <ResetToStandard />
      <ul className="space-y-2">
        {hours.map((h) => (
          <DayRow key={h.id} row={h} />
        ))}
        {!hours.length && (
          <p className="text-sm text-ash">
            No hours in the database yet — ask whoever set up the site to run
            the seed.
          </p>
        )}
      </ul>
      <AnnouncementEditor settings={settings} />
    </div>
  );
}

/**
 * Always available: the database was seeded with placeholder times, so there
 * has to be a way back to Zaba's real trading hours in one tap.
 */
function ResetToStandard() {
  const [pending, startTransition] = useTransition();

  return (
    <div className="admin-card flex flex-wrap items-center justify-between gap-3 p-3">
      <p className="text-xs leading-relaxed text-ash">
        Standard hours: Mon&ndash;Thu 09:00&ndash;21:00, Fri to 22:00,
        Sat &amp; Sun to midnight.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res = await importTradingHours();
            toast(res.ok ? SAVED : res.error, !res.ok);
          })
        }
        className="btn-quiet px-3 py-2 text-xs"
      >
        {pending ? "Setting…" : "Use standard hours"}
      </button>
    </div>
  );
}

function DayRow({ row }: { row: OpeningHoursRow }) {
  const [pending, startTransition] = useTransition();
  const [closed, setClosed] = useState(row.closed);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("id", row.id);
    if (closed) fd.set("closed", "on");
    startTransition(async () => {
      const res = await saveDayHours(fd);
      if (res.ok) toast(SAVED);
      else toast(res.error, true);
    });
  }

  return (
    <li className="admin-card p-3">
      <form onSubmit={submit}>
        <div className="flex items-center justify-between gap-4">
          <p className="font-medium text-bone">{dayName(row.dayOfWeek)}</p>
          <label className="flex items-center gap-2.5 text-sm text-ash">
            Closed
            <Switch
              checked={closed}
              onCheckedChange={setClosed}
              aria-label={`${dayName(row.dayOfWeek)} closed all day`}
            />
          </label>
        </div>
        {!closed && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="admin-label">
                Opens
              </span>
              <input
                name="opens"
                type="time"
                defaultValue={row.opens?.slice(0, 5) ?? ""}
                className="admin-input"
              />
            </label>
            <label className="block">
              <span className="admin-label">
                Closes
              </span>
              <input
                name="closes"
                type="time"
                defaultValue={row.closes?.slice(0, 5) ?? ""}
                className="admin-input"
              />
            </label>
          </div>
        )}
        <div className="mt-3 flex items-end gap-3">
          <label className="block flex-1">
            <span className="admin-label">
              Note (optional)
            </span>
            <input
              name="note"
              defaultValue={row.note ?? ""}
              placeholder="e.g. Kitchen closes 21:00"
              className="admin-input"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="btn-ember px-4 py-2.5 text-sm"
          >
            {pending ? "…" : "Save"}
          </button>
        </div>
      </form>
    </li>
  );
}

function AnnouncementEditor({ settings }: { settings: SiteSettings | null }) {
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState(settings?.announcementActive ?? false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (active) fd.set("active", "on");
    startTransition(async () => {
      const res = await saveAnnouncement(fd);
      if (res.ok) toast(SAVED);
      else toast(res.error, true);
    });
  }

  return (
    <section className="admin-card p-3">
      <h2 className="font-medium text-bone">Announcement banner</h2>
      <p className="mt-1 text-sm text-ash">
        Shows at the top of the homepage while switched on.
      </p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          name="text"
          defaultValue={settings?.announcementText ?? ""}
          placeholder="e.g. Closed this Sunday for a private event"
          className="admin-input"
        />
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 text-sm text-ash">
            Show on the site
            <Switch
              checked={active}
              onCheckedChange={setActive}
              aria-label="Announcement banner on"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="btn-ember px-4 py-2.5 text-sm"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
}
