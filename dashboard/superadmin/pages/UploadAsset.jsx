import React, { useState } from "react";
import axios from "axios";

export default function UploadAsset() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    collection: "",
    tags: "",
    previewFile: null,
    modelFile: null,
  });

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.previewFile && !form.modelFile) {
      setMessage("❌ You must upload at least a preview image or a 3D model.");
      return;
    }

    try {
      setUploading(true);
      setMessage("Uploading to S3...");

      let previewUrl = null;
      let modelUrl = null;

      if (form.previewFile) {
        const previewData = new FormData();
        previewData.append("file", form.previewFile);
        const previewRes = await axios.post("http://localhost:4000/api/assets/upload", previewData);
        previewUrl = previewRes.data.url;
      }

      if (form.modelFile) {
  const modelData = new FormData();
  modelData.append("file", form.modelFile);
  const modelRes = await axios.post("http://localhost:4000/api/assets/upload", modelData); // ✅ FIXED LINE
  modelUrl = modelRes.data.url;
}


      const payload = {
        name: form.name,
        category: form.category.toLowerCase().trim(),
        collection: form.collection.toLowerCase().trim(),
        previewUrl,
        modelUrl,
        tags: form.tags.split(",").map((tag) => tag.trim().toLowerCase()),
      };

      await axios.post("http://localhost:4000/api/assets/create", payload);

      setMessage("✅ Asset uploaded and saved successfully!");
      setForm({
        name: "",
        category: "",
        collection: "",
        tags: "",
        previewFile: null,
        modelFile: null,
      });
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Asset to Library</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Asset name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
        />

        <input
          type="text"
          name="category"
          placeholder="Category (e.g. tile, wallpaper)"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
        />

        <select
          name="collection"
          value={form.collection}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
        >
          <option value="">Select Collection</option>
          <option value="tile">Tile</option>
          <option value="wallpaper">Wallpaper</option>
          <option value="paint">Paint</option>
          <option value="laminate">Laminate</option>
          <option value="furniture">Furniture</option>
          <option value="accessory">Accessory</option>
        </select>

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
        />

        <label className="block text-sm text-zinc-500 dark:text-zinc-300">
          Upload Preview Image (optional):
        </label>
        <input
          type="file"
          name="previewFile"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2"
        />

        <label className="block text-sm text-zinc-500 dark:text-zinc-300">
          Upload 3D Model (GLB, optional):
        </label>
        <input
          type="file"
          name="modelFile"
          accept=".glb"
          onChange={handleChange}
          className="w-full p-2"
        />

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-2 bg-black text-white rounded hover:bg-zinc-800"
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>

        {message && (
          <div className="text-sm mt-3 text-center">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
