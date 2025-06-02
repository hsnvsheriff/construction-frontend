import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "@/lib/axios"; // ✅ will work again
import { v4 as uuidv4 } from 'uuid';

export default function DesignOverview() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);

  // Fetch designs from backend
  useEffect(() => {
    axios.get('/api/designs')
      .then(res => setDesigns(res.data))
      .catch(console.error);
  }, []);

  // Create a new design project
  const handleCreateProject = async () => {
    try {
      const res = await axios.post('/api/designs', {
        name: `New Project ${new Date().toLocaleDateString()}`
      });
      navigate(`/dashboard/designer/design/project/${res.data._id}`);
    } catch (err) {
      console.error('Failed to create design:', err);
    }
  };

  // Delete a design
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/designs/${id}`);
      setDesigns(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error('Failed to delete design:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white px-10 py-12 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-12 pl-10">DESIGNS</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16 justify-center px-4">
        {designs.slice(0, 1).map((design) => (
          <div
            key={design._id}
            className="w-[360px] h-[240px] rounded-lg overflow-hidden shadow-lg transform transition hover:-translate-y-1 hover:shadow-2xl relative"
          >
            <img
              src={
                design.image ||
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
              }
              alt={design.name}
              className="w-full h-[200px] object-cover cursor-pointer"
              onClick={() => navigate(`/dashboard/designer/design/project/${design._id}`)}
            />
            <div className="bg-white dark:bg-black text-center font-semibold text-sm py-2 transition-colors duration-300">
              {design.name}
            </div>
            <button
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
              onClick={() => handleDelete(design._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-16">
        <button
          onClick={handleCreateProject}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-6 rounded transition"
          disabled={designs.length >= 1}
        >
          + Create New Project
        </button>
      </div>
    </div>
  );
}
