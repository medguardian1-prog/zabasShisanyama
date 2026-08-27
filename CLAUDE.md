# Zaba's Shisanyama

Restaurant site + staff admin. Next.js 15 App Router · React 19 · TS strict ·
Tailwind v4 (CSS-first `@theme` in `app/globals.css`, no tailwind.config) ·
GSAP+ScrollTrigger · Lenis · Framer Motion · Radix in `components/ui/` ·
Supabase · `cn()` in `lib/utils.ts`.

## Rules
- **No invented business facts.** Unknown real details = literal `TODO`, logged in `CONTENT-TODO.md`.
- **Real photos only** — the ten files in `public/images/` are the whole library. No stock/AI images.
- Dark mode only. Sharp corners on the public site (admin may use small radius).

## Tokens (globals.css @theme)
char `#0B0A0A` bg · smoke `#171412` surface · bone `#F5F1EA` text · ash `#A39A90` muted ·
ember `#C8102E` accent · flame `#E8541F` hover · gold `#C9A227` eyebrows · hair `#2A2523` borders.
Ease: `cubic-bezier(0.22,1,0.36,1)`. Fonts: Anton (display) + Inter (body).

## Data layer
- `lib/types.ts` — camelCase interfaces + snake_case row mappers (the DB contract).
- `lib/queries.ts` — public reads, cached + tagged (menu/specials/gallery/hours/events/settings).
- `lib/supabase/server.ts` anon (public), `lib/supabase/admin.ts` service-role (server-only).
- `app/admin/queries.ts` — uncached admin reads. `app/admin/actions/` — all mutations.
- Prices are integer cents; `formatPrice` at the edge; `null` → "Ask at the counter".
- Hours logic (`lib/hours.ts`) uses Africa/Johannesburg explicitly.

## Pitfalls (paid for — do not rediscover)
1. `template.tsx` animates opacity ONLY (transforms break ScrollTrigger pinning).
2. Lenis runs off GSAP's ticker with `lagSmoothing(0)` — one clock.
3. `ScrollTrigger.config({ ignoreMobileResize: true })`.
4. Hidden reveal states gated behind `html.gsap-ready` (added by RevealManager).
5. Curtain reveal ends with `clearProps: "transform"`.
6. Pinned strip: `gsap.matchMedia` ≥1024px + no-pref; same markup falls back to snap-scroll.
7. Hover FX behind `@media (hover: hover)`; cursor behind `(pointer: fine)`.
8. Route change: scroll top + `ScrollTrigger.refresh()`.
9. Service-role key never in client bundles.
10. Admin layout must NOT mount SmoothScroll/RevealManager/cursor.

## Commits
Conventional-ish: `feat: …`, `fix: …`, one logical stage per commit.
