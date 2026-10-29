// Tiny zero-dependency server: serves the site and saves progress to progress.json
// Usage:  node server.js     then open http://localhost:3000
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PROGRESS_FILE = path.join(ROOT, 'progress.json');
const PORT = process.env.PORT || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
};

function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/progress') {
    if (req.method === 'GET') {
      fs.readFile(PROGRESS_FILE, 'utf8', (err, data) => send(res, 200, err ? '{}' : data));
      return;
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (c) => { body += c; if (body.length > 2e6) req.destroy(); });
      req.on('end', () => {
        try {
          const obj = JSON.parse(body);
          obj.savedAt = new Date().toISOString();
          fs.writeFile(PROGRESS_FILE, JSON.stringify(obj, null, 2), (err) =>
            err ? send(res, 500, JSON.stringify({ ok: false, error: err.message })) : send(res, 200, '{"ok":true}'));
        } catch (e) {
          send(res, 400, JSON.stringify({ ok: false, error: 'Invalid JSON' }));
        }
      });
      return;
    }
    send(res, 405, '{"ok":false}');
    return;
  }

  let file = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname)));
  if (!file.startsWith(ROOT)) return send(res, 403, 'Forbidden', 'text/plain');
  if (url.pathname === '/') file = path.join(ROOT, 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, 'Not found', 'text/plain');
    send(res, 200, data, TYPES[path.extname(file)] || 'application/octet-stream');
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`CSE 903 exam prep running at http://localhost:${PORT}`);
  console.log(`Progress is saved to ${PROGRESS_FILE}`);
});
