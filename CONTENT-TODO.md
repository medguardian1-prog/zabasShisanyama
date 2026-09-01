# Content TODO

Everything the client must supply. Fill these in one pass — most go straight
into the **staff dashboard → Settings**, the rest are code/env edits.

> **Audited 2026-09-01 against the live site.** Checked by observation, not
> assumption: menu content read back off the public page; gallery and event
> presence proved by whether any image comes from Supabase storage rather than
> `/images/` (nothing uploaded = still the built-in starter set); hours
> compared against `DEFAULT_HOURS` character for character; env vars proved by
> a successful service-role write and anon read-back.
>
> **What could not be checked from outside:** anything where the database
> value and the code fallback render identically — the /admin/settings fields,
> and whether hours were entered as the same times the fallback already uses.
> Those are marked as such rather than guessed at. Running
> `vercel env pull .env.local --environment=production` would let the database
> be queried directly and settle them.

## Site settings (/admin/settings)

**The live site shows the right values for all of these.** Whether that is
because staff filled them in or because the code fallbacks in
`lib/site-defaults.ts` are doing the work cannot be told apart from outside —
`withDefault()` returns the fallback whenever the database value is empty or
literally `TODO`, and every value on the live site matches the fallback
exactly. Open /admin/settings to see which it is; if the fields are blank or
say TODO, fill them in so staff own the values rather than the code.

- [ ] Phone number — live shows `+27 68 419 6554`
- [ ] WhatsApp number — live uses `wa.me/27684196554`
- [ ] Street address — live shows `1 Johannes Nkosi Avenue, SPCA Access Rd,
      Cato Manor, 4091`
- [ ] Google Maps link — live link resolves to that address
- [ ] Instagram / Facebook / TikTok — all three live and pointing at
      `zabas_shisanyama`, `zabashisanyamaa` (double a) and `@zabasshisanyama`

## Inconsistency found 2026-09-01 — needs a decision
- [ ] **The homepage hero says "Mayville, Durban"; everywhere else says "Cato
      Manor".** `components/Hero.tsx` carries `Mayville, Durban · Flame-grilled
      daily` in the eyebrow and `Mayville, Durban` as the "Find us" fallback,
      while the confirmed address, the About page and the Events page all say
      Cato Manor. Mayville looks like a leftover from the superseded 2026-08-27
      research below. They are adjacent Durban suburbs so both could be
      defensible — but the site should not say both. Confirm which the client
      uses and I will make it consistent.

## Environment variables

**Production (Vercel): all set and confirmed working 2026-09-01.**

- [x] `NEXT_PUBLIC_SUPABASE_URL`
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `SUPABASE_SERVICE_ROLE_KEY`
- [x] `ADMIN_PASSWORD_HASH` — generate with `node scripts/hash-password.mjs '<the staff password>'`
- [x] `ADMIN_SESSION_SECRET` — any long random string
- [x] `NEXT_PUBLIC_SITE_URL` — the production URL

Evidenced rather than assumed: the staff dashboard imported 11 menu items
(service-role write) and the public menu reads them back (anon read), staff
login issues a working session, and `og:image` on the live site resolves to
`https://zabas-shisanyama.vercel.app/...` rather than the `localhost:3000`
that `metadataBase` falls back to when `NEXT_PUBLIC_SITE_URL` is unset.

- [ ] **Local `.env.local` is still `TODO` placeholders.** Harmless — the site
      falls back to the printed menu and hours when the keys are absent — but
      it means local dev never exercises the database, so anything touching
      `lib/queries.ts`, `app/admin/` or the import can only be tested against
      production. Fix with `vercel env pull .env.local --environment=production`.

## About page (`app/(site)/about/page.tsx`)
- [ ] The Zaba's-specific story is a marked placeholder panel ("TODO — client
      copy") in the story section — who started it, when, and where. Replace
      the whole `<aside>` with a normal `<p data-reveal>` when the copy lands.
      The surrounding shisanyama-culture copy is generic and true, and every
      photo caption describes only what is visible in its own frame.

## Data to enter via the dashboard
*Audited against the live site 2026-09-01 — method in the note at the top.*

- [x] **Menu items** — 28 in the database across Platters (4), Plates (4),
      Breakfast (1), Sides (6), Add-ons (3) and Drinks (10). Names and prices
      all present.
- [ ] **Per-item photos** — still none. The first import wrote `image: null`
      for all 17 original rows; only Breakfast carries one. Nothing shows this
      today (the menu page is deliberately image-free and the homepage strip
      has its own fallback photos), so this is polish, not a fault.
- [x] **3–6 featured items** — 6 are featured and the homepage "From the Fire"
      strip is rendering them with real prices.
- [ ] **Opening hours** — still the code fallback. The live site shows exactly
      `DEFAULT_HOURS` (Sun 09:00–00:00 · Mon–Thu 09:00–21:00 · Fri 09:00–22:00
      · Sat 09:00–00:00), so nothing has been entered at /admin/hours. See the
      unresolved 23:00-vs-00:00 question at the end of this file first.
- [ ] **Gallery photos** — still the built-in starter set: 12 local files,
      none from Supabase storage, so nothing has been uploaded.
- [ ] **First special** — none active; the homepage has no special section.
- [ ] **Upcoming events** — none; /events has no "Coming up" section, only the
      past Summer Dance write-up.

## Nice to have
- [ ] A wider landscape hero-quality photo shot in low light would upgrade the
      homepage hero. (Corrected 2026-09-01: this said the hero was `food-05.jpg`
      with a heavy scrim — it has not been since the licensed-hero change. The
      hero is now `hero.jpg` / `hero-mobile.jpg`, art-directed per breakpoint.)

## Researched online 2026-08-27 — SUPERSEDED, kept for history

> **Do not use the phone or address in this section.** Both were overtaken by
> what the client supplied on 2026-08-28 (see "Received from the client"
> below), which is what the code actually uses. This section previously
> contradicted that one with both entries marked CONFIRMED; the 2026-08-28
> record wins because it came off the client's own printed menu and was later
> corroborated a third time by the event poster.

- ~~WhatsApp / bookings: **+27 62 085 8961**~~ — superseded by
  **+27 68 419 6554**, which is what `lib/site-defaults.ts` uses and what the
  live site dials.
- ~~Address: **2 Johannes Nkosi Avenue, Mayville, Durban, 4091**~~ — superseded
  by **1 Johannes Nkosi Avenue, SPCA Access Rd, Cato Manor, 4091**. Street
  number 1, not 2. This is also where the stray "Mayville" in the hero comes
  from — see the inconsistency noted at the top.
- Socials: instagram.com/zabas_shisanyama · facebook.com/zabashisanyamaa ·
  tiktok.com/@zabasshisanyama — these three stand, and are live.
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

### Resolved (nothing outstanding in this group)
- Address CONFIRMED by the client: 1 Johannes Nkosi Avenue, SPCA Access Rd,
      Cato Manor, 4091. (The printed menu spells it "Cator Manor"; the site
      uses the correct "Cato Manor" so map searches resolve.)
- Logo RECEIVED and live: the flame/script version. Supplied as a JPEG on
      solid black; the black is cut to transparency in the import step so it
      sits cleanly on every surface. Source kept at image-src/upscaled/logo-source.jpg.
- Breakfast + raw-meat photos RECEIVED and added to the gallery.
- Breakfast RECEIVED and live (see below) — this is no longer photo-only.

## Breakfast & drinks menu, received 2026-09-01 (now live)
Transcribed from a photograph of the client's printed breakfast sheet into
`lib/default-menu.ts`. Like the rest of that file it is a fallback — anything
staff enter at /admin/menu replaces it.

- **Breakfast — R55.** One priced item; the sheet lists its components rather
  than pricing them, so they are transcribed into the description verbatim
  ("X2 eggs (optional), X2 bacon, X1 sausage & fries, X2 slices of bread
  (optional). Served with mushrooms & beans."). Uses `breakfast.jpg`.
- **Drinks.** Cappy 300ml R16 · Liquifruit 300ml R16 · Zaba's Mango & Orange
  Juice (Large) R22 · Coffee R13/R20 · Tea (Rooibos / Five Roses) R12 · Hot
  Chocolate R15/R25 · Cappuccino R15/R25.

### Judgement calls to confirm with Zaba's
- [ ] **Sizes are split into separate rows.** The sheet prices coffee, hot
      chocolate and cappuccino as "small / medium". An item carries one price
      in the schema, so each size is its own row ("Coffee (Small)", "Coffee
      (Medium)"). Keeps every price editable in the dashboard instead of
      buried in prose — but it does make the drinks list ten rows long.
- [ ] **Three spellings corrected** from the printed sheet: "OPTINAL" →
      optional, "ROOOIBOS" → Rooibos, "CUPPUCCINO" → Cappuccino. Brand
      spellings left exactly as printed (Cappy, Liquifruit).
- [ ] The sheet gives no size for Cappy/Liquifruit beyond 300ml, and no
      "large" coffee — confirm nothing is missing from the photographed page.
- Address corroborated: this sheet repeats 1 Johannes Nkosi Avenue, SPCA
  Access Rd, 4091 (spelling it "Cator Manor" again — see above).

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
