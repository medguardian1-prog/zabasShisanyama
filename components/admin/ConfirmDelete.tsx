"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/admin/Toaster";
import type { ActionResult } from "@/app/admin/actions/mutations";

export default function ConfirmDelete({
  what,
  onConfirm,
}: {
  what: string;
  onConfirm: () => Promise<ActionResult>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded px-3 py-2.5 text-xs uppercase tracking-wider text-ash hover:text-flame">
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete {what}?</DialogTitle>
        <DialogDescription>
          This removes it for good. If you just want it off the site for now,
          use Hide instead.
        </DialogDescription>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await onConfirm();
                if (res.ok) {
                  toast("Deleted — gone from the site.");
                  setOpen(false);
                } else {
                  toast(res.error, true);
                }
              })
            }
            className="flex-1 rounded bg-ember px-4 py-3.5 text-sm font-semibold text-bone disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Yes, delete"}
          </button>
          <DialogClose className="flex-1 rounded border border-hair px-4 py-3.5 text-sm text-bone">
            Cancel
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
