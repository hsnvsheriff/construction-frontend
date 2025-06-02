import React, { useState } from "react";
import { FiEye, FiGrid } from "react-icons/fi"; // view, wall
import { useTranslation } from "react-i18next";
import { cleanupGhost } from "../column/drawColumn.js";

const ModeSwitcher = ({ mode, onModeChange }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

const modes = [
  { id: "view", label: t("modes.view"), icon: <FiEye /> },
  { id: "wall", label: t("modes.wall"), icon: <FiGrid /> },
];


  const handleSelect = (selectedMode) => {
    cleanupGhost();
    onModeChange(selectedMode);
    setOpen(false);
  };

  const current = modes.find((m) => m.id === mode) || modes[0];

  return (
    <div style={{ position: "relative", margin: "8px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "42px",
          height: "32px",
          borderRadius: "6px",
          backgroundColor: "#111",
          opacity: open ? 1 : 0.3,
          border: "1px solid #222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
          transition: "opacity 0.25s, background-color 0.25s",
          backdropFilter: "blur(4px)"
        }}
        title={current.label}
      >
        {current.icon}
      </button>

      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "0",
          minWidth: "150px",
          backgroundColor: "#111",
          border: "1px solid #333",
          borderRadius: "6px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
          overflow: "hidden",
          zIndex: 100,
          transition: "max-height 0.3s ease, opacity 0.3s ease",
          maxHeight: open ? "500px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        {open && modes.map((m) => (
          <div
            key={m.id}
            onClick={() => handleSelect(m.id)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 10px",
              cursor: "pointer",
              backgroundColor: mode === m.id ? "#222" : "transparent",
              fontSize: "13px",
              color: "#fff",
              transition: "background-color 0.25s ease",
            }}
          >
            <span style={{ marginRight: "8px", fontSize: "15px" }}>
              {m.icon}
            </span>
            {m.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeSwitcher;
