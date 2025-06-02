// /canvas/core/CoordinateTracker.jsx
import React from 'react';

const CoordinateTracker = ({ x, y }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: 10,
      left: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#fff',
      padding: '3px 8px',
      borderRadius: '6px',
      fontSize: '11px',
      fontFamily: 'monospace',
      zIndex: 1000,
      pointerEvents: 'none', // so it never blocks clicking!
    }}>
      X: {x.toFixed(2)}m | Y: {y.toFixed(2)}m
    </div>
  );
};

export default CoordinateTracker;
