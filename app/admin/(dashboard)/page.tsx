import Link from "next/link";
import { adminMenuItems, adminSpecials } from "@/app/admin/queries";
import {
  adminCategories,
  adminConnectionCheck,
  adminOpeningHours,
} from "@/app/admin/queries";
import FirstRunImport from "@/components/admin/FirstRunImport";
import ScreenHelp from "@/components/admin/ScreenHelp";
import { ADMIN_HELP } from "@/lib/admin-help";
import { DEFAULT_MENU } from "@/lib/default-menu";

export default async function AdminHomePage() {
  const [connection, items, specials, hours] = await Promise.all([
    adminConnectionCheck(),
    adminMenuItems(),
    adminSpecials(),
    adminOpeningHours(),
  ]);

  const connected = connection.ok;
  const needsMenu = connected && items.length === 0;
  const needsHours =
    connected && hours.length > 0 && hours.every((h) => !h.opens && !h.closed);

  // The printed-menu categories should lead, in their own order. If they do
  // not, offer the import again — re-running only re-syncs the ordering.
  const categories = await adminCategories();
  const printedOrder = DEFAULT_MENU.map((g) => g.slug);
  const actualOrder = categories
    .map((c) => c.slug)
    .filter((s) => printedOrder.includes(s));
  const orderNeedsFix =
    connected &&
    items.length > 0 &&
    actualOrder.join(",") !==
      printedOrder.filter((s) => actualOrder.includes(s)).join(",");

  // How much of the printed menu is not in the database yet. This is what
  // catches a new page of the menu (breakfast, drinks) after the first import
  // has already run — matched by name within a category, the same way the
  // import itself decides what to add, so the count and the button agree.
  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  const presentItems = new Set(
    items.map((i) => `${i.categoryId}::${i.name.trim().toLowerCase()}`),
  );
  const missingCount = DEFAULT_MENU.reduce((total, group) => {
    const categoryId = categoryIdBySlug.get(group.slug);
    if (!categoryId) return total + group.items.length;
    return (
      total +
      group.items.filter(
        (item) =>
          !presentItems.has(`${categoryId}::${item.name.trim().toLowerCase()}`),
      ).length
    );
  }, 0);

  const activeSpecial = specials.find((s) => s.active);
  const soldOut = items.filter((i) => !i.available).length;

  const today = new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Africa/Johannesburg",
  }).format(new Date());

  return (
    <div>
      <ScreenHelp
        title="Today at a glance"
        blurb={today}
        help={ADMIN_HELP.today}
      />

      {!connected && (
        <div className="admin-card mt-4 border-ember/50 p-4">
          <p className="text-sm font-semibold text-ember">
            The database isn&rsquo;t connected
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ash">
            Nothing saved here will stick until this is fixed. The website
            itself is fine — it&rsquo;s showing the printed menu and hours.
          </p>
          {connection.error && (
            <p className="mt-2 break-words rounded bg-char/60 px-3 py-2 font-mono text-[0.6875rem] text-ash">
              {connection.error}
            </p>
          )}
        </div>
      )}

      <FirstRunImport
        needsMenu={needsMenu}
        needsHours={needsHours}
        orderNeedsFix={orderNeedsFix}
        missingCount={connected && items.length > 0 ? missingCount : 0}
      />

      <dl className="admin-card mt-4 grid grid-cols-2 divide-x divide-hair">
        <Stat
          label="Special"
          value={activeSpecial ? activeSpecial.title : "None"}
        />
        <Stat label="Sold out" value={String(soldOut)} alert={soldOut > 0} />
      </dl>

      <h2 className="mt-6 text-[0.6875rem] uppercase tracking-[0.14em] text-ash">
        Daily jobs
      </h2>
      <ul className="admin-card mt-2 divide-y divide-hair">
        <Job href="/admin/menu" label="Mark something sold out" />
        <Job href="/admin/specials" label="Set today's special" />
        <Job href="/admin/hours" label="Change today's hours" />
      </ul>
    </div>
  );
}

function Stat({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="px-3 py-3">
      <dt className="text-[0.625rem] uppercase tracking-[0.14em] text-ash">
        {label}
      </dt>
      <dd
        className={`mt-1 truncate text-sm font-semibold ${
          alert ? "text-ember" : "text-bone"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function Job({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-[46px] items-center justify-between px-4 py-3 text-sm text-bone transition-colors hover:bg-bone/[0.03]"
      >
        {label}
        <span aria-hidden="true" className="text-ash">
          ›
        </span>
      </Link>
    </li>
  );
}
