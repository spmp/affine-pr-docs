// F-09 probe (mobile): while dragging a Journal Todo row, is the drop
// indicator there? Samples every frame during a drag: the indicator
// elements present, their size and position, and the pointer. Run on the
// phone (mobile-debug-eval.sh -t mobile run-file), drag a few rows until
// it goes missing, then run f09-drag-report.js.
(() => {
  const drags = (window.__f09 = []);
  let current = null;
  // The List view's drag controller (list/pc/controller/drag.ts) draws a
  // 2px drop line `[data-is-drop-preview]` and a fixed ghost row
  // `.with-data-view-css-variable`, both on <body>; the line is removed
  // whenever it finds no insert position under the pointer.
  const indicators = () => [...document.querySelectorAll('body > [data-is-drop-preview="true"], body > div.with-data-view-css-variable')]
    .map(el => { const r = el.getBoundingClientRect(); const kind = el.dataset.isDropPreview ? 'line' : 'ghost'; return `${kind} ${Math.round(r.width)}x${Math.round(r.height)}@${Math.round(r.top)}`; });
  const sample = () => {
    if (!current) return;
    current.frames.push({ t: Math.round(performance.now() - current.t0), y: current.y, indicators: indicators() });
    requestAnimationFrame(sample);
  };
  document.addEventListener('pointerdown', e => {
    const handle = e.composedPath()[0].closest?.('.affine-data-view-list-drag-handle, .data-view-table-view-drag-handler');
    if (!handle) return;
    current = { row: handle.dataset.rowId ?? handle.closest('[data-row-id]')?.dataset.rowId, t0: performance.now(), y: e.clientY, frames: [] };
    drags.push(current);
    requestAnimationFrame(sample);
  }, true);
  document.addEventListener('pointermove', e => { if (current) current.y = Math.round(e.clientY); }, true);
  for (const ev of ['pointerup', 'pointercancel']) document.addEventListener(ev, e => { if (current) { current.end = ev; current = null; } }, true);
  return 'F-09 probe on';
})();
