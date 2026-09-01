/**
 * Code-level fallbacks used when site_settings still holds TODO/empty values.
 * The staff dashboard (Settings) overrides all of these once filled in.
 *
 * WhatsApp number supplied by the client (authoritative).
 * Address/socials researched online 2026-08-27 — see CONTENT-TODO.md for the
 * one open discrepancy (street number 1 vs 2).
 */

/** Calls and WhatsApp bookings both use this number (client-confirmed 2026-08-28). */
export const WHATSAPP_NUMBER = "27684196554";
export const DEFAULT_PHONE = "+27 68 419 6554";
/** Street number 1 and the SPCA Access Rd / Cato Manor detail come from the
 *  client's own printed menu (confirmed 2026-08-28). */
export const DEFAULT_ADDRESS =
  "1 Johannes Nkosi Avenue, SPCA Access Rd, Cato Manor, 4091";
/**
 * The map search deliberately says Mayville where the printed address says
 * Cato Manor (client-confirmed 2026-09-01: "1 Mayville is right"). Same
 * street number, adjacent suburbs — the displayed address follows the
 * client's printed menu, the map follows what Google actually drops a pin
 * on. Do not "fix" this to match the address string above.
 */
export const DEFAULT_MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=Zaba%27s+Shisanyama+1+Johannes+Nkosi+Avenue+Mayville+Durban";
export const DEFAULT_INSTAGRAM = "https://www.instagram.com/zabas_shisanyama";
/**
 * Note the double "a". facebook.com/zabashisanyama is a different business
 * ("Zaba's Pub and Grill") — confirmed with the client 2026-08-27.
 */
export const DEFAULT_FACEBOOK = "https://www.facebook.com/zabashisanyamaa";
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
