// Paste probe (F-11): for each copy / paste, the clipboard types (and the
// keys inside BlockSuite's packed snapshot), where the caret was, every
// editor host's selection, whether the event was handled (prevented /
// stopped), and the blocks added by the paste. Report: return window.__paste.
(() => {
  window.__pasteStop?.();
  const log = (window.__paste = []);
  const where = () => {
    const n = document.getSelection()?.anchorNode;
    const el = n?.nodeType === 1 ? n : n?.parentElement;
    let a = document.activeElement; while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
    return {
      block: el?.closest?.('[data-block-id]')?.tagName.toLowerCase() + '#' + el?.closest?.('[data-block-id]')?.dataset.blockId,
      cell: el?.closest?.('dv-table-view-cell-container')?.dataset.columnId ?? null,
      row: el?.closest?.('[data-row-id]')?.dataset.rowId ?? null,
      inRef: el?.closest?.('affine-database-view-ref, affine-database-ref, affine-note-ref')?.tagName.toLowerCase() ?? null,
      active: a ? `${a.tagName.toLowerCase()}.${String(a.className).slice(0, 30)}` : null,
    };
  };
  const hosts = () => [...document.querySelectorAll('editor-host')].map(h => ({ doc: h.std.store.id.slice(0, 8), active: h.std.event.active, sel: h.std.selection.value.map(s => { const j = s.toJSON(); return j.type + (j.viewSelection ? ':' + (j.viewSelection.selectionType ?? j.viewSelection.type) : ''); }).join(',') }));
  const counts = () => Object.fromEntries([...document.querySelectorAll('editor-host')].map(h => [h.std.store.id.slice(0, 8), h.std.store.getAllModels().length]));
  const packedKeys = html => { try { const d = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-blocksuite-snapshot]'); return d ? Object.keys(JSON.parse(decodeURIComponent(d.dataset.blocksuiteSnapshot))) : null; } catch (e) { return 'unreadable: ' + e.message; } };
  const onCopy = e => { setTimeout(async () => { const entry = { ev: e.type, at: Math.round(performance.now()), where: where(), hosts: hosts() }; try { const items = await navigator.clipboard.read(); entry.types = items.flatMap(i => i.types); } catch (err) { entry.readError = String(err); } log.push(entry); }, 300); };
  const onPaste = e => {
    const d = e.clipboardData;
    const html = d?.getData('text/html') ?? '';
    const entry = { ev: 'paste', at: Math.round(performance.now()), types: d ? [...d.types] : null, packed: packedKeys(html), textStart: (d?.getData('text/plain') ?? '').slice(0, 60), where: where(), hosts: hosts(), countsBefore: counts() };
    log.push(entry);
    const origStop = e.stopPropagation.bind(e); let stoppedBy = null;
    e.stopPropagation = () => { stoppedBy = new Error().stack.split('\n').slice(1, 4).map(l => l.trim().slice(0, 90)).join(' < '); origStop(); };
    setTimeout(() => { entry.prevented = e.defaultPrevented; entry.stoppedBy = stoppedBy; entry.countsAfter = counts(); }, 600);
  };
  document.addEventListener('copy', onCopy, true);
  document.addEventListener('paste', onPaste, true);
  window.__pasteStop = () => { document.removeEventListener('copy', onCopy, true); document.removeEventListener('paste', onPaste, true); };
  return 'paste probe on';
})();
