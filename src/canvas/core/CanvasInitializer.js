import { drawWall } from "../wall/drawWall";
import useLayerStore from "../layers/LayerStore";
import { restrictMovementWithinGrid } from "./FabricManager";

export function restrictMovementWithinGrid(canvas, widthMeters, heightMeters, scale) {
  const halfWidth = (widthMeters * scale) / 2;
  const halfHeight = (heightMeters * scale) / 2;

  canvas.off('object:moving'); // Important: always remove old

  canvas.on('object:moving', (e) => {
    const obj = e.target;
    if (!obj) return;

    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    const boundingRect = obj.getBoundingRect(true);

    const left = (boundingRect.left - vpt[4]) / zoom;
    const top = (boundingRect.top - vpt[5]) / zoom;
    const widthPx = boundingRect.width / zoom;
    const heightPx = boundingRect.height / zoom;

    // Clamp object inside world
    if (left < -halfWidth) {
      obj.left = -halfWidth + (widthPx / 2);
    }
    if (top < -halfHeight) {
      obj.top = -halfHeight + (heightPx / 2);
    }
    if (left + widthPx > halfWidth * 2) {
      obj.left = halfWidth * 2 - (widthPx / 2);
    }
    if (top + heightPx > halfHeight * 2) {
      obj.top = halfHeight * 2 - (heightPx / 2);
    }
  });
}
export function restrictMovementWithinGrid(canvas, widthMeters, heightMeters, scale) {
  const halfWidth = (widthMeters * scale) / 2;
  const halfHeight = (heightMeters * scale) / 2;

  canvas.off('object:moving'); // Important: always remove old

  canvas.on('object:moving', (e) => {
    const obj = e.target;
    if (!obj) return;

    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    const boundingRect = obj.getBoundingRect(true);

    const left = (boundingRect.left - vpt[4]) / zoom;
    const top = (boundingRect.top - vpt[5]) / zoom;
    const widthPx = boundingRect.width / zoom;
    const heightPx = boundingRect.height / zoom;

    // Clamp object inside world
    if (left < -halfWidth) {
      obj.left = -halfWidth + (widthPx / 2);
    }
    if (top < -halfHeight) {
      obj.top = -halfHeight + (heightPx / 2);
    }
    if (left + widthPx > halfWidth * 2) {
      obj.left = halfWidth * 2 - (widthPx / 2);
    }
    if (top + heightPx > halfHeight * 2) {
      obj.top = halfHeight * 2 - (heightPx / 2);
    }
  });
}

