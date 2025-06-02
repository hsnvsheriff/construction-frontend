// CanvasObjectRegistry.js

let canvasObjects = [];

const CanvasObjectRegistry = {
  add(obj) {
    canvasObjects.push(obj);
  },

  removeById(id) {
    canvasObjects = canvasObjects.filter(item => item.id !== id);
  },

  update(id, updatedProps) {
    canvasObjects = canvasObjects.map(item =>
      item.id === id ? { ...item, ...updatedProps } : item
    );
  },

  getAll() {
    return [...canvasObjects];
  },

  clear() {
    canvasObjects = [];
  },

  exportFor3D() {
    // Import your formatter
    const formatCanvasFor3D = require('./formatCanvasFor3D').default;
    return formatCanvasFor3D(canvasObjects);
  },

  exportForMongo() {
    // Optional: add Mongo-safe shape here
    return canvasObjects.map(obj => ({
      ...obj,
      _id: undefined, // strip frontend IDs
    }));
  }
};

export default CanvasObjectRegistry;
