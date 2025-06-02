import React, { useState } from "react";

const FundamentEditorPanel = ({ fundament, onSave }) => {
  const [data, setData] = useState({ ...fundament.data });

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onSave(data);
  };

  const handleCancel = () => {
    // Just close the panel by clearing selectedFundament (done in parent)
    window.location.reload(); // Temporary fallback to reset
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.98)",
        zIndex: 9999,
        padding: "30px 40px",
        overflowY: "auto",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontWeight: "600" }}>Edit Fundament</h2>

      {/* Total Area */}
      <div style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "bold" }}>
        Total Area:{" "}
        <span style={{ fontWeight: "normal", color: "#444" }}>
          {fundament.area?.toFixed(2)} m²
        </span>
      </div>

      {/* Editable Fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {Object.entries(data).map(([key, value]) => {
          if (key === "area") return null;

          return (
            <div key={key}>
              <label style={{ fontWeight: "500", display: "block", marginBottom: "6px" }}>
                {key}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "40px", textAlign: "right" }}>
        <button
          onClick={handleCancel}
          style={{
            padding: "10px 16px",
            marginRight: "10px",
            borderRadius: "6px",
            backgroundColor: "#ccc",
            border: "none",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            backgroundColor: "#222",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FundamentEditorPanel;
