"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ScreenHelp } from "@/lib/admin-help";

/**
 * Standard header for every staff screen: title, one-line blurb, and an info
 * button that opens the full explanation of that screen.
 *
 * The panel is a disclosure rather than a modal on purpose -- staff use this on
 * a phone, often one-handed, and a modal that traps focus and blocks the page
 * behind it is the wrong shape for "remind me how this works while I do it".
 * It stays open until dismissed so it can be read alongside the controls.
 */
export default function ScreenHelp({
  title,
  blurb,
  help,
}: {
  title: string;
  blurb: React.ReactNode;
  help: ScreenHelp;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc closes it, matching every other dismissible thing on a phone.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Move focus into the panel when it opens so screen-reader and keyboard
  // users land on the content rather than staying on the button.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-bone">{title}</h1>
          <p className="mt-1 text-xs leading-relaxed text-ash">{blurb}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="-mr-2 -mt-2 inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full px-2 text-ash transition-colors hover:text-bone"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[19px] w-[19px]"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 7.6v.6" />
          </svg>
          <span className="text-xs">{open ? "Close" : "How this works"}</span>
        </button>
      </div>

      {open && (
        <div
          id={panelId}
          ref={panelRef}
          tabIndex={-1}
          className="admin-card mt-3 space-y-4 p-4 text-xs leading-relaxed outline-none"
        >
          <p className="text-bone">{help.purpose}</p>

          <p className="text-ash">
            <span className="text-ash/70">Customers see it on: </span>
            {help.showsUpOn}
          </p>

          <div>
            <h2 className="text-[0.6875rem] uppercase tracking-[0.14em] text-ash">
              How to use it
            </h2>
            <ol className="mt-2 space-y-2.5">
              {help.how.map((step, i) => (
                <li key={step.do} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-px shrink-0 text-[0.6875rem] tabular-nums text-ember"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="text-bone">{step.do}. </span>
                    <span className="text-ash">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-[0.6875rem] uppercase tracking-[0.14em] text-ash">
              What this screen can&rsquo;t do
            </h2>
            <ul className="mt-2 space-y-1.5">
              {help.cannot.map((line) => (
                <li key={line} className="flex gap-2.5 text-ash">
                  <span aria-hidden="true" className="text-ash/50">
                    &mdash;
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-[44px] items-center text-xs text-ash underline underline-offset-4 transition-colors hover:text-bone"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
