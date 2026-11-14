// F-03 / F-06 live probe: paste into DevTools on an empty AFFiNE page.
(async () => {
  const host = document.querySelector('editor-host');
  const store = host.std.store;
  const note = store.getModelsByFlavour('affine:note')[0];
  const dbId = store.addBlock('affine:database', {}, note.id);
  await new Promise(r => setTimeout(r, 300));
  const db = document.querySelector(`affine-database[data-block-id="${dbId}"]`);
  const ds = db.dataSource.value;
  const notesCol = ds.propertyAdd('end', { type: 'rich-text', name: 'Notes' });
  for (let i = 1; i <= 60; i++) {
    const id = ds.rowAdd('end');
    store.getModelById(id)?.props.text?.insert(`Row ${i}`, 0);
  }
  const vm = ds.viewManager ?? db.dataSource.value.viewManager;
  if (!vm.views$?.value?.some?.(v => v.type === 'table')) vm.setCurrentView(vm.viewAdd('table'));
  await new Promise(r => setTimeout(r, 300));

  const log = (window.__probe = []);
  const t0 = performance.now();
  const at = () => Math.round(performance.now() - t0);
  const scroller = (() => {
    let el = db.parentElement;
    while (el) {
      const s = getComputedStyle(el);
      if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight) return el;
      el = el.parentElement ?? el.getRootNode()?.host ?? null;
    }
    return document.scrollingElement;
  })();
  let last = scroller.scrollTop;
  scroller.addEventListener('scroll', () => {
    const now = scroller.scrollTop;
    if (Math.abs(now - last) > 150) log.push({ t: at(), ev: 'JUMP', from: last, to: now });
    last = now;
  }, { passive: true });
  for (const name of ['scrollIntoView', 'scrollTo', 'scrollBy']) {
    for (const proto of [Element.prototype]) {
      const orig = proto[name];
      proto[name] = function (...args) {
        log.push({ t: at(), ev: name, el: this.tagName + '.' + String(this.className).slice(0, 40),
          stack: new Error().stack.split('\n').slice(2, 9).map(s => s.trim()) });
        return orig.apply(this, args);
      };
    }
  }
  const selState = () => {
    const sel = host.std.selection.value.map(s => s.type + (s.viewSelection ? ':' + s.viewSelection.selectionType + (s.viewSelection.isEditing ? ':editing' : '') : ''));
    const a = document.activeElement;
    return { sel, active: a?.tagName + '.' + String(a?.className).slice(0, 30), editable: a?.isContentEditable };
  };
  for (const ev of ['pointerdown', 'click', 'dblclick']) {
    db.addEventListener(ev, e => {
      const cell = e.target.closest?.('dv-table-view-cell-container');
      setTimeout(() => log.push({ t: at(), ev, detail: e.detail, col: cell?.dataset.columnId, target: e.target.tagName, ...selState() }), 50);
    }, true);
  }
  host.addEventListener('keydown', e => { if (['Backspace', 'Delete'].includes(e.key)) log.push({ t: at(), ev: 'key ' + e.key, ...selState(), scrollTop: scroller.scrollTop }); }, true);
  console.log('probe ready: database', dbId, 'Notes column', notesCol, 'scroller', scroller.tagName + '.' + scroller.className);
})();
