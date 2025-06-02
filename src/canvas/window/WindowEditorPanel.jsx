import { useEffect, useState } from 'react';

const WindowEditorPanel = ({ onClose }) => {
  const [windowData, setWindowData] = useState(null);

  useEffect(() => {
    if (window.__lastPlacedWindow) {
      const { windowObj } = window.__lastPlacedWindow;
      setWindowData({ ...windowObj });
    }
  }, []);

  const handleChange = (field, value) => {
    setWindowData(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }));
  };

  const applyChanges = () => {
    const { wall, windowObj } = window.__lastPlacedWindow;
    const index = wall.metadata.windows.findIndex(w => w.id === windowObj.id);
    if (index !== -1) {
      wall.metadata.windows[index] = { ...windowData };
      if (window.DataModel?.updateFromCanvas) {
        window.DataModel.updateFromCanvas(window.__fabricCanvas);
      }
    }
    onClose();
  };

  if (!windowData) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 100,
      right: 50,
      background: 'white',
      padding: 16,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: 8,
      zIndex: 1000
    }}>
      <h3>Edit Window</h3>
      <label>Width: <input value={windowData.width} onChange={e => handleChange('width', e.target.value)} /></label><br />
      <label>Height: <input value={windowData.height} onChange={e => handleChange('height', e.target.value)} /></label><br />
      <label>Padding Bottom: <input value={windowData.paddingBottom} onChange={e => handleChange('paddingBottom', e.target.value)} /></label><br />
      <button onClick={applyChanges}>Save</button>
    </div>
  );
};

export default WindowEditorPanel;
