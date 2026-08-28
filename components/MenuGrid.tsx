"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Category, MenuItem } from "@/lib/types";
import DishCard from "@/components/DishCard";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Category slug → local fallback image when an item has no uploaded photo. */
const CATEGORY_FALLBACKS: Record<string, { src: string; alt: string }> = {
  "from-the-grill": {
    src: "/images/food-07.jpg",
    alt: "Grilled lamb chops with steamed bread and chilli relish on a wooden board",
  },
  platters: {
    src: "/images/food-02.jpg",
    alt: "Boerewors coils, roast meat and pap on a wooden serving board",
  },
  kotas: {
    src: "/images/food-03.jpg",
    alt: "A takeaway tray of flame-grilled chicken wings, bread and fresh sides",
  },
  sides: {
    src: "/images/food-04.jpg",
    alt: "A plate of chicken stew with rice and fresh sides",
  },
  drinks: {
    src: "/images/alcohol.webp",
    alt: "Shelves of spirits and drinks behind the bar at Zaba's",
  },
};

export default function MenuGrid({
  categories,
  items,
}: {
  categories: Category[];
  items: MenuItem[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? items.filter((i) => i.categoryId === active) : items),
    [active, items]
  );

  const slugById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.slug])),
    [categories]
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
        className="no-scrollbar -mx-5 mb-12 flex gap-6 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
        role="group"
        aria-label="Filter menu by category"
      >
        <FilterButton
          label="Everything"
          active={active === null}
          onClick={() => setActive(null)}
        />
        {categories.map((c) => (
          <FilterButton
            key={c.id}
            label={c.name}
            active={active === c.id}
            onClick={() => setActive(c.id)}
          />
        ))}
      </div>

      <motion.ul
        layout
        className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => {
            const fallback = CATEGORY_FALLBACKS[slugById.get(item.categoryId) ?? ""];
            return (
              <motion.li
                layout
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <DishCard
                  item={item}
                  index={i}
                  fallbackImage={fallback?.src}
                  fallbackAlt={fallback?.alt}
                />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
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
