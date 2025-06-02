import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { useTranslation } from "react-i18next";

const categories = ["Toilet", "Sink", "Shower", "Bathtub", "Furniture", "Appliance"];

export default function ModelUpload() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewName, setPreviewName] = useState(null);
  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreviewName(selected?.name || null);
  };

const handleUpload = async () => {
  if (!file || !productCode.trim() || !category.trim()) {
    alert(t("modelUpload.fillAllFields"));
    return;
  }

  try {
    setUploading(true);

    const formData = new FormData();

    // ✅ Correct order: metadata before file
    formData.append("productCode", productCode.trim());
    formData.append("category", category.trim());
    formData.append("model", file); // ✅ File comes last

    await axios.post("/api/models/upload", formData);

    setSuccess(t("modelUpload.uploadSuccess"));

    // ✅ Reset fields
    setFile(null);
    setPreviewName(null);
    setProductCode("");
    setCategory("");
  } catch (err) {
    console.error("❌ Upload failed:", err);
    alert(t("modelUpload.uploadFailed"));
  } finally {
    setUploading(false);
  }
};


  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12 bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <div className="w-full max-w-3xl mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("modelUpload.title")}</h1>
          <p className="text-zinc-700 dark:text-zinc-400 mt-2">
            {t("modelUpload.description")}
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/designer/models/library")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          {t("modelUpload.openLibrary")}
        </button>
      </div>

      <div className="w-full max-w-3xl bg-zinc-100 dark:bg-zinc-900 rounded-xl p-6 shadow space-y-6">
        <h2 className="text-xl font-semibold">{t("modelUpload.uploadNew")}</h2>

        <input type="file" accept=".glb" onChange={handleFileChange} />
        {previewName && (
          <p className="text-sm text-zinc-600 mt-2">
            {t("modelUpload.chooseFile")}: <span className="font-medium">{previewName}</span>
          </p>
        )}

        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block mb-1 text-sm">{t("modelUpload.productCode")}</label>
            <input
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="e.g., WC-001"
              className="px-2 py-1 border rounded bg-white text-black"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">{t("modelUpload.category")}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2 py-1 border rounded bg-white text-black"
            >
              <option value="">{t("modelUpload.select")}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`assets.category_${cat.toLowerCase()}`) || cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
        >
          {uploading ? t("modelUpload.uploading") : t("modelUpload.uploadButton")}
        </button>

        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>
    </div>
  );
}
