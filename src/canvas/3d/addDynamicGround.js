import * as THREE from 'three';

export function addDynamicGround(scene) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  if (!isFinite(size.x) || !isFinite(size.z)) {
    console.warn('[Ground] Scene is empty — using default size');
    size.set(10, 0, 10);
    center.set(0, 0, 0);
  }

  const maxDimension = Math.max(size.x, size.z);
  const landSize = maxDimension * 1.5;

  const geometry = new THREE.PlaneGeometry(landSize, landSize);
  const material = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 1,
    metalness: 0
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;

  // ✅ Shift it slightly below floor to avoid Z-fighting
ground.position.set(center.x, -0.01, center.z); // 🩹 Just 1 cm below

  ground.receiveShadow = true;
  scene.add(ground);
}
