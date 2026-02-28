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
  finalTextSource?: 'chat_final' | 'result_payload_last' | 'fallback_summary';
  payloadTextCount?: number;
  error?: string;
}

export interface IronclawToolPayload {
  phase: string;
  name: string;
  toolCallId: string | null;
  args: unknown;
  meta: unknown;
  isError: boolean;
}

export interface IronclawRunEvent {
  runId: string | null;
  kind: 'thinking' | 'tool' | 'started' | 'delta' | 'completed' | 'failed';
  message: string;
  delta?: string;
  snapshot?: string;
  tool?: IronclawToolPayload;
  finalText?: string | null;
}

export interface IronclawRunHandle {
  cancel: () => void;
  done: Promise<IronclawRunResult>;
}

export interface IronclawRunOptions {
  prompt: string;
  agentId: string;
  sessionKey?: string;
  lane?: 'main' | 'web' | 'subagent' | 'cron' | 'nested';
  thinking?: 'off' | 'minimal' | 'low' | 'medium' | 'high';
  onEvent: (event: IronclawRunEvent) => void;
}

interface IronclawRuntimeOptions {
  profile: string;
  binary?: string;
  timeoutMs?: number;
  suppressGatewayAutoOpen?: boolean;
}

export function buildIronclawRunArgs(
  profile: string,
  options: Pick<IronclawRunOptions, 'prompt' | 'agentId' | 'sessionKey' | 'lane' | 'thinking'>,
): string[] {
  const args = ['--profile', profile, 'agent', '--agent', options.agentId, '--message', options.prompt, '--stream-json'];
  if (typeof options.sessionKey === 'string' && options.sessionKey.trim()) {
    args.push('--session-key', options.sessionKey.trim());
  }
  if (typeof options.lane === 'string' && options.lane.trim()) {
    args.push('--lane', options.lane.trim());
  }
  if (typeof options.thinking === 'string' && options.thinking.trim()) {
    args.push('--thinking', options.thinking.trim());
  }
  return args;
}

function parseToolPayload(value: unknown): IronclawToolPayload | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  const data = value as Record<string, unknown>;
  const phase = typeof data.phase === 'string' ? data.phase : '';
  const name = typeof data.name === 'string' ? data.name : '';
  if (!phase && !name) {
    return null;
  }
  return {
    phase,
    name,
    toolCallId: typeof data.toolCallId === 'string' ? data.toolCallId : null,
    args: Object.prototype.hasOwnProperty.call(data, 'args') ? data.args : null,
    meta: Object.prototype.hasOwnProperty.call(data, 'meta') ? data.meta : null,
    isError: data.isError === true,
  };
}

function describeToolEvent(tool: IronclawToolPayload): string {
  const baseName = tool.name || 'tool';
  if (tool.phase === 'start') {
    return `Starting ${baseName}`;
  }
  if (tool.phase === 'result') {
    return tool.isError ? `${baseName} failed` : `${baseName} completed`;
  }
  return `${baseName} ${tool.phase || 'event'}`.trim();
}

function textFromContentArray(content: unknown): string | null {
  if (!Array.isArray(content)) {
    return null;
  }
  const chunks: string[] = [];
  for (const item of content) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      continue;
    }
    const record = item as Record<string, unknown>;
    if (typeof record.text === 'string' && record.text.trim()) {
      chunks.push(record.text);
    }
  }
  const joined = chunks.join('');
  return joined.trim() ? joined : null;
}

function textFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }
  const record = payload as Record<string, unknown>;
  if (typeof record.text === 'string' && record.text.trim()) {
    return record.text;
  }
  if (typeof record.content === 'string' && record.content.trim()) {
    return record.content;
  }
  return textFromContentArray(record.content);
}

function textFromChatMessage(message: unknown): string | null {
  if (!message || typeof message !== 'object' || Array.isArray(message)) {
    return null;
  }
  const record = message as Record<string, unknown>;
  if (typeof record.text === 'string' && record.text.trim()) {
    return record.text;
  }
  return textFromContentArray(record.content);
}

export function parseIronclawEventLine(
  line: string,
  previousRunId: string | null,
): {
  runId: string | null;
  events: IronclawRunEvent[];
  finalResult: IronclawRunResult | null;
} {
  const trimmed = line.trim();
  if (!trimmed) {
    return {
      runId: previousRunId,
      events: [],
      finalResult: null,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return {
      runId: previousRunId,
      events: [],
      finalResult: null,
    };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      runId: previousRunId,
      events: [],
      finalResult: null,
    };
  }

  const eventRecord = parsed as Record<string, unknown>;
  const runId = typeof eventRecord.runId === 'string' ? eventRecord.runId : previousRunId;
  const events: IronclawRunEvent[] = [];

  const eventType = typeof eventRecord.event === 'string' ? eventRecord.event : '';
  if (eventType === 'agent') {
    const stream = typeof eventRecord.stream === 'string' ? eventRecord.stream : '';
    const data =
      eventRecord.data && typeof eventRecord.data === 'object' && !Array.isArray(eventRecord.data)
        ? (eventRecord.data as Record<string, unknown>)
        : null;

    if (stream === 'health') {
      return {
        runId,
        events,
        finalResult: null,
      };
    }

    if (stream === 'lifecycle' && data?.phase === 'start') {
      events.push({
        runId,
        kind: 'started',
        message: 'IronClaw run started.',
      });
      return {
        runId,
        events,
        finalResult: null,
      };
    }

    if (stream === 'assistant') {
      const delta = typeof data?.delta === 'string' ? data.delta : '';
      const snapshot = typeof data?.text === 'string' ? data.text : '';
      if (delta || snapshot) {
        events.push({
          runId,
          kind: 'delta',
          message: delta || snapshot,
          delta: delta || undefined,
          snapshot: snapshot || undefined,
        });
      }
      return {
        runId,
        events,
        finalResult: null,
      };
    }

    if (stream === 'thinking') {
      const delta = typeof data?.delta === 'string' ? data.delta : '';
      if (delta) {
        events.push({
          runId,
          kind: 'thinking',
          message: delta,
          delta,
        });
      }
      return {
        runId,
        events,
        finalResult: null,
      };
    }

    if (stream === 'tool') {
      const tool = parseToolPayload(data);
      if (tool) {
        events.push({
          runId,
          kind: 'tool',
          message: describeToolEvent(tool),
          tool,
        });
      }
      return {
        runId,
        events,
        finalResult: null,
      };
    }

    return {
      runId,
      events,
      finalResult: null,
    };
  }

  if (eventType === 'chat') {
    const state = typeof eventRecord.state === 'string' ? eventRecord.state : '';
    const text = textFromChatMessage(eventRecord.message);
    if (!text) {
      return {
        runId,
        events,
        finalResult: null,
      };
    }
    if (state === 'delta') {
      events.push({
        runId,
        kind: 'delta',
        message: text,
        snapshot: text,
      });
    } else if (state === 'final') {
      events.push({
        runId,
        kind: 'delta',
        message: text,
        snapshot: text,
        finalText: text,
      });
    }
    return {
      runId,
      events,
      finalResult: null,
    };
  }

  if (eventType === 'result') {
    const status = typeof eventRecord.status === 'string' ? eventRecord.status : 'error';
    const summary = typeof eventRecord.summary === 'string' ? eventRecord.summary : status;
    const result =
      eventRecord.result && typeof eventRecord.result === 'object' && !Array.isArray(eventRecord.result)
        ? (eventRecord.result as Record<string, unknown>)
        : null;
    const payloads = Array.isArray(result?.payloads)
      ? result.payloads
      : Array.isArray(eventRecord.payloads)
        ? eventRecord.payloads
        : [];
    const payloadTexts = payloads
      .map((payload) => textFromPayload(payload))
      .filter((text): text is string => typeof text === 'string' && text.trim().length > 0);
    const finalText = payloadTexts[payloadTexts.length - 1] ?? null;

    const ok = status === 'ok';
    const finalResult: IronclawRunResult = {
      ok,
      runId,
      summary,
      finalText,
      finalTextSource: finalText ? 'result_payload_last' : 'fallback_summary',
      payloadTextCount: payloadTexts.length,
      error: ok ? undefined : summary,
    };
    events.push({
      runId,
      kind: ok ? 'completed' : 'failed',
      message: summary,
      finalText,
    });
    return {
      runId,
      events,
      finalResult,
    };
  }

  return {
    runId,
    events,
    finalResult: null,
  };
}

export class IronclawRuntime {
  private readonly profile: string;

  private readonly binary: string;

  private readonly timeoutMs: number;

  private readonly suppressGatewayAutoOpen: boolean;

  constructor(options: IronclawRuntimeOptions) {
    this.profile = options.profile;
    this.binary = options.binary ?? 'ironclaw';
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.suppressGatewayAutoOpen = options.suppressGatewayAutoOpen !== false;
  }

  private async runCommand(
    args: string[],
    options?: {
      env?: NodeJS.ProcessEnv;
    },
  ): Promise<{ stdout: string; stderr: string }> {
    const result = await execFileAsync(this.binary, args, {
      timeout: this.timeoutMs,
      maxBuffer: 8 * 1024 * 1024,
      env: options?.env ?? process.env,
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
    const preflight = await this.probe();
    if (preflight.connected) {
      return preflight;
    }

    const suppressAutoOpenEnv = this.suppressGatewayAutoOpen
      ? {
          ...process.env,
          SSH_TTY: '1',
          SSH_CLIENT: '127.0.0.1 0 0',
          DISPLAY: '',
          WAYLAND_DISPLAY: '',
        }
      : undefined;
    if (this.suppressGatewayAutoOpen && process.env.NODE_ENV !== 'production' && !process.env.VITEST) {
      process.stderr.write('[yogurt][ironclaw] reconnect using auto-open suppression env\n');
    }
    try {
      await this.runCommand(
        this.profileArgs('gateway', 'start'),
        suppressAutoOpenEnv ? { env: suppressAutoOpenEnv } : undefined,
      );
    } catch {
      // Reconnect attempts still proceed to probe for a final state snapshot.
    }
    return await this.probe();
  }

  startRun(options: IronclawRunOptions): IronclawRunHandle {
    const args = buildIronclawRunArgs(this.profile, options);

    const child = spawn(this.binary, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });

    const out = readline.createInterface({ input: child.stdout });
    const err = readline.createInterface({ input: child.stderr });

    let lastRunId: string | null = null;
    let finalResult: IronclawRunResult | null = null;
    let lastObservedChatFinalText: string | null = null;
    let stderrLines: string[] = [];

    const emit = (event: IronclawRunEvent): void => {
      options.onEvent(event);
    };

    out.on('line', (line) => {
      const parsed = parseIronclawEventLine(line, lastRunId);
      lastRunId = parsed.runId;
      if (parsed.finalResult) {
        finalResult = parsed.finalResult;
      }
      for (const event of parsed.events) {
        if (event.kind === 'delta' && typeof event.finalText === 'string' && event.finalText.trim()) {
          lastObservedChatFinalText = event.finalText;
        }
        emit(event);
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

        const chatFinalText =
          typeof lastObservedChatFinalText === 'string' && lastObservedChatFinalText.trim()
            ? lastObservedChatFinalText
            : null;

        if (finalResult) {
          if (chatFinalText) {
            resolve({
              ...finalResult,
              finalText: chatFinalText,
              finalTextSource: 'chat_final',
            });
            return;
          }
          if (!finalResult.finalText) {
            resolve({
              ...finalResult,
              finalText: finalResult.summary || null,
              finalTextSource: 'fallback_summary',
            });
            return;
          }
          resolve(finalResult);
          return;
        }

        if (code === 0 && chatFinalText) {
          resolve({
            ok: true,
            runId: lastRunId,
            summary: 'completed',
            finalText: chatFinalText,
            finalTextSource: 'chat_final',
          });
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
