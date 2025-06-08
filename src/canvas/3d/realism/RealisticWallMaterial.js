import * as THREE from 'three';

export function createRealisticWallMaterial() {
  const loader = new THREE.TextureLoader();

  return new THREE.MeshStandardMaterial({
    map: loader.load('/textures/wall/albedo.jpg'),
    normalMap: loader.load('/textures/wall/normal.jpg'),
    roughnessMap: loader.load('/textures/wall/roughness.jpg'),
    metalness: 0.05,
    roughness: 0.8,
  });
}
