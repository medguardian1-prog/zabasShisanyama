import Link from "next/link";
import {
  adminEnquiries,
  adminMenuItems,
  adminSpecials,
} from "@/app/admin/queries";
import { getAdminClient } from "@/lib/supabase/admin";

export default async function AdminHomePage() {
  const connected = !!getAdminClient();
  const [items, specials, enquiries] = await Promise.all([
    adminMenuItems(),
    adminSpecials(),
    adminEnquiries(),
  ]);

  const activeSpecial = specials.find((s) => s.active);
  const soldOut = items.filter((i) => !i.available).length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  const now = new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Africa/Johannesburg",
  }).format(new Date());

  return (
    <div>
      <p className="text-[0.6875rem] uppercase tracking-[0.22em] text-gold">
        {now}
      </p>
      <h1 className="mt-1 font-display text-2xl uppercase tracking-wide text-bone">
        Today at a glance
      </h1>

      {!connected && (
        <p className="admin-card mt-5 p-4 text-sm text-ash">
          The database isn&rsquo;t connected yet — ask whoever set up the site
          to add the Supabase keys.
        </p>
      )}

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          label="Today's special"
          value={activeSpecial ? activeSpecial.title : "None set"}
          accent="gold"
        />
        <StatTile
          label="Sold-out items"
          value={String(soldOut)}
          accent={soldOut > 0 ? "ember" : "ash"}
        />
        <StatTile
          label="New enquiries"
          value={String(newEnquiries)}
          accent={newEnquiries > 0 ? "ember" : "ash"}
        />
      </dl>

      <h2 className="mt-10 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-ash">
        Daily jobs
      </h2>
      <div className="mt-3 grid gap-3">
        <JobLink href="/admin/menu" primary>
          Mark something sold out
        </JobLink>
        <JobLink href="/admin/specials">Set today&rsquo;s special</JobLink>
        <JobLink href="/admin/hours">Change today&rsquo;s hours</JobLink>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "ember" | "gold" | "ash";
}) {
  const bar =
    accent === "ember"
      ? "bg-ember"
      : accent === "gold"
        ? "bg-gold"
        : "bg-hair";
  return (
    <div className="admin-card relative overflow-hidden p-5 pl-6">
      <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} aria-hidden="true" />
      <dt className="text-[0.625rem] uppercase tracking-[0.2em] text-ash">
        {label}
      </dt>
      <dd className="mt-2 truncate text-xl font-semibold text-bone">{value}</dd>
    </div>
  );
}

function JobLink({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "btn-ember justify-between px-6 py-5 text-base"
          : "admin-card flex items-center justify-between px-6 py-5 text-base font-semibold text-bone transition-colors hover:border-ash/40"
      }
    >
      {children}
      <span aria-hidden="true" className={primary ? "" : "text-gold"}>
        →
      </span>
    </Link>
  );
}
