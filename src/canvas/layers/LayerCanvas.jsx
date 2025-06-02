// /canvas/layers/LayerCanvas.jsx

import { useEffect } from 'react';
import { fabric } from 'fabric';
import useLayerStore from './LayerStore';

const LayerCanvas = ({ fabricCanvas }) => {
  const { layers, activeLayerId, setActiveLayer } = useLayerStore();

  useEffect(() => {
    if (!fabricCanvas) return;

    window.__fabricCanvas = fabricCanvas; // Optional but good idea if not set yet

    // If no active layer, auto-select first layer
    if (!activeLayerId && layers.length > 0) {
      setActiveLayer(layers[0].id);
    }

  }, [fabricCanvas, layers, activeLayerId, setActiveLayer]);

  return null; // No visible JSX needed, it works silently behind
};

export default LayerCanvas;
