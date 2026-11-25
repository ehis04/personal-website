#!/usr/bin/env node
// Makes the responsive image sizes the site serves.
//
// Why: Next.js cannot resize images on Cloudflare Workers, so without this a phone
// would download the full-size original. This writes a small WebP for each width
// (never enlarging) and lib/image-loader.ts picks the right one.
//
// Usage:  node scripts/make-image-variants.mjs
// Run it again after adding or replacing a photo in public/media/ (.jpg/.jpeg/.png)
// or a CV page image in public/cv/ (page-1.webp, page-2.webp).
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const MEDIA_WIDTHS = [384, 640, 828, 1200];
const CV_WIDTHS = [640, 750, 900, 1251];

async function make(srcFile, outBase, widths) {
  const meta = await sharp(srcFile).metadata();
  let total = 0;
  for (const w of widths) {
    const out = `${outBase}-${w}.webp`;
    const info = await sharp(srcFile)
      .resize({ width: Math.min(w, meta.width ?? w), withoutEnlargement: true })
      .webp({ quality: 74, effort: 5 })
      .toFile(out);
    total += info.size;
  }
  console.log(`${path.relative(root, srcFile).padEnd(26)} ${meta.width}px -> ${widths.join("/")}  (${Math.round(total / 1024)} KB total)`);
}

const media = path.join(root, "media");
for (const f of await readdir(media)) {
  if (/\.(jpe?g|png)$/i.test(f)) await make(path.join(media, f), path.join(media, f.replace(/\.[^.]+$/, "")), MEDIA_WIDTHS);
}
const cv = path.join(root, "cv");
for (const f of await readdir(cv)) {
  if (/^page-\d+\.webp$/.test(f)) await make(path.join(cv, f), path.join(cv, f.replace(/\.webp$/, "")), CV_WIDTHS);
}
