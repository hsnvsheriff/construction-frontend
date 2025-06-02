// src/column/useColumnToolStore.js
import { create } from 'zustand';

const useColumnToolStore = create((set) => ({
  shape: 'circle',
  setShape: (shape) => set({ shape }),
}));

export default useColumnToolStore;
