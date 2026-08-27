/**
 * Code-level fallbacks used when site_settings still holds TODO/empty values.
 * The staff dashboard (Settings) overrides all of these once filled in.
 *
 * WhatsApp number supplied by the client (authoritative).
 * Address/socials researched online 2026-08-27 — see CONTENT-TODO.md for the
 * one open discrepancy (street number 1 vs 2).
 */

export const WHATSAPP_NUMBER = "27620858961"; // +27 62 085 8961
export const DEFAULT_PHONE = "+27 62 085 8961";
export const DEFAULT_ADDRESS =
  "2 Johannes Nkosi Avenue, Mayville, Durban, 4091";
export const DEFAULT_MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=Zaba%27s+Shisanyama+2+Johannes+Nkosi+Avenue+Mayville+Durban";
export const DEFAULT_INSTAGRAM = "https://www.instagram.com/zabas_shisanyama";
export const DEFAULT_FACEBOOK = "https://www.facebook.com/zabashisanyama";
export const DEFAULT_TIKTOK = "https://www.tiktok.com/@zabasshisanyama";

const isTodo = (v: string | null | undefined) => !v || v === "TODO";

/** Prefer the DB value, fall back to the researched default. */
export function withDefault(
  value: string | null | undefined,
  fallback: string
): string {
  return isTodo(value) ? fallback : (value as string);
}

/** Digits-only WhatsApp target, preferring the DB setting. */
export function whatsappDigits(setting: string | null | undefined): string {
  const raw = isTodo(setting) ? WHATSAPP_NUMBER : (setting as string);
  const digits = raw.replace(/[^\d]/g, "");
  return digits || WHATSAPP_NUMBER;
}

/** Build a wa.me deep link with a prefilled message. */
export function waLink(
  message: string,
  setting?: string | null | undefined
): string {
  return `https://wa.me/${whatsappDigits(setting)}?text=${encodeURIComponent(message)}`;
}

export const WA_BOOKING_DEFAULT =
  "Hi Zaba's! I'd like to book a table.";
