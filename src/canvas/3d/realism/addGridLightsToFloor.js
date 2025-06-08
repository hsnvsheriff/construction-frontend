import * as THREE from 'three';

export function addGridLightsToFloor(floorPoints, scene, height = 2.5, spacing = 2) {
  if (!Array.isArray(floorPoints) || floorPoints.length < 3) return;

  const shape = new THREE.Shape();
  floorPoints.forEach((pt, idx) =>
    idx === 0 ? shape.moveTo(pt.x, pt.z) : shape.lineTo(pt.x, pt.z)
  );

  const shapePoints = shape.getPoints();
  const box2 = new THREE.Box2().setFromPoints(shapePoints);
  const min = box2.min;
  const max = box2.max;

  const lights = [];
  const maxLights = 50; // Reduce limit since they are stronger

  for (let x = min.x + spacing / 2; x < max.x; x += spacing) {
    for (let z = min.y + spacing / 2; z < max.y; z += spacing) {
      if (lights.length >= maxLights) return lights;

      const light = new THREE.PointLight(0xffffff, 2.5, 6); // stronger & farther
light.position.set(center.x, 1.5, center.z); // 👈 Inside the room!
      light.castShadow = false;
      light.shadow.mapSize.set(512, 512);
      scene.add(light);

      lights.push(light);

      // Optional helper
      scene.add(new THREE.PointLightHelper(light, 0.2));
    }
  }

  return lights;
}
