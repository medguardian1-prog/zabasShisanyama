#!/usr/bin/env node
/**
 * Converts client-supplied originals in image-src/client/ into working
 * full-resolution JPEGs in image-src/client/converted/.
 *
 * HEIC is decoded with heic-convert (pure JS/WASM) rather than sharp: these
 * iPhone files are valid, but the libheif build bundled with sharp fails on
 * them with "bad seek" — the files were verified byte-identical across two
 * independent transfers, so it is a decoder limitation, not damage.
 *
 *   node scripts/import-client-photos.mjs
 */
import sharp from "sharp";
import convert from "heic-convert";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "image-src/client";
const OUT = join(SRC, "converted");
const PREVIEW = join(SRC, "previews");

for (const dir of [OUT, PREVIEW]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

const files = readdirSync(SRC).filter((f) => /\.(heic|heif|jpe?g|png|webp)$/i.test(f));

for (const file of files) {
  const base = file.replace(/\.\w+$/, "");
  const outPath = join(OUT, `${base}.jpg`);

  let input;
  if (/\.hei[cf]$/i.test(file)) {
    const decoded = await convert({
      buffer: readFileSync(join(SRC, file)),
      format: "JPEG",
      quality: 0.94,
    });
    input = Buffer.from(decoded);
  } else {
    input = readFileSync(join(SRC, file));
  }

  // full-resolution working copy, orientation applied
  await sharp(input).rotate().jpeg({ quality: 92 }).toFile(outPath);

  // small preview for choosing placements
  await sharp(input)
    .rotate()
    .resize({ width: 420 })
    .jpeg({ quality: 72 })
    .toFile(join(PREVIEW, `${base}.jpg`));

  const m = await sharp(outPath).metadata();
  console.log(`${file} -> ${base}.jpg  ${m.width}x${m.height}`);
}

console.log(`\n${files.length} file(s) converted into ${OUT}`);
