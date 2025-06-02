// src/api/userApi.js
import axiosWithToken from "../../lib/axios";

export const fetchMyUserData = async () => {
  try {
    const res = await axiosWithToken.get("/user/me");
    console.log("✅ Secure response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch:", err.response?.data || err.message);
    throw err;
  }
};

export const updateUserData = async (updates) => {
  try {
    const res = await axiosWithToken.put("/user/update", updates);
    console.log("✅ Update success:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Update failed:", err.response?.data || err.message);
    throw err;
  }
};
