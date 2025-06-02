import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import { useTranslation } from "react-i18next";

const categories = ["tile", "wallpaper", "laminate"];

export default function AssetUpload() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
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
    if (selected?.type?.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !width || !height || !productCode || !category) {
      alert(t("assetUpload.fillAllFields"));
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("width", width);
      formData.append("height", height);
      formData.append("productCode", productCode);
      formData.append("category", category);

      await axios.post("/api/assets/upload", formData);
      setSuccess(t("assetUpload.uploadSuccess"));

      setFile(null);
      setPreview(null);
      setWidth("");
      setHeight("");
      setProductCode("");
      setCategory("");
    } catch (err) {
      console.error(err);
      alert(t("assetUpload.uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12 bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <div className="w-full max-w-3xl mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("assetUpload.title")}</h1>
          <p className="text-zinc-700 dark:text-zinc-400 mt-2">
            {t("assetUpload.description")}
          </p>
        </div>
        <button
  onClick={() => navigate("/dashboard/designer/assets/library")}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
>
  {t("assetUpload.openLibrary")}
</button>

      </div>

      <div className="w-full max-w-3xl bg-zinc-100 dark:bg-zinc-900 rounded-xl p-6 shadow space-y-6">
        <h2 className="text-xl font-semibold">{t("assetUpload.uploadNew")}</h2>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded mt-2"
          />
        )}

        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block mb-1 text-sm">{t("assetUpload.width")}</label>
            <input
              type="number"
              step="0.01"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="px-2 py-1 border rounded bg-white text-black"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">{t("assetUpload.height")}</label>
            <input
              type="number"
              step="0.01"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="px-2 py-1 border rounded bg-white text-black"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">{t("assetUpload.productCode")}</label>
            <input
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="e.g., 22-1203"
              className="px-2 py-1 border rounded bg-white text-black"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">{t("assetUpload.category")}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2 py-1 border rounded bg-white text-black"
            >
              <option value="">{t("assetUpload.selectCategory")}</option>
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
          {uploading ? t("assetUpload.uploading") : t("assetUpload.uploadButton")}
        </button>

        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>
    </div>
  );
}
