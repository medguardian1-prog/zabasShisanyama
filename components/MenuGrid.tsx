"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Category, MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Type-led menu. Deliberately image-free: the photo library cannot cover
 * every dish, and repeating the same few shots across rows looked cheap.
 * Clarity and price legibility win here — the photography lives in the
 * gallery and the homepage strip.
 */
export default function MenuGrid({
  categories,
  items,
}: {
  categories: Category[];
  items: MenuItem[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const visibleCategories = useMemo(
    () =>
      categories.filter((c) => items.some((i) => i.categoryId === c.id)),
    [categories, items]
  );

  const shown = useMemo(
    () => (active ? visibleCategories.filter((c) => c.id === active) : visibleCategories),
    [active, visibleCategories]
  );

  if (!items.length) {
    return (
      <p className="py-16 text-center text-ash">
        The menu is being written up — call or come through to see what&rsquo;s
        on the fire today.
      </p>
    );
  }

  return (
    <div>
      <div
        className="no-scrollbar -mx-5 mb-14 flex gap-6 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
        role="group"
        aria-label="Filter menu by category"
      >
        <FilterButton
          label="Everything"
          active={active === null}
          onClick={() => setActive(null)}
        />
        {visibleCategories.map((c) => (
          <FilterButton
            key={c.id}
            label={c.name}
            active={active === c.id}
            onClick={() => setActive(c.id)}
          />
        ))}
      </div>

      <motion.div layout className="space-y-16 sm:space-y-20">
        <AnimatePresence mode="popLayout">
          {shown.map((category) => {
            const list = items.filter((i) => i.categoryId === category.id);
            return (
              <motion.section
                layout
                key={category.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.5, ease: EASE }}
                aria-labelledby={`cat-${category.id}`}
              >
                <div className="mb-8 flex items-center gap-5">
                  <h2
                    id={`cat-${category.id}`}
                    className="display-xl text-3xl text-bone sm:text-4xl"
                  >
                    {category.name}
                  </h2>
                  <span className="h-px flex-1 bg-hair" aria-hidden="true" />
                  <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-gold">
                    {String(list.length).padStart(2, "0")}
                  </span>
                </div>

                <ul className="grid gap-x-14 gap-y-1 lg:grid-cols-2">
                  {list.map((item) => (
                    <MenuRow key={item.id} item={item} />
                  ))}
                </ul>
              </motion.section>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="border-b border-hair/70 py-5">
      <div className="flex items-baseline gap-4">
        <h3
          className={cn(
            "display-xl text-xl sm:text-2xl",
            item.available ? "text-bone" : "text-ash"
          )}
        >
          {item.name}
        </h3>

        {/* dotted leader keeps the eye travelling to the price */}
        <span
          aria-hidden="true"
          className="mb-1 min-w-6 flex-1 border-b border-dotted border-hair"
        />

        <p
          className={cn(
            "shrink-0 whitespace-nowrap display-xl text-xl sm:text-2xl",
            item.available ? "text-ember" : "text-ash line-through"
          )}
        >
          {formatPrice(item.price)}
        </p>
      </div>

      {(item.description || !item.available || item.tags.length > 0) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 pr-16">
          {!item.available && (
            <span className="border border-flame/60 px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.18em] text-flame">
              Sold out
            </span>
          )}
          {item.description && (
            <p className="text-sm leading-relaxed text-ash">
              {item.description}
            </p>
          )}
          {item.tags.map((t) => (
            <span
              key={t}
              className="border border-hair px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.14em] text-ash"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[44px] shrink-0 items-center border-b-2 text-[0.75rem] uppercase tracking-[0.18em] transition-colors duration-300",
        active
          ? "border-ember text-bone"
          : "border-transparent text-ash hover:text-bone"
      )}
    >
      {label}
    </button>
  );
}
