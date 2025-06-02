import React, { useState, useEffect, useRef } from 'react';

export default function ColumnInputBox({ shape, onApply, onCancel, scale = 20 }) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setWidth('');
    setHeight('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [shape]);

  const handleApply = () => {
    const w = parseFloat(width);

    if (isNaN(w) || w <= 0) return;

    if (shape === 'circle') {
      const pixel = w * scale;
      onApply({
        widthMeters: w,
        heightMeters: w,
        pixelWidth: pixel,
        pixelHeight: pixel
      });
    } else {
      const h = parseFloat(height);
      if (isNaN(h) || h <= 0) return;

      onApply({
        widthMeters: w,
        heightMeters: h,
        pixelWidth: w * scale,
        pixelHeight: h * scale
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleApply();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        background: '#ffffff',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        width: '220px',
        zIndex: 2000,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6, fontSize: '14px' }}>
        {shape === 'circle' ? 'Diameter (m)' : 'Width & Height (m)'}
      </div>

      <input
        ref={inputRef}
        type="number"
        step="0.1"
        min="0.1"
        placeholder="Width"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          marginBottom: 6,
          padding: '8px',
          fontSize: '14px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />

      {shape !== 'circle' && (
        <input
          type="number"
          step="0.1"
          min="0.1"
          placeholder="Height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            marginBottom: 10,
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleApply}
          style={{
            flex: 1,
            padding: '8px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Apply
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '8px',
            background: '#eee',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
