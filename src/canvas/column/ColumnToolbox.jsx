// src/column/ColumnToolbox.jsx
import React from 'react';
import { FiCircle, FiSquare, FiEdit3 } from 'react-icons/fi';
import useColumnToolStore from './useColumnToolStore';
import { CanvasModes } from '../core/CanvasModes';

const toolboxStyle = {
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'black',
  borderRadius: '30px',
  padding: '10px 20px',
  display: 'flex',
  gap: '20px',
  zIndex: 1000,
};

const iconStyle = (active) => ({
  color: 'white',
  opacity: active ? 0.9 : 0.4,
  cursor: 'pointer',
  fontSize: '20px',
});

export default function ColumnToolbox({ mode }) {
  const { shape, setShape } = useColumnToolStore();

  if (mode !== CanvasModes.COLUMN) return null;

  return (
    <div style={toolboxStyle}>
      <FiCircle
        style={iconStyle(shape === 'circle')}
        onClick={() => setShape('circle')}
        title="Round Column"
      />
      <FiSquare
        style={iconStyle(shape === 'rectangle')}
        onClick={() => setShape('rectangle')}
        title="Rectangle Column"
      />
  <FiEdit3
  style={iconStyle(shape === 'edit')}
  onClick={() => setShape('edit')}
  title="Edit Column"
/>

    </div>
  );
}
