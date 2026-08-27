import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Local set used until staff upload their own photos. */
export const LOCAL_GALLERY: Pick<GalleryImage, "image" | "alt" | "caption">[] = [
  {
    image: "/images/food-07.jpg",
    alt: "Flame-grilled lamb chops with steamed pap and chilli relish on a wooden board",
    caption: "Chops & pap",
  },
  {
    image: "/images/food-02.jpg",
    alt: "Boerewors coils, roast meat and pap on a wooden serving board",
    caption: "The full board",
  },
  {
    image: "/images/food-05.jpg",
    alt: "A braai board of steak, wings and boerewors on a red slatted table",
    caption: "Order 22, up",
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
    image: "/images/food-01.webp",
    alt: "Friends sharing a long board piled with flame-grilled chicken wings",
    caption: "Come hungry",
  },
  {
    image: "/images/alcohol.webp",
    alt: "Shelves of spirits and drinks behind the bar at Zaba's",
    caption: "The bar",
  },
  {
    image: "/images/food-04.jpg",
    alt: "A plated chicken stew with rice, chakalaka and fresh sides",
    caption: "Plated up",
  },
];

function Tile({
  img,
  aspect,
  sizes,
  priority,
}: {
  img: Pick<GalleryImage, "image" | "alt" | "caption">;
  aspect: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <figure className="group relative h-full" data-cursor="View">
      <div
        data-reveal-image
        className={cn(
          "photo-frame relative h-full border border-hair transition-colors duration-500 group-hover:border-gold/40",
          aspect
        )}
      >
        <Image
          src={img.image}
          alt={img.alt}
          fill
          sizes={sizes}
          quality={64}
          priority={priority}
          className="object-cover transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-char/85 via-char/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        {img.caption && (
          <figcaption className="absolute inset-x-0 bottom-0 z-[3] flex items-center gap-3 p-5">
            <span
              aria-hidden="true"
              className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-10"
            />
            <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-bone">
              {img.caption}
            </span>
          </figcaption>
        )}
      </div>
    </figure>
  );
}

/**
 * `mosaic` — asymmetric editorial block for the homepage teaser.
 * `masonry` — full gallery page, natural column flow.
 */
export default function GalleryGrid({
  images,
  variant = "masonry",
}: {
  images: GalleryImage[];
  variant?: "mosaic" | "masonry";
}) {
  const list = images.length
    ? images
    : (LOCAL_GALLERY as GalleryImage[]);

  if (variant === "mosaic") {
    const [a, b, c, d] = list;
    return (
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-12 lg:grid-rows-2">
        <div className="lg:col-span-7 lg:row-span-2">
          {a && (
            <Tile
              img={a}
              aspect="aspect-[4/5] lg:aspect-auto lg:min-h-[36rem]"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          )}
        </div>
        <div className="lg:col-span-5">
          {b && (
            <Tile
              img={b}
              aspect="aspect-[16/10] lg:aspect-auto lg:min-h-[17.5rem]"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          )}
        </div>
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:col-span-5">
          {c && (
            <Tile
              img={c}
              aspect="aspect-square lg:aspect-auto lg:min-h-[17.5rem]"
              sizes="(min-width: 1024px) 21vw, 50vw"
            />
          )}
          {d && (
            <Tile
              img={d}
              aspect="aspect-square lg:aspect-auto lg:min-h-[17.5rem]"
              sizes="(min-width: 1024px) 21vw, 50vw"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {list.map((img, i) => (
        <div key={img.image + i} className="mb-5 break-inside-avoid">
          <Tile
            img={img}
            aspect={
              i % 5 === 0
                ? "aspect-[3/4]"
                : i % 3 === 0
                  ? "aspect-square"
                  : "aspect-[4/5]"
            }
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      ))}
    </div>
  );
}
