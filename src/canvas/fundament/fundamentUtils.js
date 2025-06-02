// fundamentUtils.js
// Utility functions related to fundament objects

export function calculateFundamentArea(points) {
    // Using Shoelace formula for polygon area
    let area = 0;
    const n = points.length;
  
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
  
    return Math.abs(area / 2);
  }
  
  export function isNearFirstPoint(firstPoint, currentPoint, threshold = 15) {
    const dx = firstPoint.x - currentPoint.x;
    const dy = firstPoint.y - currentPoint.y;
    return Math.sqrt(dx * dx + dy * dy) < threshold;
  }
  