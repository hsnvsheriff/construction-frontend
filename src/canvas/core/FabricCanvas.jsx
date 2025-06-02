import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { CanvasModes } from './CanvasModes';
import FabricManager from './FabricManager';
import LayerCanvas from '../layers/LayerCanvas';
import CoordinateTracker from './CoordinateTracker';
import {
  startFundamentDrawing,
  stopFundamentDrawing,
  cancelCurrentDrawing,
  localUndoInFundamentMode
} from '../fundament/drawFundament';
import { startWallDrawing, stopWallDrawing } from '../wall/drawWall';
import useLayerStore from '../layers/LayerStore';
import { startColumnDrawing, cancelColumnDrawing } from '../column/drawColumn';
import { cleanupGhost } from '../column/drawColumn.js';
import { restoreCanvasFromDataModel } from '../core/DataRestorer';

// ✅ ADD THIS PROP: 👇
const FabricCanvas = ({ mode, canvasWidthMeters = 100, canvasHeightMeters = 100, scale = 20, onWallClick }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const modeRef = useRef(mode);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const currentCursorRef = useRef(null);

  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const { setActiveLayer } = useLayerStore();

  let dictatorMode = false;
  window.__dictatorMode = dictatorMode;

  let spaceMode = false;
  window.__spaceMode = spaceMode;

  let isPassiveMode = false;
  window.isPassiveMode = isPassiveMode;

  window.__setPassiveMode = (v) => {
    isPassiveMode = v;
    window.isPassiveMode = v;
  };

  const updateCursor = (newCursor) => {
    if (currentCursorRef.current !== newCursor) {
      currentCursorRef.current = newCursor;
      fabricRef.current?.setCursor(newCursor);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    fabric.Object.prototype.objectCaching = false;
    fabric.Object.prototype.statefullCache = false;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: 'white',
      selection: false,
    });

    fabricCanvas.setWidth(window.innerWidth);
    fabricCanvas.setHeight(window.innerHeight);
    fabricCanvas.calcOffset();

    fabricRef.current = fabricCanvas;
    window.__fabricCanvas = fabricCanvas;
    setIsCanvasReady(true);

    new FabricManager(fabricCanvas, mode, canvasWidthMeters, canvasHeightMeters, scale);

    const { layers, activeLayerId } = useLayerStore.getState();
    if (!activeLayerId && layers.length > 0) {
      setActiveLayer(layers[0].id);
    }

    const handleKeyDown = (e) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (modeRef.current === CanvasModes.FUNDAMENT) {
          localUndoInFundamentMode();
          window.__setPassiveMode(true);
        } else {
          undo(canvas);
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo(canvas);
      }

      if (e.key === 'Escape') {
        if (modeRef.current === CanvasModes.FUNDAMENT) {
          cancelCurrentDrawing();
          window.__setPassiveMode(true);
        }
      }

      if (e.key === 'Shift') {
        dictatorMode = true;
        window.__dictatorMode = true;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        spaceMode = true;
        window.__spaceMode = true;
        updateCursor('grab');
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        dictatorMode = false;
        window.__dictatorMode = false;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        spaceMode = false;
        window.__spaceMode = false;
        const fallbackCursor = modeRef.current === CanvasModes.FUNDAMENT ? 'crosshair' : 'default';
        updateCursor(fallbackCursor);
      }
    };

    const handleRightClick = (e) => {
      if (e.button === 2) {
        const canvas = fabricRef.current;
        if (!canvas) return;

        if (modeRef.current === CanvasModes.FUNDAMENT) {
          cancelCurrentDrawing();
          window.__setPassiveMode(true);
          canvas.requestRenderAll();
        }

        if (modeRef.current === CanvasModes.COLUMN) {
          cancelColumnDrawing();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleRightClick);

    const handleResize = () => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      canvas.setWidth(window.innerWidth);
      canvas.setHeight(window.innerHeight);
      canvas.calcOffset();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleRightClick);
      window.removeEventListener('resize', handleResize);
      fabricCanvas.dispose();
    };
  }, [canvasWidthMeters, canvasHeightMeters, scale, setActiveLayer]);

  useEffect(() => {
    if (!isCanvasReady) return;

    const canvas = fabricRef.current;
    if (!canvas) return;

    const id = window.location.pathname.split('/').pop();
    const globalCache = window.__projectCache || {};
    const cached = sessionStorage.getItem(`designData-${id}`);

    if (cached) {
      restoreCanvasFromDataModel(canvas, JSON.parse(cached));
      console.log("[FabricCanvas] Restored from sessionStorage ✅");
    } else if (globalCache[id]) {
      restoreCanvasFromDataModel(canvas, globalCache[id]);
      console.log("[FabricCanvas] Restored from global cache ✅");
    } else if (window.__lastProjectData) {
      restoreCanvasFromDataModel(canvas, window.__lastProjectData);
      console.log("[FabricCanvas] Restored from volatile memory ✅");
    } else {
    }
  }, [isCanvasReady]);
  
  useEffect(() => {
    const fabricCanvas = fabricRef.current;
    if (!fabricCanvas) return;

    modeRef.current = mode;

    fabricCanvas.off('mouse:down');
    fabricCanvas.off('mouse:move');
    fabricCanvas.off('mouse:up');
    fabricCanvas.off('mouse:over');
    fabricCanvas.off('mouse:out');

    cleanupGhost();
    stopFundamentDrawing(fabricCanvas);
    stopWallDrawing?.(fabricCanvas);
    if (fabricCanvas.__cleanupColumn) fabricCanvas.__cleanupColumn();

    fabricCanvas.selection = false;
    fabricCanvas.skipTargetFind = false;

    fabricCanvas.getObjects().forEach((obj) => {
      if (obj && typeof obj.set === 'function' && obj.type === 'fundament') {
        obj.set('opacity', mode === CanvasModes.FUNDAMENT ? 1 : 0.6);
      }
    });
    fabricCanvas.requestRenderAll();

    fabricCanvas.on('mouse:over', (opt) => {
      const target = opt.target;
      if (!target || !target.type) return;

      if (window.__hoverTooltip) {
        fabricCanvas.remove(window.__hoverTooltip);
        window.__hoverTooltip = null;
      }

      const pointer = fabricCanvas.getPointer(opt.e);
      const tooltip = new fabric.Text(target.type, {
        left: pointer.x + 10,
        top: pointer.y - 20,
        fontSize: 12,
        fill: '#333',
        backgroundColor: 'rgba(255,255,255,0.85)',
        padding: 4,
        selectable: false,
        evented: false,
      });

      fabricCanvas.add(tooltip);
      window.__hoverTooltip = tooltip;
      fabricCanvas.requestRenderAll();
    });

    fabricCanvas.on('mouse:out', () => {
      if (window.__hoverTooltip) {
        fabricCanvas.remove(window.__hoverTooltip);
        window.__hoverTooltip = null;
        fabricCanvas.requestRenderAll();
      }
    });

    if (mode === CanvasModes.FUNDAMENT) {
      startFundamentDrawing(fabricCanvas, scale);
    } else if (mode === CanvasModes.COLUMN) {
      startColumnDrawing(fabricCanvas, scale);
    } else if (mode === CanvasModes.WALL) {
      startWallDrawing(fabricCanvas, scale);
    }

    // ✅ WINDOW mode: enable wall click only
    if (mode === CanvasModes.WINDOW) {
      fabricCanvas.on('mouse:down', (event) => {
        const target = event.target;
        if (target?.type === 'line' && target?.metadata?.type === 'wall') {
          onWallClick?.(target); // Trigger modal
        }
      });
    }

    // Drag-pan logic
    fabricCanvas.on('mouse:down', (opt) => {
      if (window.__spaceMode && opt.e.button === 0) {
        isDraggingRef.current = true;
        lastPosRef.current = { x: opt.e.clientX, y: opt.e.clientY };
        updateCursor('grab');
      }
    });

    fabricCanvas.on('mouse:move', (opt) => {
      if (window.__spaceMode && isDraggingRef.current) {
        const dx = opt.e.clientX - lastPosRef.current.x;
        const dy = opt.e.clientY - lastPosRef.current.y;
        fabricCanvas.relativePan({ x: dx, y: dy });
        lastPosRef.current = { x: opt.e.clientX, y: opt.e.clientY };
      }
    });

    fabricCanvas.on('mouse:up', () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        const fallback =
          window.__spaceMode ? 'grab'
          : mode === CanvasModes.FUNDAMENT ? 'crosshair'
          : 'default';
        updateCursor(fallback);
      }
    });
  }, [mode, scale]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const canvas = fabricRef.current;
      if (!canvas || modeRef.current !== CanvasModes.COLUMN) return;

      const active = canvas.getActiveObject();
      if (!active) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        active.clone((cloned) => {
          cloned.set({
            left: active.left + 20,
            top: active.top + 20,
            evented: true,
            selectable: true,
          });
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.requestRenderAll();
        });
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        canvas.remove(active);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, scale]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} onContextMenu={(e) => e.preventDefault()}>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ width: '100%', height: '100%', outline: 'none' }}
      />
      {isCanvasReady && fabricRef.current && (
        <LayerCanvas fabricCanvas={fabricRef.current} />
      )}
      <CoordinateTracker x={mouseX} y={mouseY} />
    </div>
  );
};

export default FabricCanvas;
