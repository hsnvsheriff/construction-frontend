import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function setupCameraSystem(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  return { scene, camera, renderer, controls };
}

export function cleanCameraSystem(container, renderer) {
  if (container && renderer && renderer.domElement) {
    container.removeChild(renderer.domElement);
  }
}

export function handleWindowResize(container, camera, renderer) {
  const onResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}

export function fitCameraToObjects(camera, objects, controls, offset = 1.25) {
  const box = new THREE.Box3();
  objects.forEach(obj => box.expandByObject(obj));

  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const distance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;

  camera.position.set(center.x + distance, center.y + distance, center.z + distance);
  camera.lookAt(center);

  if (controls) {
    controls.target.copy(center);
    controls.update();
  }

  console.log(`[3D] Camera fit with fallback Z: ${distance.toFixed(2)}`);
}
