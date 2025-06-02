
import { convertPosition, convertColumnMetadata } from '../core/unitExchanger';

const PIXELS_PER_METER = 100;
const CANVAS_WIDTH_PX = 10000;
const CANVAS_HEIGHT_PX = 10000;

const dataStore = {
  walls: [],
  columns: [],
  doors: [],
  windows: [],
  floors: [] // Closed wall loops for 3D floors
};

function pixelToMeterWithOffset(px, py) {
  const offsetX = CANVAS_WIDTH_PX / 2;
  const offsetY = CANVAS_HEIGHT_PX / 2;
  return {
    x: (px - offsetX) / PIXELS_PER_METER,
    y: 0,
    z: -(py - offsetY) / PIXELS_PER_METER,
  };
}

function getPolygon3DCenter(points) {
  let area = 0;
  let cx = 0;
  let cz = 0;

  const n = points.length;
  for (let i = 0; i < n - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const cross = (p1.x * p2.z) - (p2.x * p1.z);
    area += cross;
    cx += (p1.x + p2.x) * cross;
    cz += (p1.z + p2.z) * cross;
  }

  area *= 0.5;
  cx /= (6 * area);
  cz /= (6 * area);

  return { x: cx, z: cz };
}


function convertPointsToMeters(points) {
  const offsetX = CANVAS_WIDTH_PX / 2;
  const offsetY = CANVAS_HEIGHT_PX / 2;

  return points.map(p => ({
    x: (p.x - offsetX) / PIXELS_PER_METER,
    z: -(p.y - offsetY) / PIXELS_PER_METER
  }));
}

function centerAllAround(points) {
  const meterPoints = points.map(p => {
    const converted = pixelToMeterWithOffset(p.x, p.y);
    return { x: converted.x, z: converted.z };
  });

  const center = getPolygon3DCenter(meterPoints);

  const centered = meterPoints.map(p => ({
    x: p.x - center.x,
    y: 0,
    z: p.z - center.z
  }));

  return { centered, center };
}


function clear() {
  dataStore.walls = [];
  dataStore.columns = [];
  dataStore.doors = [];
  dataStore.windows = [];
  dataStore.floors = [];
}



function updateFromCanvas(canvas) {
  clear();
  if (!canvas) return;

  const objects = canvas.getObjects();

  objects.forEach((obj) => {
    const center = obj.getCenterPoint?.() || { x: obj.left || 0, y: obj.top || 0 };

    const base = {
      id: obj.id || obj.name || '',
      name: obj.name || '',
      code: obj.code || '',
      layerId: obj.layerId || '',
      position: convertPosition(center),
    };

    if (obj.type === 'wall' && obj.metadata) {
  dataStore.walls.push({
    ...base,
    type: 'wall',
    layerId: obj.layerId,
    metadata: {
  ...obj.metadata,
material: {
  ...(obj.userData?.material || {}),
  color: obj.userData?.material?.color || obj.userData?.colorCode || null,
},
  tileSizeX: obj.userData?.tileSizeX ?? 1,
  tileSizeY: obj.userData?.tileSizeY ?? 1,
  color: obj.userData?.material?.color || null // ✅ New line: save wall color
}

  });
}

    

    if (obj.type === 'column' && obj.metadata) {
      dataStore.columns.push({
        ...base,
        type: 'column',
        shape: obj.shape,
        metadata: convertColumnMetadata(obj.metadata),
      });
    }

    if (obj.type === 'door' && obj.metadata) {
      dataStore.doors.push({
        ...base,
        type: 'door',
        metadata: obj.metadata,
      });
    }

    if (obj.type === 'window' && obj.metadata) {
      dataStore.windows.push({
        ...base,
        type: 'window',
        metadata: obj.metadata,
      });
    }

    if (obj.type === 'polygon' && obj.name?.startsWith('wallroom')) {
      const rawPoints = obj.points || obj.originalPoints || [];
      const tileSizeX = obj.tileSizeX || obj.userData?.tileSizeX || null;
      const tileSizeY = obj.tileSizeY || obj.userData?.tileSizeY || null;
      const material = obj.userData?.material ?? null;

      dataStore.floors.push({
        ...base,
        type: 'floor',
        points: rawPoints,
        tileSizeX,
        tileSizeY,
        material,
        userData: {
          ...(obj.userData || {}),
          tileSizeX,
          tileSizeY,
          material,
        },
      });

    }
  });
}






function addWallAndFloorToDataModel(points, layerId = 'Layer 0') {
  if (!Array.isArray(points) || points.length < 3) return;

  const wallId = `wall_${Date.now()}`;
  const floorId = `wallroom_${Date.now()}`;
  const model = window.DataModel?.store;
  if (!model) return;

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];

    model.walls.push({
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

  model.floors.push({
    id: floorId,
    name: floorId,
    code: '',
    type: 'floor',
    layerId,
    points: points.map(p => ({ x: p.x, y: p.y }))
  });
}

function generateFloorFromWalls(walls) {
  if (!walls || walls.length === 0) return [];

  // Build adjacency map
  const adjacency = new Map();

  walls.forEach(w => {
    const startKey = `${w.metadata.start.x},${w.metadata.start.y}`;
    const endKey = `${w.metadata.end.x},${w.metadata.end.y}`;
    adjacency.set(startKey, w.metadata.end);
  });

  // Walk the loop
  const visited = new Set();
  const loop = [];
  let current = walls[0]?.metadata?.start;
  if (!current) return [];

  let safetyCount = 0;
  while (current && safetyCount < 500) {
    const key = `${current.x},${current.y}`;
    if (visited.has(key)) break;

    visited.add(key);
    loop.push({ x: current.x, y: current.y });

    const next = adjacency.get(key);
    if (!next) break;

    current = next;
    safetyCount++;

    // Stop if loop closes
    const first = loop[0];
    if (loop.length > 2 && next.x === first.x && next.y === first.y) {
      loop.push({ x: next.x, y: next.y });
      break;
    }
  }

  return loop;
}



function computeSharedCenterFromWalls(walls) {
  const allPoints = walls.flatMap(w => [w.metadata.start, w.metadata.end]);
  const converted = allPoints.map(p => pixelToMeterWithOffset(p.x, p.y));
  const center = getPolygon3DCenter(converted);
  return center;
}




function getFor3D() {
  const rawFloorPoints = generateFloorFromWalls(dataStore.walls);


  const sharedCenter = computeSharedCenterFromWalls(dataStore.walls);

  let centeredFloors = [];

  if (rawFloorPoints.length >= 3) {
    const meterPoints = rawFloorPoints.map(p => pixelToMeterWithOffset(p.x, p.y));
    const centered = meterPoints.map(p => ({
      x: p.x - sharedCenter.x,
      y: 0,
      z: -(p.z - sharedCenter.z)
    }));

    const floorRef = dataStore.floors[0];

    // 💡 Safely extract tile size from root or userData, fallback to 1
    const tileSizeX = floorRef?.userData?.tileSizeX ?? floorRef?.tileSizeX ?? 1;
    const tileSizeY = floorRef?.userData?.tileSizeY ?? floorRef?.tileSizeY ?? 1;
const materialInfo =
  floorRef?.material ??
  floorRef?.userData?.material ??
  null;
  console.log("🎯 FloorRef:", floorRef);
console.log("🎯 material from root:", floorRef?.material);
console.log("🎯 material from userData:", floorRef?.userData?.material);

    centeredFloors = [{
      id: floorRef?.id || 'floor_1',
      name: floorRef?.name || 'GeneratedFloor',
      type: 'floor',
      points: centered,
      tileSizeX,
      tileSizeY,
      material: materialInfo,
      area: floorRef?.area || null,
      userData: {
        ...(floorRef?.userData || {}),
        tileSizeX,
        tileSizeY,
        material: materialInfo,
      }
    }];
  } else {
    console.warn("⚠️ getFor3D: No valid floor points generated from walls.");
  }

  const centeredWalls = dataStore.walls.map((w, index) => {
    const start = pixelToMeterWithOffset(w.metadata.start.x, w.metadata.start.y);
    const end = pixelToMeterWithOffset(w.metadata.end.x, w.metadata.end.y);
    const pos = pixelToMeterWithOffset(w.position.x, w.position.y);

    return {
      ...w,
      id: w.id || `wall_${Date.now()}_${index}`,
      name: w.name || `Wall ${index + 1}`,
      position: {
        x: pos.x - sharedCenter.x,
        y: 0,
        z: pos.z - sharedCenter.z
      },
      metadata: {
        ...w.metadata,
        id: w.metadata.id || `wall_${Date.now()}_${index}`,
        name: w.metadata.name || `Wall ${index + 1}`,
        start: {
          x: start.x - sharedCenter.x,
          y: 0,
          z: start.z - sharedCenter.z
        },
        end: {
          x: end.x - sharedCenter.x,
          y: 0,
          z: end.z - sharedCenter.z
        }
      }
    };
  });

  const centeredColumns = dataStore.columns.map((col, i) => {
    const pos = pixelToMeterWithOffset(col.position.x, col.position.y);
    return {
      ...col,
      id: col.id || `column_${Date.now()}_${i}`,
      height: col.metadata?.height || 3,
      width: col.metadata?.width || 0.2,
      position: {
        x: pos.x - sharedCenter.x,
        y: 0,
        z: pos.z - sharedCenter.z
      }
    };
  });

  const centeredDoors = dataStore.doors.map((d, i) => {
    const pos = pixelToMeterWithOffset(d.position.x, d.position.y);
    return {
      ...d,
      id: d.id || `door_${Date.now()}_${i}`,
      position: {
        x: pos.x - sharedCenter.x,
        y: 0,
        z: pos.z - sharedCenter.z
      }
    };
  });

  const centeredWindows = dataStore.windows.map((w, i) => {
    const pos = pixelToMeterWithOffset(w.position.x, w.position.y);
    return {
      ...w,
      id: w.id || `window_${Date.now()}_${i}`,
      position: {
        x: pos.x - sharedCenter.x,
        y: 0,
        z: pos.z - sharedCenter.z
      }
    };
  });

  return {
    walls: centeredWalls,
    floors: centeredFloors,
    columns: centeredColumns,
    doors: centeredDoors,
    windows: centeredWindows
  };
}

function setFromSanitized(data) {
  clear(); // Clear old data first

  dataStore.walls = data.walls || [];
  dataStore.columns = data.columns || [];
  dataStore.doors = data.doors || [];
  dataStore.windows = data.windows || [];
  dataStore.floors = data.floors || [];
}






function getSanitized() {
  return { ...dataStore };
}

export default {
  updateFromCanvas,
  getFor3D,
  getSanitized,
  setFromSanitized, // 👈 Add this line
  clear,
  store: dataStore
};
