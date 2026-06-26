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
const glbPath = path.join(root, "../public/models/modern-house.source.glb");
const buf = fs.readFileSync(glbPath);

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

function detectPool(model) {
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

  const groundMin = min.y + size.y * 0.02;
  const groundMax = min.y + size.y * 0.18;

  for (let i = 0; i <= 24; i++) {
    for (let j = 0; j <= 16; j++) {
      const x = min.x + size.x * (0.04 + (i / 24) * 0.52);
      const z = min.z + size.z * (0.5 + (j / 16) * 0.42);
      raycaster.set(
        new THREE.Vector3(x, box.max.y + 1, z),
        new THREE.Vector3(0, -1, 0),
      );

      for (const hit of raycaster.intersectObjects(meshes, false)) {
        if (!hit.face) continue;
        if (hit.point.y < groundMin || hit.point.y > groundMax) continue;
        const n = hit.face.normal
          .clone()
          .transformDirection(hit.object.matrixWorld);
        if (n.y < 0.65) continue;
        hits.push({ x: hit.point.x, y: hit.point.y, z: hit.point.z });
        break;
      }
    }
  }

  const yTolerance = size.y * 0.012;
  const groups = new Map();
  for (const h of hits) {
    let key = [...groups.keys()].find((k) => Math.abs(k - h.y) < yTolerance);
    if (key === undefined) key = h.y;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(h);
  }

  const ranked = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  console.log("Y groups:", ranked.map(([y, g]) => ({ y: +y.toFixed(4), count: g.length })));

  for (const [y, group] of ranked.slice(0, 4)) {
    const xs = group.map((h) => h.x);
    const zs = group.map((h) => h.z);
    const wf = (Math.max(...xs) - Math.min(...xs)) / size.x;
    const df = (Math.max(...zs) - Math.min(...zs)) / size.z;
    console.log(`Group y=${y.toFixed(4)}`, {
      xFrac: [((Math.min(...xs) - min.x) / size.x).toFixed(3), ((Math.max(...xs) - min.x) / size.x).toFixed(3)],
      zFrac: [((Math.min(...zs) - min.z) / size.z).toFixed(3), ((Math.max(...zs) - min.z) / size.z).toFixed(3)],
      widthFrac: wf.toFixed(3),
      depthFrac: df.toFixed(3),
      count: group.length,
    });
  }

  const poolHits = ranked[0]?.[1] ?? [];

  fs.writeFileSync(
    path.join(root, "../pool-measure.json"),
    JSON.stringify(
      {
        ranked: ranked.slice(0, 4).map(([y, group]) => {
          const xs = group.map((h) => h.x);
          const zs = group.map((h) => h.z);
          return {
            y: +y.toFixed(4),
            count: group.length,
            xMin: +((Math.min(...xs) - min.x) / size.x).toFixed(4),
            xMax: +((Math.max(...xs) - min.x) / size.x).toFixed(4),
            zMin: +((Math.min(...zs) - min.z) / size.z).toFixed(4),
            zMax: +((Math.max(...zs) - min.z) / size.z).toFixed(4),
          };
        }),
      },
      null,
      2,
    ),
  );

  if (poolHits.length < 6) {
    console.log("Not enough pool hits");
    return;
  }

  const xs = poolHits.map((h) => h.x);
  const zs = poolHits.map((h) => h.z);
  const ys = poolHits.map((h) => h.y);

  const result = {
    centerX: (Math.min(...xs) + Math.max(...xs)) / 2,
    centerZ: (Math.min(...zs) + Math.max(...zs)) / 2,
    waterY: ys.reduce((a, b) => a + b, 0) / ys.length,
    width: Math.max(...xs) - Math.min(...xs),
    depth: Math.max(...zs) - Math.min(...zs),
    bboxMin: min.toArray().map((v) => +v.toFixed(3)),
    bboxSize: size.toArray().map((v) => +v.toFixed(3)),
    fractions: {
      centerX: ((Math.min(...xs) + Math.max(...xs)) / 2 - min.x) / size.x,
      centerZ: ((Math.min(...zs) + Math.max(...zs)) / 2 - min.z) / size.z,
      width: (Math.max(...xs) - Math.min(...xs)) / size.x,
      depth: (Math.max(...zs) - Math.min(...zs)) / size.z,
      waterY: (ys.reduce((a, b) => a + b, 0) / ys.length - min.y) / size.y,
    },
    hitCount: poolHits.length,
  };

  console.log(JSON.stringify(result, null, 2));
}

loader.parse(
  buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
  "",
  (gltf) => {
    const clone = gltf.scene.clone(true);
    normalizeModel(clone);
    detectPool(clone);
  },
  (err) => {
    console.error(err);
  },
);
