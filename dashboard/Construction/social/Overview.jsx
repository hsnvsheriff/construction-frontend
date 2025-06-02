import React, { useState } from "react";
import { useTheme } from "next-themes";

export default function Overview() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Image Upload */}
          <label className="relative cursor-pointer group">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-full border-2 border-white shadow"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-neutral-600 group-hover:opacity-70 transition" />
            )}
            <span className="absolute inset-0 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 text-white bg-black bg-opacity-50 rounded-full">
              Upload
            </span>
          </label>

          {/* Company Name */}
          <h1 className="text-2xl font-bold tracking-wide uppercase">ConstructionCompany</h1>

          {/* Stats */}
          <div className="flex space-x-6 pt-2">
            <div className="text-center">
              <p className="text-lg font-semibold">28</p>
              <p className="text-sm opacity-60">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">112</p>
              <p className="text-sm opacity-60">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">36</p>
              <p className="text-sm opacity-60">Following</p>
            </div>
          </div>

          {/* Contact Button */}
          <div className="pt-4">
            <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition dark:bg-white dark:text-black">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
