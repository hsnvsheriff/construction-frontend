import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import DataModel from '../../core/DataModel';

const ViewerToolbar = ({ onBack, onImportModel }) => {
  const { t } = useTranslation();
  const [productCode, setProductCode] = useState('');

const handleImport = async () => {
  const modelId = productCode.trim(); // Now treated as productCode, not Mongo ID

  if (!modelId) return;

  try {
    const res = await fetch(`/api/models/code/${modelId}`); // ✅ Correct route

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Fetch failed. Status:", res.status, "Response:", text);
      alert("Model not found.");
      return;
    }

    const { fileUrl } = await res.json();

    if (!fileUrl) {
      alert("This model has no fileUrl.");
      return;
    }

    console.log("🎯 Importing model from URL:", fileUrl);
    onImportModel(fileUrl);
    setProductCode('');
  } catch (err) {
    console.error("❌ Error loading model by productCode:", err);
    alert("Something went wrong.");
  }
};


const handleBackTo2D = () => {
  if (window.__fabricCanvas) {
    DataModel.updateFromCanvas(window.__fabricCanvas);
    localStorage.setItem('cachedSceneData', JSON.stringify(DataModel.getSanitized()));
  }
  onBack(); // go back to 2D page
};


  return (
    <div className="w-full h-12 flex items-center justify-between px-4 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
      {/* 🔙 Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBackTo2D}
          className="flex items-center gap-1.5 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {t("viewerToolbar.backTo2D")}
        </button>
        <span className="text-sm font-semibold text-gray-800 dark:text-white">
          {t("viewerToolbar.title")}
        </span>
      </div>

      {/* 🧰 Right side tools */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder={t("viewerToolbar.modelInputPlaceholder")}
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          className="px-2 py-1 text-sm rounded bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-black dark:text-white"
        />
        <button
          onClick={handleImport}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          {t("viewerToolbar.importButton")}
        </button>
      </div>
    </div>
  );
};

export default ViewerToolbar;
