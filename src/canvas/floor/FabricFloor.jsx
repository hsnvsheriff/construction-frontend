import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useCanvasState } from '../core/useCanvasState';
import { initializeFloorDrawing } from './drawFloor';

const FabricFloor = () => {
  const { canvas, mode } = useCanvasState();

  useEffect(() => {
    if (canvas && mode === 'floor') {
      initializeFloorDrawing(canvas);
    }
  }, [canvas, mode]);

  return null;
};

export default FabricFloor;
