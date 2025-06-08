import * as THREE from 'three';

export function setupLighting(scene, renderer) {
  // ❌ Turn off global shadows
  renderer.shadowMap.enabled = false;

  // 🌤️ Ambient Light — soft global fill
  const ambient = new THREE.AmbientLight(0xffffff, 0.6); // brighter for realism
  scene.add(ambient);

  const spacing = 2.5;
  const gridCount = 5;

  // 🔆 Ceiling Lights Grid (for smooth even lighting)
  for (let x = -spacing * 2; x <= spacing * 2; x += spacing) {
    for (let z = -spacing * 2; z <= spacing * 2; z += spacing) {
      const light = new THREE.PointLight(0xffffff, 1.0, 20); // lower intensity, enough for fill
      light.position.set(x, 2.7, z); // just under ceiling
      light.castShadow = false;     // ✅ Disable shadows
      scene.add(light);
    }
  }

  // 💡 Gentle Front Fill — to brighten front view
  for (let i = 0; i < gridCount; i++) {
    const offsetZ = 2 + i * 1.5;
    const frontFill = new THREE.PointLight(0xffffff, 0.4, 10);
    frontFill.position.set(0, 1.5, offsetZ);
    frontFill.castShadow = false;
    scene.add(frontFill);
  }

  // 🌈 Rim Lights Behind — cinematic glow
  for (let i = 0; i < gridCount; i++) {
    const offsetX = -4 + i * 2;
    const rimLight = new THREE.SpotLight(0xffffff, 0.2, 10, Math.PI / 6, 0.4);
    rimLight.position.set(offsetX, 2.2, -4.5);
    rimLight.target.position.set(0, 1.2, 0);
    rimLight.castShadow = false; // ✅ Disable shadows
    scene.add(rimLight);
    scene.add(rimLight.target);
  }
}
