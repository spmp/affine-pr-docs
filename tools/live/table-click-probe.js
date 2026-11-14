// F-06 probe for pages with several tables / own-view references.
(() => {
  const log = (window.__probe4 = []);
  const t0 = performance.now();
  const at = () => Math.round(performance.now() - t0);
  const hosts = () => [...document.querySelectorAll('editor-host')];
  const hostOf = el => {
    let n = el;
    while (n) {
      if (n.tagName === 'EDITOR-HOST') { const i = hosts().indexOf(n); return i === 0 ? 'page' : 'ref' + i; }
      n = n.parentElement ?? n.getRootNode?.()?.host ?? null;
    }
    return '-';
  };
  const where = el => {
    if (!el?.closest) return String(el?.nodeName);
    const row = el.closest('data-view-table-row');
    const cell = el.closest('dv-table-view-cell-container');
    const db = el.closest('affine-database, affine-database-ref, affine-database-view-ref');
    return `${el.tagName}.${String(el.className).slice(0, 22)} [${hostOf(el)}${db ? ' ' + db.tagName.toLowerCase() : ''}${row ? ' row#' + row.dataset.rowIndex : ''}${cell ? ' col:' + cell.dataset.columnId : ''}]`;
  };
  const deepActive = () => { let a = document.activeElement; while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement; return a; };
  const tableSel = el => {
    const t = el?.closest?.('.affine-database-table');
    const s = t?.logic?.selectionController?.selection;
    return s ? `${s.selectionType}${s.isEditing ? ':editing' : ''}${s.focus ? ' r' + s.focus.rowIndex + 'c' + s.focus.columnIndex : ''}` : 'none';
  };
  const stack = () => new Error().stack.split('\n').slice(2, 16).map(s => s.trim().replace(/https?:\/\/[^/]+\/js\//, ''));
  const push = e => { if (log.length < 400) log.push(e); };
  let lastTarget = null;
  const origFocus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function (...a) {
    push({ t: at(), ev: 'focus()', on: where(this), stack: stack() });
    return origFocus.apply(this, a);
  };
  document.addEventListener('focusin', e => push({ t: at(), ev: 'focusin', on: where(e.composedPath()[0]) }), true);
  for (const ev of ['pointerdown', 'mousedown', 'click', 'dblclick']) {
    document.addEventListener(ev, e => {
      const target = e.composedPath()[0];
      if (!target.closest?.('affine-database, affine-database-ref, affine-database-view-ref')) return;
      lastTarget = target;
      push({ t: at(), ev, detail: e.detail, on: where(target), table: tableSel(target), active: where(deepActive()) });
      setTimeout(() => push({ t: at(), ev: ev + ' +100ms', table: tableSel(target), active: where(deepActive()), editable: !!deepActive()?.isContentEditable }), 100);
    }, true);
  }
  document.addEventListener('keydown', e => { if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Escape') push({ t: at(), ev: 'key ' + e.key, table: tableSel(lastTarget), active: where(deepActive()) }); }, true);
  console.log('probe4 ready:', hosts().length, 'editors on the page (1 = page, more = references)');
})();
