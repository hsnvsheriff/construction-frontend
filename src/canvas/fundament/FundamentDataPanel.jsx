import React, { useState, useEffect } from "react";
import { useGlobalCanvasStore } from "../core/useGlobalCanvasStore";

const FIELD_CONFIG = [
  { key: "code", label: "Code" },
  { key: "floor", label: "Floor" },
  { key: "depth", label: "Depth (m)" },
  { key: "thickness", label: "Thickness (cm)" },
  { key: "heightTotal", label: "Total Height (m)" },
  { key: "heightAbove", label: "Height Above Ground (m)" },
  { key: "material", label: "Material" },
  { key: "insulation", label: "Insulation" },
  { key: "fireResistance", label: "Fire Resistance" },
  { key: "soundproofing", label: "Soundproofing" },
  { key: "waterproof", label: "Waterproof" },
  { key: "hasRebar", label: "Rebar" },
  { key: "loadCapacity", label: "Load Capacity" },
  { key: "slope", label: "Slope" },
  { key: "temperatureResistance", label: "Temp Resistance" },
  { key: "frostResistance", label: "Frost Resistance" },
{ key: "shvelyer", label: "Steel Channel Type" },
  { key: "armatureType", label: "Armature Type" },
  { key: "blockType", label: "Block Type" },
  { key: "notes", label: "Notes" }
];

const FundamentDataPanel = () => {
const { activeObject, setActiveObject } = useGlobalCanvasStore();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (activeObject?.type === "fundament") {
      const baseData = {};
      FIELD_CONFIG.forEach(({ key }) => {
        baseData[key] = activeObject.data?.[key] || "";
      });
      setData(baseData);
    } else {
      setData(null);
    }
  }, [activeObject]);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (activeObject && data) {
      activeObject.set("data", {
        ...activeObject.data,
        ...data
      });
      window.__fabricCanvas.requestRenderAll();
      setActiveObject(null); // ✅ Auto-close on save
    }
  };

  if (!data) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] w-full h-full bg-white/50 backdrop-blur-xl text-black p-6 overflow-y-scroll"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Fundament Data</h2>
        <button
          onClick={() => setActiveObject(null)}
          className="text-red-600 font-bold text-lg"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {FIELD_CONFIG.map(({ key, label }) => (
          <div key={key} className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">{label}</label>
            <input
              className="border border-gray-300 bg-white px-3 py-2 rounded shadow-sm"
              value={data[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSave}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition"
        >
          Save
        </button>
        <button
          onClick={() => setActiveObject(null)}
          className="bg-white border border-black text-black px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FundamentDataPanel;
