// src/canvas/core/useGlobalCanvasStore.js
import { create } from "zustand";
import { CanvasModes } from "./CanvasModes";

export const useGlobalCanvasStore = create((set) => ({
  // 🎯 Canvas Mode Control
  currentMode: CanvasModes.VIEW,
  setMode: (mode) => set({ currentMode: mode }),
backgroundMode: 'math', // or 'none'
setBackgroundMode: (mode) => set({ backgroundMode: mode }),

  // 🧭 Drawing Start Point
  startPoint: null,
  setStartPoint: (point) => set({ startPoint: point }),
  resetStartPoint: () => set({ startPoint: null }),

  // 📐 Unit System
  unit: 'meter',
  setUnit: (unit) => set({ unit }),

  // 📊 Data Mode Toggle (D Key)
  dataMode: false,
  toggleDataMode: () => set((state) => ({ dataMode: !state.dataMode })),

  // 🧲 Object Interaction
  activeObject: null,
  setActiveObject: (obj) => set({ activeObject: obj }),
}));
