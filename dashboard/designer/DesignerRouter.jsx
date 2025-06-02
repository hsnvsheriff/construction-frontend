// src/dashboard/designer/DesignerRouter.jsx

import { Routes, Route } from "react-router-dom";
import DesignerLayout from "./DesignerLayout";

// ✅ Sidebar Pages
import Home from "@designer/sidebar/Home";
import CreateCollection from "@designer/sidebar/CreateCollection";
import AssetUpload from "@designer/sidebar/Assets";        // upload screen
import Settings from "@designer/sidebar/Settings";
import DesignOverview from "@designer/sidebar/DesignOverview";
import Models from "@designer/sidebar/Models";
import ModelLibrary from "@designer/sidebar/ModelLibrary";
import Plans from "@designer/sidebar/Plans";
import DesignProjectPage from "@designer/sidebar/DesignProjectPage";

// ✅ Fullscreen canvas / 3D viewer
import DesignPage from "@pages/DesignPage";
import ViewerPage from "@canvas/3d/pages/ViewerPage";

// ✅ External: actual asset store screen
import Store from "@/models/store"; // ✅ this is your asset library

export default function DesignerRouter() {
  return (
    <Routes>
      {/* 🧭 Main Layout Routes */}
      <Route element={<DesignerLayout />}>
        <Route path="" element={<Home />} />
        <Route path="create-collection" element={<CreateCollection />} />
        <Route path="assets" element={<AssetUpload />} />           {/* ← Upload form */}
        <Route path="assets/library" element={<Store />} />         {/* ← Actual Store.jsx */}
        <Route path="settings" element={<Settings />} />
        <Route path="design" element={<DesignOverview />} />
        <Route path="models" element={<Models />} />
        <Route path="models/library" element={<ModelLibrary />} />
        <Route path="plans" element={<Plans />} />
      </Route>

      {/* 🧱 Project Canvas + Editor */}
      <Route path="design/project/:id" element={<DesignPage />} />
      <Route path="design/project/:id/edit" element={<DesignProjectPage />} />

      {/* 🌌 3D Viewer */}
      <Route path="viewer/:id" element={<ViewerPage />} />
    </Routes>
  );
}
