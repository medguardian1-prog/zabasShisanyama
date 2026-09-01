"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";
import { requireStaffSession } from "@/lib/auth";
import { DEFAULT_MENU } from "@/lib/default-menu";
import { DEFAULT_HOURS as CLIENT_HOURS } from "@/lib/hours";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

const fail = (error: string): ActionResult => ({ ok: false, error });
const OK: ActionResult = { ok: true };
const done = (message: string): ActionResult => ({ ok: true, message });

/** Every admin mutation re-verifies the session — middleware is not the only gate. */
async function guard(): Promise<
  { sb: SupabaseClient } | { error: ActionResult }
> {
  if (!(await requireStaffSession())) {
    return { error: fail("Your session has expired — please log in again.") };
  }
  const sb = getAdminClient();
  if (!sb) {
    return { error: fail("The database isn't connected yet.") };
  }
  return { sb };
}

function revalidatePublic(...tags: string[]) {
  tags.forEach((t) => revalidateTag(t));
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

const idSchema = z.string().min(1).max(64);

/* --------------------------------- upload --------------------------------- */

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function uploadToMedia(
  sb: SupabaseClient,
  file: File
): Promise<{ url: string } | { error: string }> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) return { error: "Please upload a JPG, PNG or WebP photo." };
  if (file.size > 8 * 1024 * 1024) {
    return { error: "That photo is too large — try again." };
  }
  const name = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await sb.storage
    .from("media")
    .upload(name, file, { contentType: file.type });
  if (error) return { error: "Upload failed — please try again." };
  const { data } = sb.storage.from("media").getPublicUrl(name);
  return { url: data.publicUrl };
}

/* -------------------------------- menu items ------------------------------- */

const menuItemSchema = z.object({
  categoryId: idSchema,
  name: z.string().trim().min(1, "Give the item a name.").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  /** price in RANDS from the form; stored as integer cents. Empty = ask at counter */
  price: z.string().trim().max(12).optional().or(z.literal("")),
  tags: z.string().trim().max(300).optional().or(z.literal("")),
  featured: z.coerce.boolean().optional(),
});

function parsePriceToCents(input: string | undefined): number | null | "bad" {
  if (!input) return null;
  const n = Number(input.replace(/[R\s,]/gi, ""));
  if (Number.isNaN(n) || n < 0 || n > 1_000_000) return "bad";
  return Math.round(n * 100);
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "item"
  );
}

export async function saveMenuItem(formData: FormData): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;

  const parsed = menuItemSchema.safeParse({
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    tags: formData.get("tags"),
    featured: formData.get("featured") === "on",
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check the form.");
  }

  const cents = parsePriceToCents(parsed.data.price);
  if (cents === "bad") return fail("That price doesn't look right.");

  let image: string | null = null;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const up = await uploadToMedia(g.sb, photo);
    if ("error" in up) return fail(up.error);
    image = up.url;
  }

  const tags = (parsed.data.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const id = formData.get("id");

  if (typeof id === "string" && id) {
    const patch: Record<string, unknown> = {
      category_id: parsed.data.categoryId,
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: cents,
      tags,
      featured: !!parsed.data.featured,
      updated_at: new Date().toISOString(),
    };
    if (image) patch.image = image;
    const { error } = await g.sb.from("menu_items").update(patch).eq("id", id);
    if (error) return fail("Couldn't save — please try again.");
  } else {
    const { data: maxRow } = await g.sb
      .from("menu_items")
      .select("sort_order")
      .eq("category_id", parsed.data.categoryId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error } = await g.sb.from("menu_items").insert({
      category_id: parsed.data.categoryId,
      name: parsed.data.name,
      slug: `${slugify(parsed.data.name)}-${Date.now().toString(36)}`,
      description: parsed.data.description || null,
      price: cents,
      image,
      tags,
      featured: !!parsed.data.featured,
      available: true,
      visible: true,
      sort_order: (maxRow?.sort_order ?? 0) + 1,
    });
    if (error) return fail("Couldn't add the item — please try again.");
  }

  revalidatePublic("menu");
  return OK;
}

export async function setItemAvailability(
  id: string,
  available: boolean
): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");

  const { error } = await g.sb
    .from("menu_items")
    .update({ available, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return fail("Couldn't update — please try again.");
  revalidatePublic("menu");
  return OK;
}

export async function setItemVisibility(
  id: string,
  visible: boolean
): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");

  const { error } = await g.sb
    .from("menu_items")
    .update({ visible, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return fail("Couldn't update — please try again.");
  revalidatePublic("menu");
  return OK;
}

export async function updateItemPrice(
  id: string,
  priceInput: string
): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");
  const cents = parsePriceToCents(priceInput);
  if (cents === "bad") return fail("That price doesn't look right.");

  const { error } = await g.sb
    .from("menu_items")
    .update({ price: cents, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return fail("Couldn't save the price — please try again.");
  revalidatePublic("menu");
  return OK;
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");

  const { error } = await g.sb.from("menu_items").delete().eq("id", id);
  if (error) return fail("Couldn't delete — please try again.");
  revalidatePublic("menu");
  return OK;
}

/** Reorder via up/down arrows: swap sort_order with the neighbour. */
export async function moveRow(
  table: "menu_items" | "gallery_images" | "events" | "specials",
  id: string,
  direction: "up" | "down",
  scope?: { column: string; value: string }
): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");
  const allowed = ["menu_items", "gallery_images", "events", "specials"];
  if (!allowed.includes(table)) return fail("Bad request.");

  let query = g.sb.from(table).select("id, sort_order").order("sort_order");
  if (scope) query = query.eq(scope.column, scope.value);
  const { data: rows, error } = await query;
  if (error || !rows) return fail("Couldn't reorder — please try again.");

  const index = rows.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= rows.length) return OK;

  const a = rows[index];
  const b = rows[swapWith];
  const [r1, r2] = await Promise.all([
    g.sb.from(table).update({ sort_order: b.sort_order }).eq("id", a.id),
    g.sb.from(table).update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  if (r1.error || r2.error) return fail("Couldn't reorder — please try again.");

  revalidatePublic("menu", "gallery", "events", "specials");
  return OK;
}

/* --------------------------------- specials -------------------------------- */

const specialSchema = z.object({
  title: z.string().trim().min(1, "Give the special a title.").max(160),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  price: z.string().trim().max(12).optional().or(z.literal("")),
  startsAt: z.string().trim().max(40).optional().or(z.literal("")),
  endsAt: z.string().trim().max(40).optional().or(z.literal("")),
});

export async function saveSpecial(formData: FormData): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;

  const parsed = specialSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check the form.");
  }
  const cents = parsePriceToCents(parsed.data.price);
  if (cents === "bad") return fail("That price doesn't look right.");

  let image: string | null = null;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const up = await uploadToMedia(g.sb, photo);
    if ("error" in up) return fail(up.error);
    image = up.url;
  }

  const id = formData.get("id");
  const base = {
    title: parsed.data.title,
    description: parsed.data.description || null,
    price: cents,
    starts_at: parsed.data.startsAt || null,
    ends_at: parsed.data.endsAt || null,
    updated_at: new Date().toISOString(),
  };

  if (typeof id === "string" && id) {
    const patch: Record<string, unknown> = { ...base };
    if (image) patch.image = image;
    const { error } = await g.sb.from("specials").update(patch).eq("id", id);
    if (error) return fail("Couldn't save — please try again.");
  } else {
    const { error } = await g.sb
      .from("specials")
      .insert({ ...base, image, active: false, sort_order: 0 });
    if (error) return fail("Couldn't add the special — please try again.");
  }

  revalidatePublic("specials");
  return OK;
}

/** One-tap "Set as today's special" — deactivates all the others. */
export async function setTodaysSpecial(id: string): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");

  const off = await g.sb.from("specials").update({ active: false }).neq("id", id);
  if (off.error) return fail("Couldn't update — please try again.");
  const on = await g.sb.from("specials").update({ active: true }).eq("id", id);
  if (on.error) return fail("Couldn't update — please try again.");

  revalidatePublic("specials");
  return OK;
}

export async function setSpecialActive(
  id: string,
  active: boolean
): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");

  const { error } = await g.sb.from("specials").update({ active }).eq("id", id);
  if (error) return fail("Couldn't update — please try again.");
  revalidatePublic("specials");
  return OK;
}

export async function deleteSpecial(id: string): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");

  const { error } = await g.sb.from("specials").delete().eq("id", id);
  if (error) return fail("Couldn't delete — please try again.");
  revalidatePublic("specials");
  return OK;
}

/* ---------------------------------- hours ---------------------------------- */

const hoursSchema = z.object({
  id: idSchema,
  opens: z.string().trim().max(8).optional().or(z.literal("")),
  closes: z.string().trim().max(8).optional().or(z.literal("")),
  closed: z.boolean(),
  note: z.string().trim().max(200).optional().or(z.literal("")),
});

export async function saveDayHours(formData: FormData): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;

  const parsed = hoursSchema.safeParse({
    id: formData.get("id"),
    opens: formData.get("opens"),
    closes: formData.get("closes"),
    closed: formData.get("closed") === "on",
    note: formData.get("note"),
  });
  if (!parsed.success) return fail("Check the times and try again.");

  const { error } = await g.sb
    .from("opening_hours")
    .update({
      opens: parsed.data.opens || null,
      closes: parsed.data.closes || null,
      closed: parsed.data.closed,
      note: parsed.data.note || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);
  if (error) return fail("Couldn't save — please try again.");

  revalidatePublic("hours");
  return OK;
}

export async function saveAnnouncement(
  formData: FormData
): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;

  const text = String(formData.get("text") ?? "").trim().slice(0, 300);
  const active = formData.get("active") === "on";
  if (active && !text) {
    return fail("Write the announcement before switching it on.");
  }

  const { error } = await g.sb
    .from("site_settings")
    .update({
      announcement_text: text || null,
      announcement_active: active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);
  if (error) return fail("Couldn't save — please try again.");

  revalidatePublic("settings");
  return OK;
}

/* --------------------------------- gallery --------------------------------- */

export async function addGalleryImage(
  formData: FormData
): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return fail("Choose a photo first.");
  }
  const alt = String(formData.get("alt") ?? "").trim().slice(0, 300);
  if (!alt) return fail("Describe the photo (this helps blind visitors).");
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 200);

  const up = await uploadToMedia(g.sb, photo);
  if ("error" in up) return fail(up.error);

  const { data: maxRow } = await g.sb
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await g.sb.from("gallery_images").insert({
    image: up.url,
    alt,
    caption: caption || null,
    visible: true,
    sort_order: (maxRow?.sort_order ?? 0) + 1,
  });
  if (error) return fail("Couldn't add the photo — please try again.");

  revalidatePublic("gallery");
  return OK;
}

export async function setGalleryVisibility(
  id: string,
  visible: boolean
): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");

  const { error } = await g.sb
    .from("gallery_images")
    .update({ visible, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return fail("Couldn't update — please try again.");
  revalidatePublic("gallery");
  return OK;
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");

  const { error } = await g.sb.from("gallery_images").delete().eq("id", id);
  if (error) return fail("Couldn't delete — please try again.");
  revalidatePublic("gallery");
  return OK;
}

/* ---------------------------------- events --------------------------------- */

const eventSchema = z.object({
  title: z.string().trim().min(1, "Give the event a title.").max(160),
  eventDate: z.string().trim().max(40).optional().or(z.literal("")),
  description: z.string().trim().max(600).optional().or(z.literal("")),
});

export async function saveEvent(formData: FormData): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    eventDate: formData.get("eventDate"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check the form.");
  }

  let image: string | null = null;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const up = await uploadToMedia(g.sb, photo);
    if ("error" in up) return fail(up.error);
    image = up.url;
  }

  const id = formData.get("id");
  const base = {
    title: parsed.data.title,
    event_date: parsed.data.eventDate || null,
    description: parsed.data.description || null,
    updated_at: new Date().toISOString(),
  };

  if (typeof id === "string" && id) {
    const patch: Record<string, unknown> = { ...base };
    if (image) patch.image = image;
    const { error } = await g.sb.from("events").update(patch).eq("id", id);
    if (error) return fail("Couldn't save — please try again.");
  } else {
    const { data: maxRow } = await g.sb
      .from("events")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error } = await g.sb.from("events").insert({
      ...base,
      image,
      visible: true,
      sort_order: (maxRow?.sort_order ?? 0) + 1,
    });
    if (error) return fail("Couldn't add the event — please try again.");
  }

  revalidatePublic("events");
  return OK;
}

export async function setEventVisibility(
  id: string,
  visible: boolean
): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");

  const { error } = await g.sb
    .from("events")
    .update({ visible, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return fail("Couldn't update — please try again.");
  revalidatePublic("events");
  return OK;
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");

  const { error } = await g.sb.from("events").delete().eq("id", id);
  if (error) return fail("Couldn't delete — please try again.");
  revalidatePublic("events");
  return OK;
}

/* --------------------------------- enquiries -------------------------------- */

export async function setEnquiryStatus(
  id: string,
  status: "new" | "handled" | "archived"
): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;
  if (!idSchema.safeParse(id).success) return fail("Bad request.");
  if (!["new", "handled", "archived"].includes(status)) return fail("Bad request.");

  const { error } = await g.sb.from("enquiries").update({ status }).eq("id", id);
  if (error) return fail("Couldn't update — please try again.");
  revalidatePath("/admin", "layout");
  return OK;
}

/* ------------------------------ first-run import ---------------------------- */

/**
 * Copies the printed menu into the database so staff can edit it here, and
 * puts the categories in printed-menu order (Platters first). Safe to run
 * repeatedly: items are only inserted when there are none, so re-running
 * just re-syncs the ordering.
 */
export async function importPrintedMenu(): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;

  const { data: existing, error: readError } = await g.sb
    .from("categories")
    .select("id, slug");
  if (readError) {
    return fail(`Couldn't read the categories — ${readError.message}`);
  }

  const bySlug = new Map(
    ((existing as { id: string; slug: string }[]) ?? []).map((c) => [
      c.slug,
      c.id,
    ])
  );

  const now = new Date().toISOString();

  // Categories the printed menu uses lead, in its own order; anything else
  // already in the table is pushed after them.
  for (const [index, group] of DEFAULT_MENU.entries()) {
    const { data: saved, error } = await g.sb
      .from("categories")
      .upsert(
        {
          name: group.name,
          slug: group.slug,
          sort_order: index,
          visible: true,
          updated_at: now,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error || !saved) {
      return fail(
        `Couldn't set up the "${group.name}" category — ${
          error?.message ?? "no row returned"
        }`
      );
    }
    bySlug.set(group.slug, saved.id as string);
  }

  const menuSlugs = new Set(DEFAULT_MENU.map((g) => g.slug));
  const others = ((existing as { id: string; slug: string }[]) ?? []).filter(
    (c) => !menuSlugs.has(c.slug)
  );
  for (const [i, c] of others.entries()) {
    await g.sb
      .from("categories")
      .update({ sort_order: DEFAULT_MENU.length + i })
      .eq("id", c.id);
  }

  // Add what is missing, touch nothing that already exists.
  //
  // This used to insert only when the whole table was empty, which meant a
  // second run — the one that matters when a new page of the printed menu
  // arrives — silently created the categories and none of their items. Now
  // each printed item is matched against the rows already in its category by
  // name, and only the absent ones are inserted. Anything staff have edited,
  // renamed, repriced or hidden is left exactly as it is; re-running is safe.
  const { data: existingItems, error: itemsError } = await g.sb
    .from("menu_items")
    .select("category_id, name, sort_order");
  if (itemsError) {
    return fail(`Couldn't read the current menu — ${itemsError.message}`);
  }

  const rows = (existingItems as
    | { category_id: string; name: string; sort_order: number }[]
    | null) ?? [];

  const key = (categoryId: string, name: string) =>
    `${categoryId}::${name.trim().toLowerCase()}`;
  const present = new Set(rows.map((r) => key(r.category_id, r.name)));

  // New items land after whatever is already in their category.
  const nextSort = new Map<string, number>();
  for (const r of rows) {
    const highest = nextSort.get(r.category_id) ?? -1;
    if (r.sort_order > highest) nextSort.set(r.category_id, r.sort_order);
  }

  let added = 0;

  for (const group of DEFAULT_MENU) {
    const categoryId = bySlug.get(group.slug);
    if (!categoryId) continue;

    const missing = group.items.filter(
      (item) => !present.has(key(categoryId, item.name))
    );
    if (!missing.length) continue;

    let sort = (nextSort.get(categoryId) ?? -1) + 1;
    const stamp = Date.now().toString(36);

    const { error } = await g.sb.from("menu_items").insert(
      missing.map((item, i) => ({
        category_id: categoryId,
        name: item.name,
        slug: `${group.slug}-${sort + i}-${stamp}`,
        description: item.description,
        price: item.price,
        image: item.image ?? null,
        tags: [],
        featured: !!item.featured,
        available: true,
        visible: true,
        sort_order: sort + i,
        created_at: now,
        updated_at: now,
      }))
    );
    if (error) {
      return fail(`Couldn't import "${group.name}" — ${error.message}`);
    }

    sort += missing.length;
    nextSort.set(categoryId, sort - 1);
    added += missing.length;
  }

  revalidatePublic("menu");

  if (added === 0) {
    return done("Everything on the printed menu is already here.");
  }
  return done(
    added === 1
      ? "Added 1 item from the printed menu."
      : `Added ${added} items from the printed menu.`
  );
}

export async function importTradingHours(): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;

  const { data: rows, error: readError } = await g.sb
    .from("opening_hours")
    .select("id, day_of_week");
  if (readError) {
    return fail(`Couldn't read the hours — ${readError.message}`);
  }
  if (!rows?.length) return fail("No opening-hours rows to update.");

  for (const row of rows as { id: string; day_of_week: number }[]) {
    const t = CLIENT_HOURS[row.day_of_week];
    if (!t) continue;
    const { error } = await g.sb
      .from("opening_hours")
      .update({
        opens: t.opens,
        closes: t.closes,
        closed: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    if (error) return fail(`Couldn't save the hours — ${error.message}`);
  }

  revalidatePublic("hours");
  return OK;
}

/* --------------------------------- settings -------------------------------- */

const settingsSchema = z.object({
  phone: z.string().trim().max(40),
  whatsapp: z.string().trim().max(40),
  address: z.string().trim().max(400),
  mapLink: z.string().trim().max(600),
  instagram: z.string().trim().max(300),
  facebook: z.string().trim().max(300),
  tiktok: z.string().trim().max(300),
});

export async function saveSettings(formData: FormData): Promise<ActionResult> {
  const g = await guard();
  if ("error" in g) return g.error;

  const parsed = settingsSchema.safeParse({
    phone: formData.get("phone") ?? "",
    whatsapp: formData.get("whatsapp") ?? "",
    address: formData.get("address") ?? "",
    mapLink: formData.get("mapLink") ?? "",
    instagram: formData.get("instagram") ?? "",
    facebook: formData.get("facebook") ?? "",
    tiktok: formData.get("tiktok") ?? "",
  });
  if (!parsed.success) return fail("Check the form and try again.");

  const d = parsed.data;
  const { error } = await g.sb
    .from("site_settings")
    .update({
      phone: d.phone || null,
      whatsapp: d.whatsapp || null,
      address: d.address || null,
      map_link: d.mapLink || null,
      instagram: d.instagram || null,
      facebook: d.facebook || null,
      tiktok: d.tiktok || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);
  if (error) return fail("Couldn't save — please try again.");

  revalidatePublic("settings");
  return OK;
}
