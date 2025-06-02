import React, { useState } from "react";

const PropertiesCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "fundament01",
    thickness: "0.3",
    height: "3.0",
    material: "Reinforced Concrete",
    insulation: "Polyurethane Foam",
    floor: "1",
    floorSize: "100",
    structuralStrength: "High",
    thermalResistance: "0.35",
    acousticRating: "42 dB",
    waterproof: "Yes",
    fireResistance: "90 min",
    crewCount: "4",
    constructionTime: "120",
    estimatedCost: "4200",
    environmentalImpact: "Low",
    includesDrainage: "Yes",
    allowsSolarMount: "Yes",
    code: "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Saved", formData);
    setShowModal(false);
  };

  const resistanceScore = calculateEarthquakeResistance(formData);
  const resistanceColor = resistanceScore > 80 ? "#4CAF50" : resistanceScore > 50 ? "#FFC107" : "#F44336";

  return (
    <>
      {/* Tiny Button */}
      <div
        style={{
          position: "absolute",
          top: "90px",
          right: "20px",
          zIndex: 60,
          backgroundColor: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => setShowModal(true)}
      >
        ⚙️
      </div>

      {/* Full-Screen Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1100px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "white",
              borderRadius: "16px",
              padding: "32px",
            }}
          >
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "24px" }}>
              🏗️ Fundament Properties
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {[
                ["Name", "name"],
                ["Thickness", "thickness"],
                ["Height", "height"],
                ["Material", "material"],
                ["Insulation", "insulation"],
                ["Floor", "floor"],
                ["Floor Size (m²)", "floorSize"],
                ["Structural Strength", "structuralStrength"],
                ["Thermal Resistance", "thermalResistance"],
                ["Acoustic Rating", "acousticRating"],
                ["Waterproof", "waterproof"],
                ["Fire Resistance", "fireResistance"],
                ["Crew Count", "crewCount"],
                ["Construction Time Hrs", "constructionTime"],
                ["Estimated Cost", "estimatedCost"],
                ["Environmental Impact", "environmentalImpact"],
                ["Includes Drainage", "includesDrainage"],
                ["Allows Solar Mount", "allowsSolarMount"],
                ["Code", "code"],
              ].map(([label, key]) => (
                <div key={key} style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "14px", marginBottom: "4px" }}>{label}</label>
                  <input
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Earthquake Resistance Bar */}
            <div style={{ marginTop: "30px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                Earthquake Resistance: {resistanceScore}%
              </div>
              <div style={{ height: "12px", background: "#eee", borderRadius: "6px" }}>
                <div
                  style={{
                    width: `${resistanceScore}%`,
                    height: "100%",
                    background: resistanceColor,
                    borderRadius: "6px",
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "#ddd",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  border: "none",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  background: "#000",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  border: "none",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function calculateEarthquakeResistance(data) {
  const weightMap = {
    thickness: 1.2,
    height: -0.5,
    structuralStrength: 2.0,
    insulation: 0.5,
    waterproof: 0.5,
    fireResistance: 1.0,
    thermalResistance: 0.5,
    crewCount: -0.2,
    floorSize: -1.0,
  };

  let score = 50;

  score += parseFloat(data.thickness || 0) * weightMap.thickness;
  score += parseFloat(data.height || 0) * weightMap.height;
  score += parseFloat(data.thermalResistance || 0) * weightMap.thermalResistance;

  if (data.structuralStrength === "High") score += 15;
  if (data.waterproof === "Yes") score += 5;
  if (data.insulation) score += 2;
  if (parseInt(data.crewCount) > 5) score -= 2;
  if (parseFloat(data.floorSize) > 200) score -= 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export default PropertiesCard;
