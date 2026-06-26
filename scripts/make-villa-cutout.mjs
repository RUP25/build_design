import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const source = path.join(root, "public/images/villa.png");
const output = path.join(root, "public/images/villa-clean.png");

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.from(data);
const n = width * height;

const LOW = 12; // fully transparent at/under this brightness
const HIGH = 74; // upper bound for background-eligible darkness
const SPREAD = 26; // background must be roughly neutral (not colored)

// Eligibility: a pixel could be background if it is dark and neutral.
const eligible = new Uint8Array(n);
for (let p = 0; p < n; p++) {
  const i = p * channels;
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max <= HIGH && max - min <= SPREAD) eligible[p] = 1;
}

// Flood fill from the borders so only OUTER background is removed,
// leaving dark interior glass/shadows (enclosed by the villa) intact.
const isBg = new Uint8Array(n);
const stack = new Int32Array(n);
let sp = 0;

function push(p) {
  if (p >= 0 && p < n && eligible[p] && !isBg[p]) {
    isBg[p] = 1;
    stack[sp++] = p;
  }
}

for (let x = 0; x < width; x++) {
  push(x);
  push((height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  push(y * width);
  push(y * width + (width - 1));
}

while (sp > 0) {
  const p = stack[--sp];
  const x = p % width;
  const y = (p - x) / width;
  if (x > 0) push(p - 1);
  if (x < width - 1) push(p + 1);
  if (y > 0) push(p - width);
  if (y < height - 1) push(p + width);
}

// Apply alpha: background -> transparent with a feather for clean edges.
for (let p = 0; p < n; p++) {
  if (!isBg[p]) continue;
  const i = p * channels;
  const max = Math.max(out[i], out[i + 1], out[i + 2]);
  if (max <= LOW) {
    out[i + 3] = 0;
  } else {
    const t = (max - LOW) / (HIGH - LOW);
    out[i + 3] = Math.min(out[i + 3], Math.round(255 * Math.max(0, Math.min(1, t))));
  }
}

// Defringe: remove black matte spill from the feathered edge pixels only.
for (let p = 0; p < n; p++) {
  if (!isBg[p]) continue;
  const i = p * channels;
  const a = out[i + 3];
  if (a === 0 || a === 255) continue;
  const af = a / 255;
  out[i] = Math.min(255, Math.round(out[i] / af));
  out[i + 1] = Math.min(255, Math.round(out[i + 1] / af));
  out[i + 2] = Math.min(255, Math.round(out[i + 2] / af));
}

// Erase the Gemini star logo (bottom-right, sits in the black zone).
const starBox = {
  x0: Math.round(width * 0.84),
  x1: Math.round(width * 0.95),
  y0: Math.round(height * 0.78),
  y1: Math.round(height * 0.92),
};
for (let y = starBox.y0; y < starBox.y1; y++) {
  for (let x = starBox.x0; x < starBox.x1; x++) {
    out[(y * width + x) * channels + 3] = 0;
  }
}

await sharp(out, { raw: { width, height, channels } })
  .png({ compressionLevel: 6 })
  .toFile(output);

const sizeKB = Math.round(fs.statSync(output).size / 1024);
console.log(`Saved transparent villa: ${width}x${height} (${sizeKB} KB)`);
