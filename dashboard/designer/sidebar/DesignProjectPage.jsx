// dashboard/designer/sidebar/DesignProjectPage.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DesignToolbar from "@/pages/DesignToolbar";
import DesignCanvasArea from "@/pages/DesignCanvasArea";
import { CanvasModes } from "@/canvas/core/CanvasModes";
import { useTranslation } from "react-i18next"; // 🈶️ Language hook added

export default function DesignProjectPage() {
  const { t } = useTranslation(); // 🧠 Ready for future UI text
  const { id: projectId } = useParams();
  const [mode, setMode] = useState(CanvasModes.SELECT);
  const [activeLayer, setActiveLayer] = useState("default");

  return (
    <div className="w-full h-screen bg-white dark:bg-black text-black dark:text-white">
      <DesignToolbar onOpen3D={() => {}} />
      <DesignCanvasArea
        mode={mode}
        setMode={setMode}
        activeLayer={activeLayer}
        onSelectElement={() => {}}
      />
    </div>
  );
}
