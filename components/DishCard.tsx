import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

export default function DishCard({
  item,
  index,
  fallbackImage,
  fallbackAlt,
}: {
  item: MenuItem;
  index: number;
  fallbackImage?: string;
  fallbackAlt?: string;
}) {
  const image = item.image || fallbackImage;
  const alt = item.image
    ? `${item.name} at Zaba's Shisanyama`
    : fallbackAlt ?? `${item.name} at Zaba's Shisanyama`;

  return (
    <article className="group" data-cursor="View">
      {image && (
        <div className="photo-frame relative rounded-2xl aspect-[4/3] border border-hair transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:border-gold/40 group-hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]">
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            quality={65}
            className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
          />
          {!item.available && (
            <span className="absolute right-3 top-3 bg-char/90 px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.18em] text-flame">
              Sold out
            </span>
          )}
          {/* hover caption overlay — desktop hover only, static caption below stays for touch */}
          <div className="pointer-events-none absolute inset-0 hidden flex-col justify-end bg-gradient-to-t from-char/90 via-char/30 to-transparent p-5 opacity-0 transition-opacity duration-500 [@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:opacity-100">
            <h3 className="display-xl text-xl text-bone">
              {item.name}
            </h3>
            {item.description && (
              <p className="mt-1 line-clamp-2 text-sm text-ash">
                {item.description}
              </p>
            )}
            <p className="mt-2 text-sm font-semibold text-flame">
              {formatPrice(item.price)}
            </p>
          </div>
        </div>
      )}

      <div
        className={cn(
          "mt-4 transition-opacity duration-500",
          image && "[@media(hover:hover)]:group-hover:opacity-60"
        )}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="display-xl text-xl text-bone">
            <span className="mr-3 text-[0.6875rem] tracking-[0.22em] text-gold">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item.name}
          </h3>
          <p
            className={cn(
              "shrink-0 text-sm font-semibold",
              item.available ? "text-ember" : "text-ash line-through"
            )}
          >
            {formatPrice(item.price)}
          </p>
        </div>
        {item.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-ash">
            {item.description}
          </p>
        )}
        {!item.available && !image && (
          <p className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.18em] text-flame">
            Sold out
          </p>
        )}
        {item.tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <li
                key={t}
                className="border border-hair px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.14em] text-ash"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
