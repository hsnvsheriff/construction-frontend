export function renderGapsOnWall(canvas, wall) {
  const { start, end, gaps } = wall.metadata;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const direction = { x: dx / length, y: dy / length };

  for (let gap of gaps) {
    const baseX = start.x + direction.x * gap.positionFromStart;
    const baseY = start.y + direction.y * gap.positionFromStart;

    const perp = { x: -direction.y, y: direction.x };
    const thickness = 20;

    const rect = new fabric.Rect({
      left: baseX - gap.width / 2,
      top: baseY - gap.height,
      width: gap.width,
      height: gap.height,
      stroke: 'blue',
      fill: 'rgba(0,0,255,0.2)',
      strokeDashArray: [4, 4],
      selectable: false,
      evented: false,
    });

    canvas.add(rect);
  }
}
