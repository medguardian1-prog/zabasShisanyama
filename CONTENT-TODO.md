# Content TODO

Everything the client must supply. Fill these in one pass — most go straight
into the **staff dashboard → Settings**, the rest are code/env edits.

## Site settings (fill in at /admin/settings — currently `TODO` in the database)
- [ ] Phone number
- [ ] WhatsApp number (with country code, e.g. 27…)
- [ ] Street address
- [ ] Google Maps link
- [ ] Instagram / Facebook / TikTok links (leave blank to hide)

## Environment variables (`.env.local` locally, Vercel project settings in prod)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `ADMIN_PASSWORD_HASH` — generate with `node scripts/hash-password.mjs '<the staff password>'`
- [ ] `ADMIN_SESSION_SECRET` — any long random string
- [ ] `NEXT_PUBLIC_SITE_URL` — the production URL

## About page (`app/(site)/about/page.tsx`)
- [ ] The Zaba's-specific story paragraph is a literal `TODO` — who started it,
      when, and where. The surrounding shisanyama-culture copy is generic and true.

## Data to enter via the dashboard
- [ ] Menu items with real names, prices and photos (per category:
      from-the-grill, platters, kotas, sides, drinks)
- [ ] Mark 3–6 items as **featured** to fill the homepage "From the Fire" strip
      (until then it shows the starter photo set without prices)
- [ ] Opening hours per day (seeded rows exist; times are unset)
- [ ] First special, gallery photos, upcoming events

## Nice to have
- [ ] A wider landscape hero-quality photo shot in low light would upgrade the
      homepage hero (currently `food-05.jpg` with a heavy scrim).

## Researched online 2026-08-27 (now live as code fallbacks — confirm with Zaba's)
- WhatsApp / bookings: **+27 62 085 8961** (client-supplied, authoritative)
- Address: **2 Johannes Nkosi Avenue, Mayville, Durban, 4091** — CONFIRMED by
  the client 2026-08-27 (online sources disagreed; number 2 is correct).
- Socials: instagram.com/zabas_shisanyama · facebook.com/zabashisanyamaa ·
  tiktok.com/@zabasshisanyama
  NOTE: the Facebook page is **zabashisanyamaa** (double a). The single-a
  handle is a different business, Zaba's Pub and Grill — client-confirmed.
- Other phone numbers seen online (NOT used on the site — verify before adding):
  031 261 1762 (Yellow Pages), 073 356 0184 / 064 023 9488 (durbanwest.co.za),
  +27 76 345 4791 (Restaurant Guru)
- Hours seen on Restaurant Guru (NOT entered — punch into /admin/hours if right):
  Mon–Thu 9:00–21:00 · Fri 9:00–22:00 · Sat–Sun 9:00–23:00

## Received from the client 2026-08-28 (now live)
- **Menu**: transcribed from the printed menu into `lib/default-menu.ts` —
  4 platters (R100/R250/R400/R550), 4 plates at R60, plus sides and add-ons
  which the printed menu does not price (they render "Ask at the counter").
  This is a fallback: anything staff enter at /admin/menu replaces it.
- **Hours**: Mon–Thu 09:00–21:00 · Fri 09:00–22:00 · Sat & Sun 09:00–00:00,
  in `lib/hours.ts` as `withDefaultHours`. Also a fallback — /admin/hours wins.
- **Phone**: +27 68 419 6554 (calls). WhatsApp bookings stay on
  +27 62 085 8961 — CONFIRM whether bookings should move to the new number.

### Still open
- [ ] **ADDRESS CONFLICT**: the printed menu says "1 Johannes Nkosi Avenue,
      SPCA Access Rd, Cator Manor, 4091". The site currently shows
      "2 Johannes Nkosi Avenue, Mayville, Durban, 4091" per instruction.
      Confirm the correct street number and suburb.
- [ ] New logo (the flame/script version on the printed menu) — need the
      original file, ideally PNG with a transparent background.
- [ ] Breakfast: the client sent a breakfast photo, but breakfast is not on
      the printed menu. Ask for the items and prices before adding.
