"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  SKY_HORIZON_ORANGE,
  SKY_ZENITH_PURPLE,
  SUN_DIRECTION,
} from "./sunsetConstants";

const skyVertexShader = /* glsl */ `
  varying vec3 vWorldDir;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldDir = normalize(world.xyz - cameraPosition);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const skyFragmentShader = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uHorizonOrange;
  uniform vec3 uZenithPurple;

  varying vec3 vWorldDir;

  void main() {
    vec3 dir = normalize(vWorldDir);
    float y = dir.y;

    vec3 darkBase = vec3(0.035, 0.022, 0.03);
    vec3 sky = mix(darkBase, uZenithPurple * 0.18, smoothstep(-0.1, 0.85, y));

    float sunDot = max(dot(dir, uSunDir), 0.0);
    float villaBeam = pow(sunDot, 9.0);
    sky += uHorizonOrange * villaBeam * 0.28;
    sky += uHorizonOrange * pow(sunDot, 32.0) * 0.12;

    float disc = pow(sunDot, 640.0) * 2.2;
    vec3 sunCol = mix(vec3(1.0, 0.68, 0.32), vec3(1.0, 0.9, 0.75), disc);
    sky += sunCol * disc;

    gl_FragColor = vec4(sky, 1.0);
  }
`;

export function SunsetSky() {
  const uniforms = useMemo(
    () => ({
      uSunDir: { value: SUN_DIRECTION.clone() },
      uHorizonOrange: { value: SKY_HORIZON_ORANGE.clone() },
      uZenithPurple: { value: SKY_ZENITH_PURPLE.clone() },
    }),
    [],
  );

  return (
    <mesh frustumCulled={false} renderOrder={-100}>
      <sphereGeometry args={[120, 64, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={skyVertexShader}
        fragmentShader={skyFragmentShader}
      />
    </mesh>
  );
}
