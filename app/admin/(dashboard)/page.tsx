import Link from "next/link";
import {
  adminEnquiries,
  adminMenuItems,
  adminSpecials,
} from "@/app/admin/queries";
import { getAdminClient } from "@/lib/supabase/admin";
import { adminOpeningHours } from "@/app/admin/queries";
import FirstRunImport from "@/components/admin/FirstRunImport";

export default async function AdminHomePage() {
  const connected = !!getAdminClient();
  const [items, specials, enquiries, hours] = await Promise.all([
    adminMenuItems(),
    adminSpecials(),
    adminEnquiries(),
    adminOpeningHours(),
  ]);

  const needsMenu = connected && items.length === 0;
  const needsHours =
    connected && hours.length > 0 && hours.every((h) => !h.opens && !h.closed);

  const activeSpecial = specials.find((s) => s.active);
  const soldOut = items.filter((i) => !i.available).length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  const today = new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Africa/Johannesburg",
  }).format(new Date());

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-base font-semibold text-bone">Today at a glance</h1>
        <p className="text-xs text-ash">{today}</p>
      </div>

      {!connected && (
        <p className="admin-card mt-4 p-3 text-sm text-ash">
          The database isn&rsquo;t connected yet — ask whoever set up the site
          to add the Supabase keys.
        </p>
      )}

      <FirstRunImport needsMenu={needsMenu} needsHours={needsHours} />

      <dl className="admin-card mt-4 grid grid-cols-3 divide-x divide-hair">
        <Stat label="Special" value={activeSpecial ? activeSpecial.title : "None"} />
        <Stat label="Sold out" value={String(soldOut)} alert={soldOut > 0} />
        <Stat label="Enquiries" value={String(newEnquiries)} alert={newEnquiries > 0} />
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
