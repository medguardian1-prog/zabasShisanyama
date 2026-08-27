# Decisions

Choices made without asking, with reasons.

## Typography
- **Display: Anton.** Heavy condensed grotesque with poster energy — matches the
  bottle-cap logo's bold, workmanlike lettering better than a high-contrast serif
  would. Body: Inter.

## Image roles (what each photo actually shows)
| File | What it shows | Orientation | Role |
|---|---|---|---|
| `logo.jpg` | Zaba's bottle-cap logo, red/black/white | square | Header, footer, favicon, OG image. Never in content grids. |
| `food-05.jpg` | Mixed-grill board (steak, wings, boerewors) on a red slatted table, order ticket "22" | portrait | **Hero** — moodiest, most atmospheric shot; heavy bottom scrim handles the busy top of frame. |
| `food-07.jpg` | Lamb chops, steamed bread (dombolo), chilli relish on wood | square | Signature strip lead, from-the-grill fallback. Cleanest, most "expensive" plate shot. |
| `food-02.jpg` | Boerewors coils, roast meat, pap on a board | square | Signature strip, platters fallback, gallery. |
| `food-03.jpg` | Branded takeaway tray — wings, bread, sides | portrait | Kotas/takeaway fallback, gallery ("To go"). |
| `food-04.jpg` | Plated chicken stew, rice, sides (branded) | square | Sides/plates fallback, signature strip. |
| `food-01.webp` | People sharing wings/ribs at a table, daylight | portrait | Gallery + About — communal energy, too busy for hero. |
| `food-06.jpg` | Hands carving ribs/meat on a shared board | square | Gallery + About — the "shared, always" shot. |
| `event.jpg` | Performer on stage at night, crowd | landscape | Events page + events fallback image. |
| `alcohol.webp` | Bar shelves of spirits | landscape | Drinks category fallback + gallery ("The bar"). |

## Architecture
- Public chrome + motion providers live in the `app/(site)/` route-group layout;
  `app/admin/` has its own layout with **no** Lenis/GSAP/cursor (brief §9.11).
  Admin dashboard pages sit in `app/admin/(dashboard)/` so the login page renders
  without the staff nav.
- Supabase clients return `null` when env vars are absent; queries fall back to
  empty arrays so `next build` and the public pages work before envs are wired.
- Homepage signature strip and menu/gallery fall back to the local `public/images`
  set when the DB is empty; fallback card names describe what the photos show
  (no invented prices — price only renders when it comes from the DB).
- Admin selects use restyled **native** `<select>` — native pickers beat custom
  popovers on staff phones.
- Admin reorder uses up/down arrow buttons swapping `sort_order` with the
  neighbour (brief: drag is unreliable on phones).
- Admin mutations call `revalidateTag` for the affected public data plus
  `revalidatePath("/", "layout")` and `revalidatePath("/admin", "layout")` so
  both surfaces refresh immediately.
- Login rate limit is an in-memory Map (5 attempts / 15 min / IP). **It resets on
  cold start** — move to Upstash if abuse appears.
- Session cookie: `zabas_staff_session`, HS256 JWT via `jose`, 7-day expiry.
- Enquiry form requires at least one of phone/email so staff can actually reply.
- `getActiveSpecials` filters the schedule window in code (dates compared UTC);
  the "today's special" shown is the first active in-window special by sort order.
- Image uploads: client-side canvas compression to ≤1600px JPEG q0.8, stored in
  the public `media` bucket with a timestamp+uuid name; the public URL goes in the
  row's `image` column.

## Image quality (2026-08-27 redesign)
- The ibb.co source links served ~243px thumbnails, not originals. Originals
  are unavailable; the user's media account has no AI-upscale credits.
- Mitigation: `scripts/enhance-images.mjs` (sharp) enlarges `image-src/` 2.5x
  with lanczos3 + denoise + sharpen into `public/images/`, and the design never
  shows photos far above native size — blurred backdrop + small framed panel in
  the hero, framed/grained cards elsewhere. Re-run the script if better
  originals ever arrive in `image-src/`.
