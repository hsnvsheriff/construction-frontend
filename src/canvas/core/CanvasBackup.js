let canvasBackup = {
    json: null,
    mode: null,
  };
  
  export const setCanvasBackup = (json, mode) => {
    canvasBackup = { json, mode };
  };
  
  export const getCanvasBackup = () => canvasBackup;
  
  export const clearCanvasBackup = () => {
    canvasBackup = { json: null, mode: null };
  };
  