import * as THREE from 'three';

export function createRealisticFloorMaterial() {
  const loader = new THREE.TextureLoader();

  return new THREE.MeshStandardMaterial({
    map: loader.load('/textures/floor/albedo.jpg'),
    normalMap: loader.load('/textures/floor/normal.jpg'),
    roughnessMap: loader.load('/textures/floor/roughness.jpg'),
    metalness: 0,
    roughness: 0.9,
  });
}
