import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import GalleryGrid from "@/components/GalleryGrid";
import { getGalleryImages } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "The food, the fire and the people — a look inside Zaba's Shisanyama.",
  openGraph: {
    title: "Gallery · Zaba's Shisanyama",
    images: ["/images/logo.png"],
  },
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="pt-16 sm:pt-20">
      <Section tone="char">
        <SectionHeading eyebrow="Gallery" title="The food, the fire, the people" />
        <GalleryGrid images={images} />
      </Section>
    </div>
  );
}
