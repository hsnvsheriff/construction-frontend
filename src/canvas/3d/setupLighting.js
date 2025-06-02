import * as THREE from 'three';

export function setupLighting(scene, renderer) {
  // Enable high-quality shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft, realistic

  // 🔆 Ambient Light for base brightness
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25); // Lowered for contrast
  scene.add(ambientLight);

  // 🌞 Strong Directional Light (Sunlight)
  const sun = new THREE.DirectionalLight(0xfff8e7, 1.5); // Slightly warm tone
  sun.position.set(20, 50, 20);
  sun.castShadow = true;

  sun.shadow.mapSize.width = 4096;
  sun.shadow.mapSize.height = 4096;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 100;
  sun.shadow.camera.left = -40;
  sun.shadow.camera.right = 40;
  sun.shadow.camera.top = 40;
  sun.shadow.camera.bottom = -40;

  sun.shadow.bias = -0.0005; // reduce shadow acne
  sun.shadow.radius = 4;     // softer edges

  scene.add(sun);

  // 🔦 Rim Light (backlight for objects)
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
  rimLight.position.set(-20, 30, -20);
  scene.add(rimLight);

  // 💡 Skylight — very soft color bounce
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x666666, 0.3);
  hemiLight.position.set(0, 60, 0);
  scene.add(hemiLight);

  // 💡 Fill Light (bottom bounce)
  const fillLight = new THREE.PointLight(0xffffff, 0.2, 100);
  fillLight.position.set(0, -10, 0);
  scene.add(fillLight);
}
