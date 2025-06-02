// ✅ At top:
import { fabric } from 'fabric';
import { renderMathGrid } from './GridRenderer'; // ✅ Adjust if needed

export function restoreCanvasFromDataModel(canvas, dataStore) {
  console.log("[Restorer] CALLED with dataStore:", dataStore);

  if (!canvas || !dataStore) {
    console.warn("[Restorer] Missing canvas or data ❌", { canvas, dataStore });
    return;
  }

  canvas.clear();

  // 🧱 Restore walls
  dataStore.walls?.forEach(w => {
    const start = w.metadata?.start;
    const end = w.metadata?.end;
    if (!start || !end) return;

    const wall = new fabric.Line([start.x, start.y, end.x, end.y], {
      stroke: '#222',
      strokeWidth: 2,
      selectable: true,
      evented: true,
      type: 'wall',
      metadata: w.metadata,
      name: w.name || '',
      code: w.code || '',
      layerId: w.layerId || '',
    });

    canvas.add(wall);
  });

  // 🟫 Restore floor polygon with area and material
  dataStore.floors?.forEach(floor => {
    const points = floor.points;
    if (!points || points.length < 3) return;

    const polygon = new fabric.Polygon(points, {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      name: floor.name || `wallroom_${Date.now()}`,
      type: 'polygon',
      tileSizeX: typeof floor.tileSizeX === 'number' ? floor.tileSizeX : 1,
tileSizeY: typeof floor.tileSizeY === 'number' ? floor.tileSizeY : 1,

      userData: {
        type: 'floor',
        id: floor.id,
        name: floor.name,
        tileSizeX: typeof floor.tileSizeX === 'number' ? floor.tileSizeX : 1,
tileSizeY: typeof floor.tileSizeY === 'number' ? floor.tileSizeY : 1,

        material: {
          ...(floor.material || {}),
          previewUrl: floor.material?.previewUrl || floor.userData?.material?.previewUrl || null
        }
      }
    });

    polygon.originalPoints = points;

    // ✅ Apply material visually if exists
    const textureUrl = polygon.userData.material?.previewUrl;
    if (textureUrl) {
      fabric.Image.fromURL(textureUrl, (img) => {
        const patternSourceCanvas = document.createElement('canvas');
        const ctx = patternSourceCanvas.getContext('2d');
        patternSourceCanvas.width = 100;
        patternSourceCanvas.height = 100;
        ctx.drawImage(img.getElement(), 0, 0, 100, 100);

        const pattern = new fabric.Pattern({
          source: patternSourceCanvas,
          repeat: 'repeat',
        });

        polygon.set('fill', pattern);
        canvas.requestRenderAll();
      }, { crossOrigin: 'Anonymous' });
    } else {
      polygon.set('fill', 'rgba(150, 150, 150, 0.1)');
    }

    canvas.add(polygon);

    // 🧠 Add area label
    const center = getPolygonCenter(points);
    const scale = 100; // 100px = 1m
    const area = calculatePolygonArea(points) / (scale * scale);

    const areaText = new fabric.Text(`${area.toFixed(2)} m²`, {
      left: center.x,
      top: center.y,
      fontSize: 18,
      fill: 'black',
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center',
      name: polygon.name // to re-link with polygon
    });

    canvas.add(areaText);
  });

  canvas.requestRenderAll();
  canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));
  renderMathGrid(canvas); // ✅ reapply grid

  console.log("[Restorer] Canvas restored and rendered ✅");
}

function getPolygonCenter(points) {
  let x = 0, y = 0;
  points.forEach(p => {
    x += p.x;
    y += p.y;
  });
  return { x: x / points.length, y: y / points.length };
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
