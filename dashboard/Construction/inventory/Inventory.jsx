import React from "react";

const inventoryData = [
  { id: 1, name: "Cement Bags", quantity: 120, unit: "bags" },
  { id: 2, name: "Steel Rods", quantity: 80, unit: "pieces" },
  { id: 3, name: "Bricks", quantity: 500, unit: "units" },
];

export default function Inventory() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Inventory</h1>
        <button className="bg-white text-black px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 transition">
          Add Item
        </button>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-neutral-300">
          <thead className="bg-neutral-800 text-white">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Unit</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map(item => (
              <tr key={item.id} className="border-t border-neutral-800 hover:bg-neutral-800/50">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
