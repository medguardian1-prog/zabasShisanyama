import "server-only";

import { getAdminClient } from "@/lib/supabase/admin";
import {
  mapCategory,
  mapEnquiry,
  mapGalleryImage,
  mapMenuItem,
  mapOpeningHours,
  mapSiteEvent,
  mapSiteSettings,
  mapSpecial,
  type Category,
  type CategoryRow,
  type Enquiry,
  type EnquiryRow,
  type GalleryImage,
  type GalleryImageRow,
  type MenuItem,
  type MenuItemRow,
  type OpeningHoursDbRow,
  type OpeningHoursRow,
  type SiteEvent,
  type SiteEventRow,
  type SiteSettings,
  type SiteSettingsRow,
  type Special,
  type SpecialRow,
} from "@/lib/types";

/**
 * Lightweight connection probe. The read helpers below fall back to empty
 * arrays on failure, which makes a broken connection look like an empty
 * database — this surfaces the real reason on the dashboard instead.
 */
export async function adminConnectionCheck(): Promise<{
  ok: boolean;
  error: string | null;
}> {
  const sb = getAdminClient();
  if (!sb) {
    return {
      ok: false,
      error:
        "Supabase environment variables are missing or still set to TODO.",
    };
  }
  const { error } = await sb
    .from("categories")
    .select("id", { count: "exact", head: true });
  return error ? { ok: false, error: error.message } : { ok: true, error: null };
}

/** Admin reads — service-role, uncached, include hidden rows. */

export async function adminCategories(): Promise<Category[]> {
  const sb = getAdminClient();
  if (!sb) return [];
  const { data } = await sb.from("categories").select("*").order("sort_order");
  return ((data as CategoryRow[]) ?? []).map(mapCategory);
}

export async function adminMenuItems(): Promise<MenuItem[]> {
  const sb = getAdminClient();
  if (!sb) return [];
  const { data } = await sb.from("menu_items").select("*").order("sort_order");
  return ((data as MenuItemRow[]) ?? []).map(mapMenuItem);
}

export async function adminSpecials(): Promise<Special[]> {
  const sb = getAdminClient();
  if (!sb) return [];
  const { data } = await sb
    .from("specials")
    .select("*")
    .order("created_at", { ascending: false });
  return ((data as SpecialRow[]) ?? []).map(mapSpecial);
}

export async function adminGalleryImages(): Promise<GalleryImage[]> {
  const sb = getAdminClient();
  if (!sb) return [];
  const { data } = await sb
    .from("gallery_images")
    .select("*")
    .order("sort_order");
  return ((data as GalleryImageRow[]) ?? []).map(mapGalleryImage);
}

export async function adminOpeningHours(): Promise<OpeningHoursRow[]> {
  const sb = getAdminClient();
  if (!sb) return [];
  const { data } = await sb
    .from("opening_hours")
    .select("*")
    .order("day_of_week");
  return ((data as OpeningHoursDbRow[]) ?? []).map(mapOpeningHours);
}

export async function adminEvents(): Promise<SiteEvent[]> {
  const sb = getAdminClient();
  if (!sb) return [];
  const { data } = await sb.from("events").select("*").order("sort_order");
  return ((data as SiteEventRow[]) ?? []).map(mapSiteEvent);
}

export async function adminEnquiries(): Promise<Enquiry[]> {
  const sb = getAdminClient();
  if (!sb) return [];
  const { data } = await sb
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return ((data as EnquiryRow[]) ?? []).map(mapEnquiry);
}

export async function adminSiteSettings(): Promise<SiteSettings | null> {
  const sb = getAdminClient();
  if (!sb) return null;
  const { data } = await sb
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data ? mapSiteSettings(data as SiteSettingsRow) : null;
}
