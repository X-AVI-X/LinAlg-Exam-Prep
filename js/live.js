// Visitor stats in the sidebar: total visits (Abacus counter API) and people online now
// (presence pings over the public HiveMQ MQTT broker). Both are free and need no account;
// if either service is unreachable the site keeps working and just shows "–".
(function () {
  const el = document.getElementById('liveStats');
  if (!el || !location.protocol.startsWith('http')) return;

  const COUNTER = 'https://abacus.jasoncameron.dev';
  const NS = 'x-avi-x-linalg-exam-prep', KEY = 'site-visits';
  const BROKER = 'wss://broker.hivemq.com:8884/mqtt';
  const TOPIC = 'x-avi-x/linalg-exam-prep/presence/v1';
  const PING_MS = 20000, STALE_MS = 50000;

  let online = null, visits = null;
  const fmt = (n) => (n == null ? '–' : n.toLocaleString());
  function render() {
    el.innerHTML = `<span title="People with the site open right now"><span class="dot"></span>${fmt(online)} online</span>` +
      `<span title="Total visits so far">👀 ${fmt(visits)} visits</span>`;
  }
  render();

  // total visits: count once per browser tab session, otherwise just read
  let counted = false;
  try { counted = sessionStorage.getItem('cse903-counted') === '1'; } catch (e) { /* ignore */ }
  const loadVisits = (mode) => fetch(`${COUNTER}/${mode}/${NS}/${KEY}`)
    .then((r) => r.json())
    .then((d) => {
      if (typeof d.value !== 'number') return;
      visits = d.value;
      try { sessionStorage.setItem('cse903-counted', '1'); } catch (e) { /* ignore */ }
      render();
    })
    .catch(() => {});
  loadVisits(counted ? 'get' : 'hit');
  setInterval(() => loadVisits('get'), 60000);

  // live presence: every tab pings; each tab counts the distinct ids it heard recently
  if (!window.mqtt) return;
  const id = Math.random().toString(36).slice(2, 10);
  const seen = new Map();
  const recount = () => {
    const now = Date.now();
    for (const [k, t] of seen) if (now - t > STALE_MS) seen.delete(k);
    online = Math.max(1, seen.size);
    render();
  };
  try {
    const client = mqtt.connect(BROKER, { clientId: 'cse903-' + id, keepalive: 30, reconnectPeriod: 5000, clean: true });
    const ping = () => client.connected && client.publish(TOPIC, JSON.stringify({ id }));
    client.on('connect', () => {
      // "hello" asks tabs already open to answer at once, so the count is right immediately
      client.subscribe(TOPIC, () => client.publish(TOPIC, JSON.stringify({ id, hello: true })));
      seen.set(id, Date.now());
      recount();
    });
    client.on('message', (topic, payload) => {
      try {
        const m = JSON.parse(payload.toString());
        if (!m || typeof m.id !== 'string' || m.id.length > 16) return;
        if (m.bye) seen.delete(m.id); else seen.set(m.id, Date.now());
        if (m.hello && m.id !== id) ping();
        recount();
      } catch (e) { /* ignore junk on the public topic */ }
    });
    setInterval(() => { ping(); seen.set(id, Date.now()); recount(); }, PING_MS);
    window.addEventListener('pagehide', () => { try { client.publish(TOPIC, JSON.stringify({ id, bye: true })); client.end(); } catch (e) { /* ignore */ } });
  } catch (e) { /* broker unavailable */ }
})();
