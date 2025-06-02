import React from "react";

const sampleImages = [
"https://images.unsplash.com/photo-1570129477492-45c003edd2be",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be",
"https://images.unsplash.com/photo-1570129477492-45c003edd2be",];

export default function Gallery() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Gallery & Media</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sampleImages.map((src, index) => (
          <div key={index} className="aspect-square overflow-hidden rounded-lg bg-neutral-800">
            <img
              src={`${src}?w=600&h=600&fit=crop`}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}