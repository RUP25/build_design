"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  DeferredWebGLMount,
  WebGLErrorBoundary,
} from "./WebGLCanvasShell";
import {
  Billboard,
  Center,
  ContactShadows,
  Environment,
  Html,
  useEnvironment,
  useGLTF,
} from "@react-three/drei";
import { PoolWater, getPoolSurface } from "./PoolWater";
import { prepareSunsetModelMaterials } from "./SunsetMaterials";
import { SunsetSky } from "./SunsetSky";
import { SunsetSun, SunsetSunLighting } from "./SunsetSun";
import { FOG_COLOR, FOG_FAR, FOG_NEAR } from "./sunsetConstants";
import * as THREE from "three";

const MODEL_PATH = "/models/modern-house.glb";
const DRACO_DECODER = true;

export type BuildingModelCanvasProps = {
  activeStep: number;
  onStepChange: (step: number) => void;
  isVisible: boolean;
  mountKey: number;
  onFailed: () => void;
  mobileCameraPullBack?: number;
};

const CAMERA_PRESETS = [
  { position: [5.5, 2.8, 7.5], target: [0, 0.2, 0] },
  { position: [-7.8, 2.9, 5.8], target: [0, 0.06, 0] },
  { position: [0.6, 2.5, 8.4], target: [0, 0.28, 0] },
  { position: [8, 3.35, 5], target: [0.1, 0.4, 0.02] },
  { position: [1.2, 10.5, 16.5], target: [0, 0.12, 0] },
] as const;

/** Portrait-friendly angles — step 4 avoids pure top-down (reads as flat slabs on mobile). */
const MOBILE_CAMERA_PRESETS = [
  { position: [6, 3.1, 8.5], target: [0, 0.24, 0] },
  { position: [-8.2, 3.2, 6.5], target: [0, 0.1, 0] },
  { position: [0.8, 2.8, 9], target: [0, 0.32, 0] },
  { position: [8.5, 3.6, 5.5], target: [0.12, 0.45, 0] },
  { position: [5.4, 4.6, 10.8], target: [0, 0.42, 0] },
] as const;

function resolveCameraPullBack(
  stepIndex: number,
  basePullBack: number,
  useMobilePresets: boolean,
) {
  if (!useMobilePresets) return basePullBack;
  if (stepIndex === 4) return 1;
  return basePullBack;
}

const HOTSPOT_RAYS = [
  { dir: [-0.74, -0.06, 0.74], step: 0 },
  { dir: [-0.98, -0.14, 0.28], step: 1 },
  { dir: [-0.22, 0.1, 0.97], step: 2 },
  { dir: [0.96, 0.42, 0.24], step: 3 },
  { dir: [0.78, 0.04, 0.52], step: 4 },
] as const;

function spreadHotspotPositions(
  spots: { step: number; position: THREE.Vector3; scale: number }[],
  minSeparation: number,
) {
  const adjusted = spots.map((spot) => ({
    ...spot,
    position: spot.position.clone(),
  }));

  for (let pass = 0; pass < 6; pass += 1) {
    for (let i = 0; i < adjusted.length; i += 1) {
      for (let j = i + 1; j < adjusted.length; j += 1) {
        const a = adjusted[i].position;
        const b = adjusted[j].position;
        const delta = b.clone().sub(a);
        const dist = delta.length();
        const steps = [adjusted[i].step, adjusted[j].step];
        const minDist =
          (steps.includes(0) && steps.includes(3))
            ? minSeparation * 1.4
            : minSeparation;

        if (dist >= minDist || dist < 1e-6) continue;

        const push = (minDist - dist) * 0.55;
        delta.normalize().multiplyScalar(push * 0.5);
        a.sub(delta);
        b.add(delta);
      }
    }
  }

  return adjusted;
}

function prepareModelMaterials(object: THREE.Object3D) {
  prepareSunsetModelMaterials(object);
}

function getMeshBounds(object: THREE.Object3D) {
  const box = new THREE.Box3();
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      box.expandByObject(child);
    }
  });
  return box;
}

function normalizeModel(object: THREE.Object3D) {
  const box = getMeshBounds(object);
  if (box.isEmpty()) return 1;

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? 5.2 / maxDim : 1;

  object.position.sub(center);
  object.scale.multiplyScalar(scale);
  object.updateMatrixWorld(true);

  return scale;
}

function collectMeshes(object: THREE.Object3D) {
  const meshes: THREE.Mesh[] = [];
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      meshes.push(child as THREE.Mesh);
    }
  });
  return meshes;
}

function computeHotspotPositions(model: THREE.Object3D) {
  const box = getMeshBounds(model);
  if (box.isEmpty()) return [];

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const meshes = collectMeshes(model);
  const raycaster = new THREE.Raycaster();

  const spots = HOTSPOT_RAYS.map((anchor) => {
    const direction = new THREE.Vector3(...anchor.dir).normalize();
    const origin = center
      .clone()
      .add(direction.clone().multiplyScalar(maxDim * 2));
    raycaster.set(origin, direction.clone().negate());

    const hit = raycaster.intersectObjects(meshes, false)[0];
    const position = hit
      ? hit.point
          .clone()
          .add(
            hit.face
              ? hit.face.normal
                  .clone()
                  .transformDirection(hit.object.matrixWorld)
                  .multiplyScalar(maxDim * 0.012)
              : new THREE.Vector3(),
          )
      : center.clone().add(direction.multiplyScalar(maxDim * 0.45));

    return {
      step: anchor.step,
      position,
      scale: maxDim * 0.038,
    };
  });

  return spreadHotspotPositions(spots, maxDim * 0.2);
}

function CinematicCamera({
  activeStep,
  pullBack,
  useMobilePresets,
}: {
  activeStep: number;
  pullBack: number;
  useMobilePresets: boolean;
}) {
  const { camera } = useThree();
  const smoothStep = useRef(0);
  const lookTarget = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    smoothStep.current = THREE.MathUtils.damp(
      smoothStep.current,
      activeStep,
      3.2,
      delta,
    );

    const idx = Math.min(
      CAMERA_PRESETS.length - 1,
      Math.max(0, Math.round(smoothStep.current)),
    );
    const presets = useMobilePresets ? MOBILE_CAMERA_PRESETS : CAMERA_PRESETS;
    const preset = presets[idx];
    const stepPullBack = resolveCameraPullBack(idx, pullBack, useMobilePresets);

    desiredPos.current.set(
      preset.position[0] * stepPullBack,
      preset.position[1] * stepPullBack,
      preset.position[2] * stepPullBack,
    );
    lookTarget.current.set(
      preset.target[0],
      preset.target[1],
      preset.target[2],
    );

    camera.position.lerp(desiredPos.current, 1 - Math.pow(0.001, delta));
    camera.lookAt(lookTarget.current);
  });

  return null;
}

function Hotspot({
  position,
  scale,
  active,
  onSelect,
}: {
  position: THREE.Vector3;
  scale: number;
  active: boolean;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.035;
    group.current.scale.setScalar(active ? scale * pulse : scale * 0.92);
  });

  return (
    <group ref={group} position={position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Billboard follow>
        <mesh renderOrder={10}>
          <ringGeometry args={[0.85, 1, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={active ? 0.55 : 0.22}
            depthTest={false}
          />
        </mesh>
        <mesh renderOrder={11}>
          <ringGeometry args={[0.42, 0.48, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={active ? 0.95 : 0.4}
            depthTest={false}
          />
        </mesh>
        <mesh renderOrder={12}>
          <circleGeometry args={[0.22, 32]} />
          <meshBasicMaterial
            color={active ? "#e06c07" : "#ffffff"}
            transparent
            opacity={active ? 1 : 0.65}
            depthTest={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

function CanvasLoader() {
  return (
    <Html center>
      <div className="rounded-full border border-white/15 bg-black/70 px-5 py-2 text-[10px] tracking-[0.22em] text-white/70 uppercase">
        Loading model…
      </div>
    </Html>
  );
}

/** Mount after commit so Environment loading does not setState during render. */
function SceneEnvironment() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

    return (
    <Environment preset="sunset" background={false} environmentIntensity={1.15} />
  );
}

function CanvasCleanup() {
  const { gl } = useThree();

  useEffect(
    () => () => {
      gl.dispose();
    },
    [gl],
  );

  return null;
}

function Scene({
  activeStep,
  onStepChange,
  isVisible,
  cameraPullBack,
}: {
  activeStep: number;
  onStepChange: (step: number) => void;
  isVisible: boolean;
  cameraPullBack: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_DECODER);

  const { model, hotspots, poolSurface } = useMemo(() => {
    const clone = scene.clone(true);
    prepareModelMaterials(clone);
    normalizeModel(clone);
    clone.updateMatrixWorld(true);

    return {
      model: clone,
      hotspots: computeHotspotPositions(clone),
      poolSurface: getPoolSurface(clone),
    };
  }, [scene]);

  const useMobilePresets = cameraPullBack > 1;

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y =
      -0.32 + Math.sin(state.clock.elapsedTime * 0.12) * 0.008;
  });

  return (
    <>
      <CinematicCamera
        activeStep={activeStep}
        pullBack={cameraPullBack}
        useMobilePresets={useMobilePresets}
      />
      <CanvasCleanup />
      <SunsetSun />
      <group ref={group}>
        <Center disableY>
          <primitive object={model} />
          <PoolWater surface={poolSurface} />
          {hotspots.map((spot) => (
            <Hotspot
              key={spot.step}
              position={spot.position}
              scale={spot.scale}
              active={spot.step === activeStep}
              onSelect={() => onStepChange(spot.step)}
            />
          ))}
        </Center>
      </group>
      {isVisible && (
        <ContactShadows
          opacity={0.14}
          scale={16}
          blur={2.6}
          far={10}
          color="#120a08"
          position={[0, -0.55, 0]}
        />
      )}
    </>
  );
}

useGLTF.preload(MODEL_PATH, DRACO_DECODER);
useEnvironment.preload({ preset: "sunset" });

const CANVAS_GL_OPTIONS = {
  alpha: false,
  antialias: false,
  depth: true,
  stencil: false,
  powerPreference: "default" as WebGLPowerPreference,
  failIfMajorPerformanceCaveat: false,
};

function probeWebGLRenderer(): boolean {
  let renderer: THREE.WebGLRenderer | null = null;

  try {
    const canvas = document.createElement("canvas");
    renderer = new THREE.WebGLRenderer({
      canvas,
      ...CANVAS_GL_OPTIONS,
    });

    return Boolean(renderer.getContext());
  } catch {
    return false;
  } finally {
    renderer?.dispose();
  }
}

function CanvasFailed({ onFailed }: { onFailed: () => void }) {
  useEffect(() => {
    onFailed();
  }, [onFailed]);

  return null;
}

export function BuildingModelCanvas({
  activeStep,
  onStepChange,
  isVisible,
  mountKey,
  onFailed,
  mobileCameraPullBack = 1,
}: BuildingModelCanvasProps) {
  const [rendererReady, setRendererReady] = useState<boolean | null>(null);
  const [cameraPullBack, setCameraPullBack] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => {
      setCameraPullBack(mq.matches ? mobileCameraPullBack : 1);
    };

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [mobileCameraPullBack]);

  useEffect(() => {
    setRendererReady(null);

    let cancelled = false;
    const timer = window.setTimeout(() => {
      const ok = probeWebGLRenderer();
      if (cancelled) return;

      if (!ok) {
        onFailed();
        setRendererReady(false);
        return;
      }

      setRendererReady(true);
    }, 150);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [mountKey, onFailed]);

  if (rendererReady === null) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#080808]">
        <p className="text-xs tracking-[0.22em] text-white/40 uppercase">
          Preparing 3D viewer…
        </p>
      </div>
    );
  }

  if (rendererReady === false) {
    return null;
  }

  return (
    <WebGLErrorBoundary key={mountKey} fallback={<CanvasFailed onFailed={onFailed} />}>
      <DeferredWebGLMount
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-[#080808]">
            <p className="text-xs tracking-[0.22em] text-white/40 uppercase">
              Preparing 3D viewer…
            </p>
          </div>
        }
      >
        <Canvas
          className="!absolute inset-0 h-full w-full"
          camera={{
            position: [
              5.5 * cameraPullBack,
              2.8 * cameraPullBack,
              7.5 * cameraPullBack,
            ],
            fov: cameraPullBack > 1 ? 44 : 38,
            near: 0.1,
            far: 1000,
          }}
          frameloop={isVisible ? "always" : "never"}
          shadows
          gl={CANVAS_GL_OPTIONS}
          dpr={isVisible ? [1, 1.25] : 1}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.48;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <SunsetSky />
          <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />
          <SunsetSunLighting />
          <ambientLight intensity={0.44} color="#907068" />
          <Suspense fallback={null}>
            <SceneEnvironment />
          </Suspense>
          <Suspense fallback={<CanvasLoader />}>
            <Scene
              activeStep={activeStep}
              onStepChange={onStepChange}
              isVisible={isVisible}
              cameraPullBack={cameraPullBack}
            />
          </Suspense>
        </Canvas>
      </DeferredWebGLMount>
    </WebGLErrorBoundary>
  );
}
