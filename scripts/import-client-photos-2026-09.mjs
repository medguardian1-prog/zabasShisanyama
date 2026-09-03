#!/usr/bin/env node
/**
 * Second batch of client photography (supplied 2026-09-03), replacing the four
 * low-resolution shots that were still live on the homepage strip, gallery,
 * about page and menu: food-07, food-02, food-05 and food-06.
 *
 * Those four are the ones the homepage strip renders first, because
 * SignatureStrip's FALLBACK_IMAGES list is consumed positionally by featured
 * menu items. Identifying them by card *label* instead leads you to
 * plate-beef / plate-chicken, which are different files and were fine as they
 * were -- the client's own full-resolution plated shots. Do not touch those.
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
 * crop              optional region of the SOURCE, as fractions, applied
 *                   before the cover resize -- for when the whole frame says
 *                   the wrong thing about the dish
 */
const JOBS = [
  {
    source: "01-platter-wide.webp",
    out: "food-07.jpg",
    width: 1254,
    height: 1254,
    position: "center",
    note: "Platter for 6 / signature strip / gallery.",
  },
  {
    source: "04-platter-wors.webp",
    out: "food-02.jpg",
    width: 1254,
    height: 1254,
    position: "center",
    note: "Platter for 4 / signature strip / about 'It comes out on a board'.",
  },
  {
    source: "02-chops-phuthu.webp",
    out: "food-05.jpg",
    width: 1122,
    height: 1402,
    position: "center",
    // Tightened 2026-09-03 at the client's request. The full frame shows a
    // tray stacked with chops, which set the wrong expectation for a
    // one-person platter -- customers were going to read it as far more food
    // than they get. This crop keeps four chops plus the phuthu, salsa and
    // chakalaka the description actually promises, and drops the rest.
    crop: { left: 0.16, top: 0.22, width: 0.72, height: 0.68 },
    note: "Platter for 1. Replaces the takeaway-tray shot with the receipt and '22' ticket. Natively portrait, so it keeps the existing 4:5 slot.",
  },
  {
    source: "03-wings.webp",
    out: "food-06.jpg",
    width: 1254,
    height: 1254,
    // Wings sit left of frame; a centred square crop would clip them.
    position: "left",
    note: "Platter for 2. Replaces the hands-carving-on-a-cluttered-table shot.",
  },
];

// This batch deliberately does NOT touch hero.jpg or hero-mobile.jpg. The
// photos were supplied to replace the four content shots only; the hero keeps
// its existing image and stays owned by scripts/enhance-images.mjs.

async function run(job, { sharpen }) {
  const src = join(SRC, job.source);
  if (!existsSync(src)) {
    console.error(`  MISSING ${src}`);
    return false;
  }

  let img = sharp(src);

  if (job.crop) {
    const m = await sharp(src).metadata();
    img = img.extract({
      left: Math.round(m.width * job.crop.left),
      top: Math.round(m.height * job.crop.top),
      width: Math.round(m.width * job.crop.width),
      height: Math.round(m.height * job.crop.height),
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

console.log("\nDone. hero.jpg and hero-mobile.jpg are deliberately untouched.");
