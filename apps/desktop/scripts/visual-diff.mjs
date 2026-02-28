#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

function getArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx === -1 || idx + 1 >= process.argv.length) {
    return fallback;
  }
  return process.argv[idx + 1];
}

const baselinePath = getArg('--baseline', null);
const actualPath = getArg('--actual', null);
const diffPath = getArg('--diff', 'artifacts/visual-diff.png');
const threshold = Number(getArg('--threshold', '0.03'));

if (!baselinePath || !actualPath) {
  console.error('Usage: node scripts/visual-diff.mjs --baseline <png> --actual <png> [--diff <png>] [--threshold 0.03]');
  process.exit(1);
}

if (!fs.existsSync(baselinePath)) {
  console.error(`Baseline image missing: ${baselinePath}`);
  process.exit(1);
}

if (!fs.existsSync(actualPath)) {
  console.error(`Actual image missing: ${actualPath}`);
  process.exit(1);
}

const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
const actual = PNG.sync.read(fs.readFileSync(actualPath));

if (baseline.width !== actual.width || baseline.height !== actual.height) {
  console.error('Image dimensions must match for visual diff');
  process.exit(1);
}

const diff = new PNG({ width: baseline.width, height: baseline.height });
const pixelDiff = pixelmatch(
  baseline.data,
  actual.data,
  diff.data,
  baseline.width,
  baseline.height,
  { threshold: 0.1 },
);

const ratio = pixelDiff / (baseline.width * baseline.height);
fs.mkdirSync(path.dirname(diffPath), { recursive: true });
fs.writeFileSync(diffPath, PNG.sync.write(diff));

console.log(`diff_ratio=${ratio.toFixed(6)} threshold=${threshold}`);
console.log(`diff_image=${diffPath}`);

if (ratio > threshold) {
  process.exit(1);
}
