import React from "react";

const projects = [
  {
    title: "Modern Villa Concept",
    image: "https://images.unsplash.com/photo-1600607687728-e9d9f8f3d77c",
    location: "Miami, FL",
  },
  {
    title: "Urban Tower Redesign",
    image: "https://images.unsplash.com/photo-1529429617124-aee89efb6f6e",
    location: "New York, NY",
  },
  {
    title: "Smart Office Complex",
    image: "https://images.unsplash.com/photo-1558002038-22a549ba43e2",
    location: "San Francisco, CA",
  },
];

export default function Portfolio() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Your Public Portfolio</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-neutral-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            <img
              src={`${project.image}?w=800&h=600&fit=crop`}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-white font-medium text-lg">{project.title}</h2>
              <p className="text-sm text-neutral-400">{project.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
