import * as THREE from 'three';
import { createRealisticWallMaterial } from './RealisticWallMaterial';
import { createRealisticFloorMaterial } from './RealisticFloorMaterial';

export function createMaterialForElement({
  type,
  textureUrl,
  tileSizeX = 1,
  tileSizeY = 1,
  color,
  isGlass,
  reflecting = 10 // Default mid-level
}) {
  // Normalize values to avoid NaN
  const safeTileX = parseFloat(tileSizeX) || 1;
  const safeTileY = parseFloat(tileSizeY) || 1;
  const reflectLevel = parseFloat(reflecting) || 10;

  // Debug log
  console.log(`🎨 createMaterialForElement → type: ${type}, color: ${color}, reflect: ${reflectLevel}, texture: ${textureUrl}`);

  // GLASS MATERIAL
  if (isGlass || (textureUrl && textureUrl.toLowerCase().includes('glass'))) {
    return new THREE.MeshPhysicalMaterial({
      color: color ? new THREE.Color(color) : new THREE.Color('#ffffff'),
      transmission: 1.0,
      opacity: 1.0,
      transparent: true,
      roughness: 0.05,
      metalness: 0,
      thickness: 0.1,
envMapIntensity: 2.8,
      side: THREE.DoubleSide,
    });
  }

  // TEXTURE MATERIAL
if (textureUrl && typeof textureUrl === 'string' && textureUrl.length > 5) {
  const texture = new THREE.TextureLoader().load(textureUrl);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1 / safeTileX, 1 / safeTileY);

  return new THREE.MeshStandardMaterial({
    map: texture,
    color: color ? new THREE.Color(color) : undefined,
    side: THREE.FrontSide,
    roughness: 1 - reflectLevel / 30,
    metalness: 0.05 + reflectLevel / 100,
    envMapIntensity: 2.0,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
}

// 🎯 Always fallback to color if texture isn't present
if (color) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    side: THREE.DoubleSide,
    roughness: 1 - reflectLevel / 30,
    metalness: 0.05 + reflectLevel / 100,
    envMapIntensity: 2.0,
  });
}


  // FALLBACKS
  if (type === 'wall') return createRealisticWallMaterial();
  if (type === 'floor') return createRealisticFloorMaterial();

  // Pure fallback gray
  return new THREE.MeshStandardMaterial({
    color: '#cccccc',
    roughness: 0.7,
    metalness: 0.1,
    envMapIntensity: 1.0,
  });
}
