#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function parseVersionParts(version) {
  const match = String(version).trim().match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    suffix: match[4] ?? '',
  };
}

function compareVersions(a, b) {
  const left = parseVersionParts(a);
  const right = parseVersionParts(b);
  if (!left || !right) {
    return 0;
  }

  if (left.year !== right.year) return left.year - right.year;
  if (left.month !== right.month) return left.month - right.month;
  if (left.day !== right.day) return left.day - right.day;
  return left.suffix.localeCompare(right.suffix);
}

async function run() {
  const profile = process.env.IRONCLAW_PROFILE ?? 'ironclaw';
  const minimum = process.env.IRONCLAW_MIN_VERSION ?? '2026.2.15-1.7';

  const checks = [];

  try {
    const versionResult = await execFileAsync('ironclaw', ['--version'], { maxBuffer: 1024 * 1024 });
    const version = String(versionResult.stdout ?? '').trim();
    const ok = Boolean(version) && compareVersions(version, minimum) >= 0;
    checks.push({
      check: 'ironclaw-version',
      ok,
      message: ok
        ? `ironclaw ${version} detected`
        : `ironclaw version ${version || 'unknown'} is below minimum ${minimum}`,
    });
  } catch (error) {
    checks.push({
      check: 'ironclaw-binary',
      ok: false,
      message: `ironclaw binary not available (${error instanceof Error ? error.message : String(error)})`,
    });
  }

  try {
    const statusResult = await execFileAsync(
      'ironclaw',
      ['--profile', profile, 'gateway', 'status', '--json'],
      { maxBuffer: 1024 * 1024 * 2 },
    );
    const parsed = JSON.parse(String(statusResult.stdout ?? '{}'));
    const rpcOk = parsed?.rpc?.ok === true;
    checks.push({
      check: 'ironclaw-gateway',
      ok: rpcOk,
      message: rpcOk
        ? `gateway reachable at ${parsed?.rpc?.url ?? 'unknown'}`
        : 'gateway is not reachable for selected profile',
    });
  } catch (error) {
    checks.push({
      check: 'ironclaw-gateway',
      ok: false,
      message: `failed to query gateway status (${error instanceof Error ? error.message : String(error)})`,
    });
  }

  const ok = checks.every((item) => item.ok);
  const payload = {
    ok,
    profile,
    minimumVersion: minimum,
    checks,
    remediation: ok
      ? []
      : [
          'Install or update ironclaw: npm install -g ironclaw@latest',
          `Ensure profile exists and gateway is running: ironclaw --profile ${profile} gateway status --json`,
          `Start gateway if needed: ironclaw --profile ${profile} gateway start`,
        ],
  };

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  if (!ok) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  process.stderr.write(`ironclaw-bootstrap failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});

