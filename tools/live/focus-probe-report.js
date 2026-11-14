(() => { const s = JSON.stringify(window.__probe2, null, 1); try { copy(s); } catch {} console.log(s); return window.__probe2.length + ' entries (copied)'; })();
