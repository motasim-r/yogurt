#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function getArg(name, fallback = undefined) {
  for (let idx = process.argv.length - 2; idx >= 0; idx -= 1) {
    if (process.argv[idx] === name) {
      return process.argv[idx + 1];
    }
  }
  return fallback;
}

function slugify(input) {
  return (input || 'ui-task')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'ui-task';
}

function timestampNow() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

function runCommand(command, args) {
  const startedAt = Date.now();
  const result = spawnSync(command, args, { encoding: 'utf8' });
  return {
    command: [command, ...args].join(' '),
    exitCode: result.status ?? 1,
    durationMs: Date.now() - startedAt,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

const label = slugify(getArg('--label', 'ui-task'));
const port = Number(getArg('--port', '9222'));
const outArg = getArg('--out', '');
const outputDir = outArg
  ? path.resolve(process.cwd(), outArg)
  : path.resolve(process.cwd(), 'artifacts', `${timestampNow()}-${label}`);

fs.mkdirSync(outputDir, { recursive: true });

const beforePng = path.join(outputDir, 'before.png');
const beforeJson = path.join(outputDir, 'before.json');
const manifestPath = path.join(outputDir, 'manifest.json');

const runs = [];

const screenshotRun = runCommand('npx', ['-y', 'agent-browser', '--cdp', String(port), 'screenshot', beforePng]);
runs.push(screenshotRun);

const snapshotRun = runCommand('npx', ['-y', 'agent-browser', '--cdp', String(port), 'snapshot', '--json']);
runs.push(snapshotRun);

if (snapshotRun.exitCode === 0) {
  fs.writeFileSync(beforeJson, snapshotRun.stdout, 'utf8');
}

const succeeded = runs.every((run) => run.exitCode === 0);
const manifest = {
  timestamp: new Date().toISOString(),
  label,
  port,
  outputDir,
  status: succeeded ? 'ok' : 'error',
  commands: runs.map((run) => ({
    command: run.command,
    exitCode: run.exitCode,
    durationMs: run.durationMs,
    stderr: run.stderr.trim(),
  })),
  files: {
    beforePng: fs.existsSync(beforePng) ? beforePng : null,
    beforeJson: fs.existsSync(beforeJson) ? beforeJson : null,
  },
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

if (succeeded) {
  console.log(`capture_status=ok`);
  console.log(`capture_dir=${outputDir}`);
  console.log(`before_png=${beforePng}`);
  console.log(`before_json=${beforeJson}`);
  process.exit(0);
}

console.error(`capture_status=error`);
console.error(`capture_dir=${outputDir}`);
console.error(`manifest=${manifestPath}`);
for (const run of runs) {
  if (run.exitCode !== 0) {
    console.error(`failed_command=${run.command}`);
    if (run.stderr.trim()) {
      console.error(run.stderr.trim());
    }
  }
}
process.exit(1);
