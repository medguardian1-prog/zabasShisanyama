"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryFormState } from "@/app/actions/enquiries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const initialState: EnquiryFormState = { ok: false, error: null, done: false };

export default function BookingForm() {
  const [state, action, pending] = useActionState(submitEnquiry, initialState);

  if (state.done) {
    return (
      <div className="border border-hair bg-smoke p-8 text-center" role="status">
        <p className="font-display text-xl uppercase text-bone">
          Got it — see you at the fire.
        </p>
        <p className="mt-3 text-sm text-ash">
          We&rsquo;ve received your booking request and will confirm with you
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <div>
        <Label htmlFor="booking-type">What&rsquo;s this for?</Label>
        <Select id="booking-type" name="type" defaultValue="booking">
          <option value="booking">Table booking</option>
          <option value="large-order">Large order / catering</option>
          <option value="contact">Something else</option>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="booking-name">Name</Label>
          <Input
            id="booking-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
          />
        </div>
        <div>
          <Label htmlFor="booking-phone">Phone</Label>
          <Input
            id="booking-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="e.g. 072 000 0000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="booking-email">Email (optional)</Label>
        <Input
          id="booking-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="booking-date">Date</Label>
          <Input id="booking-date" name="eventDate" type="date" />
        </div>
        <div>
          <Label htmlFor="booking-party">Party size</Label>
          <Input
            id="booking-party"
            name="partySize"
            type="number"
            min={1}
            max={500}
            inputMode="numeric"
            placeholder="How many of you?"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="booking-message">Anything we should know?</Label>
        <Textarea
          id="booking-message"
          name="message"
          placeholder="Birthdays, big groups, special requests…"
        />
      </div>

      {state.error && (
        <p className="text-sm text-flame" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Send Booking Request"}
      </Button>
    </form>
  );
}
