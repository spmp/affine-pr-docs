// Desktop debug poll, for a server whose build has no desktop eval client
// (or no client targeting). Paste into the DevTools console of the one tab
// to debug. It polls every 250 ms (the mobile app every 2 s), so it picks up
// almost every command; snippets sent for it start with
//   if (window.__affineDebugTarget !== 'desk') return { skipped: navigator.userAgent };
// so a phone that grabs one does nothing, and the sender resubmits.
// Stop with: clearInterval(window.__deskPoll)
(() => {
  window.__affineDebugTarget = 'desk';
  if (window.__deskPoll) clearInterval(window.__deskPoll);
  const run = code => new Function(`return (async () => { ${code} })()`)();
  const text = v => { if (typeof v === 'string') return v; try { return JSON.stringify(v) ?? String(v); } catch { return String(v); } };
  let busy = false;
  window.__deskPoll = setInterval(async () => {
    if (busy) return;
    busy = true;
    try {
      const r = await fetch('/api/mobile-debug-eval/pending', { credentials: 'same-origin' }).catch(() => null);
      const p = r && r.ok ? await r.json().catch(() => null) : null;
      if (!p || !p.id || !p.code) return;
      let ok = true, result, error;
      try { result = text(await run(p.code)); } catch (e) { ok = false; error = `${e?.name}: ${e?.message ?? e}`; }
      await fetch('/api/mobile-debug-eval/result', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: p.id, ok, result, error }) }).catch(() => {});
    } finally { busy = false; }
  }, 250);
  return 'desktop debug poll on';
})();
