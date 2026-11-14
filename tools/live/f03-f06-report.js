// Paste after reproducing: prints the probe log and copies it.
(() => { const s = JSON.stringify(window.__probe, null, 1); try { copy(s); } catch {} console.log(s); return window.__probe.length + ' entries (copied)'; })();
