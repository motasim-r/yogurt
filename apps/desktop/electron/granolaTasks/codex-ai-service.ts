import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import { IronclawRuntime } from '../../../../packages/execution-ironclaw/src/ironclaw-runtime.js';
import type {
  CodexAIActionInput,
  CodexAIActionResult,
  CodexAIStatus,
} from '../../src/shared/types.js';

const execFileAsync = promisify(execFile);
const DEFAULT_MODEL_LABEL = 'Codex / Auto';

interface CodexModelsStatusProfile {
  profileId?: string | null;
  expiresAt?: string | null;
  remainingMs?: number | null;
}

interface CodexModelsStatusProvider {
  provider?: string;
  status?: string;
  profiles?: CodexModelsStatusProfile[];
}

interface CodexAIServiceOptions {
  profile?: string;
  agentId?: string;
  binary?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toStringSafe(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

function compactSingleLine(value: string, maxLength = 600): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 3)}...`;
}

export function codexStateDir(profile: string): string {
  return path.join(os.homedir(), `.openclaw-${profile}`);
}

export function codexAuthProfilesPath(profile: string): string {
  return path.join(codexStateDir(profile), 'agents', 'main', 'agent', 'auth-profiles.json');
}

export function parseCodexProvider(modelsJson: unknown): {
  connected: boolean;
  state: CodexAIStatus['state'];
  profileId: string | null;
  expiresAt: string | null;
  remainingMs: number | null;
  reason: string | null;
} {
  const providersRaw =
    isRecord(modelsJson) &&
    isRecord(modelsJson.auth) &&
    isRecord(modelsJson.auth.oauth) &&
    Array.isArray(modelsJson.auth.oauth.providers)
      ? (modelsJson.auth.oauth.providers as unknown[])
      : [];

  const provider = providersRaw.find(
    (item): item is CodexModelsStatusProvider =>
      isRecord(item) && toStringSafe(item.provider) === 'openai-codex',
  );

  if (!provider) {
    return {
      connected: false,
      state: 'disconnected',
      profileId: null,
      expiresAt: null,
      remainingMs: null,
      reason: 'No openai-codex OAuth profile found.',
    };
  }

  const profile = Array.isArray(provider.profiles) && provider.profiles.length > 0 ? provider.profiles[0] : null;
  const connected = provider.status === 'ok';
  return {
    connected,
    state: connected ? 'connected' : 'error',
    profileId: typeof profile?.profileId === 'string' ? profile.profileId : null,
    expiresAt: typeof profile?.expiresAt === 'string' ? profile.expiresAt : null,
    remainingMs: typeof profile?.remainingMs === 'number' && Number.isFinite(profile.remainingMs) ? profile.remainingMs : null,
    reason: connected ? null : compactSingleLine(toStringSafe(provider.status) || 'Codex OAuth is unavailable.', 240),
  };
}

export async function removeCodexProfiles(profile: string): Promise<{ ok: boolean; message: string }> {
  const filePath = codexAuthProfilesPath(profile);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return {
        ok: false,
        message: 'Auth profile file is invalid JSON.',
      };
    }

    const keys = Object.keys(parsed).filter((key) => key.startsWith('openai-codex:'));
    if (keys.length === 0) {
      return {
        ok: true,
        message: 'No openai-codex profiles found to remove.',
      };
    }

    for (const key of keys) {
      delete parsed[key];
    }

    await fs.writeFile(filePath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
    return {
      ok: true,
      message: `Removed ${keys.length} openai-codex profile(s).`,
    };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return {
        ok: true,
        message: 'No Codex auth profile file found.',
      };
    }
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Unable to disconnect Codex OAuth.',
    };
  }
}

export class CodexAIService {
  private readonly profile: string;

  private readonly agentId: string;

  private readonly binary: string;

  private readonly runtime: IronclawRuntime;

  constructor(options: CodexAIServiceOptions = {}) {
    this.profile = options.profile ?? 'ironclaw';
    this.agentId = options.agentId ?? 'main';
    this.binary = options.binary ?? 'ironclaw';
    this.runtime = new IronclawRuntime({
      profile: this.profile,
      binary: this.binary,
      suppressGatewayAutoOpen: true,
    });
  }

  private async runCommand(args: string[]): Promise<{ stdout: string; stderr: string }> {
    const result = await execFileAsync(this.binary, args, {
      timeout: 20_000,
      maxBuffer: 8 * 1024 * 1024,
      env: process.env,
    });
    return {
      stdout: toStringSafe(result.stdout),
      stderr: toStringSafe(result.stderr),
    };
  }

  private buildPrompt(input: CodexAIActionInput): string {
    const contextBlock = input.context
      .map((entry, index) => `${index + 1}. ${compactSingleLine(entry, 2400)}`)
      .join('\n');
    return [
      'You are Yogurt AI, an AI-native work assistant inside a context-rich work app.',
      'Be concise, structured, and practical. Use only the provided context.',
      input.kind === 'task-brief'
        ? 'Return markdown with sections: Goal, Current Context, Risks, Recommended Next Moves.'
        : 'Return markdown with a concise summary and next steps.',
      `Title: ${compactSingleLine(input.title, 180) || 'Untitled request'}`,
      '',
      input.prompt.trim(),
      '',
      'Context:',
      contextBlock || 'No additional context provided.',
    ].join('\n');
  }

  async getStatus(): Promise<CodexAIStatus> {
    const checkedAt = new Date().toISOString();
    let codex: {
      connected: boolean;
      state: CodexAIStatus['state'];
      profileId: string | null;
      expiresAt: string | null;
      remainingMs: number | null;
      reason: string | null;
    } = {
      connected: false,
      state: 'disconnected' as const,
      profileId: null,
      expiresAt: null,
      remainingMs: null,
      reason: 'Codex OAuth status unavailable.',
    };

    try {
      const output = await this.runCommand(['--profile', this.profile, 'models', 'status', '--json']);
      const parsed: unknown = JSON.parse(output.stdout);
      codex = parseCodexProvider(parsed);
    } catch (error) {
      codex = {
        connected: false,
        state: 'error',
        profileId: null,
        expiresAt: null,
        remainingMs: null,
        reason: error instanceof Error ? error.message : 'Unable to inspect Codex OAuth.',
      };
    }

    const gateway = await this.runtime.probe();
    return {
      profile: this.profile,
      state: codex.state,
      connected: codex.connected,
      profileId: codex.profileId,
      expiresAt: codex.expiresAt,
      remainingMs: codex.remainingMs,
      reason: codex.reason ?? gateway.message,
      gatewayState: gateway.connected ? 'connected' : 'disconnected',
      gatewayUrl: gateway.gatewayUrl,
      dashboardUrl: gateway.dashboardUrl,
      modelLabel: DEFAULT_MODEL_LABEL,
      lastCheckedAt: checkedAt,
    };
  }

  async connect(): Promise<{ ok: boolean; launchedInteractive: boolean; message?: string }> {
    if (process.platform !== 'darwin') {
      return {
        ok: false,
        launchedInteractive: false,
        message: 'Codex reconnect currently requires macOS Terminal.',
      };
    }

    const workspaceDir = path.join(codexStateDir(this.profile), 'workspace');
    const command = `ironclaw --profile ${this.profile} onboard --flow advanced --mode local --auth-choice openai-codex --gateway-port 19789 --gateway-bind loopback --gateway-auth token --workspace ${JSON.stringify(workspaceDir)} --install-daemon`;

    try {
      await execFileAsync('osascript', [
        '-e',
        'tell application "Terminal" to activate',
        '-e',
        `tell application "Terminal" to do script ${JSON.stringify(command)}`,
      ]);
      return {
        ok: true,
        launchedInteractive: true,
        message: 'Opened Terminal to reconnect Codex OAuth.',
      };
    } catch (error) {
      return {
        ok: false,
        launchedInteractive: false,
        message: error instanceof Error ? error.message : 'Unable to launch Codex reconnect flow.',
      };
    }
  }

  async disconnect(): Promise<{ ok: boolean; message?: string }> {
    const result = await removeCodexProfiles(this.profile);
    return {
      ok: result.ok,
      message: result.message,
    };
  }

  async generate(input: CodexAIActionInput): Promise<CodexAIActionResult> {
    const status = await this.getStatus();
    if (!status.connected) {
      return {
        ok: false,
        runId: null,
        content: null,
        message: status.reason || 'Codex OAuth is disconnected.',
        modelLabel: DEFAULT_MODEL_LABEL,
      };
    }

    const gateway = await this.runtime.reconnect();
    if (!gateway.connected) {
      return {
        ok: false,
        runId: null,
        content: null,
        message: gateway.message || 'IronClaw gateway is unavailable.',
        modelLabel: DEFAULT_MODEL_LABEL,
      };
    }

    const handle = this.runtime.startRun({
      prompt: this.buildPrompt(input),
      agentId: this.agentId,
      sessionKey: input.sessionKey?.trim() || `yogurt-ai-${Date.now()}`,
      lane: 'main',
      thinking: 'minimal',
      onEvent: () => {
        // Task-detail summarization is handled as a single response in v1.
      },
    });

    try {
      const result = await withTimeout(handle.done, 45_000, 'Codex generation timed out.');
      return {
        ok: result.ok,
        runId: result.runId,
        content: result.finalText || result.summary || null,
        message: result.error || result.summary || 'Completed.',
        modelLabel: DEFAULT_MODEL_LABEL,
      };
    } catch (error) {
      return {
        ok: false,
        runId: null,
        content: null,
        message: error instanceof Error ? error.message : 'Unable to generate Codex response.',
        modelLabel: DEFAULT_MODEL_LABEL,
      };
    }
  }
}
