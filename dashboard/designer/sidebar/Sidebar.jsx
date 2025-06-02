import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiHome,
  FiFolderPlus,
  FiImage,
  FiSettings,
  FiPenTool,
  FiBox,
} from "react-icons/fi";

export default function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();      // 🌍 i18n hook

  /** 
   * Keep route info static, just translate the label on render.
   * Each item gets a “key” that matches a string in your translation files.
   */
  const links = React.useMemo(
    () => [
      { key: "home",            to: "/dashboard/designer",                 icon: <FiHome /> },
      { key: "createCollection",to: "/dashboard/designer/create-collection",icon: <FiFolderPlus /> },
      { key: "assets",          to: "/dashboard/designer/assets",          icon: <FiImage /> },
      { key: "design",          to: "/dashboard/designer/design",          icon: <FiPenTool /> },
      { key: "models",          to: "/dashboard/designer/models",          icon: <FiBox /> },
      { key: "settings",        to: "/dashboard/designer/settings",        icon: <FiSettings /> },
    ],
    []
  );

  return (
    <aside
      style={{
        width: "230px",
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "60px 20px 40px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #2c2c2e",
      }}
    >
      {/* Logo / Title */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "18px", fontWeight: 700 }}>ArchonWiser</h1>
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 14px",
                fontSize: "14px",
                borderRadius: "10px",
                fontWeight: "500",
                backgroundColor: isActive ? "#ffffff" : "transparent",
                color: isActive ? "#000000" : "#ffffff",
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
            >
              <span style={{ fontSize: "16px" }}>{link.icon}</span>
              {/* 👉 translated label */}
              <span>{t(`sidebar.${link.key}`)}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ fontSize: "11px", color: "#888", marginTop: "auto" }}>
        © {new Date().getFullYear()} Datawiser
      </div>
    </aside>
  );
}
