// F-08 profiler (works in Firefox): for each key press, the time to the next
// painted frame, which Lit components updated in between (with time, all
// component classes on the page hooked), and the time spent in Yjs
// transactions (with their observers). Report: f08-update-report.js.
// Remove: window.__f08prof.stop().
(() => {
  window.__f08prof?.stop?.();
  const keys = [];
  let current = null;
  const restore = [];
  const hooked = new WeakSet();
  const hook = proto => {
    if (hooked.has(proto)) return;
    hooked.add(proto);
    const orig = proto.performUpdate;
    proto.performUpdate = function (...args) {
      if (!current) return orig.apply(this, args);
      const t = performance.now();
      try { return orig.apply(this, args); } finally {
        const e = (current.updates[this.tagName.toLowerCase()] ??= { n: 0, ms: 0 });
        e.n++; e.ms += performance.now() - t;
      }
    };
    restore.push(() => { proto.performUpdate = orig; });
  };
  const hookAll = () => {
    for (const el of document.querySelectorAll('*')) {
      if (!el.tagName.includes('-')) continue;
      for (let p = Object.getPrototypeOf(el); p && p !== HTMLElement.prototype; p = Object.getPrototypeOf(p)) {
        if (Object.prototype.hasOwnProperty.call(p, 'performUpdate')) hook(p);
      }
    }
  };
  hookAll();
  const host = document.querySelector('editor-host');
  const ydoc = host?.std?.store?.doc?.spaceDoc ?? host?.std?.store?.spaceDoc;
  let txStart = 0;
  const before = () => { txStart = performance.now(); };
  const after = () => { if (current && txStart) { current.yjsMs += performance.now() - txStart; current.tx++; } };
  ydoc?.on('beforeTransaction', before);
  ydoc?.on('afterTransactionCleanup', after);
  const onKey = e => {
    const node = document.getSelection()?.anchorNode;
    const el = node?.nodeType === 1 ? node : node?.parentElement;
    const cell = el?.closest?.('dv-table-view-cell-container');
    const textLen = (cell?.querySelector('[data-v-root]')?.textContent ?? '').length;
    const entry = { key: e.key.length === 1 ? 'char' : e.key, where: cell ? 'cell' : (el?.closest?.('[data-block-id]')?.tagName.toLowerCase() ?? 'none'), cellChars: cell ? textLen : undefined, t0: performance.now(), updates: {}, yjsMs: 0, tx: 0 };
    keys.push(entry);
    current = entry;
    requestAnimationFrame(() => setTimeout(() => { entry.ms = Math.round(performance.now() - entry.t0); if (current === entry) current = null; }, 0));
  };
  document.addEventListener('keydown', onKey, true);
  const rehook = setInterval(hookAll, 5000);
  window.__f08prof = { keys, ydoc: !!ydoc, stop() { restore.forEach(f => f()); clearInterval(rehook); document.removeEventListener('keydown', onKey, true); ydoc?.off('beforeTransaction', before); ydoc?.off('afterTransactionCleanup', after); } };
  return `F-08 profiler on (yjs: ${!!ydoc})`;
})();
