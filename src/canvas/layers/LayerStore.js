import { create } from 'zustand';
import { nanoid } from 'nanoid';

const useLayerStore = create((set, get) => ({
  // 🔘 Layer state
  layers: [
    {
      id: nanoid(),
      name: "Layer 1",
      visible: true,
      locked: false,
    }
  ],
  activeLayerId: null,

  // 🔘 UI toggle for expanding LayerCard
  layerCardOpen: false,
  setLayerCardOpen: (isOpen) => set({ layerCardOpen: isOpen }),

  // ➕ Create Layer
  createLayer: () => {
    const id = nanoid();
    const newLayer = {
      id,
      name: `Layer ${get().layers.length + 1}`,
      visible: true,
      locked: false,
    };

    set((state) => ({
      layers: [...state.layers, newLayer],
      activeLayerId: id,
    }));
  },

  // ❌ Delete Layer
  deleteLayer: (layerId) => {
    const canvas = window.__fabricCanvas;
    const updatedLayers = get().layers.filter(l => l.id !== layerId);

    if (canvas) {
      const toRemove = canvas.getObjects().filter(obj => obj.layerId === layerId);
      toRemove.forEach(obj => canvas.remove(obj));
      canvas.requestRenderAll();
    }

    set({
      layers: updatedLayers,
      activeLayerId: updatedLayers.length > 0 ? updatedLayers[0].id : null
    });
  },

  // ✏️ Rename Layer
  renameLayer: (layerId, newName) => {
    set((state) => ({
      layers: state.layers.map(layer =>
        layer.id === layerId ? { ...layer, name: newName } : layer
      )
    }));
  },

  // 🔄 Reorder Layers
  reorderLayer: (index, direction) => {
    set((state) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= state.layers.length) return {};

      const updated = [...state.layers];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return { layers: updated };
    });
  },

  // 🎯 Set Active
  setActiveLayer: (layerId) => {
    set({ activeLayerId: layerId });
  },

  // 👁 Toggle Visibility
  toggleVisibility: (layerId) => {
    set((state) => {
      const updatedLayers = state.layers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      );

      const canvas = window.__fabricCanvas;
      if (canvas) {
        canvas.getObjects().forEach(obj => {
          if (obj.layerId === layerId) {
            obj.visible = updatedLayers.find(l => l.id === layerId).visible;
          }
        });
        canvas.requestRenderAll();
      }

      return { layers: updatedLayers };
    });
  },

  // 🔒 Toggle Lock
  toggleLock: (layerId) => {
    set((state) => {
      const updatedLayers = state.layers.map(layer =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      );

      const canvas = window.__fabricCanvas;
      if (canvas) {
        canvas.getObjects().forEach(obj => {
          if (obj.layerId === layerId) {
            obj.selectable = !updatedLayers.find(l => l.id === layerId).locked;
          }
        });
        canvas.requestRenderAll();
      }

      return { layers: updatedLayers };
    });
  }
}));

export default useLayerStore;
