"use client";

import { useEffect, useState } from "react";

type Toast = { id: number; message: string; error?: boolean };

let listeners: ((t: Toast) => void)[] = [];
let counter = 0;

/** Fire a toast from any client component. */
export function toast(message: string, error = false) {
  const t = { id: ++counter, message, error };
  listeners.forEach((l) => l(t));
}

export const SAVED = "Saved — live on the site now.";

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3200);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex flex-col items-center gap-2 px-5"
    >
      {toasts.map((t) => (
        <p
          key={t.id}
          className={`animate-fade-in max-w-sm rounded px-5 py-3.5 text-center text-sm font-medium shadow-lg ${
            t.error ? "bg-ember text-bone" : "bg-bone text-char"
          }`}
        >
          {t.message}
        </p>
      ))}
    </div>
  );
}
