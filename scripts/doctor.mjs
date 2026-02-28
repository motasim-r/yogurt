#!/usr/bin/env node
import { execFile } from 'node:child_process';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function withTimeout(promise, timeoutMs, message) {
  let timer = null;
  return Promise.race([
    promise.finally(() => {
      if (timer) clearTimeout(timer);
    }),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]);
}

async function checkCallbackPort(port = 43110) {
  return await new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (error) => {
      resolve({
        check: 'oauth-callback-port',
        ok: false,
        message: `port ${port} unavailable (${error.message})`,
      });
    });
    server.listen(port, '127.0.0.1', () => {
      server.close(() => {
        resolve({
          check: 'oauth-callback-port',
          ok: true,
          message: `port ${port} is available`,
        });
      });
    });
  });
}

async function checkMcp() {
  const url = process.env.GRANOLA_MCP_URL ?? 'https://mcp.granola.ai/mcp';
  try {
    const response = await withTimeout(
      fetch(url, {
        method: 'GET',
        redirect: 'manual',
      }),
      8000,
      'MCP endpoint timed out',
    );
    return {
      check: 'granola-mcp',
      ok: response.status >= 200 && response.status < 500,
      message: `HTTP ${response.status} from ${url}`,
    };
  } catch (error) {
    return {
      check: 'granola-mcp',
      ok: false,
      message: `failed to reach ${url} (${error instanceof Error ? error.message : String(error)})`,
    };
  }
}

async function checkDataPath() {
  const defaultDataDir = path.join(os.homedir(), 'Library', 'Application Support', 'Granola', 'granola');
  try {
    await fs.mkdir(defaultDataDir, { recursive: true });
    await fs.access(defaultDataDir, fs.constants.R_OK | fs.constants.W_OK);
    return {
      check: 'app-data-path',
      ok: true,
      message: `${defaultDataDir} is readable/writable`,
    };
  } catch (error) {
    return {
      check: 'app-data-path',
      ok: false,
      message: `cannot access ${defaultDataDir} (${error instanceof Error ? error.message : String(error)})`,
    };
  }
}

async function checkLegacySource() {
  const legacyDir = process.env.GRANOLA_OPENCLAW_LEGACY_DATA_DIR ?? '/Users/motasimrahman/Desktop/granola-openclaw/data';
  try {
    await fs.access(legacyDir, fs.constants.R_OK);
    return {
      check: 'legacy-source',
      ok: true,
      message: `legacy source available at ${legacyDir}`,
    };
  } catch {
    return {
      check: 'legacy-source',
      ok: false,
      message: `legacy source missing at ${legacyDir}`,
    };
  }
}

async function checkIronclawBootstrap() {
  try {
    const result = await execFileAsync('node', ['scripts/ironclaw-bootstrap.mjs'], {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 2,
    });
    const parsed = JSON.parse(String(result.stdout ?? '{}'));
    return {
      check: 'ironclaw-bootstrap',
      ok: parsed.ok === true,
      message: parsed.ok ? 'ironclaw bootstrap checks passed' : JSON.stringify(parsed.checks ?? []),
      details: parsed,
    };
  } catch (error) {
    const stdout = String(error?.stdout ?? '').trim();
    const stderr = String(error?.stderr ?? '').trim();
    const detail = stdout || stderr || (error instanceof Error ? error.message : String(error));
    return {
      check: 'ironclaw-bootstrap',
      ok: false,
      message: detail,
    };
  }
}

async function run() {
  const [ironclaw, mcp, callbackPort, dataPath, legacySource] = await Promise.all([
    checkIronclawBootstrap(),
    checkMcp(),
    checkCallbackPort(),
    checkDataPath(),
    checkLegacySource(),
  ]);

  const checks = [ironclaw, mcp, callbackPort, dataPath, legacySource];
  const ok = checks.every((item) => item.ok);
  const payload = {
    ok,
    checkedAt: new Date().toISOString(),
    checks,
  };

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  if (!ok) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  process.stderr.write(`doctor failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});

