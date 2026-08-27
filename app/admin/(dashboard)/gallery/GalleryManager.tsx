"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import {
  addGalleryImage,
  deleteGalleryImage,
  moveRow,
  setGalleryVisibility,
} from "@/app/admin/actions/mutations";
import { toast, SAVED } from "@/components/admin/Toaster";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import ImageInput from "@/components/admin/ImageInput";
import { cn } from "@/lib/utils";

export default function GalleryManager({ images }: { images: GalleryImage[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [photo, setPhoto] = useState<File | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("photo");
    if (photo) fd.set("photo", photo);
    startTransition(async () => {
      const res = await addGalleryImage(fd);
      if (res.ok) {
        toast(SAVED);
        formRef.current?.reset();
        setPhoto(null);
      } else {
        toast(res.error, true);
      }
    });
  }

  return (
    <div className="mt-6">
      <form
        ref={formRef}
        onSubmit={submit}
        className="space-y-4 admin-card p-4"
      >
        <ImageInput label="New photo" onFile={setPhoto} />
        <label className="block">
          <span className="mb-2 block text-[0.6875rem] uppercase tracking-wider text-ash">
            What&rsquo;s in the photo? (required)
          </span>
          <input
            name="alt"
            required
            placeholder="e.g. Lamb chops on the grill on a Saturday"
            className="admin-input"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[0.6875rem] uppercase tracking-wider text-ash">
            Caption shown on the site (optional)
          </span>
          <input
            name="caption"
            className="admin-input"
          />
        </label>
        <button
          type="submit"
          disabled={pending || !photo}
          className="btn-ember w-full px-4 py-4 text-sm"
        >
          {pending ? "Uploading…" : "Upload photo"}
        </button>
      </form>

      <ul className="mt-6 grid grid-cols-2 gap-3">
        {images.map((img, idx) => (
          <li
            key={img.id}
            className={cn(
              "admin-card p-2",
              !img.visible && "opacity-60"
            )}
          >
            <div className="relative aspect-square overflow-hidden rounded">
              <Image
                src={img.image}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>
            <p className="mt-2 truncate px-1 text-xs text-ash">{img.alt}</p>
            <div className="mt-1 flex flex-wrap items-center gap-0.5">
              <button
                type="button"
                aria-label="Move photo earlier"
                disabled={idx === 0}
                onClick={() =>
                  startTransition(async () => {
                    const res = await moveRow("gallery_images", img.id, "up");
                    if (!res.ok) toast(res.error, true);
                  })
                }
                className="rounded px-2.5 py-2 text-sm text-ash hover:text-bone disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Move photo later"
                disabled={idx === images.length - 1}
                onClick={() =>
                  startTransition(async () => {
                    const res = await moveRow("gallery_images", img.id, "down");
                    if (!res.ok) toast(res.error, true);
                  })
                }
                className="rounded px-2.5 py-2 text-sm text-ash hover:text-bone disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() =>
                  startTransition(async () => {
                    const res = await setGalleryVisibility(img.id, !img.visible);
                    if (res.ok) toast(SAVED);
                    else toast(res.error, true);
                  })
                }
                className="rounded px-2.5 py-2 text-xs uppercase tracking-wider text-ash hover:text-bone"
              >
                {img.visible ? "Hide" : "Show"}
              </button>
              <ConfirmDelete
                what="this photo"
                onConfirm={() => deleteGalleryImage(img.id)}
              />
            </div>
          </li>
        ))}
      </ul>

      {!images.length && (
        <p className="mt-6 text-sm text-ash">
          No photos yet — the site is showing the starter set until you upload
          your own.
        </p>
      )}
    </div>
  );
}
