import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.js";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [company, setCompany] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
  });

  useEffect(() => {
    setCompany({
      name: "My Construction Co.",
      email: "info@company.com",
      phone: "+1 (555) 123-4567",
      website: "https://company.com",
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleSave = () => {
    console.log("Saving company info:", company);
    // Save to backend here
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">{t("Settings")}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          {t("Logout")}
        </button>
      </div>

      {/* App Mode + Language Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t("App Mode")}</label>
          <button
            onClick={handleThemeToggle}
            className="w-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded hover:scale-[1.02] transition"
          >
            {resolvedTheme === "dark"
              ? t("Switch to Light Mode")
              : t("Switch to Dark Mode")}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t("Language")}</label>
          <select
            onChange={handleLanguageChange}
            value={i18n.language}
            className="w-full border rounded px-4 py-2 bg-transparent dark:bg-gray-900 text-black dark:text-white"
          >
            <option value="en">English</option>
            <option value="pl">Polski</option>
            <option value="az">Azərbaycan</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>
      </div>

      {/* Company Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium">{t("Company Info")}</h3>
        <input
          type="text"
          name="name"
          value={company.name}
          onChange={handleChange}
          placeholder={t("Company Name")}
          className="w-full border rounded px-4 py-2 bg-transparent dark:bg-gray-900"
        />
        <input
          type="email"
          name="email"
          value={company.email}
          onChange={handleChange}
          placeholder={t("Email")}
          className="w-full border rounded px-4 py-2 bg-transparent dark:bg-gray-900"
        />
        <input
          type="tel"
          name="phone"
          value={company.phone}
          onChange={handleChange}
          placeholder={t("Phone")}
          className="w-full border rounded px-4 py-2 bg-transparent dark:bg-gray-900"
        />
        <input
          type="url"
          name="website"
          value={company.website}
          onChange={handleChange}
          placeholder={t("Website")}
          className="w-full border rounded px-4 py-2 bg-transparent dark:bg-gray-900"
        />
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {t("Save Changes")}
        </button>
      </div>
    </div>
  );
}
