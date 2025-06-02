import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const { userData } = useOutletContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Prevent hydration mismatch with dark/light theme
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-12 bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      {/* Top section */}
      <div className="w-full max-w-3xl mb-10">
        <h1 className="text-3xl font-bold">Designer Dashboard</h1>
      </div>

      {/* Main content */}
      <div className="w-full max-w-3xl bg-zinc-100 dark:bg-zinc-900 rounded-xl p-6 shadow space-y-4 transition">
        {!userData ? (
          <p className="text-yellow-600 dark:text-yellow-400">Loading secure user info...</p>
        ) : (
          <>
            <p className="text-lg font-medium">
              ✅ Welcome back, <strong>{userData.name}</strong> ({userData.email})
            </p>
            <p className="text-zinc-700 dark:text-zinc-400">
              This is your personalized dashboard home.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
