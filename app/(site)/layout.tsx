/**
 * Rendered per-request so the live "Open now · Closes …" status is computed
 * at view time (data reads themselves are tag-cached in lib/queries.ts).
 */
export const dynamic = "force-dynamic";

import SmoothScroll from "@/components/SmoothScroll";
import RevealManager from "@/components/RevealManager";
import GalleryCursor from "@/components/GalleryCursor";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <RevealManager />
      <GalleryCursor />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </SmoothScroll>
  );
}
