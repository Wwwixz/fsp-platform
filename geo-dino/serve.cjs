/* Локальный статический сервер для geo-dino.
   Запуск: node serve.cjs 8099 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.argv[2]) || 8099;
const root = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.md': 'text/markdown; charset=utf-8'
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.normalize(path.join(root, urlPath));
  if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
  fs.stat(file, (err, stats) => {
    if (err || !stats.isFile()) { res.writeHead(404); res.end('not found'); return; }

    const contentType = MIME[path.extname(file)] || 'application/octet-stream';
    const range = req.headers.range;
    if (!range) {
      res.writeHead(200, {
        'Accept-Ranges': 'bytes',
        'Content-Length': stats.size,
        'Content-Type': contentType
      });
      fs.createReadStream(file).pipe(res);
      return;
    }

    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      res.writeHead(416, { 'Content-Range': `bytes */${stats.size}` });
      res.end();
      return;
    }

    const start = match[1] ? Number(match[1]) : Math.max(0, stats.size - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), stats.size - 1) : stats.size - 1;
    if (start >= stats.size || end < start) {
      res.writeHead(416, { 'Content-Range': `bytes */${stats.size}` });
      res.end();
      return;
    }

    res.writeHead(206, {
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Range': `bytes ${start}-${end}/${stats.size}`,
      'Content-Type': contentType
    });
    fs.createReadStream(file, { start, end }).pipe(res);
  });
}).listen(port, '127.0.0.1', () => console.log('serving on http://127.0.0.1:' + port));
