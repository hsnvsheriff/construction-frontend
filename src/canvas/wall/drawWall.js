import { fabric } from 'fabric';
import { createGhostLine, updateGhostLinePosition, removeGhostLine } from '../fundament/ghostLine';
import {
  createMeasurementLabel,
  updateMeasurementLabel,
  removeMeasurementLabel
} from '../fundament/measurementLabel';
import { getScalePerUnit } from '../core/scaleUtils';

let fabricCanvas = null;
let wallPoints = [];
let wallLine = null;
let isDrawing = false;
let isPassiveMode = false;
let snapDots = [];
let scaleGlobal = 20;
let startPoint = null;

function getDistance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function findSnapPointNear(x, y, threshold = 10) {
  for (let p of wallPoints) {
    if (getDistance(p, { x, y }) <= threshold) return p;
  }
  return null;
}

function createSnapDot(x, y) {
  const dot = new fabric.Circle({
    left: x - 4,
    top: y - 4,
    radius: 4,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
    selectable: false,
    evented: false,
    originX: 'left',
    originY: 'top',
  });

  snapDots.push(dot);
  fabricCanvas.add(dot);
}

function removeSnapDots() {
  snapDots.forEach(dot => {
    if (fabricCanvas.contains(dot)) {
      fabricCanvas.remove(dot);
    }
  });
  snapDots = [];
}

function calculateAngle(x1, y1, x2, y2) {
  const radians = Math.atan2(y2 - y1, x2 - x1);
  let degrees = radians * (180 / Math.PI);
  if (degrees < 0) degrees += 360;
  return degrees;
}

export function calculatePolygonArea(points) {
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const { x: x1, y: y1 } = points[i];
    const { x: x2, y: y2 } = points[(i + 1) % n];
    area += (x1 * y2 - x2 * y1);
  }
  return Math.abs(area / 2);
}

function getPolygonCenter(points) {
  let x = 0, y = 0;
  points.forEach(p => {
    x += p.x;
    y += p.y;
  });
  return { x: x / points.length, y: y / points.length };
}

function addAreaLabel(points) {
  const center = getPolygonCenter(points);
  const scalePerUnit = getScalePerUnit(scaleGlobal);
  const area = calculatePolygonArea(points) / (scalePerUnit * scalePerUnit);

  const areaText = new fabric.Text(`${area.toFixed(2)} m²`, {
    left: center.x,
    top: center.y,
    fontSize: 18,
    fill: 'black',
    selectable: false,
    evented: false,
    originX: 'center',
    originY: 'center',
  });

  fabricCanvas.add(areaText);
}

function createFloorPolygon(points) {
  if (!fabricCanvas || points.length < 3) return;

  const polygon = new fabric.Polygon(points, {
    fill: 'rgba(150, 150, 150, 0.1)',
    stroke: 'black',
    strokeWidth: 1,
    selectable: false,
    evented: false,
    name: `wallroom_${Date.now()}`,
    type: 'polygon',
  });

  polygon.originalPoints = points;
  fabricCanvas.add(polygon);
}

function addWallToCanvasDataModel(points, layerId = 'Layer 0') {
  if (!Array.isArray(points) || points.length < 2) return;

  points.forEach((start, i) => {
    if (i === points.length - 1) return;
    const end = points[i + 1];

    const uniqueId = `wall_${Date.now()}_${i}`;

    const wall = new fabric.Line([start.x, start.y, end.x, end.y], {
      stroke: 'black',
      strokeWidth: 4,
      selectable: false,
      evented: false,
    });

    wall.type = 'wall';
    wall.layerId = layerId;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const pixelLength = Math.sqrt(dx * dx + dy * dy);
    const scale = getScalePerUnit(scaleGlobal);

    wall.metadata = {
      id: uniqueId,
      name: `Wall ${i + 1}`,
      start,
      end,
      thickness: 0.2, // meters
      height: 2,       // meters
      material: 'Concrete',
      length: pixelLength / scale, // meters
      angleDeg: calculateAngle(start.x, start.y, end.x, end.y),
      direction: {
        x: dx / pixelLength,
        y: dy / pixelLength
      },
      gaps: [] // 🪟 doors/windows will live here
    };

    fabricCanvas.add(wall);
  });
}




function addWallToDataModel(points, layerId = 'Layer 0') {
  if (!window.DataModel) return;

  const wallId = `wall_${Date.now()}`;
  const walls = [];

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];

    walls.push({
      id: `${wallId}_${i}`,
      name: `wall_${i + 1}`,
      code: '',
      type: 'wall',
      layerId,
      position: {
        x: (start.x + end.x) / 2,
        y: 0,
        z: (start.y + end.y) / -2
      },
      metadata: {
        start,
        end,
        thickness: 0.2,
        height: 3
      }
    });
  }

  const model = window.DataModel.store;
  if (model?.walls) {
    model.walls.push(...walls);
  }
}

function cleanupWallDrawing() {
  removeGhostLine();
  removeMeasurementLabel();
  removeSnapDots();
  wallLine = null;
  startPoint = null;
  wallPoints = [];
  isDrawing = false;
  isPassiveMode = false;
}

function handleMouseDown(event) {
  const e = event.e;
  if (e.button === 2 && isDrawing) {
    e.preventDefault();
    cleanupWallDrawing();
    fabricCanvas.requestRenderAll();
    return;
  }

  if (window.__spaceMode) return;

  const pointer = fabricCanvas.getPointer(e);
  const { x, y } = pointer;

  const snapped = findSnapPointNear(x, y);
  const clickX = snapped?.x ?? x;
  const clickY = snapped?.y ?? y;

  if (!isDrawing) {
    startPoint = { x: clickX, y: clickY };
    wallPoints = [startPoint];
    isDrawing = true;

    wallLine = new fabric.Line([clickX, clickY, clickX, clickY], {
      stroke: 'black',
      strokeWidth: 4,
      selectable: false,
      evented: false,
    });

    fabricCanvas.add(wallLine);
    createGhostLine(fabricCanvas, clickX, clickY);
    createMeasurementLabel(fabricCanvas, clickX, clickY);
    createSnapDot(clickX, clickY);
  } else {
    const distanceToFirst = getDistance({ x: clickX, y: clickY }, wallPoints[0]);
    if (distanceToFirst < 10 && wallPoints.length >= 3) {
      wallLine.set({ x2: wallPoints[0].x, y2: wallPoints[0].y });
      wallPoints.push(wallPoints[0]);
      fabricCanvas.renderAll();

      addAreaLabel(wallPoints);
      addWallToCanvasDataModel(wallPoints);
      addWallToDataModel(wallPoints);
      createFloorPolygon(wallPoints);
      cleanupWallDrawing();

      if (window.DataModel?.updateFromCanvas) {
        window.DataModel.updateFromCanvas(fabricCanvas);
      }
      return;
    }

    wallLine.set({ x2: clickX, y2: clickY });
    wallPoints.push({ x: clickX, y: clickY });
    fabricCanvas.renderAll();

    removeGhostLine();
    removeMeasurementLabel();

    startPoint = { x: clickX, y: clickY };
    wallLine = new fabric.Line([clickX, clickY, clickX, clickY], {
      stroke: 'black',
      strokeWidth: 4,
      selectable: false,
      evented: false,
    });
    fabricCanvas.add(wallLine);

    createGhostLine(fabricCanvas, clickX, clickY);
    createMeasurementLabel(fabricCanvas, clickX, clickY);
    createSnapDot(clickX, clickY);
  }
}

function handleMouseMove(event) {
  if (!isDrawing || !wallLine) return;

  const pointer = fabricCanvas.getPointer(event.e);
  const { x, y } = pointer;

  wallLine.set({ x2: x, y2: y });
  updateGhostLinePosition(x, y);

  const distance = getDistance(startPoint, { x, y }) / getScalePerUnit(scaleGlobal);
  const angle = calculateAngle(startPoint.x, startPoint.y, x, y);
  updateMeasurementLabel(x, y, distance, angle, 'm');

  fabricCanvas.renderAll();
}

export function startWallDrawing(canvas, scale = 20) {
  fabricCanvas = canvas;
  scaleGlobal = scale;
  cleanupWallDrawing();

  canvas.off('mouse:down', handleMouseDown);
  canvas.off('mouse:move', handleMouseMove);

  canvas.on('mouse:down', handleMouseDown);
  canvas.on('mouse:move', handleMouseMove);
}

export function stopWallDrawing(canvas) {
  if (!canvas) return;
  canvas.off('mouse:down', handleMouseDown);
  canvas.off('mouse:move', handleMouseMove);
  cleanupWallDrawing();
}