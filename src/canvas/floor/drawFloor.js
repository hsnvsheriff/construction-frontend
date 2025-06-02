import { distanceBetweenPoints } from './floorUtils';

let floorPoints = [];
let tempLines = [];

export function initializeFloorDrawing(canvas) {
  clearPreviousFloorDrawing(canvas);

  const onClick = (opt) => {
    const pointer = canvas.getPointer(opt.e);
    const newPoint = { x: pointer.x, y: pointer.y };

    if (floorPoints.length > 0 && distanceBetweenPoints(newPoint, floorPoints[0]) < 10) {
      // Close shape
      createFloorPolygon(canvas);
      canvas.off('mouse:down', onClick);
      return;
    }

    floorPoints.push(newPoint);

    if (floorPoints.length > 1) {
      const line = new fabric.Line([
        floorPoints[floorPoints.length - 2].x,
        floorPoints[floorPoints.length - 2].y,
        newPoint.x,
        newPoint.y
      ], {
        stroke: 'black',
        selectable: false,
        evented: false,
      });
      tempLines.push(line);
      canvas.add(line);
    }
  };

  canvas.on('mouse:down', onClick);
}

function createFloorPolygon(canvas) {
  const floor = new fabric.Polygon(floorPoints, {
    fill: '#cccccc',
    stroke: 'black',
    strokeWidth: 2,
    selectable: true,
  });
  clearPreviousFloorDrawing(canvas);
  canvas.add(floor);
}

function clearPreviousFloorDrawing(canvas) {
  floorPoints = [];
  tempLines.forEach(line => canvas.remove(line));
  tempLines = [];
}
