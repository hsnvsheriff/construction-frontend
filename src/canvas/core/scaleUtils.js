// ✅ FIXED VERSION: 1 meter = 100 pixels
export function getScalePerUnit(scaleGlobal = 20) {
  return scaleGlobal * 5; // 20px × 5 squares = 100px per meter
}
