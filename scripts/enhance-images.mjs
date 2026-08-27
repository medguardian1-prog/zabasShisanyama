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

for (const file of readdirSync(SRC)) {
  if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
  const base = file.replace(/\.\w+$/, "");
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

  if (outName.endsWith(".webp")) {
    pipeline = pipeline.webp({ quality: 84 });
  } else {
    pipeline = pipeline.jpeg({ quality: 84, mozjpeg: true });
  }

  await pipeline.toFile(output);
  const outMeta = await sharp(output).metadata();
  console.log(`${file} -> ${outName}: ${outMeta.width}x${outMeta.height}`);
}
