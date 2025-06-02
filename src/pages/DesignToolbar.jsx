import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { useGlobalCanvasStore } from "../canvas/core/useGlobalCanvasStore";
import DataModel from "../canvas/core/DataModel";
import axios from "@/lib/axios";
import { tryRestoreCanvas } from "@/pages/DataFetcher";

// ✅ FIX: Add this
import { useTranslation } from "react-i18next";

const DesignToolbar = ({ onOpen3D }) => {
  const { t } = useTranslation();
  const unit = useGlobalCanvasStore((state) => state.unit);
  const setUnit = useGlobalCanvasStore((state) => state.setUnit);
  const backgroundMode = useGlobalCanvasStore((state) => state.backgroundMode);
  const setBackgroundMode = useGlobalCanvasStore((state) => state.setBackgroundMode);

  const [showSettings, setShowSettings] = useState(false);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const settingsRef = useRef(null);

  const navigate = useNavigate();
  const { id: projectId } = useParams();

  const toggleUnit = () => {
    const newUnit = unit === "meters" ? "feet" : "meters";
    setUnit(newUnit);
    window.__unit = newUnit === "feet" ? "feet" : "meter";
  };

  const toggleBackground = () => {
    const newMode = backgroundMode === "math" ? "none" : "math";
    setBackgroundMode(newMode);

    const canvas = window.__fabricCanvas;
    if (canvas && canvas.__fabricManager?.setupGrid) {
      canvas.__fabricManager.setupGrid();
    }
  };

  const handleClickOutside = (event) => {
    if (settingsRef.current && !settingsRef.current.contains(event.target)) {
      setShowSettings(false);
    }
  };

  useEffect(() => {
    tryRestoreCanvas(projectId);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResetCanvas = () => {
    const canvas = window.__fabricCanvas;
    if (!canvas) return;

    canvas.clear();
    DataModel.reset?.(); // if you have a reset method
    sessionStorage.removeItem(`designData-${projectId}`);
    window.__lastProjectData = null;

    if (canvas.__fabricManager?.setupGrid) {
      canvas.__fabricManager.setupGrid();
    }

    console.log("🧼 Canvas reset.");
  };

  const handleOpenDataPanel = () => {
    const canvas = window.__fabricCanvas;
    if (!canvas) return;

    const objects = canvas.getObjects();
    if (objects.length === 0) {
      alert(t("designToolbar.canvasEmpty"));
      return;
    }

    DataModel.updateFromCanvas(canvas);
    const data = DataModel.getSanitized();
    sessionStorage.setItem(`designData-${projectId}`, JSON.stringify(data));
    window.__lastProjectData = data;

    setShowDataPanel(true);
  };

  const handleQuickExit = async () => {
    const canvas = window.__fabricCanvas;
    if (!canvas || canvas.getObjects().length === 0) {
      alert(t("designToolbar.nothingToSave"));
      return;
    }

    DataModel.updateFromCanvas(canvas);
    const data = DataModel.getSanitized();

    try {
      await axios.put(`/api/designs/${projectId}`, { data });
      console.log("✅ Saved design to MongoDB");
    } catch (err) {
      console.error("❌ Failed to save design", err);
    }

    sessionStorage.setItem(`designData-${projectId}`, JSON.stringify(data));
    window.__lastProjectData = data;

    navigate("/dashboard/designer/design");
  };

  return (
    <div className="h-[50px] px-4 flex items-center justify-between border-b border-black/10 z-50 relative bg-white text-black font-semibold text-sm shadow-sm">
      <div className="tracking-wide">CV2 Architect</div>

      <div className="flex items-center gap-3 relative">
        {/* 🧼 Reset Design */}
        <button
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md transition-all font-medium bg-white border border-black/20 text-black hover:bg-yellow-100"
          onClick={handleResetCanvas}
        >
          ✏️ Design Canvas
        </button>

        {/* 🔳 3D View */}
        <button
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md transition-all font-medium bg-white border border-black/20 text-black hover:bg-neutral-100"
          onClick={onOpen3D}
        >
          <CubeTransparentIcon className="w-5 h-5" />
          {t("designToolbar.3dView")}
        </button>

        {/* Quick Exit */}
        <button
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md transition-all font-medium bg-white border border-black/20 text-black hover:bg-red-100"
          onClick={handleQuickExit}
        >
          {t("designToolbar.quickExit")}
        </button>
      </div>
    </div>
  );
};

export default DesignToolbar;
