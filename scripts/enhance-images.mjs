#!/usr/bin/env node
/**
 * Enhances the small source photos in image-src/ into public/images/:
 * 2.5x lanczos3 enlargement + gentle sharpen + light denoise, so next/image
 * downscales (clean) instead of the browser upscaling (blurry).
 * Re-run any time the files in image-src/ change:
 *   node scripts/enhance-images.mjs
 */
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "image-src";
const OUT = "public/images";
const SCALE = 2.5;

for (const file of readdirSync(SRC)) {
  const input = join(SRC, file);
  const output = join(OUT, file);
  const img = sharp(input);
  const meta = await img.metadata();
  const width = Math.round(meta.width * SCALE);

  let pipeline = img
    .resize({ width, kernel: sharp.kernel.lanczos3 })
    .median(1) // light denoise before sharpening
    .sharpen({ sigma: 1.1, m1: 0.6, m2: 0.4 })
    .modulate({ saturation: 1.05 });

  if (file.endsWith(".webp")) {
    pipeline = pipeline.webp({ quality: 84 });
  } else {
    pipeline = pipeline.jpeg({ quality: 84, mozjpeg: true });
  }

  await pipeline.toFile(output);
  const outMeta = await sharp(output).metadata();
  console.log(`${file}: ${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}`);
}
