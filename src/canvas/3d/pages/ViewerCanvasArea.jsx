import React, { useState } from "react";
import ThreeDViewer from "../ThreeDViewer";
import SelectedInfoCard from "./SelectedInfoCard";

const ViewerCanvasArea = ({ viewerRef }) => {
  const [selectedWall, setSelectedWall] = useState(null);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <ThreeDViewer ref={viewerRef} onWallSelect={setSelectedWall} />
      <SelectedInfoCard selectedWall={selectedWall} />
    </div>
  );
};

export default ViewerCanvasArea;
