(() => {
  const keys = (window.__f08prof?.keys ?? []).filter(k => k.ms != null && k.key === 'char');
  const groups = {};
  for (const k of keys) {
    const g = (groups[k.where === 'cell' ? `cell ${k.cellChars > 1000 ? '>1000' : '<=1000'} chars` : k.where] ??= { n: 0, ms: [], updates: {}, yjsMs: 0, tx: 0 });
    g.n++; g.ms.push(k.ms); g.yjsMs += k.yjsMs; g.tx += k.tx;
    for (const [tag, u] of Object.entries(k.updates)) { const a = (g.updates[tag] ??= { n: 0, ms: 0 }); a.n += u.n; a.ms += u.ms; }
  }
  for (const g of Object.values(groups)) {
    g.ms.sort((a, b) => a - b);
    g.median = g.ms[g.ms.length >> 1]; g.p90 = g.ms[Math.floor(g.ms.length * 0.9)]; g.max = g.ms.at(-1); delete g.ms;
    g.updatesPerKey = Object.fromEntries(Object.entries(g.updates).sort((a, b) => b[1].ms - a[1].ms).slice(0, 12).map(([t, u]) => [t, { perKey: +(u.n / g.n).toFixed(1), msPerKey: +(u.ms / g.n).toFixed(1) }]));
    delete g.updates;
    g.yjsMsPerKey = +(g.yjsMs / g.n).toFixed(1); g.txPerKey = +(g.tx / g.n).toFixed(1); delete g.yjsMs; delete g.tx;
    g.updateMsPerKey = +Object.values(g.updatesPerKey).reduce((a, u) => a + u.msPerKey, 0).toFixed(1);
  }
  return JSON.stringify(groups, null, 1);
})();
