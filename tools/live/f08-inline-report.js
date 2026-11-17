(() => {
  const p = window.__f08inline;
  const rows = Object.entries(p.stats).map(([name, s]) => ({ name, perKey: +(s.n / p.keys).toFixed(1), msPerKey: +(s.ms / p.keys).toFixed(1), asyncMsPerKey: s.async ? +(s.async / p.keys).toFixed(1) : undefined })).sort((a, b) => b.msPerKey - a.msPerKey).slice(0, 25);
  return JSON.stringify({ keys: p.keys, cellChars: p.textLength, rows }, null, 1);
})();
