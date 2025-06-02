// src/canvas/core/FabricManager.js
import { renderMathGrid } from './GridRenderer'; // ✅ Correct for named export
import { useGlobalCanvasStore } from './useGlobalCanvasStore';

class FabricManager {
  constructor(canvas, mode = 'view') {
    this.canvas = canvas;
    this.mode = mode;

    this.targetZoom = 1;
    this.zoomCenter = { x: 0, y: 0 };

    this.init();

    // 💾 Make accessible from window for dynamic background toggle
    canvas.__fabricManager = this;
  }

  init() {
    this.setupGrid();
    this.setupZoom();
    this.setupPan();
  }

  setupGrid() {
    const { backgroundMode } = useGlobalCanvasStore.getState();

    // 🧹 Clear previous grid lines (if any)
    const existingGrid = this.canvas.getObjects().filter(obj => obj.__isMathBackground);
    existingGrid.forEach(obj => this.canvas.remove(obj));

    if (backgroundMode === 'math') {
renderMathGrid(this.canvas); // ✅ match the new named function
// ✅ draw math grid
    }

    this.canvas.requestRenderAll();
  }

  setupZoom() {
    const onWheel = (opt) => {
      const delta = opt.e.deltaY;
      let zoom = this.canvas.getZoom();
      zoom *= delta > 0 ? 0.95 : 1.05;
      zoom = Math.min(Math.max(zoom, 0.2), 5);

      const pointer = this.canvas.getPointer(opt.e, true);
      this.targetZoom = zoom;
      this.zoomCenter = { x: pointer.x, y: pointer.y };

      opt.e.preventDefault();
      opt.e.stopPropagation();
    };

    const animateZoom = () => {
      const currentZoom = this.canvas.getZoom();
      if (Math.abs(currentZoom - this.targetZoom) > 0.001) {
        const zoomStep = (this.targetZoom - currentZoom) * 0.2;
        this.canvas.zoomToPoint(this.zoomCenter, currentZoom + zoomStep);
        this.canvas.requestRenderAll();
      }
      requestAnimationFrame(animateZoom);
    };

    this.canvas.on('mouse:wheel', onWheel);
    animateZoom();
  }

  setupPan() {
    this.canvas.on('mouse:down', (opt) => {
      if (opt.e.button === 0) {
        this.canvas.isDragging = true;
        this.canvas.selection = false;
        this.canvas.lastPosX = opt.e.clientX;
        this.canvas.lastPosY = opt.e.clientY;
      }
    });

    this.canvas.on('mouse:move', (opt) => {
      if (this.canvas.isDragging) {
        const e = opt.e;
        const vpt = this.canvas.viewportTransform;
        vpt[4] += e.clientX - this.canvas.lastPosX;
        vpt[5] += e.clientY - this.canvas.lastPosY;

        this.canvas.requestRenderAll();
        this.canvas.lastPosX = e.clientX;
        this.canvas.lastPosY = e.clientY;
      }
    });

    this.canvas.on('mouse:up', () => {
      this.canvas.isDragging = false;
      this.canvas.selection = true;
    });
  }
}

export default FabricManager;
