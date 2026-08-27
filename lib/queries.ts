import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getServerClient } from "@/lib/supabase/server";
import {
  mapCategory,
  mapGalleryImage,
  mapMenuItem,
  mapOpeningHours,
  mapSiteEvent,
  mapSiteSettings,
  mapSpecial,
  type Category,
  type CategoryRow,
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
 * All public reads. Each is request-deduped with React cache() and
 * data-cached with a revalidation tag so admin mutations can
 * revalidateTag() them.
 */

export const getCategories = cache(
  unstable_cache(
    async (): Promise<Category[]> => {
      const sb = getServerClient();
      if (!sb) return [];
      const { data } = await sb
        .from("categories")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      return ((data as CategoryRow[]) ?? []).map(mapCategory);
    },
    ["categories"],
    { tags: ["menu"] }
  )
);

export const getMenuItems = cache(
  unstable_cache(
    async (): Promise<MenuItem[]> => {
      const sb = getServerClient();
      if (!sb) return [];
      const { data } = await sb
        .from("menu_items")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      return ((data as MenuItemRow[]) ?? []).map(mapMenuItem);
    },
    ["menu-items"],
    { tags: ["menu"] }
  )
);

export const getFeaturedItems = cache(async (): Promise<MenuItem[]> => {
  const items = await getMenuItems();
  return items.filter((i) => i.featured);
});

export const getActiveSpecials = cache(
  unstable_cache(
    async (): Promise<Special[]> => {
      const sb = getServerClient();
      if (!sb) return [];
      const { data } = await sb
        .from("specials")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      const now = Date.now();
      return ((data as SpecialRow[]) ?? []).map(mapSpecial).filter((s) => {
        if (s.startsAt && new Date(s.startsAt).getTime() > now) return false;
        if (s.endsAt && new Date(s.endsAt).getTime() < now) return false;
        return true;
      });
    },
    ["specials"],
    { tags: ["specials"] }
  )
);

export const getGalleryImages = cache(
  unstable_cache(
    async (): Promise<GalleryImage[]> => {
      const sb = getServerClient();
      if (!sb) return [];
      const { data } = await sb
        .from("gallery_images")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      return ((data as GalleryImageRow[]) ?? []).map(mapGalleryImage);
    },
    ["gallery"],
    { tags: ["gallery"] }
  )
);

export const getOpeningHours = cache(
  unstable_cache(
    async (): Promise<OpeningHoursRow[]> => {
      const sb = getServerClient();
      if (!sb) return [];
      const { data } = await sb
        .from("opening_hours")
        .select("*")
        .order("day_of_week");
      return ((data as OpeningHoursDbRow[]) ?? []).map(mapOpeningHours);
    },
    ["hours"],
    { tags: ["hours"] }
  )
);

export const getEvents = cache(
  unstable_cache(
    async (): Promise<SiteEvent[]> => {
      const sb = getServerClient();
      if (!sb) return [];
      const { data } = await sb
        .from("events")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      return ((data as SiteEventRow[]) ?? []).map(mapSiteEvent);
    },
    ["events"],
    { tags: ["events"] }
  )
);

export const getSiteSettings = cache(
  unstable_cache(
    async (): Promise<SiteSettings | null> => {
      const sb = getServerClient();
      if (!sb) return null;
      const { data } = await sb
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      return data ? mapSiteSettings(data as SiteSettingsRow) : null;
    },
    ["settings"],
    { tags: ["settings"] }
  )
);
