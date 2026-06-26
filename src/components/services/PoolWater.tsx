import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  SUN_DIRECTION,
  SUN_LIGHT_DIR,
  SUN_POSITION,
  SUN_TINT,
} from "./sunsetConstants";

export type PoolSurface = {
  center: THREE.Vector3;
  width: number;
  depth: number;
};

const poolSurfaceCache = new WeakMap<THREE.Object3D, PoolSurface>();

/** Pool bounds on the model (0–1 fractions of bbox). */
const POOL_X_MIN = 0.027;
const POOL_X_MAX = 1.1;
const POOL_Z_MIN = 0.45;
const POOL_Z_MAX = 1.1;
const POOL_Y_FRAC = 0.16;
const POOL_Y_LIFT = 0.008;

/** Shave the ripple plane inward from each pool edge (0–1, fraction of pool span). */
const POOL_TRIM = {
  left: 0.08,
  right: 0.12,
  front: 0.4,
  back: 0.1,
} as const;

/** Overall scale shrink after trim (0.9 = 10% smaller). */
const POOL_INSET = 0.85;

const waterVertexShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  varying vec2 vUv;
  varying vec2 vWorldXZ;
  varying float vElevation;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  float waveLayer(vec2 p, vec2 dir, float freq, float amp, float speed, float phase) {
    float d = dot(normalize(dir), p);
    return amp * sin(d * freq + uTime * speed + phase);
  }

  float waveElevation(vec2 p) {
    float h = 0.0;
    h += waveLayer(p, vec2(1.0, 0.12), 5.9, 0.014, 0.82, 0.0);
    h += waveLayer(p, vec2(-0.2, 1.0), 7.9, 0.011, 1.0, 1.4);
    h += waveLayer(p, vec2(0.65, 0.72), 12.0, 0.0072, 1.18, 2.8);
    h += waveLayer(p, vec2(-0.55, 0.88), 17.8, 0.0048, 1.42, 4.6);
    h += waveLayer(p, vec2(0.4, -0.92), 25.5, 0.0027, 1.75, 2.0);
    return h;
  }

  vec3 waveNormal(vec2 p) {
    float eps = 0.015;
    float h = waveElevation(p);
    float hx = waveElevation(p + vec2(eps, 0.0));
    float hz = waveElevation(p + vec2(0.0, eps));
    return normalize(vec3(h - hx, eps * 1.25, h - hz));
  }

  void main() {
    vUv = uv;

    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldXZ = world.xz;
    vElevation = waveElevation(world.xz);
    world.y += vElevation;
    vWorldPosition = world.xyz;
    vNormal = waveNormal(world.xz);

    gl_Position = projectionMatrix * viewMatrix * vec4(world.xyz, 1.0);
  }
`;

const waterFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uPoolSize;
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uSunColor;
  uniform vec3 uSunRayCore;
  uniform vec3 uSunRayWarm;
  uniform vec3 uSunRayGold;
  uniform vec3 uSkyHorizon;
  uniform vec3 uSkyZenith;
  uniform vec3 uSunDir;
  uniform vec3 uLightDir;
  uniform vec3 uSunPos;
  uniform vec3 uPoolCenter;
  uniform samplerCube tEnvMap;
  uniform float uHasEnvMap;
  varying vec2 vUv;
  varying vec2 vWorldXZ;
  varying float vElevation;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float rippleNoise(vec2 p, float t) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y) * 2.0 - 1.0;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += rippleNoise(p, 0.0) * 0.55;
    v += rippleNoise(p * 3.0 + 1.7, 0.0) * 0.28;
    v += rippleNoise(p * 6.2 - 2.4, 0.0) * 0.17;
    return v;
  }

  vec3 buildNormal(vec3 base, vec2 p) {
    float t = uTime;
    float n1 = sin(p.x * 22.5 + t * 1.05) * sin(p.y * 18.0 - t * 0.92);
    float n2 = sin(p.x * 13.0 - t * 0.68) * sin(p.y * 16.0 + t * 0.81);
    float n3 = fbm(p * 0.52 + vec2(t * 0.08, -t * 0.06));
    vec3 bump = vec3(
      (n1 + n3) * 0.057 + n2 * 0.027,
      0.0,
      (n2 - n3) * 0.051 + n1 * 0.023
    );
    return normalize(base + bump);
  }

  float schlickFresnel(float cosTheta, float f0) {
    return f0 + (1.0 - f0) * pow(1.0 - cosTheta, 5.0);
  }

  float ggxSpec(vec3 n, vec3 h, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float nh = max(dot(n, h), 0.0);
    float d = nh * nh * (a2 - 1.0) + 1.0;
    return a2 / (3.14159 * d * d + 0.0001);
  }

  float beamLengthFalloff(float along) {
    return smoothstep(-2.0, 4.0, along) * (1.0 - smoothstep(30.0, 42.0, along));
  }

  float sunBeamMask(vec3 worldPos) {
    vec3 rel = worldPos - uSunPos;
    float along = dot(rel, uLightDir);
    vec3 axisPoint = uSunPos + uLightDir * along;
    vec2 axisDist = worldPos.xz - axisPoint.xz;
    float radial = length(axisDist);

    float inBeam = exp(-radial * radial * 0.055);
    inBeam *= beamLengthFalloff(along);

    vec2 lightXZ = normalize(uLightDir.xz + vec2(0.0001));
    float lightAngle = atan(lightXZ.y, lightXZ.x);
    float angle = atan(axisDist.y, axisDist.x);
    float angOff = atan(sin(angle - lightAngle), cos(angle - lightAngle));

    float rayBreak = pow(max(0.0, cos(angOff * 4.5)), 2.6);
    rayBreak += pow(max(0.0, cos(angOff * 6.5 + 0.55)), 3.6) * 0.74;
    rayBreak += pow(max(0.0, cos(angOff * 9.0 - 0.35)), 4.6) * 0.54;
    rayBreak += pow(max(0.0, cos(angOff * 12.0 + 1.15)), 5.6) * 0.4;
    rayBreak += pow(max(0.0, cos(angOff * 15.0 - 0.85)), 6.6) * 0.3;
    rayBreak += pow(max(0.0, cos(angOff * 18.0 + 0.25)), 7.6) * 0.22;
    rayBreak = clamp(rayBreak, 0.0, 1.85);

    float shimmer = 0.76 + 0.24 * sin(along * 2.6 - uTime * 0.58 + angOff * 9.0);
    return inBeam * mix(0.32, 1.0, rayBreak) * shimmer;
  }

  float sunRayStreaks(vec3 worldPos) {
    vec3 rel = worldPos - uSunPos;
    float along = dot(rel, uLightDir);
    vec3 axisPoint = uSunPos + uLightDir * along;
    vec2 axisDist = worldPos.xz - axisPoint.xz;
    float radial = length(axisDist);

    vec2 lightXZ = normalize(uLightDir.xz + vec2(0.0001));
    float lightAngle = atan(lightXZ.y, lightXZ.x);
    float angle = atan(axisDist.y, axisDist.x);
    float angOff = angle - lightAngle;

    float rays = 0.0;
    rays += pow(max(0.0, cos(angOff * 5.0 + uTime * 0.045)), 4.0);
    rays += pow(max(0.0, cos(angOff * 8.0 - 0.75 + uTime * 0.032)), 5.2) * 0.68;
    rays += pow(max(0.0, cos(angOff * 11.5 + 1.35)), 6.4) * 0.46;
    rays += pow(max(0.0, cos(angOff * 15.0 - uTime * 0.04)), 7.8) * 0.3;
    rays += pow(max(0.0, cos(angOff * 19.0 + 0.55)), 9.2) * 0.2;

    float radialFalloff = exp(-radial * radial * 0.28);
    float lengthFalloff = beamLengthFalloff(along);
    float dapple =
      0.68 +
      0.32 * sin(radial * 17.0 - uTime * 0.48 + angOff * 7.0) *
        cos(along * 1.8 + uTime * 0.36);

    return rays * radialFalloff * lengthFalloff * dapple;
  }

  vec3 sunDiscReflection(vec3 normal, vec3 viewDir, vec3 worldPos) {
    vec3 toSun = normalize(uSunPos - worldPos);
    vec3 refl = reflect(-viewDir, normal);
    vec3 flatRefl = reflect(-viewDir, vec3(0.0, 1.0, 0.0));
    vec3 blendRefl = normalize(mix(flatRefl, refl, 0.58));

    float rippleWobble = 0.94 + 0.06 * fbm(worldPos.xz * 0.38 + uTime * 0.045);
    float angle = acos(clamp(dot(blendRefl, toSun), 0.0, 1.0)) * rippleWobble;

    // Whole sun disc (~6°) plus soft corona (~14°)
    float discR = 0.105;
    float coronaR = 0.26;

    float core = 1.0 - smoothstep(0.0, discR * 0.32, angle);
    float disc = 1.0 - smoothstep(discR * 0.55, discR, angle);
    float corona = (1.0 - smoothstep(discR * 0.9, coronaR, angle)) * 0.55;

    vec3 coreColor = vec3(1.0, 0.98, 0.86);
    vec3 discColor = mix(vec3(1.0, 0.82, 0.42), vec3(1.0, 0.58, 0.16), 0.38);
    vec3 haloColor = mix(uSunRayWarm, uSunRayGold, 0.45);

    return coreColor * core * 1.65 + discColor * disc * 1.15 + haloColor * corona;
  }

  float sunGlitterPath(vec3 worldPos, vec3 normal, vec3 viewDir) {
    vec2 toSunXZ = uSunPos.xz - worldPos.xz;
    float sunDist = length(toSunXZ);
    if (sunDist < 0.001) return 0.0;

    vec2 sunDirXZ = toSunXZ / sunDist;
    vec2 rel = worldPos.xz - uSunPos.xz;
    float along = dot(rel, sunDirXZ);
    vec2 axisPoint = uSunPos.xz + sunDirXZ * along;
    float perp = length(worldPos.xz - axisPoint);

    float path = exp(-perp * perp * 5.5);
    path *= smoothstep(2.0, 18.0, along) * smoothstep(42.0, 8.0, along);

    vec3 toSun = normalize(uSunPos - worldPos);
    float facing = pow(max(dot(reflect(-viewDir, normal), toSun), 0.0), 18.0);
    float shimmer = 0.72 + 0.28 * sin(along * 0.85 - uTime * 0.62 + perp * 9.0);

    return path * facing * shimmer;
  }

  float poolSurfaceGodRays(vec2 worldXZ) {
    vec2 sunToPool = uPoolCenter.xz - uSunPos.xz;
    float sunDist = length(sunToPool);
    if (sunDist < 0.001) return 0.0;

    vec2 sunDir = sunToPool / sunDist;
    vec2 rel = worldXZ - uSunPos.xz;
    float along = dot(rel, sunDir);
    vec2 perpVec = rel - sunDir * along;
    float perp = length(perpVec);

    float towardPool = smoothstep(-3.0, 5.0, along) * (1.0 - smoothstep(34.0, 46.0, along));
    float spread = exp(-perp * perp * 0.14);

    float ang = atan(perpVec.y, perpVec.x);
    float sunAng = atan(sunDir.y, sunDir.x);
    float angOff = atan(sin(ang - sunAng), cos(ang - sunAng));

    float rays = 0.0;
    rays += pow(max(0.0, cos(angOff * 4.2 + uTime * 0.05)), 3.6);
    rays += pow(max(0.0, cos(angOff * 6.8 - 0.45 + uTime * 0.038)), 4.8) * 0.62;
    rays += pow(max(0.0, cos(angOff * 10.5 + 0.9)), 6.2) * 0.42;
    rays += pow(max(0.0, cos(angOff * 14.0 - uTime * 0.03)), 7.4) * 0.28;
    rays += pow(max(0.0, cos(angOff * 18.5 + 0.35)), 8.8) * 0.18;

    float poolProx = exp(-length(worldXZ - uPoolCenter.xz) / max(length(uPoolSize) * 0.55, 0.001));
    float shimmer = 0.82 + 0.18 * sin(along * 0.42 - uTime * 0.55 + angOff * 8.0);

    return rays * spread * towardPool * shimmer * clamp(poolProx * 0.52 + 0.08, 0.08, 0.52);
  }

  float poolSunIncidence() {
    return clamp(length(uLightDir.xz) * 1.22, 0.48, 1.0);
  }

  float elevatedPoolRays(vec3 worldPos, vec3 viewDir, float sunBeam, float rayStreaks) {
    float topView = smoothstep(0.08, 0.42, clamp(viewDir.y, 0.0, 1.0));
    float incidence = poolSunIncidence();

    vec2 lightXZ = normalize(uLightDir.xz + vec2(0.0001));
    vec2 viewXZ = normalize(viewDir.xz + vec2(0.0001));
    float streakView = pow(max(abs(dot(lightXZ, viewXZ)), 0.18), 0.55);

    float rays = sunBeam * 0.5 + rayStreaks * 0.65;
    rays *= incidence;
    rays *= mix(0.34, 0.75, topView);
    rays *= 0.62 + streakView * 0.34;

    float shimmer = 0.78 + 0.22 * sin(dot(worldPos.xz, lightXZ) * 2.4 - uTime * 0.52);
    return rays * shimmer;
  }

  void main() {
    float edgeMask = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x)
                   * smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);

    vec3 normal = buildNormal(normalize(vNormal), vWorldXZ);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 toSun = normalize(uSunPos - vWorldPosition);
    float ndv = max(dot(normal, viewDir), 0.0);
    float fresnel = schlickFresnel(ndv, 0.018);

    vec2 centered = (vUv - 0.5) * uPoolSize;
    float poolDepth = clamp(length(centered / max(uPoolSize * 0.48, vec2(0.001))), 0.0, 1.0);
    poolDepth = pow(poolDepth, 1.15);

    float caustic1 = sin(vWorldXZ.x * 32.0 + uTime * 0.95) * sin(vWorldXZ.y * 26.0 - uTime * 0.82);
    float caustic2 = sin(vWorldXZ.x * 18.0 - uTime * 0.62) * sin(vWorldXZ.y * 21.0 + uTime * 1.05);
    float caustic3 = sin((vWorldXZ.x + vWorldXZ.y) * 14.0 + uTime * 0.75);
    float caustics = pow(
      max(caustic1, 0.0) * 0.45 + max(caustic2, 0.0) * 0.35 + max(caustic3, 0.0) * 0.25,
      1.45
    );

    float sunBeam = sunBeamMask(vWorldPosition);
    float rayStreaks = sunRayStreaks(vWorldPosition);
    float poolRays = poolSurfaceGodRays(vWorldXZ);
    float sunRay = clamp(sunBeam * 0.38 + rayStreaks * 0.46 + poolRays * 0.28, 0.0, 0.88);

    float viewReflectGate = pow(max(dot(reflect(-viewDir, normal), toSun), 0.0), 2.4);
    float flatReflectGate = pow(max(dot(reflect(-viewDir, vec3(0.0, 1.0, 0.0)), toSun), 0.0), 2.0);
    float sunReflectGate = max(viewReflectGate, flatReflectGate * 0.82);
    float topView = smoothstep(0.08, 0.42, clamp(viewDir.y, 0.0, 1.0));
    float viewElevGate = 1.0 - smoothstep(0.62, 0.92, clamp(viewDir.y, 0.0, 1.0));
    float rayViewMask = mix(0.42, 1.0, sunReflectGate) * mix(0.55, 1.0, viewElevGate);
    float poolRayMask = max(rayViewMask, mix(0.62, 0.96, topView));

    float sunFacing = pow(max(dot(normal, toSun), 0.0), 1.15);
    float effectiveFacing = max(sunFacing, poolSunIncidence());
    float elevatedRays = max(
      elevatedPoolRays(vWorldPosition, viewDir, sunBeam, rayStreaks),
      poolRays * 0.26
    );
    float sunLit = clamp(
      max(sunRay * (0.32 + effectiveFacing * 0.38), elevatedRays * 0.4),
      0.0,
      0.48
    );

    float shallowMix = clamp(
      (1.0 - poolDepth) * 0.62 + pow(ndv, 0.68) * 0.26 + vElevation * 12.0 + sunLit * 0.18,
      0.0,
      1.0
    );
    vec3 body = mix(uDeepColor, uShallowColor, shallowMix);

    vec3 absorb = exp(-vec3(0.92, 0.28, 0.07) * (poolDepth * 1.28 + 0.06));
    absorb = mix(absorb, vec3(0.42, 0.62, 0.88), sunLit * 0.24);
    body *= absorb;

    vec3 blueCaustics = vec3(0.02, 0.08, 0.14) * caustics;
    vec3 orangeCaustics = mix(uSunRayCore, uSunRayGold, caustics) * caustics;
    body += mix(blueCaustics, orangeCaustics, sunLit) * (0.2 + sunRay * 0.28);

    vec3 sunsetBody = mix(uSunRayCore * 0.36, uSunRayWarm, shallowMix);
    sunsetBody = mix(sunsetBody, uSunRayGold, sunRay * 0.2);
    body = mix(body, sunsetBody, sunLit * 0.3);
    body += mix(uSunRayCore, uSunRayGold, 0.5) * poolRays * 0.18;
    body += mix(uSunRayWarm, uSunRayGold, 0.35) * elevatedRays * 0.12;

    vec3 water = body;

    vec3 nRef = normalize(normal + vec3(fbm(vWorldXZ * 0.27 + uTime * 0.04) * 0.055, 0.0, 0.0));
    vec3 reflectDir = reflect(-viewDir, nRef);

    if (uHasEnvMap > 0.5) {
      vec3 envSharp = textureCube(tEnvMap, reflectDir).rgb;
      vec3 envSoft = textureCube(tEnvMap, reflect(-viewDir, normal)).rgb;
      vec3 env = mix(envSoft, envSharp, 0.52);
      vec3 sunsetSky = mix(uSkyHorizon, uSkyZenith, pow(1.0 - ndv, 1.05));
      env = mix(env, sunsetSky, 0.48 + sunLit * 0.38);
      vec3 envSun = mix(uSunRayGold, vec3(1.0, 0.92, 0.68), 0.55);
      float envSunAlign = max(dot(reflectDir, toSun), 0.0);
      float envSunAngle = acos(clamp(envSunAlign, 0.0, 1.0));
      float envSunDisc = (1.0 - smoothstep(0.06, 0.14, envSunAngle)) * 0.95;
      float envSunCore = (1.0 - smoothstep(0.0, 0.045, envSunAngle)) * 1.1;
      env = mix(env, envSun, envSunDisc);
      env += vec3(1.0, 0.9, 0.7) * envSunCore;
      water = mix(water, env, fresnel * 0.82);
    } else {
      vec3 sky = mix(uSkyHorizon, uSkyZenith, pow(1.0 - ndv, 1.35));
      float skySunAlign = max(dot(reflectDir, toSun), 0.0);
      float skySunAngle = acos(clamp(skySunAlign, 0.0, 1.0));
      float skySunDisc = (1.0 - smoothstep(0.06, 0.15, skySunAngle)) * 0.9;
      sky = mix(sky, mix(uSunRayGold, vec3(1.0, 0.94, 0.76), 0.55), skySunDisc);
      water = mix(water, sky, fresnel * 0.65);
    }

    vec3 sunDisc = sunDiscReflection(normal, viewDir, vWorldPosition);
    float glitterPath = sunGlitterPath(vWorldPosition, normal, viewDir);

    vec3 halfDir = normalize(toSun + viewDir);
    float specGGX = ggxSpec(normal, halfDir, 0.06);
    float sunSpec = pow(max(dot(normal, halfDir), 0.0), 28.0) * 0.28;
    float sunPath = pow(max(dot(reflect(-viewDir, normal), toSun), 0.0), 22.0);
    vec3 sunSpecColor = mix(uSunRayCore, uSunRayGold, 0.55);
    water += sunSpecColor * (specGGX * 0.35 + sunSpec + sunPath * 0.4) * (0.4 + sunLit * 0.45);
    water += sunDisc * (3.2 + fresnel * 2.4) * mix(0.72, 1.0, sunReflectGate);
    water += mix(uSunRayWarm, uSunRayGold, 0.4) * glitterPath * rayViewMask * 0.12;

    vec3 sunWash = mix(uSunRayCore * 0.55, uSunRayWarm, 0.45) * sunLit;
    sunWash *= 0.1 + pow(1.0 - poolDepth, 1.35) * 0.16;
    water += sunWash;

    float subsurfaceRay = max(sunRay, max(elevatedRays, poolRays * 0.3)) * (1.0 - fresnel) * pow(1.0 - poolDepth, 1.1);
    water += mix(uSunRayCore * 0.55, uSunRayGold, shallowMix) * subsurfaceRay * 0.22;

    float surfaceRay = max(max(rayStreaks * effectiveFacing, elevatedRays * 0.34), poolRays * 0.34) * pow(1.0 - fresnel, 1.15);
    water += uSunRayCore * surfaceRay * 0.2;
    water += uSunRayGold * pow(surfaceRay, 1.92) * 0.14;
    water += uSunRayWarm * poolRays * 0.14;

    vec3 refractTint = mix(uShallowColor, uDeepColor, poolDepth * 0.55);
    refractTint = mix(refractTint, mix(refractTint, mix(uSunRayWarm, uSunRayGold, 0.5), 0.65), sunLit * 0.36);
    water = mix(water, refractTint, (1.0 - fresnel) * 0.2);

    float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float meniscus = (1.0 - smoothstep(0.0, 0.025, edgeDist)) * 0.22;
    water = mix(water, uDeepColor * 0.75, meniscus);

    float foam = (1.0 - smoothstep(0.0, 0.03, edgeDist)) * 0.09;
    foam *= 0.55 + 0.45 * sin(uTime * 1.8 + vWorldXZ.x * 6.5 + vWorldXZ.y * 5.0);
    water = mix(water, vec3(0.9, 0.95, 0.98), foam);

    float sparkle = pow(max(dot(reflect(-viewDir, normal), toSun), 0.0), 72.0);
    sparkle *= 0.55 + 0.45 * hash21(floor(vWorldXZ * 48.0 + uTime * 0.45));
    water += mix(uSunRayGold, uSunColor, 0.35) * sparkle * (0.24 + sunLit * 0.18);

    float alpha = mix(0.8, 0.96, fresnel) * edgeMask;
    gl_FragColor = vec4(water, alpha);
  }
`;

function getModelBounds(model: THREE.Object3D) {
  const box = new THREE.Box3();
  model.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      box.expandByObject(child);
    }
  });
  return box;
}

function getPoolSurfaceFromMeasure(model: THREE.Object3D): PoolSurface {
  const box = getModelBounds(model);
  const min = box.min;
  const size = box.getSize(new THREE.Vector3());

  const xSpan = POOL_X_MAX - POOL_X_MIN;
  const zSpan = POOL_Z_MAX - POOL_Z_MIN;

  const xMin = POOL_X_MIN + xSpan * POOL_TRIM.left;
  const xMax = POOL_X_MAX - xSpan * POOL_TRIM.right;
  const zMin = POOL_Z_MIN + zSpan * POOL_TRIM.front;
  const zMax = POOL_Z_MAX - zSpan * POOL_TRIM.back;

  return {
    center: new THREE.Vector3(
      min.x + size.x * ((xMin + xMax) * 0.5),
      min.y + size.y * (POOL_Y_FRAC + POOL_Y_LIFT),
      min.z + size.z * ((zMin + zMax) * 0.5),
    ),
    width: (xMax - xMin) * size.x * POOL_INSET,
    depth: (zMax - zMin) * size.z * POOL_INSET,
  };
}

export function getPoolSurface(model: THREE.Object3D): PoolSurface {
  const cached = poolSurfaceCache.get(model);
  if (cached) return cached;

  model.updateMatrixWorld(true);
  const surface = getPoolSurfaceFromMeasure(model);
  poolSurfaceCache.set(model, surface);
  return surface;
}

type PoolWaterProps = {
  surface: PoolSurface;
};

export function PoolWater({ surface }: PoolWaterProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPoolSize: { value: new THREE.Vector2(surface.width, surface.depth) },
      uDeepColor: { value: new THREE.Color("#042f48") },
      uShallowColor: { value: new THREE.Color("#1a8fc4") },
      uSunColor: { value: SUN_TINT.clone() },
      uSunRayCore: { value: new THREE.Color("#e83808") },
      uSunRayWarm: { value: new THREE.Color("#ff6a18") },
      uSunRayGold: { value: new THREE.Color("#ffb040") },
      uSkyHorizon: { value: new THREE.Color("#0a0608") },
      uSkyZenith: { value: new THREE.Color("#060408") },
      uSunDir: { value: SUN_DIRECTION.clone() },
      uLightDir: { value: SUN_LIGHT_DIR.clone() },
      uSunPos: { value: SUN_POSITION.clone() },
      uPoolCenter: { value: surface.center.clone() },
      tEnvMap: { value: new THREE.CubeTexture() },
      uHasEnvMap: { value: 0 },
    }),
    [surface.center, surface.depth, surface.width],
  );

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    meshRef.current?.getWorldPosition(mat.uniforms.uPoolCenter.value);

    if (scene.environment) {
      mat.uniforms.tEnvMap.value = scene.environment;
      mat.uniforms.uHasEnvMap.value = 1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={surface.center}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={20}
      frustumCulled={false}
    >
      <planeGeometry args={[surface.width, surface.depth, 96, 68]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={waterVertexShader}
        fragmentShader={waterFragmentShader}
        transparent
        depthTest
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped
        polygonOffset
        polygonOffsetFactor={-8}
        polygonOffsetUnits={-8}
      />
    </mesh>
  );
}
