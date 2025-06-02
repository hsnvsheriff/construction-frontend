import { fabric } from 'fabric';

let measurementText = null;
let fabricCanvas = null;

export function createMeasurementLabel(canvas, startX, startY) {
  fabricCanvas = canvas;
  console.log('✅ Creating measurement label at', startX, startY); // DEBUG

  measurementText = new fabric.Text('', {
    left: startX,
    top: startY,
    fontSize: 16,
    fill: '#333',
    backgroundColor: 'white',
    padding: 4,
    selectable: false,
    evented: false,
    fontFamily: 'Arial',
    excludeFromHistory: true,
    excludeFromExport: true,
  });

  fabricCanvas.add(measurementText);
}


/**
 * `distance` is already converted based on unit before passed here.
 * We just display it properly.
 */
export function updateMeasurementLabel(x, y, distance, angleDegrees, unit = 'm') {
  if (!measurementText || !fabricCanvas) return;

  const unitLabel = unit === 'feet' ? 'ft' : 'm';

  measurementText.set({
    left: x + 10,
    top: y + 10,
    text: `Length: ${distance.toFixed(2)} ${unitLabel}\nAngle: ${angleDegrees.toFixed(1)}°`,
  });
  fabricCanvas.requestRenderAll();
}

export function removeMeasurementLabel() {
  if (measurementText && fabricCanvas) {
    fabricCanvas.remove(measurementText);
    measurementText = null;
    fabricCanvas = null;
  }
}
