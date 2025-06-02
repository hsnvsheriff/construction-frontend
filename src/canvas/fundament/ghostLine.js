import { fabric } from 'fabric';

let ghostLine = null;
let fabricCanvas = null;
let scaleGlobal = 20;

export function createGhostLine(canvas, startX, startY, scale = 20) {
  fabricCanvas = canvas;
  scaleGlobal = scale;

  ghostLine = new fabric.Line([startX, startY, startX, startY], {
    stroke: 'rgba(0, 0, 255, 0.5)',
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false,
    excludeFromHistory: true,
    excludeFromExport: true,
  });

  fabricCanvas.add(ghostLine);
}

export function updateGhostLinePosition(x, y) {
  if (!ghostLine || !fabricCanvas) return;
  ghostLine.set({ x2: x, y2: y });
  fabricCanvas.requestRenderAll();
}

export function removeGhostLine() {
  if (ghostLine && fabricCanvas) {
    fabricCanvas.remove(ghostLine);
    ghostLine = null;
    fabricCanvas = null;
  }
}
