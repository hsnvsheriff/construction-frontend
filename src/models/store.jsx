import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";

export default function Store() {
  const [allAssets, setAllAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [expandedAssetId, setExpandedAssetId] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get("/api/assets/list").then((res) => {
      const patchedAssets = res.data.map((asset) => ({
        ...asset,
        previewUrl: asset.previewUrl || asset.imageUrl,
      }));
      setAllAssets(patchedAssets);
    });
  }, []);

  useEffect(() => {
    let assets = [...allAssets];
    if (searchQuery.trim() !== "") {
      assets = assets.filter((asset) =>
        asset.productCode?.toString().includes(searchQuery.trim())
      );
    }
    setFilteredAssets(assets);
  }, [searchQuery, allAssets]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 1500);
  };

  const toggleExpand = (id) => {
    setExpandedAssetId(expandedAssetId === id ? null : id);
  };

  const assetsToRender = searchQuery ? filteredAssets : allAssets;

  return (
    <div className="min-h-screen px-6 py-12 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Model Store</h1>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by product code..."
        className="w-full mb-6 px-4 py-2 border rounded bg-white dark:bg-zinc-900 text-black dark:text-white"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {assetsToRender.map((asset) => {
          const isExpanded = expandedAssetId === asset._id;

          return (
            <div
              key={asset._id}
              onClick={() => toggleExpand(asset._id)}
              className={`relative p-3 rounded-lg shadow-md bg-zinc-100 dark:bg-zinc-800 hover:shadow-lg ${
                isExpanded ? "ring-2 ring-blue-400 scale-[1.01]" : ""
              }`}
            >
              <img
                src={asset.previewUrl}
                alt={asset.name || asset.productCode || "Asset"}
                className="w-full h-32 object-cover rounded mb-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/128?text=No+Preview";
                }}
              />
              <p className="text-sm font-medium truncate">{asset.name || asset.productCode}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {asset.category || "-"}
              </p>

              {isExpanded && (
                <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-zinc-900 bg-opacity-95 rounded-lg p-4 z-20 shadow-xl">
                  <div className="text-xs space-y-2 overflow-y-auto max-h-48">
                    <div>
                      <span className="font-semibold text-zinc-600 dark:text-zinc-300">Product Code:</span>{" "}
                      {asset.productCode || "-"}
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-600 dark:text-zinc-300">Category:</span>{" "}
                      {asset.category || "-"}
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-600 dark:text-zinc-300">S3 URL:</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(asset.previewUrl);
                        }}
                        className="ml-2 text-blue-500 hover:underline"
                      >
                        {copiedUrl === asset.previewUrl ? "Copied!" : "Copy URL"}
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to delete this asset?")) {
                          axios
                            .delete(`/api/assets/${asset._id}`)
                            .then(() => {
                              setAllAssets((prev) =>
                                prev.filter((a) => a._id !== asset._id)
                              );
                              setExpandedAssetId(null);
                            })
                            .catch((err) => {
                              console.error("Delete failed:", err);
                              alert("Failed to delete asset.");
                            });
                        }
                      }}
                      className="mt-3 px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Delete Asset
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
