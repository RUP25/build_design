import * as THREE from "three";

/** Pool center in normalized model space (front / +Z deck). */
export const POOL_CENTER = new THREE.Vector3(0.42, 0.11, 0.92);

/** Villa mass center — used for facade illumination. */
export const BUILDING_CENTER = new THREE.Vector3(0.18, 0.52, 0.28);

/** Light aim between pool deck and building volume. */
export const SCENE_LIGHT_TARGET = POOL_CENTER.clone()
  .lerp(BUILDING_CENTER, 0.58)
  .clone();

/** Golden hour — low sun behind the villa, aimed at pool + facade. */
export const SUN_POSITION = new THREE.Vector3(-26, 2.1, -6);
export const SUN_TARGET = SCENE_LIGHT_TARGET.clone();
export const POOL_LIGHT_TARGET = POOL_CENTER.clone();

/** Material warm tint covers the full villa footprint. */
export const VILLA_CENTER = BUILDING_CENTER.clone();
export const VILLA_BEAM_RADIUS = 5.8;

export const RAY_ORIGIN = SUN_POSITION.clone().lerp(SUN_TARGET, 0.32);

/** Direction from scene focus toward the sun (sky + specular). */
export const SUN_DIRECTION = SUN_POSITION.clone()
  .sub(SCENE_LIGHT_TARGET)
  .normalize();

/** Incoming sunlight (sun → scene). */
export const SUN_LIGHT_DIR = SCENE_LIGHT_TARGET.clone()
  .sub(SUN_POSITION)
  .normalize();

/** ~2800 K sunset key light. */
export const SUN_KEY_COLOR = new THREE.Color("#ffb070");
/** ~2200 K horizon bounce. */
export const SUN_FILL_COLOR = new THREE.Color("#ff7848");
export const SUN_TINT = new THREE.Color("#ff8840");

/** Sky gradient palette. */
export const SKY_HORIZON_CRIMSON = new THREE.Color("#8c1a12");
export const SKY_HORIZON_ORANGE = new THREE.Color("#d44a18");
export const SKY_MID_AMBER = new THREE.Color("#c87840");
export const SKY_ZENITH_PURPLE = new THREE.Color("#4a3058");

/** Camera-facing warm fill — keeps shadow-side facades readable. */
export const FACADE_FILL_POSITION = new THREE.Vector3(6.5, 5.2, 11);
export const FACADE_FILL_INTENSITY = 2.05;

/** Fog / atmospheric haze — dark surround, villa reads in contrast. */
export const FOG_COLOR = "#100c0c";
export const FOG_NEAR = 10;
export const FOG_FAR = 34;
