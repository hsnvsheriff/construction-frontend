import React, { useState, useEffect } from "react";
import FabricCanvas from "../canvas/core/FabricCanvas";
import { CanvasModes } from "../canvas/core/CanvasModes";
import { MdFoundation } from "react-icons/md";
import FundamentDataPanel from "../canvas/fundament/FundamentDataPanel";

const DesignCanvasArea = ({ mode, setMode, activeLayer, onSelectElement }) => {
  const [zoom, setZoom] = useState(1);
  const [showList, setShowList] = useState(false);
  const [selectedFundament, setSelectedFundament] = useState(null);

  const handleIconClick = () => {
    const canvas = window.__fabricCanvas;
    if (!canvas) return;

    const fundaments = canvas.getObjects().filter(obj => obj.type === "fundament");

    if (fundaments.length === 0) {
      alert("No fundament found on canvas.");
      return;
    }

    if (fundaments.length === 1) {
      openEditor(fundaments[0]);
    } else {
      setShowList(true);
    }
  };

  const openEditor = (fundament) => {
    const areaText = window.__fabricCanvas.getObjects().find(o =>
      o.type === "text" && o.name === fundament.name
    );

    const area = parseFloat(areaText?.text?.replace(/[^\d.]/g, "") || "0");

    // Highlight selection
    window.__fabricCanvas.getObjects().forEach((obj) => {
      if (obj.type === "fundament") {
        obj.set("fill", "rgba(50,50,50,0.2)");
      }
    });
    fundament.set("fill", "rgba(80,150,255,0.3)");
    window.__fabricCanvas.requestRenderAll();

    setSelectedFundament({ fabricObject: fundament, data: fundament.data || {}, area });
    setShowList(false);
  };

  const handleSave = (newData) => {
    if (!selectedFundament) return;
    selectedFundament.fabricObject.set("data", newData);
    window.__fabricCanvas.requestRenderAll();
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <FabricCanvas
        mode={mode}
        activeLayer={activeLayer}
        onSelectElement={onSelectElement}
        setZoom={setZoom}
        canvasWidthMeters={100}
        canvasHeightMeters={100}
        scale={20}
      />

      {/* 🧱 Top-right icon under Settings */}
      {mode === CanvasModes.FUNDAMENT && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "20px",
            zIndex: 99,
          }}
        >
          <button
            onClick={handleIconClick}
            style={{
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              width: "48px",
              height: "48px",
              cursor: "pointer",
              fontSize: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
            }}
            title="Open Fundament Info"
          >
            <MdFoundation size={24} />
          </button>
        </div>
      )}

 
      {mode === CanvasModes.FUNDAMENT && <FundamentDataPanel />}

    </div>
  );
};

export default DesignCanvasArea;
