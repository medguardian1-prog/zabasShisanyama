"use client";

import { useTransition } from "react";
import {
  importPrintedMenu,
  importTradingHours,
} from "@/app/admin/actions/mutations";
import { toast } from "@/components/admin/Toaster";

/**
 * The public site falls back to the printed menu and the client's trading
 * hours while the database is empty. This moves that content into the
 * database so it becomes editable here.
 */
export default function FirstRunImport({
  needsMenu,
  needsHours,
}: {
  needsMenu: boolean;
  needsHours: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (!needsMenu && !needsHours) return null;

  return (
    <section className="admin-card mt-4 border-gold/40 p-4">
      <h2 className="text-sm font-semibold text-bone">Finish setting up</h2>
      <p className="mt-1 text-xs leading-relaxed text-ash">
        The website is currently showing Zaba&rsquo;s printed menu and trading
        hours. Import them here once and you&rsquo;ll be able to edit prices,
        mark things sold out and change times yourself.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {needsMenu && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await importPrintedMenu();
                toast(
                  res.ok ? "Menu imported — you can edit it now." : res.error,
                  !res.ok
                );
              })
            }
            className="btn-ember px-4 py-2.5 text-sm"
          >
            Import the menu
          </button>
        )}
        {needsHours && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await importTradingHours();
                toast(
                  res.ok ? "Hours imported — you can edit them now." : res.error,
                  !res.ok
                );
              })
            }
            className="btn-quiet px-4 py-2.5 text-sm"
          >
            Import the hours
          </button>
        )}
      </div>
    </section>
  );
}
