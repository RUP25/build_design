import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const source = path.join(root, "public/images/villatree.png");
const output = path.join(root, "public/images/villatree-clean.png");

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.from(data);
const n = width * height;

// The baked-in transparency checkerboard is a regular pattern (~23px squares)
// of WHITE (255) and GRAY (~205) neutral cells. Villa walls/glass are also
// bright + neutral, so brightness alone leaks into the building.
//
// Trick: a pixel only counts as checkerboard background if it is bright+neutral
// AND there is a distinct GRAY checker cell nearby AND a near-WHITE cell nearby.
// Uniform white walls have no gray cell beside them, so the fill can't pass
// through them into the interior.
// Measured checker palette: WHITE ~255 and a specific GRAY ~191.
const SPREAD = 18; // neutral: r,g,b close together
const RADIUS = 28; // a bit larger than one checker square (~23px)
const GRAY_LO = 183;
const GRAY_HI = 199;
const WHITE_LO = 248;

const grayCell = new Uint8Array(n); // the distinctive checker gray square
const brightNeutral = new Uint8Array(n); // gray, white, or their AA boundaries

for (let p = 0; p < n; p++) {
  const i = p * channels;
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min > SPREAD) continue; // not neutral
  if (max >= 150) brightNeutral[p] = 1;
  if (max >= GRAY_LO && max <= GRAY_HI) grayCell[p] = 1;
}
void WHITE_LO;

// Integral image for fast "is there a checker-gray cell within RADIUS" query.
const stride = width + 1;
const Ig = new Int32Array(stride * (height + 1));
for (let y = 0; y < height; y++) {
  let rowSum = 0;
  for (let x = 0; x < width; x++) {
    rowSum += grayCell[y * width + x];
    Ig[(y + 1) * stride + (x + 1)] = Ig[y * stride + (x + 1)] + rowSum;
  }
}
function grayNear(x, y) {
  const x0 = Math.max(0, x - RADIUS);
  const y0 = Math.max(0, y - RADIUS);
  const x1 = Math.min(width, x + RADIUS + 1);
  const y1 = Math.min(height, y + RADIUS + 1);
  return (
    Ig[y1 * stride + x1] -
    Ig[y0 * stride + x1] -
    Ig[y1 * stride + x0] +
    Ig[y0 * stride + x0]
  );
}

// A pixel is checker background if it is bright + neutral (gray square, white
// square, or the anti-aliased boundary between them) AND sits near the
// distinctive checker-gray. Solid white walls have no checker-gray beside
// them, so they stay opaque.
const eligible = new Uint8Array(n);
for (let p = 0; p < n; p++) {
  if (!brightNeutral[p]) continue;
  const x = p % width;
  const y = (p - x) / width;
  if (grayNear(x, y) > 0) eligible[p] = 1;
}

// Flood fill from the borders to remove the OUTER checkerboard while keeping
// the villa (and large light surfaces like the concrete patio) intact.
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

// Clear small ENCLOSED checker pockets (gaps behind railings/under decks) that
// the border fill couldn't reach. Only small components are removed, so large
// light surfaces (patio, paths) are preserved.
const POCKET_MAX = Math.round(n * 0.03); // enclosed checker pockets
const visited = new Uint8Array(n);
const comp = new Int32Array(n);
for (let s = 0; s < n; s++) {
  if (!eligible[s] || isBg[s] || visited[s]) continue;
  let cp = 0;
  let head = 0;
  comp[cp++] = s;
  visited[s] = 1;
  while (head < cp) {
    const p = comp[head++];
    const x = p % width;
    const y = (p - x) / width;
    const nb = [
      x > 0 ? p - 1 : -1,
      x < width - 1 ? p + 1 : -1,
      y > 0 ? p - width : -1,
      y < height - 1 ? p + width : -1,
    ];
    for (const q of nb) {
      if (q >= 0 && eligible[q] && !isBg[q] && !visited[q]) {
        visited[q] = 1;
        comp[cp++] = q;
      }
    }
  }
  if (cp <= POCKET_MAX) {
    for (let k = 0; k < cp; k++) isBg[comp[k]] = 1;
  }
}

// Background -> fully transparent.
for (let p = 0; p < n; p++) {
  if (isBg[p]) out[p * channels + 3] = 0;
}

// Feather: soften the 1px halo around the subject so edges aren't hard.
// Any kept pixel that borders transparency gets a slight alpha reduction.
const alphaCopy = new Uint8Array(n);
for (let p = 0; p < n; p++) alphaCopy[p] = out[p * channels + 3];

for (let p = 0; p < n; p++) {
  if (alphaCopy[p] === 0) continue;
  const x = p % width;
  const y = (p - x) / width;
  let transparentNeighbors = 0;
  if (x > 0 && alphaCopy[p - 1] === 0) transparentNeighbors++;
  if (x < width - 1 && alphaCopy[p + 1] === 0) transparentNeighbors++;
  if (y > 0 && alphaCopy[p - width] === 0) transparentNeighbors++;
  if (y < height - 1 && alphaCopy[p + width] === 0) transparentNeighbors++;
  if (transparentNeighbors >= 2) out[p * channels + 3] = 170;
}

await sharp(out, { raw: { width, height, channels } })
  .png({ compressionLevel: 6 })
  .toFile(output);

let bgCount = 0;
for (let p = 0; p < n; p++) if (isBg[p]) bgCount++;
const sizeKB = Math.round(fs.statSync(output).size / 1024);
console.log(
  `Saved ${output} ${width}x${height} (${sizeKB} KB), removed ${(
    (bgCount / n) *
    100
  ).toFixed(1)}% as background`,
);
