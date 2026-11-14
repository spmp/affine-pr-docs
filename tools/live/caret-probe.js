// F-03 caret probe: who sets a caret / focus in a table text editor.
(() => {
  const log = (window.__probe3 = []);
  const t0 = performance.now();
  const at = () => Math.round(performance.now() - t0);
  const where = el => {
    const row = el.closest?.('data-view-table-row');
    const cell = el.closest?.('dv-table-view-cell-container');
    return `${el.tagName}.${String(el.className).slice(0, 30)}${row ? ' row#' + row.dataset.rowIndex : ''}${cell ? ' col:' + cell.dataset.columnId : ''}`;
  };
  const stack = () => new Error().stack.split('\n').slice(2, 32).map(s => s.trim().replace(/https?:\/\/[^/]+\/js\//, ''));
  const origFocus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function (...a) {
    if (this.closest?.('affine-database')) log.push({ t: at(), ev: 'focus()', on: where(this), stack: stack() });
    return origFocus.apply(this, a);
  };
  const origAdd = Selection.prototype.addRange;
  Selection.prototype.addRange = function (r) {
    const n = r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement;
    if (n?.closest?.('affine-database')) log.push({ t: at(), ev: 'addRange', on: where(n), stack: stack() });
    return origAdd.call(this, r);
  };
  const host = document.querySelector('editor-host');
  host.std.store.slots.blockUpdated.subscribe(e => { if (e.type === 'delete') log.push({ t: at(), ev: 'deleted' }); });
  document.addEventListener('pointerdown', e => {
    const t = e.composedPath()[0];
    log.push({ t: at(), ev: 'pointerdown', on: where(t), text: (t.textContent || '').trim().slice(0, 20) });
  }, true);
  console.log('caret probe ready');
})();
