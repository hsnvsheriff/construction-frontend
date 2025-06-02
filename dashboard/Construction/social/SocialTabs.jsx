import React from "react";

export default function SocialTabs({ active, onChange }) {
  const tabs = ["Overview", "Gallery", "Portfolio"];

  return (
    <div className="flex justify-center mt-6">
      <div className="inline-flex items-center bg-neutral-900 p-1 rounded-full border border-neutral-700 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
              active === tab
                ? "bg-white text-black shadow"
                : "text-white hover:bg-neutral-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
