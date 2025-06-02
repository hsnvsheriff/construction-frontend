import React, { useState } from "react";
import Overview from "./Overview";
import Gallery from "./Gallery";
import Portfolio from "./Portfolio";
import SocialTabs from "./SocialTabs";
import Footer from "./Footer"; // 🧁 import your modern footer

export default function Social() {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":
        return null;
      case "Gallery":
        return <Gallery />;
      case "Portfolio":
        return <Portfolio />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* 🧠 Main Content */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-2 pt-2">
          <Overview />

          <div className="mt-6 border-t border-neutral-800 pt-4">
            <SocialTabs active={activeTab} onChange={setActiveTab} />
          </div>

          <div className="mt-4">
            {renderTab()}
          </div>
        </div>
      </div>

      {/* 🧁 Sticky Footer */}
      <Footer />
    </div>
  );
}
