// F-08 probe: slowdowns on large pages and when typing in big database
// cells. Records each key's time to the next painted frame, long tasks
// (with attribution where the browser gives it), and the page's size.
// Run, type for a while in the slow place, then f08-perf-report.js.
(() => {
  const host = document.querySelector('editor-host');
  const keys = (window.__f08keys = []);
  const longTasks = (window.__f08long = []);
  document.addEventListener('keydown', e => {
    const t = performance.now();
    // the caret's block: keydown targets the page's top-level editable
    const node = document.getSelection()?.anchorNode;
    const el = node?.nodeType === 1 ? node : node?.parentElement;
    const where = el?.closest?.('affine-database') ? 'database' : el?.closest?.('[data-block-id]')?.tagName.toLowerCase() ?? 'none';
    requestAnimationFrame(() => setTimeout(() => keys.push({ key: e.key.length === 1 ? 'char' : e.key, where, ms: Math.round(performance.now() - t) }), 0));
  }, true);
  try {
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) longTasks.push({ at: Math.round(e.startTime), ms: Math.round(e.duration), name: e.name, scripts: (e.scripts ?? []).slice(0, 3).map(s => `${s.sourceFunctionName || '?'} ${String(s.sourceURL).split('/').pop()}:${s.sourceCharPosition} ${Math.round(s.duration)}ms`) });
    }).observe({ type: 'long-animation-frame', buffered: false });
  } catch {
    new PerformanceObserver(list => { for (const e of list.getEntries()) longTasks.push({ at: Math.round(e.startTime), ms: Math.round(e.duration) }); }).observe({ entryTypes: ['longtask'] });
  }
  const store = host.std.store;
  window.__f08size = {
    blocks: store.getAllModels?.().length,
    databases: document.querySelectorAll('affine-database').length,
    references: document.querySelectorAll('affine-database-ref, affine-note-ref, affine-embed-synced-doc-block').length,
    domNodes: document.getElementsByTagName('*').length,
  };
  return 'F-08 probe on ' + JSON.stringify(window.__f08size);
})();
