import axios from "axios";

export async function getModelsByCategory(category) {
  try {
    const res = await axios.get(`http://localhost:4000/api/models/${category}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch models:", err);
    return [];
  }
}
