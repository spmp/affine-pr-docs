// Focus / caret probe (F-03, F-06): attaches to the last table on the page.
(() => {
  const host = document.querySelector('editor-host');
  const dbs = document.querySelectorAll('affine-database');
  const db = dbs[dbs.length - 1];
  const log = (window.__probe2 = []);
  const t0 = performance.now();
  const at = () => Math.round(performance.now() - t0);
  const where = el => {
    if (!el?.closest) return el?.tagName;
    const row = el.closest('data-view-table-row');
    const cell = el.closest('dv-table-view-cell-container');
    return `${el.tagName}.${String(el.className).slice(0, 25)}${row ? ' row#' + row.dataset.rowIndex : ''}${cell ? ' col:' + cell.dataset.columnId : ''}${db?.contains(el) ? '' : ' (outside table)'}`;
  };
  const sel = () => host.std.selection.value.map(s => s.type + (s.viewSelection ? ':' + s.viewSelection.selectionType + (s.viewSelection.isEditing ? ':editing' : '') : '')).join(',');
  const stack = () => new Error().stack.split('\n').slice(2, 8).map(s => s.trim().replace(/https?:\/\/[^/]+\/js\//, ''));
  const origFocus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function (...a) { log.push({ t: at(), ev: 'focus()', on: where(this), sel: sel(), stack: stack() }); return origFocus.apply(this, a); };
  const origSIV = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (...a) { log.push({ t: at(), ev: 'scrollIntoView', on: where(this), stack: stack() }); return origSIV.apply(this, a); };
  document.addEventListener('focusin', e => log.push({ t: at(), ev: 'focusin', on: where(e.composedPath()[0]) }), true);
  for (const ev of ['pointerdown', 'click']) document.addEventListener(ev, e => {
    const target = e.composedPath()[0];
    const menu = target.closest?.('affine-menu, .affine-menu, affine-menu-button');
    setTimeout(() => log.push({ t: at(), ev, on: where(target), text: menu ? (target.textContent || '').trim().slice(0, 30) : undefined, sel: sel(), active: where(document.activeElement?.shadowRoot?.activeElement ?? document.activeElement) }), 30);
  }, true);
  host.addEventListener('keydown', e => log.push({ t: at(), ev: 'key ' + e.key, sel: sel() }), true);
  host.std.store.slots.blockUpdated.subscribe(e => { if (e.type === 'delete') log.push({ t: at(), ev: 'deleted', flavour: e.flavour }); });
  console.log('focus probe on', db?.dataset.blockId);
})();
