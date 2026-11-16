// F-07 probe: deleting a selection that starts at the first character
// deletes the wrong text. Records, for every Backspace/Delete/cut and the
// beforeinput that follows: the native selection (endpoints, offsets, the
// nearest v-text / row / block), BlockSuite's selection, and the text of
// the blocks touched before and after. Paste in DevTools (desktop) or run
// with `mobile-debug-eval.sh -t <client> run-file`; then reproduce and run
// f07-delete-report.js.
(() => {
  const host = document.querySelector('editor-host');
  const log = (window.__f07 = []);
  const t0 = performance.now();
  const at = () => Math.round(performance.now() - t0);
  const blockOf = node => {
    const el = node?.nodeType === 1 ? node : node?.parentElement;
    return el?.closest?.('[data-block-id]');
  };
  const describe = (node, offset) => {
    if (!node) return null;
    const el = node.nodeType === 1 ? node : node.parentElement;
    const block = blockOf(node);
    const vtext = el?.closest?.('v-text');
    const row = el?.closest?.('[data-row-id]');
    return {
      node: node.nodeType === 3 ? `#text "${node.data.slice(0, 20)}"` : `${node.tagName}.${String(node.className).slice(0, 30)}`,
      offset,
      inVText: !!vtext,
      editable: el?.isContentEditable ?? null,
      block: block ? `${block.tagName.toLowerCase()}#${block.dataset.blockId}` : null,
      row: row?.dataset.rowId ?? null,
    };
  };
  const native = () => {
    const s = document.getSelection();
    if (!s || !s.rangeCount) return null;
    return { anchor: describe(s.anchorNode, s.anchorOffset), focus: describe(s.focusNode, s.focusOffset), text: s.toString().slice(0, 60) };
  };
  const std = () => host.std.selection.value.map(s => {
    const j = s.toJSON();
    return j.type === 'text' ? `text ${j.from.blockId}[${j.from.index},${j.from.length}]${j.to ? ` -> ${j.to.blockId}[${j.to.index},${j.to.length}]` : ''}` : `${j.type} ${j.blockId ?? ''}`;
  });
  const textOf = id => host.std.store.getBlock(id)?.model?.props?.text?.toString?.();
  const touched = () => {
    const ids = new Set();
    const s = document.getSelection();
    for (const n of [s?.anchorNode, s?.focusNode]) { const b = blockOf(n); if (b) ids.add(b.dataset.blockId); }
    for (const sel of host.std.selection.value) { const j = sel.toJSON(); if (j.from) ids.add(j.from.blockId); if (j.to) ids.add(j.to.blockId); if (j.blockId) ids.add(j.blockId); }
    return [...ids];
  };
  const snapshot = ids => Object.fromEntries(ids.map(id => [id, textOf(id)]));
  const record = (ev, extra = {}) => {
    const ids = touched();
    const before = snapshot(ids);
    const entry = { t: at(), ev, ...extra, native: native(), std: std(), before };
    log.push(entry);
    requestAnimationFrame(() => { entry.after = snapshot(ids); entry.stdAfter = std(); });
  };
  document.addEventListener('keydown', e => {
    if (['Backspace', 'Delete'].includes(e.key) || ((e.metaKey || e.ctrlKey) && e.key === 'x')) record('key ' + e.key);
  }, true);
  document.addEventListener('beforeinput', e => {
    if (!e.inputType.startsWith('delete')) return;
    const r = e.getTargetRanges?.()[0];
    record('beforeinput ' + e.inputType, { targetRange: r ? { start: describe(r.startContainer, r.startOffset), end: describe(r.endContainer, r.endOffset) } : null });
  }, true);
  document.addEventListener('cut', () => record('cut'), true);
  console.log('F-07 probe on; reproduce, then run f07-delete-report.js');
  return 'F-07 probe on';
})();
