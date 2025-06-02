import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../src/firebase";
import axiosWithToken from "@/lib/axios";
import Sidebar from "./sidebar/Sidebar";
import { useTheme } from "next-themes";

export default function DesignerLayout() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const { theme } = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

useEffect(() => {
  const fetchSecureUser = async () => {
    try {
      const res = await axiosWithToken.get("/api/users/me"); // ✅ Corrected
      setUserData(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err.message);
    }
  };

  fetchSecureUser();
}, []);


  return (
    <div className="flex min-h-screen transition-colors duration-300 bg-white text-black dark:bg-black dark:text-white">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <Outlet context={{ userData, handleLogout }} />
      </main>
    </div>
  );
}
