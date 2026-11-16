(() => {
  const keys = window.__f08keys ?? [];
  const by = {};
  for (const k of keys) (by[k.where] ??= []).push(k.ms);
  const stats = Object.fromEntries(Object.entries(by).map(([w, ms]) => { ms.sort((a, b) => a - b); return [w, { n: ms.length, median: ms[ms.length >> 1], p90: ms[Math.floor(ms.length * 0.9)], max: ms.at(-1) }]; }));
  const long = (window.__f08long ?? []).sort((a, b) => b.ms - a.ms).slice(0, 15);
  const s = JSON.stringify({ size: window.__f08size, keyToFrame: stats, worstFrames: long }, null, 1);
  try { copy(s); } catch {}
  console.log(s);
  return s;
})();
