import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useTranslation } from "react-i18next";

export default function ModelStore() {
  const { t } = useTranslation();
  const [allModels, setAllModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [expandedModelId, setExpandedModelId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [searchCode, setSearchCode] = useState("");

  useEffect(() => {
    axios.get("/api/models/list").then((res) => {
      setAllModels(res.data);
      setFilteredModels(res.data);
    });
  }, []);

  useEffect(() => {
    const trimmed = searchCode.trim().toLowerCase();
    if (trimmed === "") {
      setFilteredModels(allModels);
    } else {
      const filtered = allModels.filter((model) =>
        model.productCode?.toLowerCase().includes(trimmed)
      );
      setFilteredModels(filtered);
    }
  }, [searchCode, allModels]);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 1500);
    } else {
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 1500);
    }
  };

  const toggleExpand = (id) => {
    setExpandedModelId(expandedModelId === id ? null : id);
  };

  const renderModelCard = (model) => {
    const isExpanded = expandedModelId === model._id;

    return (
      <div
        key={model._id}
        onClick={() => toggleExpand(model._id)}
        className={`relative p-4 rounded-xl transition-all duration-200 shadow-md cursor-pointer bg-zinc-100 dark:bg-zinc-800 hover:shadow-lg ${
          isExpanded ? "ring-2 ring-blue-400 scale-[1.01] z-10" : ""
        }`}
        style={{ minHeight: "180px" }}
      >
        <p className="text-md font-medium truncate">{model.productCode}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          {model.category || "-"}
        </p>

        {isExpanded && (
          <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-zinc-900 bg-opacity-95 rounded-xl p-4 z-20 flex flex-col justify-center shadow-xl">
            <div className="text-xs space-y-2 overflow-y-auto max-h-60">
              <div className="font-mono text-zinc-500 dark:text-zinc-300 break-all">
                <span className="font-bold text-green-500">{t("modelStore.mongoId") || "Mongo ID"}:</span> {model._id}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(model._id, "id");
                  }}
                  className="ml-2 text-blue-500 hover:underline text-xs"
                >
                  {copiedId === model._id ? "Copied!" : "Copy"}
                </button>
              </div>

              <div>
                <span className="font-semibold">Product Code:</span> {model.productCode || "-"}
              </div>

              <div>
                <span className="font-semibold">Category:</span> {model.category || "-"}
              </div>

              <div className="font-mono text-xs break-all">
                <span className="font-semibold">S3 URL:</span> {model.fileUrl}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(model.fileUrl, "url");
                  }}
                  className="ml-2 text-blue-500 hover:underline"
                >
                  {copiedUrl === model.fileUrl ? "Copied!" : "Copy URL"}
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this model?")) {
                    axios
                      .delete(`/api/models/${model._id}`)
                      .then(() => {
                        setAllModels((prev) => prev.filter((m) => m._id !== model._id));
                        setFilteredModels((prev) => prev.filter((m) => m._id !== model._id));
                        setExpandedModelId(null);
                      })
                      .catch(() => {
                        alert("Failed to delete model.");
                      });
                  }
                }}
                className="mt-3 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete Model
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6">Model Store</h1>

      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search by product code..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="px-3 py-2 rounded border bg-white text-black dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredModels.map(renderModelCard)}
      </div>
    </div>
  );
}
