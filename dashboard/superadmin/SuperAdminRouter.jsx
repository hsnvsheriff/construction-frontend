import { Routes, Route } from "react-router-dom";
import SuperAdminLayout from "./SuperAdminLayout";
import SuperAdminDashboard from "./SuperAdminDashboard";
import AccessControl from "./pages/AccessControl";
import TokenUsage from "./pages/TokenUsage";
import ApiAnalytics from "./pages/ApiAnalytics";
import SystemStatus from "./pages/SystemStatus";
import UploadAsset from './pages/UploadAsset';


export default function SuperAdminRouter() {
  return (
    <Routes>
      <Route path="" element={<SuperAdminLayout />}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="access" element={<AccessControl />} />
        <Route path="usage" element={<TokenUsage />} />
        <Route path="analytics" element={<ApiAnalytics />} />
        <Route path="status" element={<SystemStatus />} />
        <Route path="upload-asset" element={<UploadAsset />} />
      </Route>
    </Routes>
  );
}
