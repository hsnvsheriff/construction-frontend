import React from 'react';

const FundamentListPanel = ({ fundaments, onSelect }) => {
  const canvas = window.__fabricCanvas;
  if (!canvas) return null;

  // 🎯 Only valid, attached Polygon fundaments
  const validFundaments = canvas
    .getObjects()
    .filter(obj => obj.type === 'fundament' && obj.constructor.name === 'Polygon' && canvas.contains(obj));

  // ⚡ Auto-open if one valid
  if (validFundaments.length === 1) {
    onSelect(validFundaments[0]);
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '80px',
        right: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        maxHeight: '60vh',
        overflowY: 'auto',
        zIndex: 999,
        minWidth: '240px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#111' }}>
        Select a Fundament
      </div>
      {validFundaments.map((fund, index) => (
        <div
          key={fund.name || index}
          onClick={() => {
            // Reset all highlights
            canvas.getObjects().forEach((obj) => {
              if (obj.type === 'fundament') {
                obj.set('fill', 'rgba(50,50,50,0.2)');
              }
            });

            // Highlight selected
            fund.set('fill', 'rgba(80,150,255,0.3)');
            canvas.requestRenderAll();

            onSelect(fund);
          }}
          style={{
            padding: '10px 12px',
            marginBottom: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: '#f1f1f1',
            color: '#111',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {fund.name || `fundament${index + 1}`}
        </div>
      ))}
    </div>
  );
};

export default FundamentListPanel;
