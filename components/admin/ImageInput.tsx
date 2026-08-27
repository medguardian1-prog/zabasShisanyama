"use client";

import { useRef, useState } from "react";
import Image from "next/image";

/**
 * Phone-friendly photo picker. Compresses client-side before upload:
 * ≤1600px longest edge, JPEG quality ~0.8 via canvas.
 */
export default function ImageInput({
  name = "photo",
  label = "Photo",
  existingUrl,
  onFile,
}: {
  name?: string;
  label?: string;
  existingUrl?: string | null;
  onFile: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      onFile(null);
      setPreview(null);
      return;
    }
    setBusy(true);
    try {
      const compressed = await compressImage(file);
      onFile(compressed);
      setPreview(URL.createObjectURL(compressed));
    } catch {
      // fall back to the original file if canvas work fails
      onFile(file);
      setPreview(URL.createObjectURL(file));
    } finally {
      setBusy(false);
    }
  }

  const shown = preview ?? existingUrl ?? null;

  return (
    <div>
      <span className="mb-2 block text-[0.6875rem] uppercase tracking-[0.18em] text-ash">
        {label}
      </span>
      <div className="flex items-center gap-4">
        {shown && (
          <Image
            src={shown}
            alt="Selected photo preview"
            width={72}
            height={72}
            className="h-18 w-18 rounded object-cover"
            unoptimized
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="btn-quiet px-4 py-3 text-sm disabled:opacity-50"
        >
          {busy ? "Preparing photo…" : shown ? "Change photo" : "Choose photo"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

async function compressImage(file: File): Promise<File> {
  const MAX = 1600;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas context");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.8)
  );
  if (!blob) throw new Error("compression failed");
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
    type: "image/jpeg",
  });
}
