import React, { useState } from 'react';

const WindowModal = ({ wall, onClose, onConfirm }) => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(120);
  const [paddingBottom, setPaddingBottom] = useState(40);

  return (
    <div className="fixed top-1/2 left-1/2 bg-white shadow-lg p-6 z-50 rounded border border-gray-300"
         style={{ transform: 'translate(-50%, -50%)' }}>
      <h2 className="text-xl font-bold mb-2">Add Window</h2>
      <label className="block mb-2">
        Width (px): <input type="number" value={width} onChange={e => setWidth(+e.target.value)} />
      </label>
      <label className="block mb-2">
        Height (px): <input type="number" value={height} onChange={e => setHeight(+e.target.value)} />
      </label>
      <label className="block mb-4">
        Padding from Ground (px): <input type="number" value={paddingBottom} onChange={e => setPaddingBottom(+e.target.value)} />
      </label>
      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
        <button onClick={() => onConfirm({ width, height, paddingBottom })} className="bg-blue-500 text-white px-3 py-1 rounded">Add</button>
      </div>
    </div>
  );
};

export default WindowModal;
