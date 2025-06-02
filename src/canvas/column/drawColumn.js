// src/column/drawColumn.js
import { fabric } from 'fabric';
import useColumnToolStore from './useColumnToolStore';
import mountInputBox from './mountInputBox';
import useLayerStore from '../layers/LayerStore';

const FUNDAMENT_STROKE_COLOR = 'black';
const PIXELS_PER_SQUARE = 20;
const PIXELS_PER_METER = PIXELS_PER_SQUARE * 5; // 1m = 100px

let fabricCanvas = null;
let ghost = null;
let ghostLines = [];
let ghostLabels = [];
let isColumnDrawing = false;
let _isColumnBoxOpen = false;

function getIsColumnBoxOpen() {
  return _isColumnBoxOpen;
}

function setIsColumnBoxOpen(value) {
  _isColumnBoxOpen = value;
}

function startColumnDrawing(canvas, scale = PIXELS_PER_SQUARE) {
  fabricCanvas = canvas;

  useColumnToolStore.subscribe(
    (state) => state.shape,
    (shape) => {
      const all = canvas.getObjects();
      all.forEach((obj) => {
if (obj.type === 'column' && obj.data) {
  dataStore.columns.push({
    ...base,
    shape: obj.shape,
    data: obj.data
  });
}

      });
      canvas.skipTargetFind = shape !== 'edit';
      canvas.selection = shape === 'edit';
      canvas.requestRenderAll();
    }
  );

  canvas.setCursor('crosshair');
  canvas.upperCanvasEl.style.cursor = 'crosshair';

  canvas.on('mouse:move', (opt) => {
    const pointer = canvas.getPointer(opt.e);
    const { shape } = useColumnToolStore.getState();

    canvas.skipTargetFind = shape !== 'edit';
    canvas.selection = shape === 'edit';
    canvas.getObjects().forEach((obj) => {
      if (obj.type === 'column') {
        obj.set({
          selectable: shape === 'edit',
          evented: shape === 'edit',
        });
      }
    });
    canvas.requestRenderAll();

    if (shape === 'edit') {
      cleanupGhost();
      return;
    }

    if (getIsColumnBoxOpen()) return;

    if (isColumnDrawing) {
      const ghostSize = shape === 'circle' ? 0.4 * PIXELS_PER_METER : 0.4 * PIXELS_PER_METER;
      updateGhost(pointer.x, pointer.y, shape, ghostSize, scale);
    } else {
      cleanupGhost();
    }
  });

  canvas.on('mouse:down', (opt) => {
    if (window.__spaceMode) return;

    const pointer = canvas.getPointer(opt.e);
    const { shape } = useColumnToolStore.getState();
    const target = opt.target;

    if (shape === 'edit') {
      cleanupGhost();
      if (target && target.type === 'column') {
        fabricCanvas.setActiveObject(target);
        fabricCanvas.requestRenderAll();
      }
      return;
    }

    if (!isColumnDrawing) {
      isColumnDrawing = true;
      updateGhost(pointer.x, pointer.y, shape, 0.4 * PIXELS_PER_METER, scale);
      return;
    }

    const { x, y } = pointer;

    setIsColumnBoxOpen(true);

    mountInputBox(
      x, y, shape,
      (sizeObj) => {
        setIsColumnBoxOpen(false);

        let { pixelWidth, pixelHeight, widthMeters, heightMeters } = sizeObj;
        if (!heightMeters || heightMeters <= 0) heightMeters = 3;

        // Properly scaled dimensions in pixels
        pixelWidth = widthMeters * PIXELS_PER_METER;
        pixelHeight = widthMeters * PIXELS_PER_METER;

        const props = {
          left: x,
          top: y,
          originX: 'center',
          originY: 'center',
          fill: 'rgba(0, 0, 0, 0.4)',
          stroke: 'black',
          strokeWidth: 1,
          type: 'column',
          selectable: true,
          evented: true,
          metadata: {
            unit: 'm',
            underground: 2,
            ...(shape === 'circle'
              ? { diameter: widthMeters, height: heightMeters }
              : { width: widthMeters, height: heightMeters }),
          }
        };

        const shapeObj = shape === 'circle'
          ? new fabric.Circle({ ...props, radius: pixelWidth / 2 })
          : new fabric.Rect({ ...props, width: pixelWidth, height: pixelHeight });

        shapeObj.id = `column_${Date.now()}`;
        shapeObj.name = shapeObj.id;
        shapeObj.code = '';
        shapeObj.shape = shape;
        shapeObj.position = { x, y, z: 0 };
        shapeObj.dimensions = {
          width: shape === 'circle' ? widthMeters : widthMeters,
          height: heightMeters,
          depth: shape === 'circle' ? widthMeters : widthMeters
        };
        shapeObj.material = 'default';

        fabricCanvas.add(shapeObj);
        fabricCanvas.requestRenderAll();
        window.pushToUndo?.();
      },
      () => {
        setIsColumnBoxOpen(false);
        fabricCanvas.requestRenderAll();
      },
      scale
    );
  });

  console.log('✅ Column mode activated');
}

function cancelColumnDrawing() {
  isColumnDrawing = false;
  cleanupGhost();
  fabricCanvas?.requestRenderAll();
}

function stopColumnDrawing(canvas) {
  if (!canvas) return;
  canvas.off('mouse:down');
  canvas.off('mouse:move');
  cleanupGhost();
  canvas.upperCanvasEl.style.cursor = 'default';
  fabricCanvas = null;
}

function updateGhost(x, y, shape, size, scale = PIXELS_PER_SQUARE) {
  cleanupGhost();
  const { activeLayerId } = useLayerStore.getState();
  if (!activeLayerId) return;

  ghost = shape === 'circle'
    ? new fabric.Circle({
        left: x,
        top: y,
        radius: size / 2,
        originX: 'center',
        originY: 'center',
        stroke: '#666',
        fill: 'rgba(0,0,0,0.1)',
        strokeDashArray: [3, 3],
        selectable: false,
        evented: false,
        layerId: activeLayerId
      })
    : new fabric.Rect({
        left: x,
        top: y,
        width: size,
        height: size,
        originX: 'center',
        originY: 'center',
        stroke: '#666',
        fill: 'rgba(0,0,0,0.1)',
        strokeDashArray: [3, 3],
        selectable: false,
        evented: false,
        layerId: activeLayerId
      });

  fabricCanvas.add(ghost);

  const fundamentLines = fabricCanvas.getObjects().filter(obj =>
    obj.type === 'line' &&
    obj.stroke === FUNDAMENT_STROKE_COLOR &&
    obj.layerId === activeLayerId
  );

  const MAX_DISTANCE = 150;
  const offset = shape === 'circle' ? size / 2 : size / 2;

  const candidates = fundamentLines.map(line => {
    const pt = getClosestPointOnLine(x, y, line);
    const dist = Math.hypot(pt.x - x, pt.y - y);
    return { line, pt, dist };
  }).filter(c => c.dist <= MAX_DISTANCE);

  candidates.sort((a, b) => a.dist - b.dist);
  const top2 = candidates.slice(0, 2);

  top2.forEach(({ pt: closestPoint, dist }) => {
    const dx = closestPoint.x - x;
    const dy = closestPoint.y - y;
    const length = Math.max(1, dist);
    const unitX = dx / length;
    const unitY = dy / length;

    const edgeX = x + unitX * offset;
    const edgeY = y + unitY * offset;

    const lineObj = new fabric.Line([edgeX, edgeY, closestPoint.x, closestPoint.y], {
      stroke: '#ccc',
      strokeDashArray: [3, 3],
      strokeWidth: 1,
      selectable: false,
      evented: false,
      layerId: activeLayerId
    });
    ghostLines.push(lineObj);
    fabricCanvas.add(lineObj);

    const distance = Math.hypot(edgeX - closestPoint.x, edgeY - closestPoint.y) / PIXELS_PER_METER;
    const label = new fabric.Text(`${distance.toFixed(2)} m`, {
      left: ((edgeX + closestPoint.x) / 2) + (unitX * 10),
      top: ((edgeY + closestPoint.y) / 2) + (unitY * 10),
      fontSize: 12,
      fill: '#111',
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: 3,
      selectable: false,
      evented: false,
      layerId: activeLayerId
    });

    ghostLabels.push(label);
    fabricCanvas.add(label);
  });

  fabricCanvas.requestRenderAll();
}

function getClosestPointOnLine(px, py, line) {
  const { x1, y1, x2, y2 } = line;
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  const param = lenSq !== 0 ? dot / lenSq : -1;

  let xx, yy;
  if (param < 0) {
    xx = x1; yy = y1;
  } else if (param > 1) {
    xx = x2; yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  return { x: xx, y: yy };
}

function cleanupGhost() {
  if (ghost) fabricCanvas.remove(ghost);
  ghostLines.forEach(line => fabricCanvas.remove(line));
  ghostLabels.forEach(label => fabricCanvas.remove(label));
  ghost = null;
  ghostLines = [];
  ghostLabels = [];
}

export {
  cleanupGhost,
  startColumnDrawing,
  cancelColumnDrawing,
  stopColumnDrawing,
  getIsColumnBoxOpen,
  setIsColumnBoxOpen
};
