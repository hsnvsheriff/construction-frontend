import React, { useEffect, useState } from "react";
import {
  FiLayers,
  FiEdit2,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import useLayerStore from "../layers/LayerStore";

const LayersCard = () => {
  const {
    layers,
    activeLayerId,
    createLayer,
    deleteLayer,
    setActiveLayer,
    renameLayer,
    reorderLayer,
    toggleVisibility,
    toggleLock,
    layerCardOpen,
    setLayerCardOpen,
  } = useLayerStore();

  const [renamingIndex, setRenamingIndex] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    window.__expandLayerPanel = () => setLayerCardOpen(true);
  }, [setLayerCardOpen]);

  const handleRename = (index) => {
    const layer = layers[index];
    if (!layer) return;
    renameLayer(layer.id, renameValue.trim() || layer.name);
    setRenamingIndex(null);
  };

  const moveLayer = (index, direction) => {
    reorderLayer(index, direction);
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        width: layerCardOpen ? "260px" : "48px",
        height: layerCardOpen ? "400px" : "48px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: layerCardOpen ? "16px" : "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        fontSize: "14px",
        color: "rgba(34,34,34,0.8)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setLayerCardOpen(!layerCardOpen)}
        style={{
          background: "none",
          border: "none",
          color: "#000",
          fontSize: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          cursor: "pointer",
          marginBottom: layerCardOpen ? "12px" : "0",
        }}
        title="Layers"
      >
        <FiLayers />
      </button>

      {/* Expanded View */}
      {layerCardOpen && (
        <>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "4px",
              marginBottom: "12px",
            }}
          >
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                style={{
                  background: activeLayerId === layer.id ? "#111" : "#f0f0f0",
                  color: activeLayerId === layer.id ? "#fff" : "#000",
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 8px",
                  marginBottom: "6px",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              >
                <div style={{ marginRight: "6px", color: activeLayerId === layer.id ? "#bbb" : "#666" }}>#{index}</div>

                <div style={{ flex: 1 }}>
                  {renamingIndex === index ? (
                    <input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRename(index)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleRename(index)
                      }
                      autoFocus
                      style={{
                        width: "100%",
                        border: "none",
                        padding: "4px",
                        borderRadius: "4px",
                        background: "inherit",
                        color: "inherit",
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => setActiveLayer(layer.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "inherit",
                        textAlign: "left",
                        width: "100%",
                        cursor: "pointer",
                      }}
                    >
                      {layer.name}
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", gap: "4px", marginLeft: "6px" }}>
                  <button onClick={() => toggleVisibility(layer.id)} style={iconBtnStyle}>
                    {layer.visible ? <FiEye /> : <FiEyeOff />}
                  </button>
                  <button onClick={() => toggleLock(layer.id)} style={iconBtnStyle}>
                    {layer.locked ? <FiLock /> : <FiUnlock />}
                  </button>
                  <button onClick={() => moveLayer(index, -1)} style={iconBtnStyle}>
                    <FiArrowUp />
                  </button>
                  <button onClick={() => moveLayer(index, 1)} style={iconBtnStyle}>
                    <FiArrowDown />
                  </button>
                  <button
                    onClick={() => {
                      setRenamingIndex(index);
                      setRenameValue(layer.name);
                    }}
                    style={iconBtnStyle}
                  >
                    <FiEdit2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ➕ ➖ Add/Delete Layer */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => createLayer()}
              style={{
                flex: 1,
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                padding: "8px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              + Add
            </button>
            <button
              onClick={() => {
                if (layers.length > 1) deleteLayer(activeLayerId);
              }}
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                padding: "8px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <FiTrash2 />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const iconBtnStyle = {
  background: "none",
  border: "none",
  color: "inherit",
  cursor: "pointer",
};

export default LayersCard;
