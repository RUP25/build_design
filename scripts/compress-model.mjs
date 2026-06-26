import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modelsDir = path.join(root, "public", "models");
const source = path.join(modelsDir, "modern-house.source.glb");
const input = fs.existsSync(source)
  ? source
  : path.join(modelsDir, "modern-house.glb");
const output = path.join(modelsDir, "modern-house.glb");

if (!fs.existsSync(input)) {
  console.error("No GLB found at public/models/modern-house.glb");
  process.exit(1);
}

const tmp = path.join(modelsDir, "modern-house.tmp.glb");

console.log(`Compressing ${path.basename(input)}…`);

execSync(
  [
    "npx gltf-transform optimize",
    `"${input}"`,
    `"${tmp}"`,
    "--compress draco",
    "--texture-compress webp",
    "--texture-size 2048",
    "--simplify false",
  ].join(" "),
  { stdio: "inherit", cwd: root },
);

if (input !== source && !fs.existsSync(source)) {
  fs.copyFileSync(input, source);
  console.log("Saved original as modern-house.source.glb");
}

fs.renameSync(tmp, output);

const before = fs.statSync(source).size;
const after = fs.statSync(output).size;
console.log(
  `Done: ${(before / 1024 / 1024).toFixed(1)} MB → ${(after / 1024 / 1024).toFixed(2)} MB`,
);
