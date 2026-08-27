import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import MenuGrid from "@/components/MenuGrid";
import { getCategories, getMenuItems } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The full Zaba's Shisanyama menu — flame-grilled meat, platters, kotas, sides and drinks.",
  openGraph: { title: "Menu · Zaba's Shisanyama", images: ["/images/logo.jpg"] },
};

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    getCategories(),
    getMenuItems(),
  ]);

  return (
    <div className="pt-16 sm:pt-20">
      <Section tone="char">
        <SectionHeading eyebrow="The Menu" title="Off the fire, onto your plate" />
        <MenuGrid categories={categories} items={items} />
      </Section>
    </div>
  );
}
