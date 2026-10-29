// Progress store. Saves to progress.json through server.js when available,
// and always mirrors to localStorage so the site also works when opened as a file.
(function () {
  const KEY = 'cse903-progress';
  const blank = () => ({ topics: {}, solved: {}, quiz: {}, practice: { right: 0, total: 0 }, wrongQs: {} });
  let data = blank();
  let serverOK = false;
  let timer = null;

  function merge(obj) {
    const b = blank();
    return { ...b, ...obj, practice: { ...b.practice, ...(obj && obj.practice) } };
  }
  function status(msg) {
    const el = document.getElementById('saveStatus');
    if (el) el.textContent = msg;
  }
  function readLocal() {
    try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }
  function writeLocal() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* storage blocked */ }
  }

  async function load() {
    const local = readLocal();
    if (location.protocol.startsWith('http')) {
      try {
        const r = await fetch('api/progress', { cache: 'no-store' });
        if (r.ok) {
          const remote = await r.json();
          serverOK = true;
          // prefer whichever copy was saved most recently
          const pick = local && local.savedAt && (!remote.savedAt || local.savedAt > remote.savedAt) ? local : remote;
          data = merge(pick);
          status('💾 Saving to progress.json');
          return;
        }
      } catch (e) { /* no server */ }
    }
    data = merge(local || {});
    status('💾 Saving in this browser (run server.js for progress.json)');
  }

  function save() {
    data.savedAt = new Date().toISOString();
    writeLocal();
    if (!serverOK) return;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const r = await fetch('api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        status(r.ok ? '💾 Saved to progress.json · ' + new Date().toLocaleTimeString() : '⚠ Save failed');
      } catch (e) { status('⚠ Server not reachable – saved in browser'); }
    }, 300);
  }

  window.Progress = {
    load, save,
    get: () => data,
    topicDone: (id) => !!(data.topics[id] && data.topics[id].done),
    setTopicDone(id, v) { data.topics[id] = { ...(data.topics[id] || {}), done: v }; save(); },
    solved: (id) => !!data.solved[id],
    setSolved(id, v) { if (v) data.solved[id] = true; else delete data.solved[id]; save(); },
    recordQuiz(topic, score, total) {
      const q = data.quiz[topic] || { best: 0, attempts: 0, last: 0 };
      const pct = Math.round((100 * score) / total);
      q.attempts++; q.last = pct; q.best = Math.max(q.best, pct);
      data.quiz[topic] = q; save();
    },
    markWrong(qid, wrong) { if (wrong) data.wrongQs[qid] = (data.wrongQs[qid] || 0) + 1; else delete data.wrongQs[qid]; save(); },
    recordPractice(ok) { data.practice.total++; if (ok) data.practice.right++; save(); },
    reset() { data = blank(); save(); },
    exportJSON() { return JSON.stringify(data, null, 2); },
    importJSON(s) { data = merge(JSON.parse(s)); save(); },
  };
})();
