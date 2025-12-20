#!/usr/bin/env node

/*
Uploads the SPA site assets from ./docs to R2 (remote) so the Worker can serve
real multipage UI:
- docs/index.html   -> index.html
- docs/app.css      -> app.css
- docs/app.js       -> app.js
- docs/folder-icon.png -> folder-icon.png
- docs/components/* -> components/*

Usage:
  node upload-site-assets.js
*/

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DOCS_DIR = path.join(ROOT, 'docs');
const BUCKET = 'autonomous-coding-agent';

function guessContentType(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.html')) return 'text/html; charset=utf-8';
  if (lower.endsWith('.css')) return 'text/css; charset=utf-8';
  if (lower.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.isFile()) out.push(p);
  }
  return out;
}

function runWranglerPut(key, file, contentType) {
  const objectPath = `${BUCKET}/${key}`;
  const args = [
    'r2',
    'object',
    'put',
    objectPath,
    '--file',
    file,
    '--content-type',
    contentType,
    '--remote',
  ];
  execFileSync('wrangler', args, { stdio: 'inherit', cwd: ROOT });
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error('docs/ directory not found:', DOCS_DIR);
    process.exit(1);
  }

  const files = walk(DOCS_DIR);
  const allowed = new Set(['.html', '.css', '.js', '.png', '.svg', '.json']);

  const uploads = [];
  for (const file of files) {
    const rel = path.relative(DOCS_DIR, file).replace(/\\/g, '/');
    const ext = path.extname(rel).toLowerCase();
    if (!allowed.has(ext)) continue;

    // Map docs/index.html -> index.html at bucket root
    const key = rel === 'index.html' ? 'index.html' : rel;
    uploads.push({ key, file, contentType: guessContentType(file) });
  }

  console.log(`Uploading ${uploads.length} files to R2 bucket ${BUCKET} (remote)...`);
  for (const u of uploads) {
    console.log(`\n? ${u.key}`);
    runWranglerPut(u.key, u.file, u.contentType);
  }

  console.log('\n? Site assets uploaded to remote R2.');
}

main();
