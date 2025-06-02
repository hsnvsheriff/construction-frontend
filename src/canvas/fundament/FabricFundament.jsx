// FabricFundament.jsx
// Used to render saved fundament from stored data (points array)

import { fabric } from 'fabric';

export function createFabricFundament(fundamentData) {
  const polygon = new fabric.Polygon(fundamentData.points, {
    fill: 'rgba(0, 0, 255, 0.2)',
    stroke: 'blue',
    strokeWidth: 2,
    objectCaching: false,
    selectable: true,
    hasControls: true,
    hasBorders: true,
    id: fundamentData.id,   // Save id inside Fabric.js object if needed later
    type: 'fundament'       // Custom type tag
  });

  return polygon;
}
