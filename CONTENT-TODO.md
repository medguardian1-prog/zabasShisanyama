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
- [ ] The Zaba's-specific story is a marked placeholder panel ("TODO — client
      copy") in the story section — who started it, when, and where. Replace
      the whole `<aside>` with a normal `<p data-reveal>` when the copy lands.
      The surrounding shisanyama-culture copy is generic and true, and every
      photo caption describes only what is visible in its own frame.

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
  +27 68 419 6554 — client confirmed calls AND WhatsApp bookings both use it.

### Still open
- Address CONFIRMED by the client: 1 Johannes Nkosi Avenue, SPCA Access Rd,
      Cato Manor, 4091. (The printed menu spells it "Cator Manor"; the site
      uses the correct "Cato Manor" so map searches resolve.)
- Logo RECEIVED and live: the flame/script version. Supplied as a JPEG on
      solid black; the black is cut to transparency in the import step so it
      sits cleanly on every surface. Source kept at image-src/upscaled/logo-source.jpg.
- Breakfast + raw-meat photos RECEIVED and added to the gallery.
- [ ] Breakfast is shown as a photo only — it is not on the printed menu.
      Still need the breakfast items and prices before listing it.

## Hero image (2026-08-28)
- New hero: the pork-chop board shot, rotated 90 deg to landscape. Source kept
  at image-src/upscaled/hero-source.jpg. Regenerate via the rotate+sharpen step
  if a better original arrives.
- [ ] The file came through WhatsApp compressed (587x953). Ask the client to
      resend this one as a **Document** for the full-resolution original — the
      hero is the largest image on the site and would benefit most.
- [ ] Same for the remaining food photos: everything except the logo, breakfast,
      raw-meat and hero shots is still upscaled from ~243px thumbnails.

## Events photography (2026-08-31)
20 professional photos from the 29 November event, supplied by the client.
Facts on the /events page are taken only from what is legible in them:
- **Durban's Summer Dance**, held at Zaba's on **Saturday 29 November 2025**
  (29 Nov fell on a Saturday in 2025, not 2026 — and the filenames are dated
  29Nov, so this is a past event and is presented as such, not as upcoming).
- Poster credits: Inamandla Entertainment, Durban Tourism, Webtickets,
  Zaba's Legacy; sponsor board adds Red Bull, Martell, Fitch & Leedes.
- Poster repeats the address as 1 Johannes Nkosi Avenue, SPCA Access Rd,
  Cator Manor, 4091 — independently confirming the street number.

### HOURS DISCREPANCY — needs one question
The **Trading Hours sign inside the shop**, photographed at that event, reads:
Mon–Thurs 09:00–21:00 · Friday 09:00–22:00 · **Sat & Sun 09:00–23:00**.
The client told us Sat & Sun run to **00:00**. Restaurant Guru also says 23:00.
The site currently shows 00:00 per the client's instruction. Confirm which is
right — the sign may simply predate an extension.
