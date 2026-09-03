import type { Category, MenuItem } from "@/lib/types";

/**
 * The real Zaba's menu, transcribed from the client's printed menu
 * (supplied 2026-08-28). Used only while the `menu_items` table is empty —
 * anything staff add in the dashboard replaces this entirely.
 *
 * Prices are integer cents. Items the printed menu does not price (sides and
 * extras) are null, which renders as "Ask at the counter" — no invented prices.
 */

interface FallbackItem {
  name: string;
  description: string | null;
  price: number | null;
  image?: string;
  featured?: boolean;
}

interface FallbackGroup {
  name: string;
  slug: string;
  items: FallbackItem[];
}

export const DEFAULT_MENU: FallbackGroup[] = [
  {
    name: "Platters",
    slug: "platters",
    items: [
      {
        name: "Platter for 1",
        description:
          "Beef or pork chops, papa or jeqe, 1 wing, chakalaka or Chester wors, and 2 salads.",
        price: 10000,
        image: "/images/food-05.jpg",
        featured: true,
      },
      {
        name: "Platter for 2",
        description:
          "Beef, pork chops, chakalaka or Chester wors, papa or jeqe, 2 salads, 2 wings and a 1.5L Coke.",
        price: 25000,
        image: "/images/food-06.jpg",
        featured: true,
      },
      {
        name: "Platter for 4",
        description:
          "Beef, pork chops, chakalaka or Chester wors, papa or jeqe, 2 salads, 4 wings and a 1.5L Coke.",
        price: 40000,
        image: "/images/food-02.jpg",
        featured: true,
      },
      {
        name: "Platter for 6",
        description:
          "Beef, pork chops or lamb, chakalaka or Chester wors, papa or jeqe, 3 salads, 6 wings and a 2L Coke.",
        price: 55000,
        image: "/images/food-07.jpg",
        featured: true,
      },
    ],
  },
  {
    name: "Plates",
    slug: "plates",
    items: [
      {
        name: "Phuthu & Beef",
        description: null,
        price: 6000,
        image: "/images/plate-beef.jpg",
        featured: true,
      },
      {
        name: "Phuthu & Chicken",
        description: null,
        price: 6000,
        image: "/images/plate-chicken.jpg",
        featured: true,
      },
      { name: "Rice & Beef Curry", description: null, price: 6000 },
      { name: "Biryani (Chicken)", description: null, price: 6000 },
    ],
  },
  {
    /**
     * From the client's printed breakfast menu (photographed 2026-09-01).
     * One priced item; the sheet lists its components rather than pricing
     * them separately, so they are transcribed into the description.
     */
    name: "Breakfast",
    slug: "breakfast",
    items: [
      {
        name: "Breakfast",
        description:
          "X2 eggs (optional), X2 bacon, X1 sausage & fries, X2 slices of bread (optional). Served with mushrooms & beans.",
        price: 5500,
        image: "/images/breakfast.jpg",
      },
    ],
  },
  {
    name: "Sides",
    slug: "sides",
    items: [
      { name: "Salsa", description: null, price: null },
      { name: "Butternut", description: null, price: null },
      { name: "Beetroot", description: null, price: null },
      { name: "Chakalaka", description: null, price: null },
      { name: "Potato Salad", description: null, price: null },
      { name: "Braai Salad Bowl", description: null, price: null },
    ],
  },
  {
    name: "Add-ons",
    slug: "add-ons",
    items: [
      { name: "Creamy Samp", description: null, price: null },
      { name: "Isigwaqane", description: null, price: null },
      { name: "Steam Bread (Ujeqe)", description: null, price: null },
    ],
  },
  {
    /**
     * From the client's printed breakfast menu (photographed 2026-09-01).
     * Where the sheet prices a drink by size, each size is its own row: the
     * schema carries one price per item, and splitting them keeps every
     * price editable in the dashboard instead of buried in prose.
     */
    name: "Drinks",
    slug: "drinks",
    items: [
      { name: "Cappy 300ml", description: null, price: 1600 },
      { name: "Liquifruit 300ml", description: null, price: 1600 },
      {
        name: "Zaba's Mango & Orange Juice (Large)",
        description: null,
        price: 2200,
      },
      { name: "Coffee (Small)", description: null, price: 1300 },
      { name: "Coffee (Medium)", description: null, price: 2000 },
      { name: "Tea (Rooibos / Five Roses)", description: null, price: 1200 },
      { name: "Hot Chocolate (Small)", description: null, price: 1500 },
      { name: "Hot Chocolate (Medium)", description: null, price: 2500 },
      { name: "Cappuccino (Small)", description: null, price: 1500 },
      { name: "Cappuccino (Medium)", description: null, price: 2500 },
    ],
  },
];

const now = new Date(0).toISOString();

/** Shapes the fallback menu into the same types the DB reads produce. */
export function fallbackMenu(): { categories: Category[]; items: MenuItem[] } {
  const categories: Category[] = DEFAULT_MENU.map((g, i) => ({
    id: `fallback-${g.slug}`,
    name: g.name,
    slug: g.slug,
    sortOrder: i,
    visible: true,
    createdAt: now,
    updatedAt: now,
  }));

  const items: MenuItem[] = DEFAULT_MENU.flatMap((g, gi) =>
    g.items.map((item, ii) => ({
      id: `fallback-${g.slug}-${ii}`,
      categoryId: `fallback-${g.slug}`,
      name: item.name,
      slug: `${g.slug}-${ii}`,
      description: item.description,
      price: item.price,
      image: item.image ?? null,
      available: true,
      featured: !!item.featured,
      tags: [],
      sortOrder: gi * 100 + ii,
      visible: true,
      createdAt: now,
      updatedAt: now,
    }))
  );

  return { categories, items };
}
