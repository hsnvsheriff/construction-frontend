import { loadHDRIEnvironment } from './HDRIEnvironmentLoader.js';
import { setupPostProcessing } from './PostProcessingSetup.js';

export async function initRealismPack({ renderer, scene, camera }) {
  await loadHDRIEnvironment(renderer, scene); // default path used
  const composer = setupPostProcessing(renderer, scene, camera);
  return composer;
}
