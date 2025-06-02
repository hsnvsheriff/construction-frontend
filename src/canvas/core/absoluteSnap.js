// absoluteSnap.js

function getDistance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

import useLayerStore from '../layers/LayerStore';

// Default: 5 meters physical snapping radius
let SNAP_RADIUS_METERS = 5;

export function getSnappedCoords(pointer, mode, canvasObjects, scale = 20) {
  if (!canvasObjects || !pointer) return pointer;

  const { activeLayerId } = useLayerStore.getState();
  if (!activeLayerId) return pointer;

  const SNAP_THRESHOLD_PX = SNAP_RADIUS_METERS * scale; // Convert to canvas units

  const snapTargets = canvasObjects.filter(obj => {
    if (!obj.snapEligible) return false;
    if (obj.layerId !== activeLayerId) return false;

    // Snap within same category or allowed rules
    if (mode === 'fundament') return obj.type === 'fundament';
    else return obj.type !== 'fundament'; // disallow snapping to fundament
  });

  let closest = null;
  let minDistance = SNAP_THRESHOLD_PX;

  snapTargets.forEach(obj => {
    if (Array.isArray(obj.pointsData)) {
      obj.pointsData.forEach(pt => {
        const dist = getDistance(pointer, pt);
        if (dist < minDistance) {
          minDistance = dist;
          closest = pt;
        }
      });
    }
  });

  return closest || pointer;
}
