import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

globalThis.self = globalThis;
globalThis.window = globalThis;
globalThis.ProgressEvent = class extends Event {
  constructor(type, init = {}) {
    super(type);
    this.lengthComputable = !!init.lengthComputable;
    this.loaded = init.loaded ?? 0;
    this.total = init.total ?? 0;
  }
};

const root = path.dirname(fileURLToPath(import.meta.url));
const buf = fs.readFileSync(path.join(root, "../public/models/modern-house.source.glb"));
const loader = new GLTFLoader();

function normalizeModel(object) {
  const box = new THREE.Box3();
  object.traverse((child) => {
    if (child.isMesh) box.expandByObject(child);
  });
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? 4.2 / maxDim : 1;
  object.position.sub(center);
  object.scale.multiplyScalar(scale);
  object.updateMatrixWorld(true);
}

loader.parse(
  buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
  "",
  (gltf) => {
    const model = gltf.scene.clone(true);
    normalizeModel(model);

    const box = new THREE.Box3();
    const meshes = [];
    model.traverse((child) => {
      if (child.isMesh) {
        box.expandByObject(child);
        meshes.push(child);
      }
    });

    const min = box.min;
    const size = box.getSize(new THREE.Vector3());
    const raycaster = new THREE.Raycaster();
    const hits = [];

    // Front-left pool region (user red outline)
    for (let i = 0; i <= 28; i++) {
      for (let j = 0; j <= 20; j++) {
        const x = min.x + size.x * (0.04 + (i / 28) * 0.48);
        const z = min.z + size.z * (0.48 + (j / 20) * 0.44);
        raycaster.set(
          new THREE.Vector3(x, box.max.y + 2, z),
          new THREE.Vector3(0, -1, 0),
        );

        const all = raycaster.intersectObjects(meshes, false);
        for (const hit of all) {
          if (!hit.face) continue;
          const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
          if (n.y < 0.55) continue;
          hits.push({ x: hit.point.x, y: hit.point.y, z: hit.point.z, ny: n.y });
          break;
        }
      }
    }

    const yTol = size.y * 0.01;
    const groups = new Map();
    for (const h of hits) {
      let key = [...groups.keys()].find((k) => Math.abs(k - h.y) < yTol);
      if (key === undefined) key = h.y;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(h);
    }

    const ranked = [...groups.entries()].sort((a, b) => a[0] - b[0]);
    console.log("All Y layers (lowest first):");
    for (const [y, group] of ranked) {
      const xs = group.map((h) => h.x);
      const zs = group.map((h) => h.z);
      console.log({
        y: +y.toFixed(4),
        yFrac: +(((y - min.y) / size.y).toFixed(4)),
        count: group.length,
        xFrac: [+(((Math.min(...xs) - min.x) / size.x).toFixed(3)), +(((Math.max(...xs) - min.x) / size.x).toFixed(3))],
        zFrac: [+(((Math.min(...zs) - min.z) / size.z).toFixed(3)), +(((Math.max(...zs) - min.z) / size.z).toFixed(3))],
      });
    }

    // Pool basin = lowest dense horizontal layer in front-left
    const poolLayer = ranked.find(([, g]) => g.length >= 8) ?? ranked[0];
    if (!poolLayer) return;

    const [y, group] = poolLayer;
    const xs = group.map((h) => h.x);
    const zs = group.map((h) => h.z);

    const result = {
      waterY: +y.toFixed(4),
      yFrac: +(((y - min.y) / size.y).toFixed(4)),
      xMin: +(((Math.min(...xs) - min.x) / size.x).toFixed(4)),
      xMax: +(((Math.max(...xs) - min.x) / size.x).toFixed(4)),
      zMin: +(((Math.min(...zs) - min.z) / size.z).toFixed(4)),
      zMax: +(((Math.max(...zs) - min.z) / size.z).toFixed(4)),
      centerX: +(((Math.min(...xs) + Math.max(...xs)) / 2).toFixed(4)),
      centerZ: +(((Math.min(...zs) + Math.max(...zs)) / 2).toFixed(4)),
      centerXFrac: +((((Math.min(...xs) + Math.max(...xs)) / 2 - min.x) / size.x).toFixed(4)),
      centerZFrac: +((((Math.min(...zs) + Math.max(...zs)) / 2 - min.z) / size.z).toFixed(4)),
    };

    console.log("\nRecommended pool surface:", result);
    fs.writeFileSync(path.join(root, "../pool-basin.json"), JSON.stringify(result, null, 2));
  },
  console.error,
);
