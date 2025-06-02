// src/canvas/core/GridRenderer.js
import { fabric } from 'fabric';

const PIXELS_PER_METER = 100;
const PIXELS_PER_SQUARE = 20;
const GRID_COLOR_MINOR = '#eee';
const GRID_COLOR_MAJOR = '#ccc';
const GRID_STROKE_MINOR = 1;
const GRID_STROKE_MAJOR = 2;

/**
 * Renders a scalable math grid centered on (0,0) with correct unit sizes.
 * - 1 meter = 100 pixels
 * - 1 square = 20 pixels (i.e., 5 squares per meter)
 */
export function renderMathGrid(canvas, widthInMeters = 100, heightInMeters = 60) {

  if (!canvas) return;

  const width = widthInMeters * PIXELS_PER_METER;
  const height = heightInMeters * PIXELS_PER_METER;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const minorSpacing = PIXELS_PER_SQUARE;       // every 0.2m
  const majorSpacing = PIXELS_PER_METER;        // every 1m

  // Cleanup old grid
  const existingGrid = canvas.getObjects().filter(obj => obj.__isMathBackground);
  existingGrid.forEach(obj => canvas.remove(obj));

  // Vertical lines
  for (let x = -halfWidth; x <= halfWidth; x += minorSpacing) {
    const isMajor = Math.round(x) % majorSpacing === 0;
    const line = new fabric.Line(
      [x, -halfHeight, x, halfHeight],
      {
        stroke: isMajor ? GRID_COLOR_MAJOR : GRID_COLOR_MINOR,
        strokeWidth: isMajor ? GRID_STROKE_MAJOR : GRID_STROKE_MINOR,
        selectable: false,
        evented: false,
        hasBorders: false,
        hasControls: false,
        hoverCursor: 'default',
      }
    );
    line.__isMathBackground = true;
    canvas.add(line);
    canvas.sendToBack(line);
  }

  // Horizontal lines
  for (let y = -halfHeight; y <= halfHeight; y += minorSpacing) {
    const isMajor = Math.round(y) % majorSpacing === 0;
    const line = new fabric.Line(
      [-halfWidth, y, halfWidth, y],
      {
        stroke: isMajor ? GRID_COLOR_MAJOR : GRID_COLOR_MINOR,
        strokeWidth: isMajor ? GRID_STROKE_MAJOR : GRID_STROKE_MINOR,
        selectable: false,
        evented: false,
        hasBorders: false,
        hasControls: false,
        hoverCursor: 'default',
      }
    );
    line.__isMathBackground = true;
    canvas.add(line);
    canvas.sendToBack(line);
  }

  // Boundary rectangle
  const border = new fabric.Rect({
    left: -halfWidth,
    top: -halfHeight,
    width: width,
    height: height,
    fill: '',
    stroke: '#999',
    strokeWidth: 4,
    selectable: false,
    evented: false,
  });
  border.__isMathBackground = true;
  canvas.add(border);
  canvas.sendToBack(border);
}
