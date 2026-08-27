"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { SiteEvent } from "@/lib/types";
import { formatEventDate } from "@/lib/format";
import {
  deleteEvent,
  saveEvent,
  setEventVisibility,
} from "@/app/admin/actions/mutations";
import { toast, SAVED } from "@/components/admin/Toaster";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import ImageInput from "@/components/admin/ImageInput";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function EventsManager({ events }: { events: SiteEvent[] }) {
  const [editing, setEditing] = useState<SiteEvent | "new" | null>(null);
  const [, startTransition] = useTransition();

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setEditing("new")}
        className="btn-ember w-full px-4 py-2.5 text-sm"
      >
        + Add an event
      </button>

      <ul className="mt-3 space-y-2">
        {events.map((ev) => (
          <li
            key={ev.id}
            className={cn(
              "admin-card p-3",
              !ev.visible && "opacity-60"
            )}
          >
            <div className="flex items-center gap-3">
              {ev.image && (
                <Image
                  src={ev.image}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded object-cover"
                  unoptimized
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-bone">
                  {ev.title}
                  {!ev.visible && (
                    <span className="ml-2 text-xs text-ash">(hidden)</span>
                  )}
                </p>
                <p className="text-sm text-ash">
                  {formatEventDate(ev.eventDate)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-hair pt-2">
              <button
                type="button"
                onClick={() => setEditing(ev)}
                className="rounded px-2.5 py-2 text-xs text-ash transition-colors hover:text-bone"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() =>
                  startTransition(async () => {
                    const res = await setEventVisibility(ev.id, !ev.visible);
                    if (res.ok) toast(SAVED);
                    else toast(res.error, true);
                  })
                }
                className="rounded px-2.5 py-2 text-xs text-ash transition-colors hover:text-bone"
              >
                {ev.visible ? "Hide" : "Show"}
              </button>
              <ConfirmDelete what={ev.title} onConfirm={() => deleteEvent(ev.id)} />
            </div>
          </li>
        ))}
      </ul>

      {!events.length && (
        <p className="mt-6 text-sm text-ash">
          Nothing coming up — add your first event above.
        </p>
      )}

      {editing && (
        <EventDialog
          event={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function EventDialog({
  event,
  onClose,
}: {
  event: SiteEvent | null;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [photo, setPhoto] = useState<File | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("photo");
    if (photo) fd.set("photo", photo);
    if (event) fd.set("id", event.id);
    startTransition(async () => {
      const res = await saveEvent(fd);
      if (res.ok) {
        toast(SAVED);
        onClose();
      } else {
        toast(res.error, true);
      }
    });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto">
        <DialogTitle>{event ? `Edit ${event.title}` : "Add an event"}</DialogTitle>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block">
            <span className="admin-label">
              Title
            </span>
            <input
              name="title"
              required
              defaultValue={event?.title}
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="admin-label">
              Date
            </span>
            <input
              name="eventDate"
              type="date"
              defaultValue={event?.eventDate ? event.eventDate.slice(0, 10) : ""}
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="admin-label">
              Description (optional)
            </span>
            <textarea
              name="description"
              defaultValue={event?.description ?? ""}
              className="min-h-20 admin-input"
            />
          </label>
          <ImageInput existingUrl={event?.image} onFile={setPhoto} />
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="btn-ember flex-1 px-4 py-2.5 text-sm"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <DialogClose className="btn-quiet flex-1 px-4 py-2.5 text-sm">
              Cancel
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
