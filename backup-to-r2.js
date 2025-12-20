#!/usr/bin/env node

/**
 * Backup the entire autonomous-coding-agent project to a specified R2 bucket.
 * Usage: node backup-to-r2.js [bucket-name]
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BUCKET = process.argv[2] || 'autonomous-coding-agent';

// Files and directories to ignore
const IGNORE = new Set([
    'node_modules',
    '.git',
    '.DS_Store',
    'dist',
    '.wrangler',
    'backup-to-r2.js' // don't backup the backup script itself if you want, but it's fine
]);

function guessContentType(filePath) {
    const lower = filePath.toLowerCase();
    if (lower.endsWith('.html')) return 'text/html; charset=utf-8';
    if (lower.endsWith('.css')) return 'text/css; charset=utf-8';
    if (lower.endsWith('.js')) return 'text/javascript; charset=utf-8';
    if (lower.endsWith('.ts')) return 'text/typescript; charset=utf-8';
    if (lower.endsWith('.json')) return 'application/json; charset=utf-8';
    if (lower.endsWith('.md')) return 'text/markdown; charset=utf-8';
    if (lower.endsWith('.sql')) return 'application/sql; charset=utf-8';
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.svg')) return 'image/svg+xml';
    if (lower.endsWith('.toml')) return 'application/toml; charset=utf-8';
    if (lower.endsWith('.sh')) return 'application/x-sh; charset=utf-8';
    return 'application/octet-stream';
}

function walk(dir, base = dir) {
    const out = [];
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (IGNORE.has(ent.name)) continue;

        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            out.push(...walk(p, base));
        } else if (ent.isFile()) {
            out.push(p);
        }
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
    try {
        console.log(`Uploading: ${key} (${contentType})`);
        execFileSync('wrangler', args, { stdio: 'inherit', cwd: ROOT });
    } catch (err) {
        console.error(`Failed to upload ${key}:`, err.message);
    }
}

function main() {
    console.log(`\n?? Starting backup to R2 bucket: ${BUCKET}\n`);

    const files = walk(ROOT);

    for (const file of files) {
        const rel = path.relative(ROOT, file).replace(/\\/g, '/');
        const contentType = guessContentType(file);
        runWranglerPut(rel, file, contentType);
    }

    console.log(`\n? Backup complete! All files uploaded to ${BUCKET}.\n`);
}

main();

