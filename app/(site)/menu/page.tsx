import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import MenuGrid from "@/components/MenuGrid";
import { getCategories, getMenuItems } from "@/lib/queries";
import { fallbackMenu } from "@/lib/default-menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The full Zaba's Shisanyama menu — flame-grilled meat, platters, kotas, sides and drinks.",
  openGraph: { title: "Menu · Zaba's Shisanyama", images: ["/images/logo.png"] },
};

export default async function MenuPage() {
  const [dbCategories, dbItems] = await Promise.all([
    getCategories(),
    getMenuItems(),
  ]);

  // Show the client's printed menu until staff enter items in the dashboard.
  const fallback = fallbackMenu();
  const categories = dbItems.length ? dbCategories : fallback.categories;
  const items = dbItems.length ? dbItems : fallback.items;

  return (
    <div className="pt-16 sm:pt-20">
      <Section tone="char">
        <SectionHeading eyebrow="The Menu" title="Off the fire, onto your plate" />
        <MenuGrid categories={categories} items={items} />
      </Section>
    </div>
  );
}
