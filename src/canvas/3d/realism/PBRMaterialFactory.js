import * as THREE from 'three';

export function createPBRMaterial({ albedo, normal, roughness, metalness }) {
  const textureLoader = new THREE.TextureLoader();

  return new THREE.MeshStandardMaterial({
    map: textureLoader.load(albedo),
    normalMap: textureLoader.load(normal),
    roughnessMap: textureLoader.load(roughness),
    metalnessMap: metalness ? textureLoader.load(metalness) : null,
    metalness: 0.1,
    roughness: 0.8,
  });
}
