import * as THREE from 'three';

/**
 * Creates a THREE.MeshStandardMaterial for a floor.
 * Applies UV mapping only if geometry is passed.
 */
export function createFloorMaterial(materialMeta = {}, geometry) {
  const tileSizeX = parseFloat(materialMeta?.tileSizeX);
  const tileSizeY = parseFloat(materialMeta?.tileSizeY);

  // Optional custom UVs (only if geometry is passed and tile sizes are valid)
  if (geometry && tileSizeX > 0 && tileSizeY > 0) {
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;
    const sizeX = bbox.max.x - bbox.min.x;
    const sizeY = bbox.max.y - bbox.min.y;

    const position = geometry.attributes.position;
    const uvArray = [];

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i); // ShapeGeometry uses X/Y
      const u = (x - bbox.min.x) / tileSizeX;
      const v = (y - bbox.min.y) / tileSizeY;
      uvArray.push(u, v);
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
  }

  const textureUrl = materialMeta?.previewUrl || '';

  if (!textureUrl) {
    return new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
  }

  const texture = new THREE.TextureLoader().load(textureUrl, undefined, undefined, () => {
    console.warn("🛑 Failed to load texture:", textureUrl);
  });

  // Only set wrapping; do NOT apply repeat scaling here
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.center.set(0.5, 0.5);
  texture.rotation = materialMeta?.rotation || 0;

  return new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    roughness: 0.8,
    metalness: 0.1,
  });
}
