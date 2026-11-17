// F-08: times every method of the inline editor of the largest rich-text
// cell on the page (the editor and its services), per key press. Report:
// f08-inline-report.js. Remove: window.__f08inline.stop().
(() => {
  window.__f08inline?.stop?.();
  const editors = [...document.querySelectorAll('dv-table-view-cell-container rich-text')]
    .map(rt => ({ rt, len: rt.textContent.length }))
    .sort((a, b) => b.len - a.len);
  const target = editors[0]?.rt;
  const editor = target?.inlineEditor;
  if (!editor) return 'no inline editor found (click into the big cell first)';
  const stats = {};
  let active = false;
  const restore = [];
  const wrapObject = (obj, label) => {
    if (!obj) return;
    const names = new Set();
    for (let p = obj; p && p !== Object.prototype; p = Object.getPrototypeOf(p)) {
      for (const n of Object.getOwnPropertyNames(p)) names.add(n);
    }
    for (const n of names) {
      if (n === 'constructor') continue;
      const desc = Object.getOwnPropertyDescriptor(obj, n) ?? (() => { for (let p = Object.getPrototypeOf(obj); p; p = Object.getPrototypeOf(p)) { const d = Object.getOwnPropertyDescriptor(p, n); if (d) return d; } })();
      if (!desc || typeof desc.value !== 'function') continue;
      const orig = obj[n];
      const name = `${label}.${n}`;
      obj[n] = function (...args) {
        if (!active) return orig.apply(this, args);
        const t = performance.now();
        const s = (stats[name] ??= { n: 0, ms: 0 });
        s.n++;
        let r;
        try { r = orig.apply(this, args); } catch (e) { s.ms += performance.now() - t; throw e; }
        if (r && typeof r.then === 'function') { r.then(() => { s.async = (s.async ?? 0) + performance.now() - t; }, () => {}); }
        s.ms += performance.now() - t;
        return r;
      };
      restore.push(() => { if (Object.prototype.hasOwnProperty.call(desc, 'value') && Object.getOwnPropertyDescriptor(obj, n) ) obj[n] = orig; });
    }
  };
  wrapObject(editor, 'editor');
  for (const key of Object.keys(editor)) {
    const v = editor[key];
    if (v && typeof v === 'object' && /Service$|service$/.test(key)) wrapObject(v, key);
  }
  let keys = 0;
  const onKey = () => { keys++; active = true; requestAnimationFrame(() => setTimeout(() => { active = false; }, 0)); };
  document.addEventListener('keydown', onKey, true);
  window.__f08inline = { stats, get keys() { return keys; }, textLength: editors[0].len, stop() { restore.forEach(f => f()); document.removeEventListener('keydown', onKey, true); } };
  return `inline profiler on the cell with ${editors[0].len} chars; services: ${Object.keys(editor).filter(k => /Service$/.test(k)).join(', ')}`;
})();
