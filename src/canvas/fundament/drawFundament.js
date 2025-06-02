import { pushToUndo } from '../core/AbsoluteHistory';
import { fabric } from 'fabric';
import useLayerStore from '../layers/LayerStore';
import {
  createGhostLine,
  updateGhostLinePosition,
  removeGhostLine
} from './ghostLine';
import { createMeasurementLabel, updateMeasurementLabel, removeMeasurementLabel } from './measurementLabel';
import { getSnappedCoords } from '../core/absoluteSnap';
import { getScalePerUnit } from '../core/scaleUtils'; // ⬅️ at top of file
import { useGlobalCanvasStore } from '../core/useGlobalCanvasStore'; // ✅ NEW



let points = [];
let snapSquares = []; // NEW: stores green/gray dot Fabric.Rect objects
let lines = [];
let isPassiveMode = false;
let fabricCanvasGlobal = null;
let scaleGlobal = 20;
let isDrawing = false;
let preventContextMenuHandler = null;
let needsRender = false;
let renderLoopRunning = false;
const FUNDAMENT_STROKE_COLOR = 'black';
const FUNDAMENT_STROKE_WIDTH = 2;
import toast from 'react-hot-toast';


function handleMouseMove(event) {
  if (window.__spaceMode) return;
  if (!fabricCanvasGlobal || points.length === 0 || !isDrawing) return;
  const pointer = fabricCanvasGlobal.getPointer(event.e);
  let x = pointer.x;
  let y = pointer.y;
  const lastPoint = points[points.length - 1];

  if (window.__dictatorMode) {
    const snapped = applyDictatorSnapping(x, y, lastPoint, scaleGlobal);
    x = snapped.x;
    y = snapped.y;
  }

  if (!ghostLineExists()) {
    createGhostLine(fabricCanvasGlobal, lastPoint.x, lastPoint.y);
    createMeasurementLabel(fabricCanvasGlobal, x, y);
  }

  updateGhostLinePosition(x, y);

const scalePerUnit = getScalePerUnit(scaleGlobal);
  const distance = getDistance(lastPoint, { x, y }) / scalePerUnit;
  const angleDegrees = calculateAngle(lastPoint.x, lastPoint.y, x, y); // ✅ this line was missing
const unit = useGlobalCanvasStore.getState().unit;

  updateMeasurementLabel(x, y, distance, angleDegrees, unit);
}



function startRenderLoop() {
  if (renderLoopRunning || !fabricCanvasGlobal) return;
  renderLoopRunning = true;

  const loop = () => {
    if (!fabricCanvasGlobal) {
      renderLoopRunning = false;
      return;
    }

    if (needsRender) {
      needsRender = true;
      startRenderLoop();
            needsRender = false;
    }

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}


export function startFundamentDrawing(canvas, scale = 20) {
  // Reset internal state
  points = [];
  lines = [];
  fabricCanvasGlobal = canvas;
  scaleGlobal = scale;
  isDrawing = false;
  isPassiveMode = false;
  window.isPassiveMode = false;

  // Prevent right-click menu
  preventContextMenuHandler = (e) => e.preventDefault();
  canvas.upperCanvasEl.addEventListener('contextmenu', preventContextMenuHandler);

  // Always remove old handlers before attaching new ones
  canvas.off('mouse:down', handleMouseDown);
  canvas.off('mouse:move', handleMouseMove);

  // Detect if in dataMode
const { dataMode } = useGlobalCanvasStore.getState();

  if (dataMode) {
    console.log("[DATA MODE] Fundament inspection mode");
    // Reuse handleMouseDown for selecting elements
    canvas.on('mouse:down', handleMouseDown);
    return;
  }

  // Attach drawing mode listeners
  canvas.on('mouse:down', handleMouseDown);
  canvas.on('mouse:move', handleMouseMove);
}



export function stopFundamentDrawing(canvas) {
  if (!fabricCanvasGlobal) return;

  fabricCanvasGlobal.off('mouse:down', handleMouseDown);
  fabricCanvasGlobal.off('mouse:move', handleMouseMove);

  if (preventContextMenuHandler && canvas.upperCanvasEl) {
    canvas.upperCanvasEl.removeEventListener('contextmenu', preventContextMenuHandler);
    preventContextMenuHandler = null;
  }

  cleanupDrawing(fabricCanvasGlobal);
  fabricCanvasGlobal = null;
}

export function cancelCurrentDrawing() {
  if (!fabricCanvasGlobal) return;

  if (points.length > 0 && isDrawing) {
    removeGhostLine();
    removeMeasurementLabel();

    // ✅ Do NOT remove any real points/lines/squares
    isDrawing = false;
    isPassiveMode = true;

    needsRender = true;
    startRenderLoop();
      }
}


function cleanupDrawing(canvas) {
  if (!canvas) return;
  lines.forEach(line => canvas.remove(line));
  lines = [];
  points = [];
  snapSquares.forEach(dot => canvas.remove(dot));
  snapSquares = [];
  removeGhostLine();
  removeMeasurementLabel();
  isDrawing = false;
}


function createSnapSquare(x, y, color, layerId) {
  const size = 10;
  const square = new fabric.Rect({
    left: x - size / 2,
    top: y - size / 2,
    width: size,
    height: size,
    fill: color,
    selectable: false,
    evented: false,
    originX: 'left',
    originY: 'top',
    name: 'snap-square',
    excludeFromHistory: true, // 👈 this line is key
  });

  square.type = 'rect';
  square.snapEligible = true;
  square.pointsData = [{ x, y }];
  square.layerId = layerId;

  snapSquares.push(square);
  return square;
}


function ghostLineExists() {
  return !!(fabricCanvasGlobal && fabricCanvasGlobal.getObjects().find(obj => obj.strokeDashArray));
}


function getDistance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function getPolygonCenter(points) {
  let x = 0, y = 0;
  points.forEach(p => {
    x += p.x;
    y += p.y;
  });
  return { x: x / points.length, y: y / points.length };
}

function completeFundament() {
  const first = points[0];
  const last = points[points.length - 1];
  const { activeLayerId } = useLayerStore.getState();
  const fundamentId = `fundament_${Date.now()}`;

  // ➕ Final closing line
  const closingLine = new fabric.Line([last.x, last.y, first.x, first.y], {
    stroke: FUNDAMENT_STROKE_COLOR,
    strokeWidth: FUNDAMENT_STROKE_WIDTH,
    selectable: false,
    evented: false,
    subtype: 'fundament',
    strokeUniform: true,
  });
  closingLine.layerId = activeLayerId;
  lines.push(closingLine);
  fabricCanvasGlobal.add(closingLine);

  // 🔲 Polygon
  const adjustedPoints = shrinkPolygonInward(points, FUNDAMENT_STROKE_WIDTH / 2);
  const polygon = new fabric.Polygon(adjustedPoints, {
    fill: 'rgba(50,50,50,0.2)',
    stroke: FUNDAMENT_STROKE_COLOR,
    strokeWidth: FUNDAMENT_STROKE_WIDTH,
    objectCaching: false,
    selectable: true,
    evented: true,
    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
    type: 'fundament',
    strokeUniform: true,
    name: fundamentId,
  });
  polygon.originalPoints = points;
  polygon.layerId = activeLayerId;

  // 🧠 Attach default metadata
  polygon.data = {
    code: '',
    floor: '1',
    depth: '0.00',
    thickness: '0.00',
    length: '0.00',
    width: '0.00',
    material: 'Concrete',
    insulation: 'Standard',
    fireResistance: 'Class A',
    soundproofing: 'Normal',
    waterproof: 'Yes',
    hasRebar: 'Yes',
    loadCapacity: '10t/m²',
    slope: '0%',
    temperatureResistance: '-30°C to 80°C',
    frostResistance: 'High',
    anchorType: 'Steel Bolt',
    codeCompliance: 'EN 1992',
    constructionDate: 'Not Set',
    createdBy: 'Architect AI',
    seismicRating: '5.5',
    wiFiAttenuation: 'Medium',
    uvResistance: 'High',
    color: '#999999',
    internalID: fundamentId,
    notes: '',
    marsReady: 'No',
    aiCertified: 'Pending',
  };

  fabricCanvasGlobal.add(polygon);
  enableFundamentInspector(); // ✅ Enables click-based inspection

  // 🧮 Area text
  const center = getPolygonCenter(points);
  const scalePerUnit = getScalePerUnit(scaleGlobal);
const unit = useGlobalCanvasStore.getState().unit;
  const baseArea = calculatePolygonArea(points) / (scalePerUnit * scalePerUnit);
  const area = baseArea;
  const unitLabel = unit === 'feet' ? 'ft²' : 'm²';

  const areaText = new fabric.Text(`${area.toFixed(2)} ${unitLabel}`, {
    left: center.x,
    top: center.y,
    fontSize: 18,
    fill: 'black',
    selectable: false,
    evented: false,
    originX: 'center',
    originY: 'center',
  });
  areaText.layerId = activeLayerId;
  areaText.type = 'fundament';
  fabricCanvasGlobal.add(areaText);

  // 🧼 Clean snap squares
  fabricCanvasGlobal.getObjects().forEach((obj) => {
    if (obj.name === 'snap-square') {
      fabricCanvasGlobal.remove(obj);
    }
  });

  pushToUndo([polygon, areaText, closingLine]);

  // Final cleanup
  snapSquares.forEach(dot => fabricCanvasGlobal.remove(dot));
  removeGhostLine();
  removeMeasurementLabel();
  lines = [];
  points = [];
  isDrawing = false;
  isPassiveMode = false;
  window.__hasCompletedFundament = true;
}



function shrinkPolygonInward(points, amount) {
  const center = getPolygonCenter(points);
  return points.map(pt => {
    const dx = pt.x - center.x;
    const dy = pt.y - center.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const factor = (length - amount) / length;
    return {
      x: center.x + dx * factor,
      y: center.y + dy * factor,
    };
  });
}


function calculateAngle(x1, y1, x2, y2) {
  const radians = Math.atan2(y2 - y1, x2 - x1);
  let degrees = radians * (180 / Math.PI);
  if (degrees < 0) degrees += 360;
  return degrees;
}




function handleMouseDown(opt) {
const { dataMode } = useGlobalCanvasStore.getState();

  if (dataMode) {
    const obj = opt.target;
    if (obj?.type === "fundament") {
useGlobalCanvasStore.getState().setActiveObject(obj);
    }
    return; // ✅ Skip all drawing logic
  }

  if (window.__spaceMode || !fabricCanvasGlobal) return;

  const e = opt.e;

  // 🖱️ Right-click to cancel
  if (e.button === 2) {
    e.preventDefault();
    e.stopPropagation();
    cancelCurrentDrawing();
    return;
  }

  if (e.button !== 0) return;

  const pointer = fabricCanvasGlobal.getPointer(e);
  let { x, y } = getSnappedCoords(pointer, 'fundament', fabricCanvasGlobal.getObjects(), scaleGlobal);
  const { activeLayerId, setLayerCardOpen } = useLayerStore.getState();

  // 🛑 No layer selected
  if (!activeLayerId) {
    toast.error('Please select a layer before drawing.', { icon: '⚠️' });
    return;
  }

  // 🚫 Prevent multiple fundaments per layer
  const alreadyHasFundament = fabricCanvasGlobal.getObjects().some(
    obj => obj.type === 'fundament' && obj.layerId === activeLayerId
  );
  if (alreadyHasFundament) {
    setLayerCardOpen(true); // 👈 Expand the layer card
    toast.error('Max 1 fundament per layer.\nPlease add a second layer to continue.', { icon: '🚧' });
    return;
  }

  // 📏 Dictator snapping
  if (points.length > 0 && window.__dictatorMode) {
    const lastPoint = points[points.length - 1];
    const result = applyDictatorSnapping(x, y, lastPoint, scaleGlobal);
    x = result.x;
    y = result.y;
  }

  removeGhostLine();
  removeMeasurementLabel();

  // 🔄 Resume passive drawing
  if (!isDrawing && isPassiveMode) {
    const dot = findSnapSquareNear(x, y);
    if (dot) {
      const resumeX = dot.left + 5;
      const resumeY = dot.top + 5;
      points.push({ x: resumeX, y: resumeY });
      isDrawing = true;
      isPassiveMode = false;
      return;
    } else return;
  }

  // 🟢 Start new drawing
  if (points.length === 0) {
    const square = createSnapSquare(x, y, 'green', activeLayerId);
    fabricCanvasGlobal.add(square);

    const dummyLine = new fabric.Line([x, y, x, y], {
      stroke: 'transparent',
      strokeWidth: 0,
      selectable: false,
      evented: false,
    });
    dummyLine.layerId = activeLayerId;
    dummyLine.snapHelpers = [square];

    fabricCanvasGlobal.add(dummyLine);
    lines.push(dummyLine);

    points.push({ x, y });
    pushToUndo(dummyLine, [square]);
    isDrawing = true;
    isPassiveMode = false;
    return;
  }

  // 🟣 Close shape
  const firstPoint = points[0];
  if (getDistance(firstPoint, { x, y }) < 10 && points.length >= 3) {
    maybeCompleteFundament();
    return;
  }

  // 🧱 Add next point
  const lastPoint = points[points.length - 1];
  if (lastPoint?.x === x && lastPoint?.y === y) return;
  if (points.some(p => p.x === x && p.y === y)) return;

  points.push({ x, y });

  const snapSquare = createSnapSquare(x, y, 'gray', activeLayerId);
  fabricCanvasGlobal.add(snapSquare);

  const line = new fabric.Line([lastPoint.x, lastPoint.y, x, y], {
    stroke: 'black',
    strokeWidth: 2,
    selectable: false,
    evented: false,
    subtype: 'fundament',
    strokeUniform: true,
  });
  line.layerId = activeLayerId;
  line.snapHelpers = [snapSquare];

  fabricCanvasGlobal.add(line);
  lines.push(line);

  createGhostLine(fabricCanvasGlobal, x, y);
  createMeasurementLabel(fabricCanvasGlobal, x, y);

  pushToUndo(line, [snapSquare]);
}





function maybeCompleteFundament() {
  const skipDisclaimer = localStorage.getItem('skipFundamentDisclaimer');

  const finish = () => {
    const result = completeFundament(); // this must return the created objects
    if (!result) return;

    const { polygon, areaText, closingLine } = result;
pushToUndo([polygon, areaText, closingLine]);

  };

  if (skipDisclaimer === 'true') {
    finish();
    return;
  }

  if (typeof window.showFundamentDisclaimer === 'function') {
    window.showFundamentDisclaimer((dontShowAgain) => {
      if (dontShowAgain) {
        localStorage.setItem('skipFundamentDisclaimer', 'true');
      }
      finish();
    });
  } else {
    finish();
  }
}



function findSnapSquareNear(x, y, threshold = 10) {
  return snapSquares.find(dot => {
    const dx = x - (dot.left + 5); // center of square
    const dy = y - (dot.top + 5);
    return Math.sqrt(dx * dx + dy * dy) <= threshold;
  });
}



function calculatePolygonArea(points) {
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const { x: x1, y: y1 } = points[i];
    const { x: x2, y: y2 } = points[(i + 1) % n];
    area += (x1 * y2 - x2 * y1);
  }
  return Math.abs(area / 2);
}



export function applyDictatorSnapping(x, y, origin, scaleGlobal) {
  if (!window.__dictatorMode || !origin) return { x, y };

  const dx = x - origin.x;
  const dy = y - origin.y;
  let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;

  // 🔁 Normalize to nearest 90°: 0, 90, 180, 270
  const snappedDeg = Math.round(angleDeg / 90) * 90 % 360;
  const snappedRad = (snappedDeg * Math.PI) / 180;

  // Distance snap (based on grid)
  const distancePx = Math.sqrt(dx * dx + dy * dy);
  const stepPx = scaleGlobal * 5;
  const snappedDistance = Math.max(1, Math.round(distancePx / stepPx)) * stepPx;

  const newX = origin.x + Math.cos(snappedRad) * snappedDistance;
  const newY = origin.y + Math.sin(snappedRad) * snappedDistance;

  return { x: newX, y: newY };
}


function scratchFundament() {
  if (!fabricCanvasGlobal) return;

  const { activeLayerId } = useLayerStore.getState();
  const objects = fabricCanvasGlobal.getObjects();

  // 🧹 Remove all fundament-related objects on this layer
  const toRemove = objects.filter((obj) =>
    obj.layerId === activeLayerId &&
    (obj.type === 'polygon' || obj.type === 'text' || obj.subtype === 'fundament')
  );
  toRemove.forEach(obj => fabricCanvasGlobal.remove(obj));

  // 💥 Remove all snapSquares
  snapSquares.forEach(dot => {
    if (fabricCanvasGlobal.contains(dot)) {
      fabricCanvasGlobal.remove(dot);
    }
  });

  // 🔄 Clean ghost line + label
  removeGhostLine();
  removeMeasurementLabel();

  // 💾 Reset all internal state
  lines = [];
  points = [];
  snapSquares = [];
  isDrawing = false;
  isPassiveMode = false;
  window.isPassiveMode = false;
  window.__hasCompletedFundament = false;

  // 👀 Force re-render + clear any leftover selection
  fabricCanvasGlobal.discardActiveObject();
  fabricCanvasGlobal.requestRenderAll();
  fabricCanvasGlobal.off('mouse:down', handleMouseDown);
fabricCanvasGlobal.on('mouse:down', handleMouseDown);

}






export function localUndoInFundamentMode() {
if (!fabricCanvasGlobal) return;

const hasPolygon = fabricCanvasGlobal.getObjects().some(
  (obj) => obj.type === 'polygon'
);

if (window.__hasCompletedFundament) {
  scratchFundament();
  return;
}
  removeGhostLine();
  removeMeasurementLabel();

  const lastLine = lines.pop();
  if (lastLine) {
    // 🧹 Remove helpers first
    if (Array.isArray(lastLine.snapHelpers)) {
      lastLine.snapHelpers.forEach(dot => {
        if (fabricCanvasGlobal.contains(dot)) {
          fabricCanvasGlobal.remove(dot);
        }
      });
    }
    if (fabricCanvasGlobal.contains(lastLine)) {
      fabricCanvasGlobal.remove(lastLine);
    }
  }

  points.pop();

  isDrawing = points.length > 0;
  isPassiveMode = !isDrawing;
  window.isPassiveMode = isPassiveMode;

  needsRender = true;
  startRenderLoop();
}


function enableFundamentInspector() {
  if (!fabricCanvasGlobal) return;

  // ❌ Prevent stacking old listeners
  fabricCanvasGlobal.off('mouse:down', inspectorHandler);
  fabricCanvasGlobal.on('mouse:down', inspectorHandler);
}

function inspectorHandler(e) {
  const obj = e.target;
  if (
    obj &&
    obj.type === 'polygon' &&
    obj.name?.startsWith('fundament')
  ) {
useGlobalCanvasStore.getState().setActiveObject(obj);
  }
}







export { cleanupDrawing };

