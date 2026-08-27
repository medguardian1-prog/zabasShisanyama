"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { Special } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import {
  deleteSpecial,
  saveSpecial,
  setSpecialActive,
  setTodaysSpecial,
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

export default function SpecialsManager({ specials }: { specials: Special[] }) {
  const [editing, setEditing] = useState<Special | "new" | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setEditing("new")}
        className="w-full rounded bg-ember px-6 py-4 text-base font-semibold text-bone"
      >
        + Add a special
      </button>

      <ul className="mt-6 space-y-2">
        {specials.map((s) => (
          <li
            key={s.id}
            className={cn(
              "rounded border bg-smoke p-4",
              s.active ? "border-ember" : "border-hair"
            )}
          >
            <div className="flex items-center gap-3">
              {s.image && (
                <Image
                  src={s.image}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded object-cover"
                  unoptimized
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-bone">
                  {s.title}
                  {s.active && (
                    <span className="ml-2 text-xs text-flame">
                      ● live today
                    </span>
                  )}
                </p>
                <p className="text-sm text-ash">{formatPrice(s.price)}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-hair pt-2">
              {!s.active ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const res = await setTodaysSpecial(s.id);
                      if (res.ok) toast(SAVED);
                      else toast(res.error, true);
                    })
                  }
                  className="rounded bg-ember px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-bone disabled:opacity-50"
                >
                  Set as today&rsquo;s special
                </button>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const res = await setSpecialActive(s.id, false);
                      if (res.ok) toast(SAVED);
                      else toast(res.error, true);
                    })
                  }
                  className="rounded px-3 py-2.5 text-xs uppercase tracking-wider text-ash hover:text-bone"
                >
                  Switch off
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditing(s)}
                className="rounded px-3 py-2.5 text-xs uppercase tracking-wider text-ash hover:text-bone"
              >
                Edit
              </button>
              <ConfirmDelete what={s.title} onConfirm={() => deleteSpecial(s.id)} />
            </div>
          </li>
        ))}
      </ul>

      {!specials.length && (
        <p className="mt-6 text-sm text-ash">
          No specials yet — add one above, then set it live.
        </p>
      )}

      {editing && (
        <SpecialDialog
          special={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function SpecialDialog({
  special,
  onClose,
}: {
  special: Special | null;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [photo, setPhoto] = useState<File | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("photo");
    if (photo) fd.set("photo", photo);
    if (special) fd.set("id", special.id);
    startTransition(async () => {
      const res = await saveSpecial(fd);
      if (res.ok) {
        toast(SAVED);
        onClose();
      } else {
        toast(res.error, true);
      }
    });
  }

  const toLocalInput = (iso: string | null) =>
    iso ? new Date(iso).toISOString().slice(0, 10) : "";

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto">
        <DialogTitle>
          {special ? `Edit ${special.title}` : "Add a special"}
        </DialogTitle>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Title">
            <input
              name="title"
              required
              defaultValue={special?.title}
              className="w-full rounded border border-hair bg-char px-4 py-3.5 text-base text-bone focus:border-ember focus:outline-none"
            />
          </Field>
          <Field label="Price in rands (optional)">
            <input
              name="price"
              inputMode="decimal"
              defaultValue={
                special?.price != null ? String(special.price / 100) : ""
              }
              placeholder="e.g. 99"
              className="w-full rounded border border-hair bg-char px-4 py-3.5 text-base text-bone focus:border-ember focus:outline-none"
            />
          </Field>
          <Field label="Description (optional)">
            <textarea
              name="description"
              defaultValue={special?.description ?? ""}
              className="min-h-20 w-full rounded border border-hair bg-char px-4 py-3.5 text-base text-bone focus:border-ember focus:outline-none"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Starts (optional)">
              <input
                name="startsAt"
                type="date"
                defaultValue={toLocalInput(special?.startsAt ?? null)}
                className="w-full rounded border border-hair bg-char px-4 py-3.5 text-base text-bone focus:border-ember focus:outline-none"
              />
            </Field>
            <Field label="Ends (optional)">
              <input
                name="endsAt"
                type="date"
                defaultValue={toLocalInput(special?.endsAt ?? null)}
                className="w-full rounded border border-hair bg-char px-4 py-3.5 text-base text-bone focus:border-ember focus:outline-none"
              />
            </Field>
          </div>
          <ImageInput existingUrl={special?.image} onFile={setPhoto} />
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded bg-ember px-4 py-3.5 text-sm font-semibold text-bone disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <DialogClose className="flex-1 rounded border border-hair px-4 py-3.5 text-sm text-bone">
              Cancel
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.6875rem] uppercase tracking-[0.18em] text-ash">
        {label}
      </span>
      {children}
    </label>
  );
}
