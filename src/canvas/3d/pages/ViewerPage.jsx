import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ViewerToolbar from "./ViewerToolbar";
import ViewerCanvasArea from "./ViewerCanvasArea";

const ViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const viewerRef = useRef(null);

  const handleBack = () => {
    if (id) {
      navigate(`/dashboard/designer/design/project/${id}`);
    } else {
      navigate("/dashboard/designer/design");
    }
  };

  const handleImportModel = (url) => {
  console.log("🧩 Importing GLB model:", url);
  viewerRef.current.loadGLBModel(url); // don't wrap it again
};


  return (
    <div className="w-screen h-screen flex flex-col bg-white dark:bg-neutral-900 text-black dark:text-white">
      <ViewerToolbar onBack={handleBack} onImportModel={handleImportModel} />
      <div className="flex-1 flex relative overflow-hidden">
        <ViewerCanvasArea viewerRef={viewerRef} />
      </div>
    </div>
  );
};

export default ViewerPage;
