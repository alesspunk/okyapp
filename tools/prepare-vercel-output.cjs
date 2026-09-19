const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'storybook-static');
const demo = 'oky-cash-prototype-demo.html';
const canonical = path.join(root, 'prototypes/oky-cash/index.html');

// Only replace identical standalone exports with aliases. Fail on drift so a
// newer prototype can never silently disappear from one of its existing URLs.
if (!fs.readFileSync(path.join(output, demo)).equals(fs.readFileSync(canonical))) {
  throw new Error('Prototype exports differ; synchronize images/' + demo + ' and prototypes/oky-cash/index.html before building.');
}

// Storybook already copies images/ to the output root. /images/* is served
// from that single copy by vercel.json, including nested asset directories.
for (const name of fs.readdirSync(root)) {
  if (/^mockup-.*\.html$/.test(name) || name === 'mockups.html') {
    fs.copyFileSync(path.join(root, name), path.join(output, name));
  }
}
fs.mkdirSync(path.join(output, 'stories'), { recursive: true });
for (const name of ['mars.css', 'Organisms.Carrusel.template.js']) {
  fs.copyFileSync(path.join(root, 'stories', name), path.join(output, 'stories', name));
}
fs.cpSync(path.join(root, 'prototypes'), path.join(output, 'prototypes'), { recursive: true });
fs.unlinkSync(path.join(output, demo));
