#!/usr/bin/env node
/**
 * Second batch of client photography (supplied 2026-09-03), replacing the four
 * low-resolution shots that were still live on the homepage strip, gallery,
 * about page and menu.
 *
 * Sources live in image-src/client-new/ and keep their original framing; this
 * script does the cropping so the framing decisions stay in version control
 * rather than in someone's photo editor.
 *
 * Run:  node scripts/import-client-photos-2026-09.mjs
 *
 * Note on aspect: every consumer renders with next/image `fill` + `object-cover`
 * inside its own CSS aspect box, so the stored aspect does not drive layout --
 * it only decides how much detail survives the crop. The tallest box in use is
 * aspect-[3/4], so nothing is stored wider than 1:1.
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { join } from "node:path";

const SRC = "image-src/client-new";
const OUT = "public/images";

/**
 * source            the staged original
 * out               destination filename in public/images
 * width, height     stored dimensions (cover-cropped from the source)
 * position          which part of the frame to keep when cropping
 */
const JOBS = [
  {
    source: "01-platter-wide.webp",
    out: "food-07.jpg",
    width: 1254,
    height: 1254,
    position: "center",
    note: "Platter for 1 / signature strip lead / gallery. Also the hero source.",
  },
  {
    source: "04-platter-wors.webp",
    out: "food-02.jpg",
    width: 1254,
    height: 1254,
    position: "center",
    note: "Platter for 2 / signature strip / about 'It comes out on a board'.",
  },
  {
    source: "02-chops-phuthu.webp",
    out: "plate-beef.jpg",
    width: 1200,
    height: 1600,
    position: "center",
    note: "Phuthu & Beef. Natively portrait, so it keeps the 3:4 slot.",
  },
  {
    source: "03-wings.webp",
    out: "plate-chicken.jpg",
    width: 1254,
    height: 1254,
    // Wings sit left of frame; a centred square crop would clip them.
    position: "left",
    note: "Phuthu & Chicken. Landscape source, so stored square rather than 3:4.",
  },
];

// The hero is displayed far larger than any source photo, so it is upscaled
// and sharpened once here rather than by the browser at paint time.
const HERO_JOBS = [
  {
    source: "01-platter-wide.webp",
    out: "hero.jpg",
    width: 1700,
    height: 1045,
    position: "center",
    note: "Desktop banner (~1.63:1).",
  },
  {
    source: "02-chops-phuthu.webp",
    out: "hero-mobile.jpg",
    width: 1200,
    height: 1800,
    position: "center",
    // The phone scrim runs `to top`, so the TOP of this frame is the one part
    // that stays fully transparent. The source opens on a dark wooden plank,
    // which landed in exactly that window and read as a black band above the
    // headline. Drop it so the bread and chops sit under the clear area.
    extractTopPct: 0.12,
    note: "Phone banner. Uses the portrait shot: cropping the landscape one to 2:3 would have meant a 1.9x upscale of a narrow slice.",
  },
];

async function run(job, { sharpen }) {
  const src = join(SRC, job.source);
  if (!existsSync(src)) {
    console.error(`  MISSING ${src}`);
    return false;
  }

  let img = sharp(src);

  // Optional pre-crop, applied before the cover resize, for when a specific
  // band of the source needs to be excluded rather than merely de-centred.
  if (job.extractTopPct) {
    const meta = await sharp(src).metadata();
    const top = Math.round(meta.height * job.extractTopPct);
    img = img.extract({
      left: 0,
      top,
      width: meta.width,
      height: meta.height - top,
    });
  }

  img = img.resize({
    width: job.width,
    height: job.height,
    fit: "cover",
    position: job.position,
    kernel: sharp.kernel.lanczos3,
  });

  // Sources are ~1269px on the long edge, so every output is a mild upscale.
  // Unsharp masking recovers the edge definition lanczos softens.
  img = img.sharpen(sharpen);

  await img.jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(join(OUT, job.out));

  const m = await sharp(join(OUT, job.out)).metadata();
  console.log(`  ${job.out.padEnd(18)} ${m.width}x${m.height}  <- ${job.source}`);
  return true;
}

console.log("Content images:");
for (const job of JOBS) {
  await run(job, { sharpen: { sigma: 1.1, m1: 0.4, m2: 0.3 } });
}

console.log("\nHero variants:");
for (const job of HERO_JOBS) {
  await run(job, { sharpen: { sigma: 1.4, m1: 0.5, m2: 0.35 } });
}

console.log("\nDone. Backups of the previous files are in .backup-images-20260903/");
