import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { Toaster } from "react-hot-toast"; // ✅ Toast provider
import SuperAdminRouter from "../dashboard/superadmin/SuperAdminRouter";
import Login from "./auth/Login";
import DesignPage from "./pages/DesignPage";
import ConstructionRouter from "../dashboard/Construction/ConstructionRouter";
import RequireRole from "./auth/RequireRole";
import DesignerRouter from "../dashboard/designer/DesignerRouter";
import ViewerPage from "./canvas/3d/pages/ViewerPage";
import UnifiedPlans from './pages/UnifiedPlans';
import Success from './pages/Success';
import Cancel from './pages/Cancel';


export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      {/* ✅ Global toast renderer (put once at root) */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1F2937", // Tailwind dark bg
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />
      

<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<Navigate to="/login" />} />

  <Route
    path="/dashboard/Construction/*"
    element={
      <RequireRole expectedRole="company">
        <ConstructionRouter />
      </RequireRole>
    }
  />
  <Route
    path="/dashboard/designer/*"
    element={
      <RequireRole expectedRole="designer">
        <DesignerRouter />
      </RequireRole>
    }
  />
    <Route path="/pricing" element={<UnifiedPlans />} />
  <Route path="/success" element={<Success />} />
  <Route path="/cancel" element={<Cancel />} />

  <Route
    path="/dashboard/superadmin/*"
    element={
      <RequireRole expectedRole="superadmin">
        <SuperAdminRouter />
      </RequireRole>
    }
  />

  <Route path="/design" element={<Navigate to="/dashboard/designer/design/project/default-id" />} />
  <Route path="/designer/viewer/:id" element={<ViewerPage />} />

  <Route path="*" element={<Navigate to="/" />} />
</Routes>

    </Router>
  );
}
