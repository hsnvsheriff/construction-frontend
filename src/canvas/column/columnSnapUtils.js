const columnSnapPoints = [];

export function addColumnSnapPoint(x, y) {
  columnSnapPoints.push({ x, y });
}

export function getColumnSnapPoint(x, y, threshold = 15) {
  for (const point of columnSnapPoints) {
    const dist = Math.hypot(point.x - x, point.y - y);
    if (dist < threshold) return point;
  }
  return null;
}

export function clearColumnSnapPoints() {
  columnSnapPoints.length = 0;
}
