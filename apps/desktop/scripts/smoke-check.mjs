#!/usr/bin/env node
import fs from 'node:fs';

const requiredFiles = [
  'dist/index.html',
  'dist-electron/electron/main.js',
  'dist-electron/electron/preload.js',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(file));

if (missing.length > 0) {
  console.error('Smoke check failed. Missing required build artifacts:');
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log('Smoke check passed. Required build artifacts are present.');
