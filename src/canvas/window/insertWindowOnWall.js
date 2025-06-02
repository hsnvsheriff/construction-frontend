export function insertWindowOnWall(wall, { width, height, paddingBottom }) {
  const wallLength = wall.metadata.length * 100; // in px
  const positionFromStart = wallLength / 2 - width / 2;

  const gap = {
    id: `gap_${Date.now()}`,
    type: 'window',
    width,
    height,
    paddingBottom,
    positionFromStart,
    metadata: {}
  };

  wall.metadata.gaps.push(gap);
}
