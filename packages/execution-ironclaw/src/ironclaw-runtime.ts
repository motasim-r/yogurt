import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import readline from 'node:readline';

const execFileAsync = promisify(execFile);

const URL_PATTERN = /(https?:\/\/[^\s]+)/i;

function toStringSafe(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const candidate = trimmed.slice(start, end + 1);
      try {
        return JSON.parse(candidate);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function extractDashboardUrl(raw: string): string | null {
  const match = raw.match(URL_PATTERN);
  return match?.[1] ?? null;
}

export interface IronclawProbe {
  connected: boolean;
  gatewayUrl: string | null;
  dashboardUrl: string | null;
  message: string | null;
}

export interface IronclawRunResult {
  ok: boolean;
  runId: string | null;
  summary: string;
  finalText: string | null;
  error?: string;
}

export interface IronclawRunEvent {
  runId: string | null;
  kind: 'started' | 'delta' | 'completed' | 'failed';
  message: string;
  finalText?: string | null;
}

export interface IronclawRunHandle {
  cancel: () => void;
  done: Promise<IronclawRunResult>;
}

interface IronclawRunOptions {
  prompt: string;
  agentId: string;
  onEvent: (event: IronclawRunEvent) => void;
}

interface IronclawRuntimeOptions {
  profile: string;
  binary?: string;
  timeoutMs?: number;
}

export class IronclawRuntime {
  private readonly profile: string;

  private readonly binary: string;

  private readonly timeoutMs: number;

  constructor(options: IronclawRuntimeOptions) {
    this.profile = options.profile;
    this.binary = options.binary ?? 'ironclaw';
    this.timeoutMs = options.timeoutMs ?? 10_000;
  }

  private async runCommand(args: string[]): Promise<{ stdout: string; stderr: string }> {
    const result = await execFileAsync(this.binary, args, {
      timeout: this.timeoutMs,
      maxBuffer: 8 * 1024 * 1024,
      env: process.env,
    });

    return {
      stdout: toStringSafe(result.stdout),
      stderr: toStringSafe(result.stderr),
    };
  }

  private profileArgs(...args: string[]): string[] {
    return ['--profile', this.profile, ...args];
  }

  async getVersion(): Promise<string | null> {
    try {
      const output = await this.runCommand(['--version']);
      const match = `${output.stdout}\n${output.stderr}`.match(/\d{4}\.\d+\.\d+(?:-[\w.]+)?/);
      return match?.[0] ?? (output.stdout.trim() || null);
    } catch {
      return null;
    }
  }

  async getDashboardUrl(): Promise<string | null> {
    const output = await this.runCommand(this.profileArgs('dashboard', '--no-open'));
    return extractDashboardUrl(`${output.stdout}\n${output.stderr}`);
  }

  async probe(): Promise<IronclawProbe> {
    try {
      const statusOutput = await this.runCommand(this.profileArgs('gateway', 'status', '--json'));
      const parsed = extractJsonObject(statusOutput.stdout);
      const payload =
        parsed && typeof parsed === 'object' && !Array.isArray(parsed)
          ? (parsed as Record<string, unknown>)
          : ({} as Record<string, unknown>);

      const rpc =
        payload.rpc && typeof payload.rpc === 'object' && !Array.isArray(payload.rpc)
          ? (payload.rpc as Record<string, unknown>)
          : null;
      const gateway =
        payload.gateway && typeof payload.gateway === 'object' && !Array.isArray(payload.gateway)
          ? (payload.gateway as Record<string, unknown>)
          : null;
      const port =
        payload.port && typeof payload.port === 'object' && !Array.isArray(payload.port)
          ? (payload.port as Record<string, unknown>)
          : null;

      const connected = rpc?.ok === true;
      const gatewayUrl =
        (typeof rpc?.url === 'string' && rpc.url) ||
        (typeof gateway?.probeUrl === 'string' && gateway.probeUrl) ||
        null;
      const portHints = Array.isArray(port?.hints) ? port.hints : [];
      const hint =
        typeof portHints[0] === 'string'
          ? portHints[0]
          : connected
            ? null
            : 'IronClaw gateway is not reachable.';
      const dashboardUrl = connected ? await this.getDashboardUrl().catch(() => null) : null;

      return {
        connected,
        gatewayUrl,
        dashboardUrl,
        message: hint,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to probe IronClaw runtime.';
      return {
        connected: false,
        gatewayUrl: null,
        dashboardUrl: null,
        message,
      };
    }
  }

  async reconnect(): Promise<IronclawProbe> {
    try {
      await this.runCommand(this.profileArgs('gateway', 'start'));
    } catch {
      // Reconnect attempts still proceed to probe for a final state snapshot.
    }
    return await this.probe();
  }

  startRun(options: IronclawRunOptions): IronclawRunHandle {
    const args = this.profileArgs(
      'agent',
      '--agent',
      options.agentId,
      '--message',
      options.prompt,
      '--stream-json',
    );

    const child = spawn(this.binary, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });

    const out = readline.createInterface({ input: child.stdout });
    const err = readline.createInterface({ input: child.stderr });

    let lastRunId: string | null = null;
    let finalResult: IronclawRunResult | null = null;
    let stderrLines: string[] = [];

    const emit = (event: IronclawRunEvent): void => {
      options.onEvent(event);
    };

    out.on('line', (line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        return;
      }

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return;
      }

      const eventRecord = parsed as Record<string, unknown>;
      const runId = typeof eventRecord.runId === 'string' ? eventRecord.runId : null;
      if (runId) {
        lastRunId = runId;
      }

      const eventType = typeof eventRecord.event === 'string' ? eventRecord.event : '';
      if (eventType === 'agent') {
        const stream = typeof eventRecord.stream === 'string' ? eventRecord.stream : '';
        const data =
          eventRecord.data && typeof eventRecord.data === 'object' && !Array.isArray(eventRecord.data)
            ? (eventRecord.data as Record<string, unknown>)
            : null;

        if (stream === 'lifecycle' && data?.phase === 'start') {
          emit({
            runId: lastRunId,
            kind: 'started',
            message: 'IronClaw run started.',
          });
          return;
        }

        if (stream === 'assistant') {
          const text = typeof data?.text === 'string' ? data.text : typeof data?.delta === 'string' ? data.delta : '';
          if (text) {
            emit({
              runId: lastRunId,
              kind: 'delta',
              message: text,
            });
          }
          return;
        }
      }

      if (eventType === 'result') {
        const status = typeof eventRecord.status === 'string' ? eventRecord.status : 'error';
        const summary = typeof eventRecord.summary === 'string' ? eventRecord.summary : status;
        const result =
          eventRecord.result && typeof eventRecord.result === 'object' && !Array.isArray(eventRecord.result)
            ? (eventRecord.result as Record<string, unknown>)
            : null;
        const payloads = Array.isArray(result?.payloads) ? result.payloads : [];
        const firstPayload =
          payloads[0] && typeof payloads[0] === 'object' && !Array.isArray(payloads[0])
            ? (payloads[0] as Record<string, unknown>)
            : null;
        const finalText = typeof firstPayload?.text === 'string' ? firstPayload.text : null;

        const ok = status === 'ok';
        finalResult = {
          ok,
          runId: lastRunId,
          summary,
          finalText,
          error: ok ? undefined : summary,
        };

        emit({
          runId: lastRunId,
          kind: ok ? 'completed' : 'failed',
          message: summary,
          finalText,
        });
      }
    });

    err.on('line', (line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return;
      }

      stderrLines.push(trimmed);
      if (stderrLines.length > 8) {
        stderrLines = stderrLines.slice(-8);
      }
    });

    const done = new Promise<IronclawRunResult>((resolve) => {
      child.once('close', (code) => {
        out.close();
        err.close();

        if (finalResult) {
          resolve(finalResult);
          return;
        }

        const errorSummary =
          stderrLines.join(' | ') ||
          (code === 0 ? 'IronClaw run ended without a final result.' : `IronClaw exited with code ${String(code)}.`);
        resolve({
          ok: code === 0,
          runId: lastRunId,
          summary: errorSummary,
          finalText: null,
          error: code === 0 ? undefined : errorSummary,
        });
      });
    });

    return {
      cancel: () => {
        if (!child.killed) {
          child.kill('SIGTERM');
        }
      },
      done,
    };
  }
}
