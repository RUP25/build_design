"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  FACADE_FILL_INTENSITY,
  FACADE_FILL_POSITION,
  SUN_KEY_COLOR,
  SUN_LIGHT_DIR,
  SUN_POSITION,
  SUN_TARGET,
  VILLA_BEAM_RADIUS,
  VILLA_CENTER,
} from "./sunsetConstants";

export {
  POOL_CENTER,
  POOL_LIGHT_TARGET,
  SKY_HORIZON_CRIMSON,
  SKY_HORIZON_ORANGE,
  SKY_MID_AMBER,
  SKY_ZENITH_PURPLE,
  SUN_DIRECTION,
  SUN_FILL_COLOR,
  SUN_KEY_COLOR,
  SUN_LIGHT_DIR,
  SUN_POSITION,
  SUN_TARGET,
  SUN_TINT,
  VILLA_BEAM_RADIUS,
  VILLA_CENTER,
} from "./sunsetConstants";

const SHAFT_ANGLES = [-0.38, -0.2, -0.08, 0.08, 0.2, 0.38] as const;

const shaftVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const shaftFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uSunPos;
  uniform vec3 uLightDir;
  uniform vec3 uVillaCenter;
  uniform float uVillaRadius;
  uniform float uRayLength;
  uniform float uRayWidth;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vec3 rel = vWorldPos - uSunPos;
    float along = dot(rel, uLightDir);
    float t = clamp(along / uRayLength, 0.0, 1.0);

    vec3 axisPoint = uSunPos + uLightDir * along;
    float axisDist = length(vWorldPos - axisPoint) / max(uRayWidth * 0.5, 0.001);
    float radial = exp(-axisDist * axisDist * 1.35);

    vec2 villaXZ = vWorldPos.xz - uVillaCenter.xz;
    float villaDist = length(villaXZ) / max(uVillaRadius, 0.001);
    float villaHeight = abs(vWorldPos.y - uVillaCenter.y) / max(uVillaRadius * 0.55, 0.001);
    float villaMask = exp(-(villaDist * villaDist * 1.6 + villaHeight * villaHeight * 0.9));

    float alongTarget = dot(uVillaCenter - uSunPos, uLightDir);
    float alongMask =
      smoothstep(alongTarget + 1.5, alongTarget - 0.5, along) *
      smoothstep(-1.0, 0.4, along);

    float beam = radial * smoothstep(0.0, 0.1, t) * exp(-t * 1.05);
    beam *= 0.72 + 0.28 * sin(t * 14.0 - uTime * 0.28 + uSeed * 2.1);
    beam *= villaMask * alongMask;

    vec3 warm = mix(vec3(1.0, 0.42, 0.12), vec3(1.0, 0.68, 0.38), t);
    float alpha = beam * 0.11;
    gl_FragColor = vec4(warm * beam, alpha);
  }
`;

function LightShaft({
  axisAngle,
  baseQuaternion,
}: {
  axisAngle: number;
  baseQuaternion: THREE.Quaternion;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const width = 8;
  const length = 30;

  const { quaternion, position } = useMemo(() => {
    const spread = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      axisAngle,
    );
    return {
      quaternion: baseQuaternion.clone().multiply(spread),
      position: SUN_LIGHT_DIR.clone().multiplyScalar(length * 0.5),
    };
  }, [axisAngle, baseQuaternion, length]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSeed: { value: axisAngle + 2.1 },
      uSunPos: { value: SUN_POSITION.clone() },
      uLightDir: { value: SUN_LIGHT_DIR.clone() },
      uVillaCenter: { value: VILLA_CENTER.clone() },
      uVillaRadius: { value: VILLA_BEAM_RADIUS },
      uRayLength: { value: length },
      uRayWidth: { value: width },
    }),
    [axisAngle, length, width],
  );

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={position} quaternion={quaternion} renderOrder={85} frustumCulled={false}>
      <planeGeometry args={[width, length, 1, 16]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={shaftVertexShader}
        fragmentShader={shaftFragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function SunsetSun() {
  const baseQuaternion = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.copy(SUN_POSITION);
    obj.lookAt(SUN_TARGET);
    obj.rotateX(-Math.PI / 2);
    return obj.quaternion.clone();
  }, []);

  return (
    <>
      <group position={SUN_POSITION.toArray()}>
        {SHAFT_ANGLES.map((angle, index) => (
          <LightShaft key={index} axisAngle={angle} baseQuaternion={baseQuaternion} />
        ))}
      </group>
    </>
  );
}

function configureShadowLight(light: THREE.DirectionalLight) {
  light.shadow.mapSize.set(2048, 2048);
  light.shadow.bias = -0.00015;
  light.shadow.normalBias = 0.025;
  light.shadow.radius = 3;

  const cam = light.shadow.camera;
  cam.left = -14;
  cam.right = 14;
  cam.top = 14;
  cam.bottom = -14;
  cam.near = 4;
  cam.far = 70;
  cam.updateProjectionMatrix();
}

export function SunsetSunLighting() {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const sunPos = SUN_POSITION.toArray();
  const villaTarget = VILLA_CENTER.toArray();

  useEffect(() => {
    if (keyRef.current) configureShadowLight(keyRef.current);
  }, []);

  return (
    <>
      <directionalLight
        ref={keyRef}
        castShadow
        position={sunPos}
        intensity={4.8}
        color={SUN_KEY_COLOR}
      >
        <object3D attach="target" position={villaTarget} />
      </directionalLight>
      <spotLight
        position={sunPos}
        angle={0.42}
        penumbra={0.9}
        intensity={3.5}
        color={SUN_KEY_COLOR}
        distance={60}
        decay={1.45}
        castShadow={false}
      >
        <object3D attach="target" position={villaTarget} />
      </spotLight>
      <directionalLight
        position={[7, 5.5, 9]}
        intensity={1.25}
        color="#ffe4cc"
      >
        <object3D attach="target" position={villaTarget} />
      </directionalLight>
      <directionalLight
        position={FACADE_FILL_POSITION.toArray()}
        intensity={FACADE_FILL_INTENSITY}
        color="#fff0e0"
      >
        <object3D attach="target" position={villaTarget} />
      </directionalLight>
      <pointLight
        position={[0.15, 0.75, 0.35]}
        intensity={1.15}
        color="#ffaa68"
        distance={11}
        decay={1.8}
      />
      <hemisphereLight args={["#c89888", "#3a2420", 0.62]} position={[0, 20, 0]} />
    </>
  );
}

export { applySunTintToMaterial } from "./SunsetMaterials";
