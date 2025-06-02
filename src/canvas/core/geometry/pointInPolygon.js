// src/canvas/core/geometry/pointInPolygon.js

export default function pointInPolygon(point, polygon) {
    const { x, y } = point;
    let inside = false;
  
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
  
      const intersect =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
  
      if (intersect) inside = !inside;
    }
  
    return inside;
  }
  