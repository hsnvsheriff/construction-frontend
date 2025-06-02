// src/canvas/core/Shortcuts.js

import { CanvasModes } from './CanvasModes';
import { undo } from './AbsoluteHistory';
import { useGlobalCanvasStore } from './useGlobalCanvasStore'; // ✅ Updated import

let modes = [
  CanvasModes.WALL,
  CanvasModes.WINDOW,
  CanvasModes.DOOR,
  CanvasModes.FLOOR,
  CanvasModes.FUNDAMENT
];

let currentModeIndex = 0;

export function setupShortcuts(setMode) {
  const keydownHandler = (e) => {
    const tag = document.activeElement.tagName;
    const isTyping =
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      document.activeElement.isContentEditable;

    // 🔁 Undo (Ctrl+Z or Cmd+Z)
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      const canvas = window.__fabricCanvas;
      if (canvas) undo(canvas);
      return;
    }

    // ⌨️ Tab = Switch modes, unless typing
    if (e.key === 'Tab') {
      if (isTyping) return;

      e.preventDefault();
      currentModeIndex = (currentModeIndex + 1) % modes.length;
      const newMode = modes[currentModeIndex];
      setMode(newMode);
      window.currentCanvasMode = newMode;

      const canvas = window.__fabricCanvas;
      if (canvas && typeof canvas.__modeRefresh === 'function') {
        canvas.__modeRefresh(newMode); // 🔄 Refresh mode logic
      }

      console.log('[SHORTCUT] Switched to mode:', newMode);
      return;
    }

    // ⛔ ESC = Cancel drawing
    if (e.key === 'Escape') {
      if (window.currentCanvasMode === CanvasModes.FUNDAMENT) {
        console.log('[SHORTCUT] ESC pressed: Cancel fundament drawing.');
        if (typeof window.__cancelCurrentDrawing === 'function') {
          window.__cancelCurrentDrawing();
          window.__setPassiveMode?.(true);
        }
      }
    }

    // 🧠 D = Toggle Data Mode
    if (e.key.toLowerCase() === 'd') {
      useGlobalCanvasStore.getState().toggleDataMode(); // ✅ Updated
      console.log('[SHORTCUT] Data mode toggled.');

      const canvas = window.__fabricCanvas;
      if (canvas && window.__hoverTooltip) {
        canvas.remove(window.__hoverTooltip);
        window.__hoverTooltip = null;
        canvas.requestRenderAll();
      }

      return;
    }
  };

  window.addEventListener('keydown', keydownHandler);

  return () => {
    window.removeEventListener('keydown', keydownHandler);
  };
}
