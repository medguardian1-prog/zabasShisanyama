/**
 * Hand-written interfaces mirroring the Supabase tables (snake_case in the
 * DB, camelCase here). These are the contract between the DB and every
 * component. Mapping happens in lib/queries.ts / server actions.
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  /** integer cents; null = "Ask at the counter" */
  price: number | null;
  image: string | null;
  available: boolean;
  featured: boolean;
  tags: string[];
  sortOrder: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Special {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  image: string | null;
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  image: string;
  alt: string;
  caption: string | null;
  sortOrder: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHoursRow {
  id: string;
  /** 0 = Sunday .. 6 = Saturday */
  dayOfWeek: number;
  opens: string | null;
  closes: string | null;
  closed: boolean;
  note: string | null;
  updatedAt: string;
}

export interface SiteEvent {
  id: string;
  title: string;
  eventDate: string | null;
  description: string | null;
  image: string | null;
  visible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryType = "booking" | "contact" | "large-order";
export type EnquiryStatus = "new" | "handled" | "archived";

export interface Enquiry {
  id: string;
  type: EnquiryType;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  eventDate: string | null;
  partySize: number | null;
  status: EnquiryStatus;
  createdAt: string;
}

export interface SiteSettings {
  id: boolean;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  mapLink: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  announcementText: string | null;
  announcementActive: boolean;
  updatedAt: string;
}

/* ------------------------- raw DB row shapes (snake) ------------------------ */

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemRow {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  image: string | null;
  available: boolean;
  featured: boolean;
  tags: string[] | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpecialRow {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  image: string | null;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryImageRow {
  id: string;
  image: string;
  alt: string;
  caption: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpeningHoursDbRow {
  id: string;
  day_of_week: number;
  opens: string | null;
  closes: string | null;
  closed: boolean;
  note: string | null;
  updated_at: string;
}

export interface SiteEventRow {
  id: string;
  title: string;
  event_date: string | null;
  description: string | null;
  image: string | null;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface EnquiryRow {
  id: string;
  type: EnquiryType;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  event_date: string | null;
  party_size: number | null;
  status: EnquiryStatus;
  created_at: string;
}

export interface SiteSettingsRow {
  id: boolean;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  map_link: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  announcement_text: string | null;
  announcement_active: boolean;
  updated_at: string;
}

/* --------------------------------- mappers --------------------------------- */

export const mapCategory = (r: CategoryRow): Category => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  sortOrder: r.sort_order,
  visible: r.visible,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const mapMenuItem = (r: MenuItemRow): MenuItem => ({
  id: r.id,
  categoryId: r.category_id,
  name: r.name,
  slug: r.slug,
  description: r.description,
  price: r.price,
  image: r.image,
  available: r.available,
  featured: r.featured,
  tags: r.tags ?? [],
  sortOrder: r.sort_order,
  visible: r.visible,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const mapSpecial = (r: SpecialRow): Special => ({
  id: r.id,
  title: r.title,
  description: r.description,
  price: r.price,
  image: r.image,
  startsAt: r.starts_at,
  endsAt: r.ends_at,
  active: r.active,
  sortOrder: r.sort_order,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const mapGalleryImage = (r: GalleryImageRow): GalleryImage => ({
  id: r.id,
  image: r.image,
  alt: r.alt,
  caption: r.caption,
  sortOrder: r.sort_order,
  visible: r.visible,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const mapOpeningHours = (r: OpeningHoursDbRow): OpeningHoursRow => ({
  id: r.id,
  dayOfWeek: r.day_of_week,
  opens: r.opens,
  closes: r.closes,
  closed: r.closed,
  note: r.note,
  updatedAt: r.updated_at,
});

export const mapSiteEvent = (r: SiteEventRow): SiteEvent => ({
  id: r.id,
  title: r.title,
  eventDate: r.event_date,
  description: r.description,
  image: r.image,
  visible: r.visible,
  sortOrder: r.sort_order,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const mapEnquiry = (r: EnquiryRow): Enquiry => ({
  id: r.id,
  type: r.type,
  name: r.name,
  phone: r.phone,
  email: r.email,
  message: r.message,
  eventDate: r.event_date,
  partySize: r.party_size,
  status: r.status,
  createdAt: r.created_at,
});

export const mapSiteSettings = (r: SiteSettingsRow): SiteSettings => ({
  id: r.id,
  phone: r.phone,
  whatsapp: r.whatsapp,
  address: r.address,
  mapLink: r.map_link,
  instagram: r.instagram,
  facebook: r.facebook,
  tiktok: r.tiktok,
  announcementText: r.announcement_text,
  announcementActive: r.announcement_active,
  updatedAt: r.updated_at,
});
