import Image from "next/image";
import { formatPrice } from "@/lib/format";
import type { Special } from "@/lib/types";
import Eyebrow from "@/components/Eyebrow";

export default function SpecialCard({ special }: { special: Special }) {
  return (
    <article className="grid overflow-hidden border border-hair bg-smoke shadow-[0_32px_80px_-40px_rgba(0,0,0,0.9)] md:grid-cols-2">
      {special.image && (
        <div data-reveal-image className="photo-frame relative aspect-[4/3] md:aspect-auto md:min-h-[320px]">
          <Image
            src={special.image}
            alt={`${special.title} — today's special at Zaba's Shisanyama`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col justify-center p-8 sm:p-12" data-reveal-group>
        <Eyebrow data-reveal className="mb-4">
          Today&rsquo;s Special
        </Eyebrow>
        <h3
          data-reveal
          className="font-display text-2xl uppercase leading-[1.12] text-bone sm:text-3xl"
        >
          {special.title}
        </h3>
        {special.description && (
          <p data-reveal className="mt-4 text-sm leading-relaxed text-ash sm:text-base">
            {special.description}
          </p>
        )}
        <p data-reveal className="mt-6 font-display text-xl text-ember">
          {formatPrice(special.price)}
        </p>
      </div>
    </article>
  );
}
