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

  return (
    <div>
      <h1 className="text-xl font-semibold text-bone">Today at a glance</h1>

      {!connected && (
        <p className="mt-4 rounded border border-hair bg-smoke p-4 text-sm text-ash">
          The database isn&rsquo;t connected yet — ask whoever set up the site
          to add the Supabase keys.
        </p>
      )}

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded border border-hair bg-smoke p-5">
          <dt className="text-xs uppercase tracking-wider text-ash">
            Today&rsquo;s special
          </dt>
          <dd className="mt-2 text-lg font-semibold text-bone">
            {activeSpecial ? activeSpecial.title : "None set"}
          </dd>
        </div>
        <div className="rounded border border-hair bg-smoke p-5">
          <dt className="text-xs uppercase tracking-wider text-ash">
            Sold-out items
          </dt>
          <dd className="mt-2 text-lg font-semibold text-bone">{soldOut}</dd>
        </div>
        <div className="rounded border border-hair bg-smoke p-5">
          <dt className="text-xs uppercase tracking-wider text-ash">
            New enquiries
          </dt>
          <dd className="mt-2 text-lg font-semibold text-bone">
            {newEnquiries}
          </dd>
        </div>
      </dl>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-ash">
        Daily jobs
      </h2>
      <div className="mt-3 grid gap-3">
        <Link
          href="/admin/menu"
          className="rounded bg-ember px-6 py-5 text-base font-semibold text-bone"
        >
          Mark something sold out →
        </Link>
        <Link
          href="/admin/specials"
          className="rounded bg-smoke px-6 py-5 text-base font-semibold text-bone ring-1 ring-hair"
        >
          Set today&rsquo;s special →
        </Link>
        <Link
          href="/admin/hours"
          className="rounded bg-smoke px-6 py-5 text-base font-semibold text-bone ring-1 ring-hair"
        >
          Change today&rsquo;s hours →
        </Link>
      </div>
    </div>
  );
}
