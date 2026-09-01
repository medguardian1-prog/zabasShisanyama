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
  orderNeedsFix = false,
  missingCount = 0,
}: {
  needsMenu: boolean;
  needsHours: boolean;
  orderNeedsFix?: boolean;
  /** Printed-menu items not in the database yet, after the first import. */
  missingCount?: number;
}) {
  const [pending, startTransition] = useTransition();

  const hasMissing = missingCount > 0;
  if (!needsMenu && !needsHours && !orderNeedsFix && !hasMissing) return null;

  // Three different reasons to offer the same button, so it says which one.
  const menuBlurb = needsMenu
    ? "The website is currently showing Zaba's printed menu and trading hours. Import them here once and you'll be able to edit prices, mark things sold out and change times yourself."
    : hasMissing
      ? `There ${missingCount === 1 ? "is 1 item" : `are ${missingCount} items`} on the printed menu that aren't in the dashboard yet. Adding them won't touch anything you've already edited.`
      : "The menu categories aren't in the order of the printed menu. This puts Platters first again.";

  const menuLabel = needsMenu
    ? "Import the menu"
    : hasMissing
      ? `Add ${missingCount} missing ${missingCount === 1 ? "item" : "items"}`
      : "Fix the menu order";

  return (
    <section className="admin-card mt-4 border-gold/40 p-4">
      <h2 className="text-sm font-semibold text-bone">Finish setting up</h2>
      <p className="mt-1 text-xs leading-relaxed text-ash">{menuBlurb}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(needsMenu || orderNeedsFix || hasMissing) && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await importPrintedMenu();
                if (!res.ok) {
                  toast(res.error, true);
                  return;
                }
                // The action counts what it actually inserted — prefer that
                // over guessing from the state this page rendered with.
                toast(
                  res.message ??
                    (needsMenu
                      ? "Menu imported — you can edit it now."
                      : "Menu order fixed — live on the site now.")
                );
              })
            }
            className="btn-ember px-4 py-2.5 text-sm"
          >
            {menuLabel}
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
