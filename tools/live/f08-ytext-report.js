(() => {
  const p = window.__f08y;
  const per = v => +(v / Math.max(p.keys, 1)).toFixed(1);
  const stats = Object.fromEntries(Object.entries(p.stats).map(([k, s]) => [k, { perKey: per(s.n), msPerKey: per(s.ms), maxLen: s.maxLen }]));
  const stacks = Object.entries(p.stacks).sort((a, b) => b[1].ms - a[1].ms).slice(0, 12).map(([k, s]) => ({ perKey: per(s.n), msPerKey: per(s.ms), where: k }));
  return JSON.stringify({ keys: p.keys, stats, stacks }, null, 1);
})();
