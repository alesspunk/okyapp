const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const extensions = { 'image/png': 'png', 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'font/woff2': 'woff2', 'font/ttf': 'ttf', 'font/otf': 'otf' };

function buildWebPrototype(output) {
  const canonical = path.join(output, 'prototypes/oky-cash/index.html');
  const original = fs.readFileSync(canonical, 'utf8');
  const webDir = path.join(output, 'prototypes/oky-cash-web');
  const existing = new Map();
  function scan(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'prototypes') scan(file);
      } else if (/\.(png|webp|jpe?g|gif|svg|woff2?|ttf|otf)$/i.test(entry.name)) {
        const hash = digest(fs.readFileSync(file));
        if (!existing.has(hash)) existing.set(hash, '/' + path.relative(output, file).split(path.sep).map(encodeURIComponent).join('/'));
      }
    }
  }
  scan(output);
  fs.mkdirSync(webDir, { recursive: true });
  let references = 0, reused = 0, newBytes = 0;
  const assets = new Map();
  let html = original.replace(/data:([^;,\s]+);base64,([A-Za-z0-9+/=]+)/g, (uri, mime, encoded) => {
    if (!extensions[mime]) throw new Error('Unsupported embedded MIME: ' + mime);
    const bytes = Buffer.from(encoded, 'base64');
    if (bytes.toString('base64') !== encoded) throw new Error('Invalid embedded base64');
    const hash = digest(bytes);
    references++;
    let url = existing.get(hash);
    if (url) reused++;
    else {
      const name = hash + '.' + extensions[mime];
      const dir = path.join(webDir, 'assets');
      fs.mkdirSync(dir, { recursive: true });
      if (!assets.has(hash)) {
        fs.writeFileSync(path.join(dir, name), bytes);
        newBytes += bytes.length;
      }
      url = '/prototypes/oky-cash-web/assets/' + name;
    }
    assets.set(hash, { url, bytes: bytes.length });
    return url;
  });
  // Only the web derivative gets its own country-switch URL namespace.
  const oldRoute = String.raw`/\/prototypes\/oky-cash$/`;
  const newRoute = String.raw`/\/prototypes\/oky-cash-web$/`;
  if (!html.includes(oldRoute)) throw new Error('Country URL logic changed; review web route adaptation');
  html = html.replace(oldRoute, newRoute);
  if (/data:[^;,\s]+;base64,/.test(html)) throw new Error('Embedded assets remain');
  fs.writeFileSync(path.join(webDir, 'index.html'), html);
  return { originalBytes: Buffer.byteLength(original), htmlBytes: Buffer.byteLength(html), references, reused, uniqueAssets: assets.size, newAssetBytes: newBytes };
}

module.exports = { buildWebPrototype };
if (require.main === module) {
  console.log(JSON.stringify(buildWebPrototype(path.resolve(process.argv[2] || path.join(__dirname, '../storybook-static'))), null, 2));
}
