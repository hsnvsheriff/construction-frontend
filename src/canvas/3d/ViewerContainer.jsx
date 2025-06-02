import React from 'react';
import ThreeViewer from './ThreeDViewer';

const ViewerContainer = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.85)'
    }}>
      {/* Removed the ❌ button here */}
      <ThreeViewer onClose={onClose} />
    </div>
  );
};

export default ViewerContainer;
