// src/canvas/core/useCanvasStore.js
import create from "zustand"; // ✅ CommonJS-compatible default import
import { CanvasModes } from "./CanvasModes";


export const useCanvasStore = create((set) => ({
  currentMode: CanvasModes.VIEW,
  setMode: (mode) => set({ currentMode: mode }),

  startPoint: null,
  setStartPoint: (point) => set({ startPoint: point }),
  resetStartPoint: () => set({ startPoint: null }),
}));
