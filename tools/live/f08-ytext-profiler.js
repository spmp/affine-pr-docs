// F-08: per key press, how often Y.Text / Y.Map / Y.Array are serialised
// (toString, toJSON, toDelta) and how long it takes, with the biggest text
// lengths seen and a short call stack for the costliest calls. Report:
// f08-ytext-report.js. Remove: window.__f08y.stop().
(() => {
  window.__f08y?.stop?.();
  const rt = [...document.querySelectorAll('dv-table-view-cell-container rich-text')].sort((a, b) => b.textContent.length - a.textContent.length)[0];
  const ytext = rt?.inlineEditor?.yText;
  if (!ytext) return 'no Y.Text found';
  const store = document.querySelector('editor-host').std.store;
  const ydoc = ytext.doc;
  const YText = ytext.constructor;
  const YMap = ydoc.getMap ? Object.getPrototypeOf(ydoc.getMap('blocks')).constructor : null;
  const stats = {};
  const stacks = {};
  let active = false;
  let keys = 0;
  const restore = [];
  const wrap = (cls, name, label) => {
    if (!cls) return;
    const proto = cls.prototype;
    const orig = proto[name];
    if (typeof orig !== 'function') return;
    proto[name] = function (...args) {
      if (!active) return orig.apply(this, args);
      const t = performance.now();
      const r = orig.apply(this, args);
      const ms = performance.now() - t;
      const key = `${label}.${name}`;
      const s = (stats[key] ??= { n: 0, ms: 0, maxLen: 0 });
      s.n++; s.ms += ms;
      const len = this.length ?? this.size ?? 0;
      if (len > s.maxLen) s.maxLen = len;
      if (ms > 2) {
        const st = new Error().stack.split('\n').slice(2, 7).map(l => l.trim().replace(/https?:\/\/[^/]+\//, '').slice(0, 90)).join(' < ');
        const k = `${key} ${st}`;
        const e = (stacks[k] ??= { n: 0, ms: 0 });
        e.n++; e.ms += ms;
      }
      return r;
    };
    restore.push(() => { proto[name] = orig; });
  };
  for (const m of ['toString', 'toJSON', 'toDelta']) wrap(YText, m, 'YText');
  wrap(YMap, 'toJSON', 'YMap');
  const onKey = () => { keys++; active = true; requestAnimationFrame(() => setTimeout(() => { active = false; }, 0)); };
  document.addEventListener('keydown', onKey, true);
  window.__f08y = { stats, stacks, get keys() { return keys; }, stop() { restore.forEach(f => f()); document.removeEventListener('keydown', onKey, true); } };
  return `Y.Text profiler on (cell text ${ytext.length} chars)`;
})();
