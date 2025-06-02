import * as THREE from 'three';

export function createMathGrid(width = 100, height = 100) {
  const group = new THREE.Group();

  const thinMaterial = new THREE.LineBasicMaterial({
    color: 0x444444,
    transparent: true,
    opacity: 0.3,
  });

  const thickMaterial = new THREE.LineBasicMaterial({
    color: 0x888888,
  });

  for (let i = 0; i <= width; i++) {
    const isMajor = i % 10 === 0;
    const material = isMajor ? thickMaterial : thinMaterial;

    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(i, 0, 0),
      new THREE.Vector3(i, 0, height),
    ]);

    const line = new THREE.Line(geometry, material);
    group.add(line);
  }

  for (let j = 0; j <= height; j++) {
    const isMajor = j % 10 === 0;
    const material = isMajor ? thickMaterial : thinMaterial;

    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, j),
      new THREE.Vector3(width, 0, j),
    ]);

    const line = new THREE.Line(geometry, material);
    group.add(line);
  }

  return group;
}
