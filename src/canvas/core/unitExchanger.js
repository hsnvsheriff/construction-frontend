const PIXELS_PER_METER = 100;

export function toMeters(valueInPixels) {
  return valueInPixels / PIXELS_PER_METER;
}

export function metersToPixels(valueInMeters) {
  return valueInMeters * PIXELS_PER_METER;
}

export function convertPoints(points, pixelsPerMeter = 100) {
  return points.map(p => ({
    x: p.x / pixelsPerMeter,
    y: -p.y / pixelsPerMeter  // ✅ invert Y-axis here
  }));
}


export function convertPosition(pos) {
  return {
    x: toMeters(pos.x),
    y: toMeters(pos.y),
    z: toMeters(pos.z ?? 0)
  };
}

export function convertColumnMetadata(meta) {
  return {
    ...meta,
    diameter: meta.diameter ? toMeters(meta.diameter) : undefined,
    width: meta.width ? toMeters(meta.width) : undefined,
    height: meta.height ? toMeters(meta.height) : undefined
  };
}
