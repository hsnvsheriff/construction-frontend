import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ConstructionLayout from "./ConstructionLayout";
import RequireAuth from "../../src/auth/RequireAuth";

// Main sections
import Overview from "./pages/Overview";
import Team from "./pages/Team";
import StartProject from "./pages/StartProject";
import Projects from "./pages/Projects";
import Messages from "./pages/messages/Messages";
import Budget from "./pages/Budget";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";

// Inventory (now modular)
import Inventory from "./inventory/Inventory";

// Social module
import Social from "./social/Social";
import SocialOverview from "./social/Overview";
import SocialPortfolio from "./social/Portfolio";
import SocialSettings from "./social/Settings";
import SocialFooter from "./social/Footer";
import SocialGallery from "./social/Gallery";

export default function ConstructionRouter() {
  return (
    <Routes>
      <Route
        element={
          <RequireAuth>
            <ConstructionLayout />
          </RequireAuth>
        }
      >
        {/* Main Dashboard Pages */}
        <Route path="overview" element={<Overview />} />
        <Route path="team" element={<Team />} />
        <Route path="start-project" element={<StartProject />} />
        <Route path="projects" element={<Projects />} />
        <Route path="messages" element={<Messages />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="budget" element={<Budget />} />
        <Route path="documents" element={<Documents />} />
        <Route path="settings" element={<Settings />} />

        {/* Social Module */}
        <Route path="social" element={<Social />}>
          <Route index element={<SocialOverview />} />
          <Route path="overview" element={<SocialOverview />} />
          <Route path="gallery" element={<SocialGallery />} />
          <Route path="portfolio" element={<SocialPortfolio />} />
          <Route path="settings" element={<SocialSettings />} />
          <Route path="footer" element={<SocialFooter />} />
        </Route>

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to="overview" />} />
      </Route>
    </Routes>
  );
}
