import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  FiUsers,
  FiBarChart2,
  FiCpu,
  FiActivity,
  FiUploadCloud
} from 'react-icons/fi';

const SuperAdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 shadow-md p-6 hidden md:flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-10">Super Admin</h1>
          <nav className="space-y-4">
            <NavItem icon={<FiUsers />} label="Access Control" to="access" />
            <NavItem icon={<FiBarChart2 />} label="Token Usage" to="usage" />
            <NavItem icon={<FiActivity />} label="API Analytics" to="analytics" />
            <NavItem icon={<FiCpu />} label="System Status" to="status" />
            <NavItem icon={<FiUploadCloud />} label="Asset Uploader" to="upload-asset" /> {/* ✅ NEW */}
          </nav>
        </div>
        <div className="text-sm text-gray-400 dark:text-zinc-500">v1.0.0</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, to }) => (
  <Link
    to={`/dashboard/superadmin/${to}`} // ✅ THIS LINE FIXES YOUR NAVIGATION
    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer transition"
  >
    <span className="text-xl">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);


export default SuperAdminLayout;
