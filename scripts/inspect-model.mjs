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

loader.parse(
  buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
  "",
  (gltf) => {
    const clone = gltf.scene.clone(true);
    normalizeModel(clone);
    clone.updateMatrixWorld(true);

    const box = new THREE.Box3();
    clone.traverse((c) => {
      if (c.isMesh) box.expandByObject(c);
    });
    const min = box.min;
    const size = box.getSize(new THREE.Vector3());

    console.log("bbox min", min.toArray().map((v) => +v.toFixed(3)));
    console.log("bbox size", size.toArray().map((v) => +v.toFixed(3)));

    const meshes = [];
    clone.traverse((child) => {
      if (!child.isMesh) return;
      const mesh = child;
      const mb = new THREE.Box3().setFromObject(mesh);
      const ms = mb.getSize(new THREE.Vector3());
      const mc = mb.getCenter(new THREE.Vector3());
      meshes.push({
        name: child.name || "(unnamed)",
        parent: child.parent?.name || "(root)",
        center: mc.toArray().map((v) => +v.toFixed(3)),
        size: ms.toArray().map((v) => +v.toFixed(3)),
        xFrac: +(((mc.x - min.x) / size.x).toFixed(3)),
        zFrac: +(((mc.z - min.z) / size.z).toFixed(3)),
        yFrac: +(((mc.y - min.y) / size.y).toFixed(3)),
        horiz: ms.y < ms.x * 0.15 && ms.y < ms.z * 0.15,
        verts: mesh.geometry?.attributes?.position?.count ?? 0,
      });
    });

    const poolish = meshes
      .filter((m) => m.horiz && m.yFrac < 0.25 && m.size[0] > 0.2 && m.size[2] > 0.2)
      .sort((a, b) => a.xFrac - b.xFrac);

    console.log("\nHorizontal low meshes (pool candidates):");
    for (const m of poolish.slice(0, 20)) {
      console.log(m);
    }

    console.log("\nAll mesh names:");
    for (const m of meshes) {
      if (/pool|water|swim|aqua|teal/i.test(m.name)) console.log("MATCH", m);
    }
  },
  (err) => console.error(err),
);
