import * as THREE from "three";
import { SUN_DIRECTION, SUN_TINT, VILLA_BEAM_RADIUS, VILLA_CENTER } from "./sunsetConstants";

function isGlassMaterial(
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  meshName: string,
) {
  const label = `${material.name} ${meshName}`.toLowerCase();
  if (
    label.includes("glass") ||
    label.includes("window") ||
    label.includes("glazing") ||
    label.includes("pane")
  ) {
    return true;
  }
  return material.transparent && material.opacity < 0.98;
}

function isWoodMaterial(
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  meshName: string,
) {
  const label = `${material.name} ${meshName}`.toLowerCase();
  return (
    label.includes("wood") ||
    label.includes("timber") ||
    label.includes("deck") ||
    label.includes("cladding") ||
    label.includes("oak") ||
    label.includes("teak")
  );
}

function isConcreteMaterial(
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  meshName: string,
) {
  const label = `${material.name} ${meshName}`.toLowerCase();
  return (
    label.includes("concrete") ||
    label.includes("stone") ||
    label.includes("cement") ||
    label.includes("stucco") ||
    label.includes("plaster") ||
    label.includes("wall") ||
    label.includes("floor") ||
    label.includes("slab")
  );
}

export function applySunTintToMaterial(
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
) {
  const toSun = SUN_DIRECTION.clone();

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSunTintColor = { value: SUN_TINT.clone() };
    shader.uniforms.uSunDir = { value: toSun };
    shader.uniforms.uVillaCenter = { value: VILLA_CENTER.clone() };
    shader.uniforms.uVillaRadius = { value: VILLA_BEAM_RADIUS };

    shader.vertexShader = `
      varying vec3 vWorldPosTint;
      ${shader.vertexShader}
    `.replace(
      "#include <begin_vertex>",
      /* glsl */ `
        #include <begin_vertex>
        vWorldPosTint = (modelMatrix * vec4(transformed, 1.0)).xyz;
      `,
    );

    shader.fragmentShader = `
      uniform vec3 uSunTintColor;
      uniform vec3 uSunDir;
      uniform vec3 uVillaCenter;
      uniform float uVillaRadius;
      varying vec3 vWorldPosTint;
      ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <output_fragment>",
      /* glsl */ `
        {
          float sunLit = pow(max(dot(normalize(normal), uSunDir), 0.0), 1.35);
          float grazing = pow(1.0 - max(dot(normalize(normal), normalize(vViewPosition)), 0.0), 2.2);
          vec2 villaXZ = vWorldPosTint.xz - uVillaCenter.xz;
          float villaProx =
            exp(-dot(villaXZ, villaXZ) / (uVillaRadius * uVillaRadius) * 1.15);
          villaProx *= exp(
            -pow(abs(vWorldPosTint.y - uVillaCenter.y) / max(uVillaRadius * 0.72, 0.001), 1.6)
          );
          float villaLift = villaProx * mix(0.24, 0.42, sunLit);
          diffuseColor.rgb += uSunTintColor * villaLift;
          diffuseColor.rgb +=
            uSunTintColor * sunLit * mix(0.55, villaProx, 0.92) * mix(0.38, 0.95, grazing);
          diffuseColor.rgb = max(diffuseColor.rgb, vec3(0.078) * villaProx);
        }
        #include <output_fragment>
      `,
    );
  };
  material.customProgramCacheKey = () => "sunset-tint-v6";
  material.needsUpdate = true;
}

export function tuneSunsetMaterial(
  material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  meshName: string,
) {
  const textureKeys = [
    "map",
    "emissiveMap",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "aoMap",
  ] as const;

  textureKeys.forEach((key) => {
    const texture = material[key];
    if (texture instanceof THREE.Texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  });

  material.envMapIntensity = 1.78;

  const luminance =
    material.color.r * 0.299 +
    material.color.g * 0.587 +
    material.color.b * 0.114;
  if (luminance < 0.22) {
    material.color.lerp(new THREE.Color("#b0a098"), 0.58);
  }

  if (isGlassMaterial(material, meshName)) {
    if (material instanceof THREE.MeshPhysicalMaterial) {
      material.transmission = Math.max(material.transmission ?? 0, 0.82);
      material.thickness = 0.35;
      material.roughness = Math.min(material.roughness, 0.08);
      material.metalness = 0;
      material.ior = 1.52;
      material.transparent = true;
      material.opacity = 1;
      material.envMapIntensity = 1.35;
    } else {
      material.transparent = true;
      material.opacity = Math.min(material.opacity, 0.42);
      material.roughness = Math.min(material.roughness, 0.06);
      material.metalness = 0;
      material.envMapIntensity = 1.4;
    }
    applySunTintToMaterial(material);
    return material;
  }

  if (isWoodMaterial(material, meshName)) {
    material.roughness = material.roughnessMap
      ? material.roughness
      : THREE.MathUtils.clamp(material.roughness * 0.88, 0.38, 0.72);
    material.metalness = Math.min(material.metalness, 0.04);
    material.envMapIntensity = 1.08;
    applySunTintToMaterial(material);
    return material;
  }

  if (isConcreteMaterial(material, meshName)) {
    material.roughness = material.roughnessMap
      ? material.roughness
      : Math.max(material.roughness, 0.78);
    material.metalness = Math.min(material.metalness, 0.06);
    if (!material.normalMap) {
      material.bumpScale = 0.015;
    }
    material.envMapIntensity = 0.95;
    applySunTintToMaterial(material);
    return material;
  }

  if (!material.metalnessMap) {
    material.metalness = Math.min(material.metalness, 0.1);
  }
  if (!material.roughnessMap) {
    material.roughness = Math.max(material.roughness, 0.58);
  }
  applySunTintToMaterial(material);
  return material;
}

export function prepareSunsetModelMaterials(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;

    const mesh = child as THREE.Mesh;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    const tuned = materials.map((material) => {
      if (
        material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhysicalMaterial
      ) {
        return tuneSunsetMaterial(material, mesh.name);
      }
      return material;
    });

    mesh.material = Array.isArray(mesh.material) ? tuned : tuned[0];
  });
}
