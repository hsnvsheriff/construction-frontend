// src/canvas/column/mountInputBox.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18+
import ColumnInputBox from './ColumnInputBox';
import { setIsColumnBoxOpen } from './drawColumn'; // ✅ import setter

/**
 * Dynamically mounts a column input box on screen.
 *
 * @param {number} x - Canvas X position
 * @param {number} y - Canvas Y position
 * @param {'circle' | 'rectangle'} shape - Column shape
 * @param {Function} onApply - Callback when user confirms
 * @param {Function} [onCancel] - Optional cancel callback
 * @param {number} [scale=20] - Pixels-per-meter scale
 */
export default function mountInputBox(x, y, shape, onApply, onCancel, scale = 20) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  container.style.zIndex = 9999;
  document.body.appendChild(container);

  window.__INPUT_FOCUS_LOCK = true;
  setIsColumnBoxOpen(true); // ✅ lock ghost when input is open

  const root = ReactDOM.createRoot(container);

  const cleanup = () => {
    root.unmount();
    container.remove();
    setIsColumnBoxOpen(false); // ✅ unlock ghost after cleanup
    window.__INPUT_FOCUS_LOCK = false;
  };

  root.render(
    <ColumnInputBox
      x={x}
      y={y}
      shape={shape}
      scale={scale}
      onApply={(sizeObj) => {
        onApply(sizeObj);
        cleanup(); // ✅ hide panel and clean state
      }}
      onCancel={() => {
        if (onCancel) onCancel();
        cleanup(); // ✅ cancel and clean state
      }}
    />
  );
}
