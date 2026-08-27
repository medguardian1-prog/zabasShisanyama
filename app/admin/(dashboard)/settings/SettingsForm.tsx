"use client";

import { useTransition } from "react";
import type { SiteSettings } from "@/lib/types";
import { saveSettings } from "@/app/admin/actions/mutations";
import { toast, SAVED } from "@/components/admin/Toaster";

const clean = (v: string | null | undefined) => (v === "TODO" ? "" : v ?? "");

export default function SettingsForm({
  settings,
}: {
  settings: SiteSettings | null;
}) {
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveSettings(fd);
      if (res.ok) toast(SAVED);
      else toast(res.error, true);
    });
  }

  const fields: {
    name: string;
    label: string;
    value: string;
    placeholder: string;
    type?: string;
  }[] = [
    {
      name: "phone",
      label: "Phone number",
      value: clean(settings?.phone),
      placeholder: "e.g. 072 000 0000",
      type: "tel",
    },
    {
      name: "whatsapp",
      label: "WhatsApp number (with country code)",
      value: clean(settings?.whatsapp),
      placeholder: "e.g. 27720000000",
      type: "tel",
    },
    {
      name: "address",
      label: "Address",
      value: clean(settings?.address),
      placeholder: "Street, area, town",
    },
    {
      name: "mapLink",
      label: "Google Maps link",
      value: clean(settings?.mapLink),
      placeholder: "https://maps.app.goo.gl/…",
      type: "url",
    },
    {
      name: "instagram",
      label: "Instagram link",
      value: clean(settings?.instagram),
      placeholder: "https://instagram.com/…",
      type: "url",
    },
    {
      name: "facebook",
      label: "Facebook link",
      value: clean(settings?.facebook),
      placeholder: "https://facebook.com/…",
      type: "url",
    },
    {
      name: "tiktok",
      label: "TikTok link",
      value: clean(settings?.tiktok),
      placeholder: "https://tiktok.com/@…",
      type: "url",
    },
  ];

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className="mb-2 block text-[0.6875rem] uppercase tracking-wider text-ash">
            {f.label}
          </span>
          <input
            name={f.name}
            type={f.type ?? "text"}
            defaultValue={f.value}
            placeholder={f.placeholder}
            className="w-full rounded border border-hair bg-smoke px-4 py-3.5 text-base text-bone placeholder:text-ash/50 focus:border-ember focus:outline-none"
          />
        </label>
      ))}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-ember px-4 py-4 text-sm font-semibold text-bone disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
