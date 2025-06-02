import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const initRenderer = (container) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f2f2f2');

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(5, 5, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  return { scene, camera, renderer, controls };
};

export const cleanUpRenderer = (container) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};
