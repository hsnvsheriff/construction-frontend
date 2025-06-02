import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 py-12 px-6 text-sm text-neutral-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12">
        {/* Left - Brand Message */}
        <div>
          <h2 className="text-white text-2xl font-semibold mb-3">Social Mode</h2>
          <p className="max-w-md">
            Designed for those building the future. Share progress, manage teams, and elevate visibility — all in one unified environment.
          </p>
        </div>

        {/* Right - Contact Info */}
        <div className="space-y-2">
          <h3 className="text-white text-lg font-medium mb-3">Contact</h3>
          <p>Address: 7533 S Center View Ct Ste N, West Jordan, UT 84084</p>
          <p>Phone: +1 (385) 999-1234</p>
          <p>Email: support@socialmode.app</p>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-10 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} Social Mode · Built by DATAWISER LLC
      </div>
    </footer>
  );
}
