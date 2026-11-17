// F-17/F-18 probe: Enter inserting a newline instead of a new item /
// paragraph. For each Enter: every editor host's dispatcher `active` flag,
// whether keydown was handled (defaultPrevented), and whether a
// beforeinput insertParagraph / insertLineBreak followed (the newline
// path), with the block and the text before and after. Report: return
// window.__f17.
(() => {
  window.__f17stop?.();
  const log = (window.__f17 = []);
  const blockOf = () => {
    const n = document.getSelection()?.anchorNode;
    const el = n?.nodeType === 1 ? n : n?.parentElement;
    const b = el?.closest?.('[data-block-id]');
    const host = el?.closest?.('editor-host');
    return { el: b, host, id: b?.dataset.blockId, tag: b?.tagName.toLowerCase() };
  };
  const textOf = (host, id) => host?.std?.store?.getBlock(id)?.model?.props?.text?.toString?.();
  const typeOf = (host, id) => host?.std?.store?.getBlock(id)?.model?.props?.type;
  const onKey = e => {
    if (e.key !== 'Enter' || e.isComposing) return;
    const b = blockOf();
    const hosts = [...document.querySelectorAll('editor-host')].map((h, i) => ({ i, doc: h.std.store.id, active: h.std.event.active, containsCaret: h === b.host }));
    const entry = { t: Math.round(performance.now()), shift: e.shiftKey, block: `${b.tag}#${b.id}`, type: typeOf(b.host, b.id), textBefore: textOf(b.host, b.id)?.slice(-40), hosts, beforeinput: null };
    log.push(entry);
    setTimeout(() => { entry.keydownPrevented = e.defaultPrevented; const a = blockOf(); entry.after = { block: `${a.tag}#${a.id}`, type: typeOf(a.host, a.id), text: textOf(a.host, a.id)?.slice(-40), oldBlockText: textOf(b.host, b.id)?.slice(-40) }; }, 150);
  };
  const onBeforeInput = e => {
    if (!/insertParagraph|insertLineBreak/.test(e.inputType)) return;
    const last = log.at(-1);
    if (last && performance.now() - last.t < 300) last.beforeinput = e.inputType;
  };
  document.addEventListener('keydown', onKey, true);
  document.addEventListener('beforeinput', onBeforeInput, true);
  window.__f17stop = () => { document.removeEventListener('keydown', onKey, true); document.removeEventListener('beforeinput', onBeforeInput, true); };
  return 'F-17 Enter probe on';
})();
