"use server";

import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";

export interface EnquiryFormState {
  ok: boolean;
  error: string | null;
  done: boolean;
}

const enquirySchema = z.object({
  type: z.enum(["booking", "contact", "large-order"]),
  name: z.string().trim().min(1, "Please tell us your name.").max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("That email doesn't look right.")
    .max(200)
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  eventDate: z.string().trim().max(40).optional().or(z.literal("")),
  partySize: z.coerce.number().int().min(1).max(500).optional().or(z.literal("")),
});

export async function submitEnquiry(
  _prev: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const parsed = enquirySchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
    eventDate: formData.get("eventDate"),
    partySize: formData.get("partySize") || "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      done: false,
      error:
        parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  const d = parsed.data;
  if (!d.phone && !d.email) {
    return {
      ok: false,
      done: false,
      error: "Leave a phone number or an email so we can get back to you.",
    };
  }

  const sb = getAdminClient();
  if (!sb) {
    return {
      ok: false,
      done: false,
      error:
        "Bookings are temporarily offline — please call or WhatsApp us instead.",
    };
  }

  const { error } = await sb.from("enquiries").insert({
    type: d.type,
    name: d.name,
    phone: d.phone || null,
    email: d.email || null,
    message: d.message || null,
    event_date: d.eventDate || null,
    party_size: typeof d.partySize === "number" ? d.partySize : null,
    status: "new",
  });

  if (error) {
    return {
      ok: false,
      done: false,
      error: "Something went wrong on our side — please try again.",
    };
  }

  return { ok: true, done: true, error: null };
}
