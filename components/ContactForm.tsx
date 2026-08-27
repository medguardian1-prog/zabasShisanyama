"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryFormState } from "@/app/actions/enquiries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialState: EnquiryFormState = { ok: false, error: null, done: false };

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitEnquiry, initialState);

  if (state.done) {
    return (
      <div className="border border-hair bg-smoke p-8 text-center" role="status">
        <p className="font-display text-xl uppercase text-bone">Message sent.</p>
        <p className="mt-3 text-sm text-ash">
          Thanks for reaching out — we&rsquo;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="type" value="contact" />
      <div>
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="e.g. 072 000 0000"
          />
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          placeholder="What's on your mind?"
        />
      </div>

      {state.error && (
        <p className="text-sm text-flame" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
