import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Offset two-column grid with curtain reveals. Falls back to the local
 * image set until staff upload their own photos.
 */
export const LOCAL_GALLERY: Pick<GalleryImage, "image" | "alt" | "caption">[] = [
  {
    image: "/images/food-05.jpg",
    alt: "A loaded braai board of steak, wings and boerewors on a red slatted table",
    caption: "Order up",
  },
  {
    image: "/images/food-01.webp",
    alt: "Friends sharing a pile of flame-grilled chicken and ribs on a wooden board",
    caption: "Come hungry",
  },
  {
    image: "/images/food-02.jpg",
    alt: "Boerewors coils, roast meat and pap on a wooden serving board",
    caption: "From the fire",
  },
  {
    image: "/images/food-06.jpg",
    alt: "Hands carving ribs and grilled meat on a shared board",
    caption: "Shared, always",
  },
  {
    image: "/images/food-03.jpg",
    alt: "A takeaway tray of grilled wings, bread and fresh sides with the Zaba's tag",
    caption: "To go",
  },
  {
    image: "/images/alcohol.webp",
    alt: "Shelves of spirits and drinks behind the bar at Zaba's",
    caption: "The bar",
  },
];

export default function GalleryGrid({
  images,
  limit,
}: {
  images: GalleryImage[];
  limit?: number;
}) {
  const list = (images.length ? images : (LOCAL_GALLERY as GalleryImage[])).slice(
    0,
    limit
  );

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {list.map((img, i) => (
        <li
          key={img.image + i}
          className={cn("sm:even:mt-16", i === 0 && "sm:mt-0")}
        >
          <figure>
            <div
              data-reveal-image
              className={cn(
                "relative overflow-hidden bg-smoke",
                i % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/3]"
              )}
            >
              <Image
                src={img.image}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            {img.caption && (
              <figcaption className="mt-3 text-[0.6875rem] uppercase tracking-[0.22em] text-ash">
                {img.caption}
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  );
}
