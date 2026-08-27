import type { Metadata } from "next";

/**
 * Admin shell. Deliberately does NOT mount SmoothScroll, RevealManager or
 * the custom cursor — the dashboard is fast and boring by design.
 */
export const metadata: Metadata = {
  title: "Staff · Zaba's Shisanyama",
  robots: { index: false, follow: false },
};

/** Admin always renders fresh — staff must see current data, not build-time data. */
export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-[100svh] bg-char text-bone"
      style={{
        backgroundImage:
          "radial-gradient(80% 40% at 50% 0%, rgba(200,16,46,0.07) 0%, transparent 60%)",
      }}
    >
      {children}
    </div>
  );
}
