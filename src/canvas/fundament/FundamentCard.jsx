import React, { useState } from 'react';
import { MdFoundation } from 'react-icons/md';

const FundamentCard = ({ fundamentData = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    name = 'fundament01',
    code = '',
    area = '0.00',
    floor = '1',
    depth = '0.00',
    thickness = '0.00',
    length = '0.00',
    width = '0.00',
    material = 'Concrete',
    insulation = 'Standard',
    fireResistance = 'Class A',
    soundproofing = 'Normal',
    waterproof = 'Yes',
    hasRebar = 'Yes',
    loadCapacity = '10t/m²',
    slope = '0%',
    temperatureResistance = '-30°C to 80°C',
    frostResistance = 'High',
    anchorType = 'Steel Bolt',
    codeCompliance = 'EN 1992',
    constructionDate = 'Not Set',
    createdBy = 'Architect AI',
    seismicRating = '8.5',
    wiFiAttenuation = 'Medium',
    uvResistance = 'High',
    color = '#999999',
    internalID = 'AUTO-GEN',
    notes = '',
    marsReady = 'No',
    aiCertified = 'Pending',
  } = fundamentData;

  return (
<div style={{ position: 'absolute', top: '80px', right: '20px', zIndex: 50 }}>
      {/* Modern Icon Button */}
  <button
  onClick={() => setIsOpen(prev => !prev)}
  style={{
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: '48px',
    height: '48px',
    cursor: 'pointer',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#333', // ✅ Ensures icon is visible
  }}
  title="Toggle Fundament Info"
>
  <MdFoundation size={24} /> {/* ✅ Force visible size */}
</button>


      {/* Expandable Info Panel */}
      {isOpen && (
        <div
          style={{
            marginTop: '12px',
            width: '320px',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(12px)',
            borderRadius: '14px',
            padding: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            color: '#222',
            fontSize: '14px',
            lineHeight: '1.6',
            overflowY: 'auto',
            maxHeight: '70vh',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Foundation Info
          </div>

          <div><strong>Name:</strong> {name}</div>
          <div><strong>Code:</strong> {code}</div>
          <div><strong>Area:</strong> {area} m²</div>
          <div><strong>Floor:</strong> {floor}</div>
          <div><strong>Depth:</strong> {depth} m</div>
          <div><strong>Thickness:</strong> {thickness} m</div>
          <div><strong>Length:</strong> {length} m</div>
          <div><strong>Width:</strong> {width} m</div>
          <div><strong>Material:</strong> {material}</div>
          <div><strong>Insulation:</strong> {insulation}</div>
          <div><strong>Fire Resistance:</strong> {fireResistance}</div>
          <div><strong>Soundproofing:</strong> {soundproofing}</div>
          <div><strong>Waterproof:</strong> {waterproof}</div>
          <div><strong>Rebar Present:</strong> {hasRebar}</div>
          <div><strong>Load Capacity:</strong> {loadCapacity}</div>
          <div><strong>Slope:</strong> {slope}</div>
          <div><strong>Temperature Res:</strong> {temperatureResistance}</div>
          <div><strong>Frost Resistance:</strong> {frostResistance}</div>
          <div><strong>Anchor Type:</strong> {anchorType}</div>
          <div><strong>Code Compliance:</strong> {codeCompliance}</div>
          <div><strong>Build Date:</strong> {constructionDate}</div>
          <div><strong>Created By:</strong> {createdBy}</div>
          <div><strong>Seismic Rating:</strong> {seismicRating}</div>
          <div><strong>Wi-Fi Attenuation:</strong> {wiFiAttenuation}</div>
          <div><strong>UV Resistance:</strong> {uvResistance}</div>
          <div><strong>Color:</strong> {color}</div>
          <div><strong>Internal ID:</strong> {internalID}</div>
          <div><strong>Notes:</strong> {notes}</div>
          <div><strong>Mars Ready:</strong> {marsReady}</div>
          <div><strong>AI Certified:</strong> {aiCertified}</div>
        </div>
      )}
    </div>
  );
};

export default FundamentCard;
