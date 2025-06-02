// src/superadmin/SuperAdminDashboard.jsx
import React from "react";

const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Super Admin Dashboard</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {/* Total Users */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">321</p>
        </div>

        {/* Total Collections */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Collections</h2>
          <p className="text-3xl font-bold text-green-600">87</p>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Recent Activity</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>User `AliDesigns` uploaded an asset</li>
            <li>Admin `John` edited a collection</li>
            <li>Client `SpaceHome` signed up</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
