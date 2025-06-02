import { startColumnDrawing, stopColumnDrawing } from './drawColumn';

export default function FabricColumnMode(canvas, scale = 20) {
  // 🔁 Always rerun to rebind listeners & update shape mode
  if (canvas.__cleanupColumn) {
    canvas.__cleanupColumn(); // Clean previous listeners first
  }

  console.log('✅ FabricColumnMode triggered with scale:', scale);

  startColumnDrawing(canvas, scale); // 🧠 Includes Zustand shape

  canvas.__cleanupColumn = () => {
    stopColumnDrawing(canvas);
  };
}
