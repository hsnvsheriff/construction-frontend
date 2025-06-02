// src/canvas/3d/addDynamicGround.js
import * as THREE from 'three';

export function addDynamicGround(scene) {
  const existing = scene.getObjectByName('DynamicGround');
  if (existing) scene.remove(existing);

  const groundSize = 200; // meters wide and long
  const groundDepth = 2; // meters height (Y-axis depth)

  // 💡 BoxGeometry with depth
  const geometry = new THREE.BoxGeometry(groundSize, groundDepth, groundSize);

  const material = new THREE.MeshStandardMaterial({
    color: 0x111111, // deep black
    roughness: 1,
    metalness: 0.1,
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.name = 'DynamicGround';

  // 🧱 Position it so the top surface aligns with Y=0
  ground.position.set(0, -groundDepth / 2, 0);

  ground.receiveShadow = true;
  ground.castShadow = false;

  scene.add(ground);
}
  