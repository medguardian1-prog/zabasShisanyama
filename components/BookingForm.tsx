"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { waLink } from "@/lib/site-defaults";

/**
 * Bookings always go through WhatsApp — the form composes a prefilled
 * message and opens the chat. Nothing is stored on the site.
 */
export default function BookingForm({
  whatsappSetting,
}: {
  whatsappSetting?: string | null;
}) {
  const [type, setType] = useState("Table booking");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [party, setParty] = useState("");
  const [note, setNote] = useState("");

  const lines = [
    `Hi Zaba's! ${type === "Large order / catering" ? "I'd like to place a large order." : "I'd like to book a table."}`,
    name && `Name: ${name}`,
    date && `Date: ${date}`,
    party && `We are ${party} people.`,
    note && `Note: ${note}`,
  ].filter(Boolean);

  const href = waLink(lines.join("\n"), whatsappSetting);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <div>
        <Label htmlFor="booking-type">What&rsquo;s this for?</Label>
        <Select
          id="booking-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Table booking</option>
          <option>Large order / catering</option>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="booking-name">Name</Label>
          <Input
            id="booking-name"
            required
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="booking-date">Date</Label>
          <Input
            id="booking-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="booking-party">Party size</Label>
        <Input
          id="booking-party"
          type="number"
          min={1}
          max={500}
          inputMode="numeric"
          placeholder="How many of you?"
          value={party}
          onChange={(e) => setParty(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="booking-message">Anything we should know?</Label>
        <Textarea
          id="booking-message"
          placeholder="Birthdays, big groups, special requests…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-3 bg-[#25D366] px-8 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-char transition-colors duration-300 hover:brightness-110 sm:w-auto"
      >
        <WhatsAppIcon />
        Book on WhatsApp
      </button>
      <p className="text-xs leading-relaxed text-ash">
        Tapping the button opens WhatsApp with your booking message ready to
        send — we confirm every booking in the chat.
      </p>
    </form>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.1 4c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.2-1.5-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.1-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5Z" />
    </svg>
  );
}
