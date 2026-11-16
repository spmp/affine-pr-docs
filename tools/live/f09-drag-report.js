(() => {
  const s = JSON.stringify((window.__f09 ?? []).map(d => ({ row: d.row, end: d.end, frames: d.frames.length, framesWithoutLine: d.frames.filter(f => !f.indicators.some(i => i.startsWith('line'))).length, framesWithoutGhost: d.frames.filter(f => !f.indicators.some(i => i.startsWith('ghost'))).length, sample: d.frames.filter((_, i) => i % 10 === 0).slice(0, 12) })), null, 1);
  try { copy(s); } catch {}
  console.log(s);
  return s;
})();
