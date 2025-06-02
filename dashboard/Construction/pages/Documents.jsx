import { useState } from 'react';
import { FiTrash, FiChevronRight } from 'react-icons/fi';
import { useTheme } from 'next-themes';

export default function Documents() {
  const [collections, setCollections] = useState([
    {
      id: 'col1',
      name: 'Project Alpha',
      description: 'Initial design layouts',
      assets: ['wall-layout.png', 'floor_plan.glb'],
    },
    {
      id: 'col2',
      name: 'Materials Archive',
      description: 'All base materials',
      assets: ['bricks-v2.jpg', 'cement-mix.pdf'],
    }
  ]);

  const [activeCollection, setActiveCollection] = useState(null);

  return (
   <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white p-6 transition-colors duration-300">
      {/* Topbar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <div className="space-x-3">
          <button className="px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-black transition">+ Add Collection</button>
          <button className="px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-black transition">Set PIN</button>
        </div>
      </div>

      {/* If no collection is opened */}
      {!activeCollection && (
        <div className="space-y-4">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => setActiveCollection(col)}
              className="cursor-pointer border border-gray-700 hover:border-white hover:shadow-lg transition p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-medium">{col.name}</h2>
                <p className="text-sm text-gray-400">{col.description}</p>
              </div>
              <FiChevronRight className="text-white text-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Inside a collection */}
      {activeCollection && (
        <div className="space-y-6">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{activeCollection.name}</h2>
              <p className="text-sm text-gray-400">{activeCollection.description}</p>
            </div>
            <button
              onClick={() => setActiveCollection(null)}
              className="text-white text-sm underline hover:text-gray-300 transition"
            >
              ← Back to all collections
            </button>
          </div>
          <div className="space-y-3">
            {activeCollection.assets.map((asset, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-2 bg-gray-900 rounded border border-gray-800 hover:border-white transition"
              >
                <span>{asset}</span>
                <FiTrash className="text-white hover:text-gray-400 cursor-pointer" />
              </div>
            ))}
          </div>
          <button className="mt-6 px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-black transition">
            + Add Asset
          </button>
        </div>
      )}
    </div>
  );
}
