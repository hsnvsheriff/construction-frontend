// src/canvas/wall/wallUtils.js

import { fabric } from 'fabric';

let fabricCanvas = null;

export function startWallDrawing(canvas) {
  fabricCanvas = canvas;

  canvas.on('mouse:down', handleMouseDown);
  canvas.on('mouse:move', handleMouseMove);

  canvas.setCursor('crosshair');
  canvas.upperCanvasEl.style.cursor = 'crosshair';

  console.log('🧱 Wall drawing mode activated (wallUtils.js)');
}

export function stopWallDrawing(canvas) {
  if (!canvas) return;

  canvas.off('mouse:down', handleMouseDown);
  canvas.off('mouse:move', handleMouseMove);

  canvas.upperCanvasEl.style.cursor = 'default';
  fabricCanvas = null;
}



function handleMouseMove(opt) {
  // optional: can be used for ghost line or live cursor feedback
}