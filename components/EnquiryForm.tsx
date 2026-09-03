"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { waLink } from "@/lib/site-defaults";
import { cn } from "@/lib/utils";

/**
 * General enquiry, composed into a prefilled WhatsApp message.
 *
 * This replaced BookingForm on 2026-09-03. The venue stopped taking table
 * bookings and pre-orders, so the date, party-size and "large order /
 * catering" fields are gone with it -- asking for a date implies the venue
 * will hold something, and it will not.
 *
 * The CTA stays a plain anchor to wa.me rather than window.open from a submit
 * handler: an anchor survives popup blockers and works before hydration.
 */
export default function EnquiryForm({
  whatsappSetting,
}: {
  whatsappSetting?: string | null;
}) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  const lines = [
    "Hi Zaba's! I have a question.",
    name && `Name: ${name}`,
    note && `Question: ${note}`,
  ].filter(Boolean);

  const href = waLink(lines.join("\n"), whatsappSetting);
  const ready = name.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="enquiry-name">Name</Label>
        <Input
          id="enquiry-name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-describedby={!ready && touched ? "enquiry-name-error" : undefined}
        />
        {!ready && touched && (
          <p id="enquiry-name-error" className="mt-2 text-sm text-flame">
            Please add your name so we know who we&rsquo;re talking to.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="enquiry-message">What would you like to know?</Label>
        <Textarea
          id="enquiry-message"
          placeholder="Big groups, events, functions, anything else…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!ready}
        onClick={(e) => {
          if (!ready) {
            e.preventDefault();
            setTouched(true);
          }
        }}
        className={cn(
          "inline-flex w-full items-center justify-center gap-3 px-8 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300 sm:w-auto",
          ready
            ? "bg-[#25D366] text-char hover:brightness-110"
            : "cursor-not-allowed bg-[#25D366]/35 text-char/70"
        )}
      >
        <WhatsAppIcon />
        WhatsApp Us
      </a>

      <p className="text-xs leading-relaxed text-ash">
        Opens WhatsApp with your message ready to send. We answer in the chat.
      </p>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.1 4c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.2-1.5-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.1-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5Z" />
    </svg>
  );
}
