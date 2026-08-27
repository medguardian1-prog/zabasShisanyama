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
