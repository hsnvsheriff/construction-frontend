let undoStack = [];
let isWatching = false;

export function startWatching(canvas) {
  if (isWatching || !canvas) return;
  isWatching = true;

  // Optional: attach canvas event listener if needed
  console.log('[ABSOLUTE HISTORY] Watching canvas events.');
}

export function stopWatching(canvas) {
  if (!isWatching || !canvas) return;
  isWatching = false;

  canvas.off('object:added', handleCanvasEvent);
  console.log('[ABSOLUTE HISTORY] Stopped watching canvas.');
}

function handleCanvasEvent(e) {
  const canvas = window.__fabricCanvas;
  const obj = e?.target;
  if (!canvas || !obj) return;

  if (obj.excludeFromHistory || obj.type === 'ghost') return;

  const related = [];
  if (obj.snapHelpers && Array.isArray(obj.snapHelpers)) {
    related.push(...obj.snapHelpers);
  }

  undoStack.push({ main: [obj], helpers: related });
  console.log('[ABSOLUTE HISTORY] Saved to undo stack:', obj.type);
}

// ✅ Support single object or array of objects
export function pushToUndo(mainObjects, helpers = []) {
  const mainArray = Array.isArray(mainObjects) ? mainObjects : [mainObjects];
  undoStack.push({
    main: mainArray,
    helpers: helpers.filter(Boolean),
  });
}

// ✅ Pop from stack and remove main + helpers
export function undo(canvas) {
  if (!canvas || undoStack.length === 0) {
    console.warn('[ABSOLUTE HISTORY] Nothing to undo.');
    return;
  }

  const { main, helpers } = undoStack.pop();

  // 🧹 Remove helpers
  if (Array.isArray(helpers)) {
    helpers.forEach((h) => {
      if (h && canvas.contains(h)) canvas.remove(h);
    });
  }

  // 🧹 Remove main (supports group undo)
  if (Array.isArray(main)) {
    main.forEach(obj => {
      if (obj && canvas.contains(obj)) canvas.remove(obj);
    });
  } else if (main && canvas.contains(main)) {
    canvas.remove(main);
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();

  console.log('[ABSOLUTE HISTORY] Undo: removed', Array.isArray(main) ? main.length : 1, 'object(s),', helpers?.length || 0, 'helper(s)');
}

// Optional utility
export function clearHistory() {
  undoStack = [];
  console.log('[ABSOLUTE HISTORY] Undo stack cleared.');
}
