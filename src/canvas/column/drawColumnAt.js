export function drawColumnAt(x, y, { pixelWidth, pixelHeight }, shape = 'rectangle') {
    const canvas = window.__fabricCanvas;
    if (!canvas) return;
  
    const column = shape === 'circle'
      ? new fabric.Circle({
          left: x,
          top: y,
          radius: pixelWidth / 2,
          fill: '#999',
          originX: 'center',
          originY: 'center',
          selectable: true,
          evented: true,
        })
      : new fabric.Rect({
          left: x - pixelWidth / 2,
          top: y - pixelHeight / 2,
          width: pixelWidth,
          height: pixelHeight,
          fill: '#999',
          originX: 'left',
          originY: 'top',
          selectable: true,
          evented: true,
        });
  
    canvas.add(column);
    canvas.setActiveObject(column);
    canvas.requestRenderAll();
  }
  