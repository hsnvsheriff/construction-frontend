import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DesignToolbar from "./DesignToolbar";
import DesignCanvasArea from "./DesignCanvasArea";
import ModeSwitcher from "../canvas/toolbar/ModeSwitcher";
import LayersCard from "../canvas/cards/LayersCard";
import { CanvasModes } from "../canvas/core/CanvasModes";
import FundamentDisclaimerModal from "../components/FundamentDisclaimerModal";
import ColumnToolbox from "../canvas/column/ColumnToolbox";
import WindowModal from "../canvas/window/WindowModal";
import { insertWindowOnWall } from "../canvas/window/insertWindowOnWall";
import { renderGapsOnWall } from "../canvas/wall/renderWallGaps";
import DataModel from "../canvas/core/DataModel";
import { tryRestoreCanvas } from "./DataFetcher";

const DesignPage = () => {
  const [mode, setMode] = useState(CanvasModes.VIEW);
  const [activeLayer, setActiveLayer] = useState("Layer 0");
  const [selectedElement, setSelectedElement] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerCallback, setDisclaimerCallback] = useState(null);
  const [selectedFundamentMetadata, setSelectedFundamentMetadata] = useState(null);
  const [selectedWall, setSelectedWall] = useState(null);
  const [showWindowModal, setShowWindowModal] = useState(false);

  const { id: projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;

    tryRestoreCanvas(projectId).then(() => {
      setTimeout(() => {
        const canvas = window.__fabricCanvas;
        if (canvas && canvas.getObjects().length > 0) {
          console.log("[DesignPage] 🔁 Restoring canvas to DataModel...");
          DataModel.updateFromCanvas(canvas);
          const data = DataModel.getSanitized();
          sessionStorage.setItem(`designData-${projectId}`, JSON.stringify(data));
          window.__lastProjectData = data;
          console.log("[DesignPage] ✅ Synced canvas data after restore");
        } else {
          console.warn("[DesignPage] ⚠️ No objects found on canvas after restore");
        }
      }, 1000);
    });
  }, [projectId]);

  const handleOpen3D = () => {
    if (!projectId) return;

    const canvas = window.__fabricCanvas;
    if (canvas) {
      DataModel.updateFromCanvas(canvas);
      const data = DataModel.getSanitized();
      sessionStorage.setItem(`designData-${projectId}`, JSON.stringify(data));
      window.__lastProjectData = data;
    }

    navigate(`/designer/viewer/${projectId}`);
  };

  const handleWallClick = (wall) => {
    console.log("🪟 Wall clicked:", wall);
    setSelectedWall(wall);
    setShowWindowModal(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <DesignToolbar
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          window.currentCanvasMode = newMode;
        }}
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
        onOpen3D={handleOpen3D}
      />

      <div className="flex-1 relative flex overflow-hidden">
        <div className="absolute top-4 left-4 z-20">
          <ModeSwitcher
            mode={mode}
            onModeChange={(newMode) => {
              setMode(newMode);
              window.currentCanvasMode = newMode;
            }}
          />
        </div>

        <div className="w-full h-full relative">
          <DesignCanvasArea
            mode={mode}
            setMode={setMode}
            activeLayer={activeLayer}
            onSelectElement={setSelectedElement}
            selectedFundamentMetadata={selectedFundamentMetadata}
            onWallClick={handleWallClick}
          />
          <ColumnToolbox mode={mode} />
          <LayersCard />
        </div>
      </div>

      {showDisclaimer && (
        <FundamentDisclaimerModal
          onConfirm={(dontShowAgain) => {
            if (dontShowAgain) {
              localStorage.setItem("skipFundamentDisclaimer", "true");
            }
            setShowDisclaimer(false);
            if (disclaimerCallback) disclaimerCallback();
          }}
        />
      )}

      {showWindowModal && selectedWall && (
        <WindowModal
          wall={selectedWall}
          onClose={() => setShowWindowModal(false)}
          onConfirm={(gapData) => {
            insertWindowOnWall(selectedWall, gapData);
            renderGapsOnWall(window.__fabricCanvas, selectedWall);
            setShowWindowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default DesignPage;
