// ✅ src/pages/DataFetcher.js
import { restoreCanvasFromDataModel } from "../canvas/core/DataRestorer";
import axios from "@/lib/axios";
import DataModel from "../canvas/core/DataModel";

export async function tryRestoreCanvas(projectId) {
  const canvas = window.__fabricCanvas;

  if (!canvas) {
    console.warn("[DataFetcher] ❌ No canvas instance found.");
    return false;
  }

  if (!canvas.__fabricManager?.isInitialized) {
    console.warn("[DataFetcher] ❌ Canvas not initialized with fabricManager.");
    return false;
  }

  console.log(`[DataFetcher] 🔍 Attempting to fetch design ${projectId} from MongoDB...`);

  try {
    const res = await axios.get(`/api/designs/${projectId}`);
    const designData = res.data?.data;

    console.log("[DataFetcher] 📦 Raw API response:", res.data);

    if (!designData || !Array.isArray(designData.walls)) {
      throw new Error("❌ Invalid or missing design data from backend.");
    }

    if (designData.walls.length === 0) {
      console.warn("[DataFetcher] ⚠️ Backend returned 0 walls. Will try localStorage fallback.");
      throw new Error("Empty design");
    }

    restoreCanvasFromDataModel(canvas, designData);
    DataModel.setFromSanitized(designData);
    console.log("[DataFetcher] 🧠 Canvas restored from MongoDB ✅");
    return true;
  } catch (err) {
    console.warn("[DataFetcher] ⚠️ Backend restore failed or empty. Trying localStorage fallback...");

    try {
      const cached = localStorage.getItem("cachedSceneData");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.walls?.length > 0) {
          restoreCanvasFromDataModel(canvas, parsed);
          DataModel.setFromSanitized(parsed);
          console.log("[DataFetcher] 💾 Canvas restored from localStorage ✅");
          return true;
        } else {
          console.warn("[DataFetcher] 🕳️ localStorage has no valid wall data.");
        }
      } else {
        console.warn("[DataFetcher] 🕳️ No cachedSceneData found.");
      }
    } catch (parseErr) {
      console.error("[DataFetcher] ❌ Error parsing localStorage:", parseErr);
    }

    return false;
  }
}
