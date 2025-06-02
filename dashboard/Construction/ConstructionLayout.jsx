import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./ConstructionSidebar";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export default function ConstructionLayout() {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();

const isDark = resolvedTheme === "dark";

  return (
<div className={`flex min-h-screen transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      {/* Sidebar */}
      <aside className="w-[240px] min-w-[240px] bg-black text-white border-r border-neutral-800">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-2">
        <Outlet />
      </main>
    </div>
  );
}
