import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * Loads HDRI environment texture.
 * @param {THREE.WebGLRenderer} renderer 
 * @param {THREE.Scene} scene 
 * @param {string} filePath 
 * @returns Promise<void>
 */
export async function loadHDRIEnvironment(renderer, scene, filePath = '/hdr/studio_small_09_1k.hdr') {
  return new Promise((resolve, reject) => {
    const loader = new RGBELoader();

    loader.setDataType(THREE.FloatType); // ✅ works with Radiance .hdr
    loader.load(
      filePath,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.background = texture;
        console.log('✅ HDRI applied:', filePath);
        resolve();
      },
      undefined,
      (err) => {
        console.error('❌ HDRI load failed:', err);
        reject(err);
      }
    );
  });
}
