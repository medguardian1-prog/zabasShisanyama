#!/usr/bin/env node
/**
 * Enhances the small source photos in image-src/ into public/images/:
 * 2.5x lanczos3 enlargement + gentle sharpen + light denoise, so next/image
 * downscales (clean) instead of the browser upscaling (blurry).
 * Re-run any time the files in image-src/ change:
 *   node scripts/enhance-images.mjs
 */
import sharp from "sharp";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

// image-src/upscaled/ (Upscayl 4x versions, added 2026-08-27) takes
// precedence over the tiny ibb.co originals in image-src/.
const HAS_UPSCALED = existsSync("image-src/upscaled");
const SRC = HAS_UPSCALED ? "image-src/upscaled" : "image-src";
const OUT = "public/images";
const SCALE = HAS_UPSCALED ? 1 : 2.5;

// The site serves .webp for food-01/alcohol and .jpg for the rest.
const WEBP_TARGETS = new Set(["food-01", "alcohol"]);
// Client-supplied originals (already full resolution) and the logo source are
// handled separately, so the bulk loop skips them.
//
// food-02 and food-07 are also skipped: as of 2026-09-03 both are owned by
// scripts/import-client-photos-2026-09.mjs, which builds them from the second
// batch of client photography in image-src/client-new/. The stale Upscayl
// sources are still sitting in image-src/upscaled/, so without this guard a
// re-run here would silently revert the homepage strip, gallery and about page
// to the old low-resolution shots.
const SKIP = new Set([
  "logo-source",
  "breakfast",
  "food-08",
  "food-02",
  "food-07",
]);

/**
 * Per-image colour correction. Upscayl pushed a few shots into a neon
 * magenta/orange cast; these pull them back to something appetising.
 */
const CORRECTIONS = {
  "food-01": {
    modulate: { saturation: 0.52, brightness: 0.99 },
    recomb: [
      [0.94, 0.06, 0.03],
      [0.02, 0.99, 0.02],
      [0.02, 0.08, 0.88],
    ],
  },
  "food-03": { modulate: { saturation: 0.86 } },
};

for (const file of readdirSync(SRC)) {
  if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
  const base = file.replace(/\.\w+$/, "");
  if (SKIP.has(base)) continue;
  const outName = WEBP_TARGETS.has(base) ? `${base}.webp` : `${base}.jpg`;
  const input = join(SRC, file);
  const output = join(OUT, outName);
  const img = sharp(input);
  const meta = await img.metadata();

  let pipeline = img;
  if (SCALE > 1) {
    pipeline = pipeline
      .resize({
        width: Math.round(meta.width * SCALE),
        kernel: sharp.kernel.lanczos3,
      })
      .median(1) // light denoise before sharpening
      .sharpen({ sigma: 1.1, m1: 0.6, m2: 0.4 })
      .modulate({ saturation: 1.05 });
  } else {
    // already high-res: just cap the size for the web
    pipeline = pipeline.resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const fix = CORRECTIONS[base];
  if (fix?.modulate) pipeline = pipeline.modulate(fix.modulate);
  if (fix?.recomb) pipeline = pipeline.recomb(fix.recomb);

  if (outName.endsWith(".webp")) {
    pipeline = pipeline.webp({ quality: 84 });
  } else {
    pipeline = pipeline.jpeg({ quality: 84, mozjpeg: true });
  }

  await pipeline.toFile(output);
  const outMeta = await sharp(output).metadata();
  console.log(`${file} -> ${outName}: ${outMeta.width}x${outMeta.height}`);
}

/**
 * Hero assets moved out of this script on 2026-09-03.
 *
 * Both hero.jpg (desktop) and hero-mobile.jpg (phone) are now built by
 * scripts/import-client-photos-2026-09.mjs from the second batch of client
 * photography. hero-mobile.jpg was never generated here at all -- it had been
 * cropped by hand, which is why it drifted out of sync with hero.jpg.
 *
 * Do not reinstate a hero step here without deleting the one there, or the two
 * scripts will fight over the same output.
 */
