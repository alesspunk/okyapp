const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/alessandroperez/Documents/OKY';

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;

  // Handle extensionless paths like /ATOMIC-DESIGN-LIBRARY
  if (!path.extname(filePath)) {
    filePath = filePath + '.html';
  }

  const fullPath = path.join(BASE_DIR, filePath);

  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const ext = path.extname(fullPath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
