# Zaba's Shisanyama

Production website + staff admin dashboard for Zaba's Shisanyama.
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP +
Lenis + Framer Motion · Supabase.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

## Environment variables

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public reads, RLS-restricted) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key — server only, used by admin mutations |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the shared staff password (see below) |
| `ADMIN_SESSION_SECRET` | Long random string used to sign staff session JWTs |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, e.g. `https://zabas.example` |

The app builds and the public pages render (with empty states) even when the
Supabase variables are absent.

## Staff password

The staff password is never stored in plaintext. Generate the hash and put it
in `ADMIN_PASSWORD_HASH`:

```bash
node scripts/hash-password.mjs 'the-staff-password'
```

> **Gotcha — escape the `$` in `.env.local`.** Next.js expands `$VAR`
> references inside `.env` files, and a bcrypt hash starts with `$2b$12$…`.
> Pasted raw, the value is silently truncated and every login fails with
> "Incorrect password". In `.env.local`, escape each `$`:
>
> ```
> ADMIN_PASSWORD_HASH=\$2b\$12\$abc123…
> ```
>
> Quoting does **not** help. This affects local development only — environment
> variables set through the Vercel dashboard are injected directly and are not
> expanded, so paste the hash unescaped there.

Staff log in at `/admin/login` (linked quietly as “Staff” in the site footer).
Sessions last 7 days.

## Data

The Supabase schema (categories, menu_items, specials, gallery_images,
opening_hours, events, enquiries, site_settings) already exists — this repo
contains no migrations. Staff photo uploads go to the public `media` storage
bucket.

## Deploy (Vercel)

1. Import the repo into Vercel.
2. Add all six environment variables above in Project → Settings →
   Environment Variables.
3. Deploy. Admin edits go live immediately via cache tag revalidation.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint
- `node scripts/hash-password.mjs '<password>'` — print a bcrypt hash
