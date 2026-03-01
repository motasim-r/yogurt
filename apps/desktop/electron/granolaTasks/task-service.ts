import crypto from 'node:crypto';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { promisify } from 'node:util';
import { UnauthorizedError } from '@modelcontextprotocol/sdk/client/auth.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
  buildTodoExtractionPrompt,
  createMeetingSourceHash,
  createTodoFingerprint,
  parseExtractedTodos,
} from '../../../../packages/granola-pipeline/src/todo-extractor.js';
import { MeetingsCacheStore } from '../../../../packages/granola-pipeline/src/cache-store.js';
import { EncryptedTokenStore } from '../../../../packages/granola-pipeline/src/token-store.js';
import { TodoStore } from '../../../../packages/granola-pipeline/src/todo-store.js';
import { TaskChatStore, type TaskChatStoreDocument } from './chat-store.js';
import { OAuthCallbackServer } from './oauth-callback.js';
import { IronclawRuntime, type IronclawToolPayload } from '../../../../packages/execution-ironclaw/src/ironclaw-runtime.js';
import { migrateLegacyOpenclawData, type LegacyDataMigrationStatus } from './data-migration.js';
import {
  loadMeetingsWithClient,
  queryGranolaMeetings,
  safeErrorMessage,
} from '../../../../packages/granola-pipeline/src/meeting-sync.js';
import type {
  ExtractedTodoCandidate,
  GranolaMeeting,
  MeetingSyncOptions,
  PersistedAuthDocument,
  SyncMetadata,
  TodoExtractionResult,
  TodoRecord,
  TodoStoreDocument,
} from '../../../../packages/granola-pipeline/src/types.js';
import type {
  GranolaAuthStatus,
  TaskChatMessage,
  TaskChatMessageType,
  TaskChatTrace,
  TaskChatThreadPage,
  TaskExecutionPhase,
  TaskExecutorConnection,
  TaskCounts,
  TaskItemPublic,
  TaskPlanDraft,
  TaskPlanOption,
  TaskPlanningContext,
  TaskStartOptions,
  TasksFeed,
  TasksRealtimeEvent,
  TasksRuntimeCheck,
  TasksRuntimeMetadata,
  TasksSyncHealth,
  TasksConnectionState,
} from '../../src/shared/types.js';

const URL_MATCHER = /https?:\/\/[^\s"'`<>]+/g;
const execFileAsync = promisify(execFile);

interface GranolaTaskServiceOptions {
  dataDir: string;
  mcpUrl?: string;
  tokenEncryptionKey?: string;
  ironclawProfile?: string;
  ironclawAgentId?: string;
  legacyDataDir?: string;
  legacyDataMigrationEnabled?: boolean;
  canonicalProjectPath?: string;
  liveRequestTimeoutMs?: number;
  autoSyncIntervalMs?: number;
  callbackHost?: string;
  callbackPort?: number;
  callbackMaxPort?: number;
  pendingAuthTtlMs?: number;
  autoDisableLegacyGatewayService?: boolean;
  executionSessionScope?: 'per_task' | 'per_run' | 'shared_main';
  progressOnlyAutoRetry?: 'off' | 'once' | 'twice';
  openExternal?: (url: string) => Promise<void> | void;
  allowUnauthenticatedExtraction?: boolean;
  extractTodosForMeeting?: (meeting: GranolaMeeting, prompt: string) => Promise<string>;
}

interface AuthState {
  clientInformation?: unknown;
  tokens?: unknown;
  codeVerifier?: string;
  pendingAuthorizationUrl?: string;
  pendingStartedAt: string | null;
  pendingExpiresAt: string | null;
  lastAuthAt: string | null;
  lastAuthError: string | null;
  lastAuthStage:
    | 'idle'
    | 'starting'
    | 'authorizing'
    | 'callback_received'
    | 'exchanging_code'
    | 'connected'
    | 'failed';
  lastAuthHttpStatus: number | null;
  lastAuthErrorCode: string | null;
  savedAt: string | null;
}

interface CacheState {
  meetings: GranolaMeeting[];
  availableTools: string[];
  warnings: string[];
  warningDetails: string[];
  fetchedAt: string | null;
  syncMetadata: SyncMetadata;
}

interface TodoRuntimeState {
  loaded: boolean;
  todos: TodoRecord[];
  events: TodoStoreDocument['events'];
  metadata: TodoStoreDocument['metadata'];
  saveChain: Promise<void>;
  extractionInFlight: boolean;
  extractionPendingReason: string | null;
  lastExtractionAt: string | null;
  lastExtractionError: string | null;
  lastSubmissionAt: string | null;
  lastSubmissionError: string | null;
}

interface AuthHttpDiagnostic {
  status: number;
  errorCode: string | null;
  bodySnippet: string | null;
}

interface SyncTelemetryEntry {
  createdAt: string;
  reason: string;
  requestCountsByTool: Record<string, number>;
  rateLimitedTools: string[];
  transcriptAttempts: number;
  transcriptSkippedCount: number;
  extractionProcessed: number;
  extractionDeferred: number;
}

interface RunningExecution {
  executionId: string;
  todoId: string;
  startedAt: string;
  startedAtMs: number;
  runId: string | null;
  cancel: () => void;
  heartbeatTimer: NodeJS.Timeout | null;
  lastDeltaAtMs: number;
  assistantMessageId: string | null;
  cancelled: boolean;
}

interface ExecutionQueueRequest {
  executionId: string;
  todoId: string;
  prompt: string;
  retryCount: number;
  requestedAt: string;
  source: 'start' | 'chat';
}

interface ChatRuntimeState {
  loaded: boolean;
  saveChain: Promise<void>;
  migratedStepEventsAt: string | null;
  threads: Record<string, TaskChatMessage[]>;
}

function nowIso(): string {
  return new Date().toISOString();
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeout);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

function clampText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength)}...`;
}

function normalizeTraceString(value: unknown, maxLength = 1200): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? clampText(trimmed, maxLength) : null;
  }
  try {
    return clampText(JSON.stringify(value, null, 2), maxLength);
  } catch {
    return clampText(String(value), maxLength);
  }
}

function toolLabel(name: string): string {
  return name.replace(/[_-]+/g, ' ').trim() || 'tool';
}

function extractUrlCandidates(value: unknown, output: Set<string>, limit = 16, depth = 0): void {
  if (output.size >= limit || depth > 6 || value === null || value === undefined) {
    return;
  }
  if (typeof value === 'string') {
    for (const match of value.matchAll(URL_MATCHER)) {
      const raw = match[0]?.replace(/[),.;\]}]+$/g, '');
      if (!raw) {
        continue;
      }
      output.add(raw);
      if (output.size >= limit) {
        return;
      }
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      extractUrlCandidates(item, output, limit, depth + 1);
      if (output.size >= limit) {
        return;
      }
    }
    return;
  }
  if (typeof value === 'object') {
    for (const nested of Object.values(value as Record<string, unknown>)) {
      extractUrlCandidates(nested, output, limit, depth + 1);
      if (output.size >= limit) {
        return;
      }
    }
  }
}

function domainFromUrl(value: string): string | null {
  try {
    return new URL(value).hostname.replace(/^www\./, '') || null;
  } catch {
    return null;
  }
}

function overlapSuffixPrefix(current: string, chunk: string): number {
  const maxLength = Math.min(current.length, chunk.length);
  for (let length = maxLength; length > 0; length -= 1) {
    if (current.endsWith(chunk.slice(0, length))) {
      return length;
    }
  }
  return 0;
}

function mergeAssistantBuffer(
  current: string,
  incomingDelta: string | undefined,
  incomingSnapshot: string | undefined,
): { next: string; emittedDelta: string; changed: boolean } {
  const delta = (incomingDelta ?? '').toString();
  const snapshot = (incomingSnapshot ?? '').toString();

  if (snapshot) {
    if (snapshot === current) {
      return { next: current, emittedDelta: '', changed: false };
    }
    if (snapshot.startsWith(current)) {
      return {
        next: snapshot,
        emittedDelta: snapshot.slice(current.length),
        changed: true,
      };
    }
    if (!current.startsWith(snapshot) && !delta && snapshot.length > current.length) {
      return {
        next: snapshot,
        emittedDelta: snapshot,
        changed: true,
      };
    }
  }

  if (!delta) {
    return { next: current, emittedDelta: '', changed: false };
  }
  if (current.endsWith(delta)) {
    return { next: current, emittedDelta: '', changed: false };
  }

  const overlap = overlapSuffixPrefix(current, delta);
  const appendChunk = delta.slice(overlap);
  if (!appendChunk) {
    return { next: current, emittedDelta: '', changed: false };
  }
  return {
    next: `${current}${appendChunk}`,
    emittedDelta: appendChunk,
    changed: true,
  };
}

function chatSortKey(message: TaskChatMessage): number {
  const parsed = Date.parse(message.createdAt);
  return Number.isFinite(parsed) ? parsed : 0;
}

function encodeCursor(message: TaskChatMessage): string {
  return `${message.createdAt}::${message.messageId}`;
}

function decodeCursor(value: string | null | undefined): { createdAt: string; messageId: string } | null {
  if (!value) {
    return null;
  }
  const [createdAt, messageId] = value.split('::');
  if (!createdAt || !messageId) {
    return null;
  }
  return { createdAt, messageId };
}

function parseIsoDate(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDateIso(value: string | null): string {
  const parsed = parseIsoDate(value);
  if (parsed === null) {
    return value || 'Unknown';
  }
  return new Date(parsed).toLocaleString();
}

function normalizeTodoStatus(
  status: unknown,
): 'discovered' | 'approved' | 'queued' | 'submitting' | 'submitted' | 'failed' | 'cancelled' {
  switch (status) {
    case 'approved':
    case 'queued':
    case 'submitting':
    case 'submitted':
    case 'failed':
    case 'cancelled':
      return status;
    default:
      return 'discovered';
  }
}

function inferTodoRunState(todo: TodoRecord): 'idle' | 'running' | 'retry_wait' | 'done' | 'blocked' {
  if (todo.status === 'submitting') {
    return 'running';
  }
  if (todo.status === 'submitted') {
    return 'done';
  }
  if (todo.status === 'failed' && todo.guardrail?.verdict === 'blocked') {
    return 'blocked';
  }
  if (todo.nextRetryAt) {
    const retryAt = Date.parse(todo.nextRetryAt);
    if (Number.isFinite(retryAt) && retryAt > Date.now()) {
      return 'retry_wait';
    }
  }
  return 'idle';
}

function ensureTodoTelemetry(todo: TodoRecord): void {
  if (!Array.isArray(todo.stepEvents)) {
    todo.stepEvents = [];
  }

  todo.runState = inferTodoRunState(todo);
  if (!todo.guardrail || typeof todo.guardrail !== 'object') {
    todo.guardrail = {
      mode: 'workspace_only',
      verdict: 'unknown',
      reason: null,
      checkedAt: null,
    };
  }

  if (!todo.openclaw || typeof todo.openclaw !== 'object') {
    todo.openclaw = {
      lastStatus: null,
      lastEndpoint: null,
      lastRunId: null,
      lastResponseAt: null,
      lastError: null,
    };
  }

  if (!todo.latestPublicStep && todo.stepEvents.length > 0) {
    const latest = [...todo.stepEvents].reverse().find((item) => item.publicMessage);
    todo.latestPublicStep = latest?.publicMessage ?? null;
  }
}

function appendTodoStep(todo: TodoRecord, step: string, publicMessage: string, adminMessage: string): void {
  ensureTodoTelemetry(todo);
  const event = {
    step,
    createdAt: nowIso(),
    publicMessage,
    adminMessage,
  };

  todo.stepEvents.push(event);
  if (todo.stepEvents.length > 200) {
    todo.stepEvents = todo.stepEvents.slice(-200);
  }
  todo.latestPublicStep = publicMessage;
}

function todoSortKey(todo: TodoRecord): number {
  const updatedAt = Date.parse(todo.updatedAt ?? '');
  const createdAt = Date.parse(todo.createdAt ?? '');
  if (Number.isFinite(updatedAt)) {
    return updatedAt;
  }
  if (Number.isFinite(createdAt)) {
    return createdAt;
  }
  return 0;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length < 2 || !parts[1]) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(base64, 'base64').toString('utf8');
    const payload: unknown = JSON.parse(json);
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      return payload as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function inferTokenExpiryIso(tokens: unknown): string | null {
  if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
    return null;
  }

  const record = tokens as Record<string, unknown>;
  const expiresAt = record.expires_at ?? record.expiresAt;
  if (typeof expiresAt === 'number' && Number.isFinite(expiresAt)) {
    const ms = expiresAt > 1_000_000_000_000 ? expiresAt : expiresAt * 1000;
    return new Date(ms).toISOString();
  }

  if (typeof record.access_token === 'string') {
    const payload = decodeJwtPayload(record.access_token);
    const exp = payload?.exp;
    if (typeof exp === 'number' && Number.isFinite(exp)) {
      return new Date(exp * 1000).toISOString();
    }
  }

  return null;
}

function inferTokenIdentity(tokens: unknown): string | null {
  if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
    return null;
  }

  const record = tokens as Record<string, unknown>;
  if (typeof record.id_token === 'string') {
    const payload = decodeJwtPayload(record.id_token);
    const identity = payload?.email ?? payload?.sub ?? payload?.name;
    if (typeof identity === 'string') {
      return identity;
    }
  }

  if (typeof record.access_token === 'string') {
    const payload = decodeJwtPayload(record.access_token);
    const identity = payload?.email ?? payload?.sub ?? payload?.name;
    if (typeof identity === 'string') {
      return identity;
    }
  }

  return null;
}

function mergeMeeting(existing: GranolaMeeting | undefined, incoming: GranolaMeeting): GranolaMeeting {
  if (!existing) {
    return incoming;
  }

  return {
    id: incoming.id || existing.id,
    title: incoming.title || existing.title,
    date: incoming.date || existing.date,
    attendees: incoming.attendees.length > 0 ? incoming.attendees : existing.attendees,
    notes: richerText(existing.notes, incoming.notes),
    enhancedNotes: richerText(existing.enhancedNotes, incoming.enhancedNotes),
    privateNotes: richerText(existing.privateNotes, incoming.privateNotes),
    transcript: richerText(existing.transcript, incoming.transcript),
    raw: incoming.raw ?? existing.raw,
  };
}

function richerText(a: string | null, b: string | null): string | null {
  const left = String(a ?? '').trim();
  const right = String(b ?? '').trim();

  if (!left) {
    return right || null;
  }
  if (!right) {
    return left || null;
  }

  return right.length >= left.length ? right : left;
}

function parseDateForSort(value: string | null): number {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function compactWarningLines(input: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const message of input) {
    const normalized = String(message ?? '').replace(/\s+/g, ' ').trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    output.push(normalized);
  }
  return output.slice(0, 4);
}

function formatRetryTime(iso: string | null): string {
  if (!iso) {
    return 'soon';
  }

  const parsed = Date.parse(iso);
  if (!Number.isFinite(parsed)) {
    return iso;
  }

  return new Date(parsed).toLocaleTimeString();
}

function isRateLimitLikeMessage(message: string): boolean {
  const lowered = message.toLowerCase();
  return lowered.includes('rate limit') || lowered.includes('too many requests') || lowered.includes('429');
}

function maxProgressRetryAttempts(mode: 'off' | 'once' | 'twice'): number {
  if (mode === 'twice') {
    return 2;
  }
  if (mode === 'once') {
    return 1;
  }
  return 0;
}

function progressCheckpointLine(value: string): string | null {
  const lines = value
    .split('\n')
    .map((item) => item.replace(/\s+/g, ' ').trim())
    .filter((item) => item.length > 0);
  if (lines.length === 0) {
    return null;
  }

  const progressLine =
    [...lines]
      .reverse()
      .find((item) =>
        /(progress|step\s*\d+\s*\/\s*\d+|working|searching|fetching|running|queued|started|thinking)/i.test(item),
      ) ?? lines[lines.length - 1];
  return progressLine ? clampText(progressLine, 320) : null;
}

function isProgressOnlyFinal(value: string | null | undefined): boolean {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return true;
  }
  if (normalized.length > 420) {
    return false;
  }
  if (/https?:\/\//i.test(normalized)) {
    return false;
  }
  if (/\b(summary|findings|conclusion|next steps|recommend(?:ed|ation)|sources?)\b/i.test(normalized) && normalized.length > 160) {
    return false;
  }

  const progressSignals = [
    /\bprogress update\b/i,
    /\bstep\s*\d+\s*\/\s*\d+\b/i,
    /\b(started|starting|working|thinking|queued|running)\b/i,
    /\b(pulling|gathering|checking|defining)\b/i,
  ];
  const signalCount = progressSignals.reduce((total, matcher) => total + (matcher.test(normalized) ? 1 : 0), 0);
  return signalCount > 0;
}

function defaultSyncMetadata(): SyncMetadata {
  return {
    detailHydratedAtByMeetingId: {},
    transcriptCooldownUntilByMeetingId: {},
    globalTranscriptCooldownUntil: null,
    globalSyncCooldownUntil: null,
    syncRateLimitStreak: 0,
  };
}

function compactMultilineText(value: string | null | undefined, maxLength = 2200): string {
  const normalized = String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!normalized) {
    return '';
  }
  return clampText(normalized, maxLength);
}

function compactSingleLineText(value: unknown, maxLength = 220): string {
  const normalized = String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!normalized) {
    return '';
  }
  return clampText(normalized, maxLength);
}

function parseJsonObjectStrict(text: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function extractJsonObjectFromFence(text: string): Record<string, unknown> | null {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (!match) {
    return null;
  }
  return parseJsonObjectStrict(match[1] ?? '');
}

function extractFirstJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) {
    return null;
  }
  return parseJsonObjectStrict(text.slice(start, end + 1));
}

function normalizePlanSteps(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => compactSingleLineText(item, 240))
      .filter(Boolean)
      .slice(0, 6);
  }
  if (typeof value !== 'string') {
    return [];
  }
  return value
    .split(/\n+/)
    .map((line) => line.replace(/^[\s\-*0-9.)]+/, ''))
    .map((line) => compactSingleLineText(line, 240))
    .filter(Boolean)
    .slice(0, 6);
}

function normalizePlanOptionCandidate(candidate: unknown, fallbackIndex: number): TaskPlanOption | null {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return null;
  }
  const row = candidate as Record<string, unknown>;
  const id = compactSingleLineText(row.id, 60) || `option-${fallbackIndex + 1}`;
  const title = compactSingleLineText(row.title ?? row.name ?? row.option, 120);
  const summary = compactSingleLineText(row.summary ?? row.description ?? row.outcome, 240);
  const why = compactSingleLineText(row.why ?? row.reason ?? row.rationale, 240);
  const steps = normalizePlanSteps(row.steps ?? row.actions ?? row.todo ?? row.plan);
  if (!title || !summary || !why || steps.length === 0) {
    return null;
  }
  return {
    id,
    title,
    summary,
    steps,
    why,
    recommended: row.recommended === true,
  };
}

function fallbackPlanOptions(todo: TodoRecord, meeting: GranolaMeeting | null): TaskPlanOption[] {
  const hasRichMeetingContext = Boolean(
    (meeting?.enhancedNotes && meeting.enhancedNotes.trim()) ||
      (meeting?.notes && meeting.notes.trim()) ||
      (meeting?.transcript && meeting.transcript.trim()),
  );
  const meetingFocus = compactSingleLineText(meeting?.title ?? todo.meetingTitle ?? 'meeting context', 80);
  const taskFocus = compactSingleLineText(todo.title, 80) || 'the task';

  const options: TaskPlanOption[] = [
    {
      id: 'option-1',
      title: 'Fast path execution',
      summary: 'Get to a concrete first answer quickly, then refine only where needed.',
      steps: [
        `Clarify the core outcome for ${taskFocus}`,
        `Pull high-signal evidence from ${meetingFocus}`,
        'Return concise findings and immediate next actions',
      ],
      why: 'Best default when speed and momentum matter.',
      recommended: true,
    },
    {
      id: 'option-2',
      title: 'Evidence-first validation',
      summary: 'Prioritize source quality and reduce risk before making recommendations.',
      steps: ['List key claims to verify', 'Cross-check claims with stronger sources', 'Present decisions with confidence levels'],
      why: 'Best when decisions are high impact or need stronger confidence.',
      recommended: false,
    },
  ];

  if (hasRichMeetingContext) {
    options.push({
      id: 'option-3',
      title: 'Meeting-context deep dive',
      summary: 'Use meeting details and transcript context to shape a tailored plan.',
      steps: ['Extract explicit constraints from notes', 'Resolve ambiguities from transcript context', 'Build a focused execution checklist'],
      why: 'Best when the meeting context contains nuanced requirements.',
      recommended: false,
    });
  }

  return options;
}

function normalizePlanOptions(
  parsedOptions: TaskPlanOption[],
  fallbackOptions: TaskPlanOption[],
  targetCount: number,
): { options: TaskPlanOption[]; recommendedOptionId: string } {
  const candidates = [...parsedOptions, ...fallbackOptions];
  const options: TaskPlanOption[] = [];
  const usedIds = new Set<string>();
  const usedTitles = new Set<string>();
  let preferredRecommendedId: string | null = null;

  for (const candidate of candidates) {
    if (options.length >= targetCount) {
      break;
    }
    const titleKey = candidate.title.trim().toLowerCase();
    if (!titleKey || usedTitles.has(titleKey)) {
      continue;
    }
    let nextId = compactSingleLineText(candidate.id, 64) || `option-${options.length + 1}`;
    if (usedIds.has(nextId)) {
      let suffix = 2;
      while (usedIds.has(`${nextId}-${suffix}`)) {
        suffix += 1;
      }
      nextId = `${nextId}-${suffix}`;
    }
    usedIds.add(nextId);
    usedTitles.add(titleKey);
    if (!preferredRecommendedId && candidate.recommended) {
      preferredRecommendedId = nextId;
    }
    options.push({
      ...candidate,
      id: nextId,
      recommended: false,
    });
  }

  while (options.length < 2 && fallbackOptions.length > 0) {
    const template = fallbackOptions[options.length % fallbackOptions.length] as TaskPlanOption;
    let nextId = `${template.id}-fallback-${options.length + 1}`;
    while (usedIds.has(nextId)) {
      nextId = `${nextId}-x`;
    }
    usedIds.add(nextId);
    options.push({
      ...template,
      id: nextId,
      recommended: false,
    });
  }

  if (options.length === 0) {
    const emergency = fallbackOptions[0] as TaskPlanOption;
    options.push({
      ...emergency,
      id: 'option-1',
      recommended: false,
    });
  }

  const recommendedOptionId = preferredRecommendedId && options.some((option) => option.id === preferredRecommendedId)
    ? preferredRecommendedId
    : (options[0]?.id ?? 'option-1');

  return {
    options: options.map((option) => ({
      ...option,
      recommended: option.id === recommendedOptionId,
    })),
    recommendedOptionId,
  };
}

function planningDraftMarkdown(draft: TaskPlanDraft): string {
  const lines: string[] = [];
  lines.push('## Planning options');
  for (const [index, option] of draft.options.entries()) {
    lines.push('');
    lines.push(`### ${index + 1}. ${option.title}${option.recommended ? ' (Recommended)' : ''}`);
    lines.push(option.summary);
    lines.push(`Why: ${option.why}`);
    for (const step of option.steps) {
      lines.push(`- ${step}`);
    }
  }
  return lines.join('\n');
}

function formatMeetingContext(meeting: GranolaMeeting | null): string {
  if (!meeting) {
    return 'No cached meeting context was found for this task.';
  }

  const sections: string[] = [];
  sections.push(`Meeting title: ${meeting.title || 'Untitled meeting'}`);
  sections.push(`Meeting date: ${meeting.date || 'Unknown date'}`);

  if (meeting.attendees.length > 0) {
    sections.push(`Attendees: ${meeting.attendees.join(', ')}`);
  }

  const notes = compactMultilineText(meeting.notes, 1800);
  if (notes) {
    sections.push(`Notes:\n${notes}`);
  }

  const enhanced = compactMultilineText(meeting.enhancedNotes, 1800);
  if (enhanced) {
    sections.push(`Enhanced notes:\n${enhanced}`);
  }

  const privateNotes = compactMultilineText(meeting.privateNotes, 1200);
  if (privateNotes) {
    sections.push(`Private notes:\n${privateNotes}`);
  }

  const transcript = compactMultilineText(meeting.transcript, 1200);
  if (transcript) {
    sections.push(`Transcript excerpt:\n${transcript}`);
  }

  return sections.join('\n\n');
}

function buildExecutionPrompt(todo: TodoRecord, meeting: GranolaMeeting | null): string {
  const evidence = compactMultilineText(todo.evidence, 1200);
  const objective = [
    `Task title: ${todo.title}`,
    `Task description: ${todo.description || 'No description provided.'}`,
    `Owner: ${todo.owner || 'Unassigned'}`,
    `Due date: ${todo.dueDate || 'Not specified'}`,
    `Priority: ${todo.priority}`,
    evidence ? `Evidence from extraction:\n${evidence}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return [
    'You are assisting on a task extracted from Granola meeting notes.',
    'Perform focused research and return concrete findings with links when available.',
    '',
    'Task context:',
    objective,
    '',
    'Meeting context:',
    formatMeetingContext(meeting),
    '',
    'Response format:',
    '1) One-paragraph summary',
    '2) 3-6 bullet findings with links or references',
    '3) Suggested next steps',
    '',
    'Keep the response concise and action-oriented.',
  ].join('\n');
}

function buildPlanningPrompt(
  todo: TodoRecord,
  meeting: GranolaMeeting | null,
  guidance: string,
): string {
  const evidence = compactMultilineText(todo.evidence, 1200);
  const objective = [
    `Task title: ${todo.title}`,
    `Task description: ${todo.description || 'No description provided.'}`,
    `Owner: ${todo.owner || 'Unassigned'}`,
    `Due date: ${todo.dueDate || 'Not specified'}`,
    `Priority: ${todo.priority}`,
    evidence ? `Evidence from extraction:\n${evidence}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return [
    'You are planning task execution for Yogurt.',
    'Return strict JSON only. No markdown, no prose outside JSON.',
    '',
    'Requirements:',
    '- Return 2 or 3 options only.',
    '- Exactly one option must be recommended=true.',
    '- Each option must include concise steps.',
    '- Keep options practical and action-oriented.',
    '',
    'JSON schema:',
    '{"options":[{"id":"string","title":"string","summary":"string","steps":["string"],"why":"string","recommended":true|false}]}',
    '',
    'Task context:',
    objective,
    '',
    'Meeting context:',
    formatMeetingContext(meeting),
    '',
    'User guidance:',
    guidance,
  ].join('\n');
}

function mergeMeetingsForCache(
  existing: GranolaMeeting[],
  live: GranolaMeeting[],
): { meetings: GranolaMeeting[]; reusedDetailsCount: number; carriedForwardCount: number } {
  const map = new Map<string, GranolaMeeting>();
  let reusedDetailsCount = 0;
  let carriedForwardCount = 0;

  for (const meeting of live) {
    map.set(meeting.id, meeting);
  }

  for (const cached of existing) {
    const current = map.get(cached.id);
    if (current) {
      const merged = mergeMeeting(current, cached);
      const reusedAnyDetail =
        (!current.notes && Boolean(merged.notes)) ||
        (!current.enhancedNotes && Boolean(merged.enhancedNotes)) ||
        (!current.privateNotes && Boolean(merged.privateNotes)) ||
        (!current.transcript && Boolean(merged.transcript));

      if (reusedAnyDetail) {
        reusedDetailsCount += 1;
      }

      map.set(cached.id, merged);
      continue;
    }

    map.set(cached.id, cached);
    carriedForwardCount += 1;
  }

  const meetings = [...map.values()].sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date));
  return {
    meetings,
    reusedDetailsCount,
    carriedForwardCount,
  };
}

async function closeMcp(client: Client, transport: StreamableHTTPClientTransport): Promise<void> {
  try {
    await client.close();
  } catch {
    // ignore close failures
  }

  try {
    await transport.close();
  } catch {
    // ignore close failures
  }
}

export class GranolaTaskService {
  private static readonly MAX_EXTRACTION_MEETINGS_PER_SYNC = 2;

  private readonly mcpUrl: string;

  private readonly liveRequestTimeoutMs: number;

  private readonly autoSyncIntervalMs: number;

  private readonly pendingAuthTtlMs: number;

  private readonly openExternal: (url: string) => Promise<void>;

  private readonly allowUnauthenticatedExtraction: boolean;

  private readonly extractTodosForMeeting?: (meeting: GranolaMeeting, prompt: string) => Promise<string>;

  private readonly authStore: EncryptedTokenStore;

  private readonly cacheStore: MeetingsCacheStore;

  private readonly todoStore: TodoStore;

  private readonly chatStore: TaskChatStore;

  private readonly callbackServer: OAuthCallbackServer;

  private readonly guardrailMode: 'workspace_only' | 'off' = 'off';

  private readonly ironclawProfile: string;

  private readonly ironclawAgentId: string;

  private readonly legacyDataDir: string;

  private readonly canonicalProjectPath: string;

  private readonly autoDisableLegacyGatewayService: boolean;

  private readonly executionSessionScope: 'per_task' | 'per_run' | 'shared_main';

  private readonly progressOnlyAutoRetry: 'off' | 'once' | 'twice';

  private readonly legacyGatewayCleanupMarkerPath: string;

  private readonly ironclaw: IronclawRuntime;

  private readonly chatTimelineV2Enabled: boolean;

  private readonly realtimeEvents = new EventEmitter();

  private readonly uiRefreshMs = 5000;

  private authState: AuthState = {
    clientInformation: undefined,
    tokens: undefined,
    codeVerifier: undefined,
    pendingAuthorizationUrl: undefined,
    pendingStartedAt: null,
    pendingExpiresAt: null,
    lastAuthAt: null,
    lastAuthError: null,
    lastAuthStage: 'idle',
    lastAuthHttpStatus: null,
    lastAuthErrorCode: null,
    savedAt: null,
  };

  private cacheState: CacheState = {
    meetings: [],
    availableTools: [],
    warnings: [],
    warningDetails: [],
    fetchedAt: null,
    syncMetadata: defaultSyncMetadata(),
  };

  private todoState: TodoRuntimeState = {
    loaded: false,
    todos: [],
    events: [],
    metadata: {
      meetingSourceHashes: {},
    },
    saveChain: Promise.resolve(),
    extractionInFlight: false,
    extractionPendingReason: null,
    lastExtractionAt: null,
    lastExtractionError: null,
    lastSubmissionAt: null,
    lastSubmissionError: null,
  };

  private lastSyncAt: string | null = null;

  private lastSyncError: string | null = null;

  private autoSyncTimer: NodeJS.Timeout | null = null;

  private nextAutoSyncAt: string | null = null;

  private syncInFlightPromise: Promise<{ ok: boolean; meetingCount: number; fetchedAt: string; warning?: string }> | null =
    null;

  private connecting = false;

  private connectInFlightPromise: Promise<{ ok: boolean; needsBrowser: boolean; message?: string }> | null = null;

  private oauthRedirectUrl: string | null = null;

  private lastAuthHttpDiagnostic: AuthHttpDiagnostic | null = null;

  private syncTelemetryHistory: SyncTelemetryEntry[] = [];

  private transcriptDisabledForSession = false;

  private executorState: TaskExecutorConnection = {
    state: 'unknown',
    profile: 'ironclaw',
    gatewayUrl: null,
    dashboardUrl: null,
    lastCheckedAt: null,
    lastError: null,
  };

  private runningExecutions = new Map<string, RunningExecution>();

  private executionQueue: ExecutionQueueRequest[] = [];

  private activeExecutionTodoId: string | null = null;

  private chatState: ChatRuntimeState = {
    loaded: false,
    saveChain: Promise.resolve(),
    migratedStepEventsAt: null,
    threads: {},
  };

  private chatPersistTimer: NodeJS.Timeout | null = null;

  private lastFeedBroadcastAt = 0;

  private ironclawVersion: string | null = null;

  private migrationStatus: LegacyDataMigrationStatus = {
    sourceDir: '/Users/motasimrahman/Desktop/granola-openclaw/data',
    markerPath: '',
    imported: false,
    importedAt: null,
    skippedReason: 'not-initialized',
    backupDir: null,
    error: null,
    copiedFiles: [],
  };

  private legacyGatewayCleanupAttempted = false;

  constructor(private readonly options: GranolaTaskServiceOptions) {
    this.mcpUrl = options.mcpUrl ?? 'https://mcp.granola.ai/mcp';
    this.liveRequestTimeoutMs = options.liveRequestTimeoutMs ?? 12_000;
    this.autoSyncIntervalMs = options.autoSyncIntervalMs ?? 300_000;
    this.pendingAuthTtlMs = Math.max(60_000, options.pendingAuthTtlMs ?? 10 * 60_000);
    this.allowUnauthenticatedExtraction = options.allowUnauthenticatedExtraction === true;
    this.extractTodosForMeeting = options.extractTodosForMeeting;
    this.ironclawProfile = options.ironclawProfile ?? 'ironclaw';
    this.ironclawAgentId = options.ironclawAgentId ?? 'main';
    this.legacyDataDir = options.legacyDataDir ?? '/Users/motasimrahman/Desktop/granola-openclaw/data';
    this.canonicalProjectPath = options.canonicalProjectPath ?? process.cwd();
    this.autoDisableLegacyGatewayService = options.autoDisableLegacyGatewayService !== false;
    this.executionSessionScope = options.executionSessionScope ?? 'per_task';
    this.progressOnlyAutoRetry = options.progressOnlyAutoRetry ?? 'once';
    this.legacyGatewayCleanupMarkerPath = path.join(options.dataDir, '.legacy-launchagent-cleanup-v1.json');
    this.chatTimelineV2Enabled = process.env.CHAT_TIMELINE_V2 !== '0';
    this.ironclaw = new IronclawRuntime({
      profile: this.ironclawProfile,
      suppressGatewayAutoOpen: true,
    });

    const tokenKey = options.tokenEncryptionKey ?? this.deriveTokenEncryptionKey(options.dataDir);
    this.authStore = new EncryptedTokenStore(path.join(options.dataDir, 'granola-token.enc'), tokenKey);
    this.cacheStore = new MeetingsCacheStore(path.join(options.dataDir, 'meetings-cache.json'));
    this.todoStore = new TodoStore(path.join(options.dataDir, 'todo-store.json'));
    this.chatStore = new TaskChatStore(path.join(options.dataDir, 'task-chat-store.json'));

    this.callbackServer = new OAuthCallbackServer({
      host: options.callbackHost ?? '127.0.0.1',
      preferredPort: options.callbackPort ?? 43110,
      maxPort: options.callbackMaxPort ?? 43130,
      callbackPath: '/oauth/callback',
    });

    this.executorState.profile = this.ironclawProfile;
    this.realtimeEvents.setMaxListeners(64);

    this.openExternal = async (url: string) => {
      if (options.openExternal) {
        await options.openExternal(url);
      }
    };
  }

  private deriveTokenEncryptionKey(seed: string): string {
    return crypto.createHash('sha256').update(seed).digest('hex');
  }

  onRealtimeEvent(listener: (event: TasksRealtimeEvent) => void): () => void {
    this.realtimeEvents.on('event', listener);
    return () => {
      this.realtimeEvents.off('event', listener);
    };
  }

  private emitRealtimeEvent(event: TasksRealtimeEvent): void {
    this.realtimeEvents.emit('event', event);
  }

  private emitFeedUpdated(force = false): void {
    const now = Date.now();
    if (!force && now - this.lastFeedBroadcastAt < 200) {
      return;
    }
    this.lastFeedBroadcastAt = now;
    this.emitRealtimeEvent({ type: 'tasks-feed-updated' });
  }

  private pushRuntimeWarning(summary: string, detail?: string): void {
    const lines = compactWarningLines([summary, detail ?? '', ...this.cacheState.warnings, ...this.cacheState.warningDetails]);
    if (lines.length === 0) {
      return;
    }
    this.cacheState.warnings = lines.slice(0, 1);
    this.cacheState.warningDetails = lines.slice(1, 4);
    this.emitFeedUpdated(true);
  }

  private async launchctl(args: string[]): Promise<{ ok: boolean; output: string }> {
    try {
      const result = await execFileAsync('launchctl', args, {
        timeout: 8_000,
        maxBuffer: 1024 * 1024,
      });
      return {
        ok: true,
        output: `${String(result.stdout ?? '')}\n${String(result.stderr ?? '')}`.trim(),
      };
    } catch (error) {
      const stderr = error && typeof error === 'object' && 'stderr' in error ? String((error as { stderr?: unknown }).stderr ?? '') : '';
      const message = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        output: `${stderr}\n${message}`.trim(),
      };
    }
  }

  private buildExecutionSessionKey(todoId: string, executionId: string): string {
    if (this.executionSessionScope === 'shared_main') {
      return `agent:${this.ironclawAgentId}:main`;
    }
    if (this.executionSessionScope === 'per_run') {
      return `agent:${this.ironclawAgentId}:web:yogurt:${todoId}:${executionId}`;
    }
    return `agent:${this.ironclawAgentId}:web:yogurt:${todoId}`;
  }

  private executionLane(): 'main' | 'web' {
    return this.executionSessionScope === 'shared_main' ? 'main' : 'web';
  }

  private retryPrompt(prompt: string): string {
    return [
      prompt,
      '',
      'Previous attempt ended with progress-only output.',
      'Continue from current state without repeating Step 1.',
      'Return concrete final findings now, with links/sources where possible.',
    ].join('\n');
  }

  private async ensureLegacyGatewayLaunchAgentDisabledOnce(): Promise<void> {
    if (!this.autoDisableLegacyGatewayService || this.legacyGatewayCleanupAttempted) {
      return;
    }
    this.legacyGatewayCleanupAttempted = true;
    if (process.platform !== 'darwin' || typeof process.getuid !== 'function') {
      return;
    }

    try {
      const markerRaw = await readFile(this.legacyGatewayCleanupMarkerPath, 'utf8');
      const marker = JSON.parse(markerRaw) as { attempted?: boolean };
      if (marker?.attempted) {
        return;
      }
    } catch {
      // Marker absent or malformed; continue with cleanup attempt.
    }

    const uid = process.getuid();
    const target = `gui/${uid}/ai.granola-openclaw`;
    const bootout = await this.launchctl(['bootout', target]);
    const disable = await this.launchctl(['disable', target]);
    const disableOutput = disable.output.toLowerCase();
    const disabled =
      disable.ok || disableOutput.includes('disabled') || disableOutput.includes('already') || disableOutput.includes('not found');

    if (disabled) {
      this.pushRuntimeWarning(
        'Disabled legacy ai.granola-openclaw to prevent routing conflicts.',
        bootout.ok ? 'Legacy LaunchAgent cleanup completed.' : 'Legacy LaunchAgent was already inactive.',
      );
    } else {
      const manualCommand = `launchctl disable ${target}`;
      const detail = disable.output
        ? `Automatic cleanup failed (${clampText(disable.output, 180)}). Run: ${manualCommand}`
        : `Automatic cleanup failed. Run: ${manualCommand}`;
      this.pushRuntimeWarning('Legacy ai.granola-openclaw may still interfere with routing.', detail);
    }

    try {
      await mkdir(path.dirname(this.legacyGatewayCleanupMarkerPath), { recursive: true });
      await writeFile(
        this.legacyGatewayCleanupMarkerPath,
        JSON.stringify(
          {
            attempted: true,
            attemptedAt: nowIso(),
            disabled,
            bootoutOk: bootout.ok,
            disableOutput: clampText(disable.output, 400),
          },
          null,
          2,
        ),
        'utf8',
      );
    } catch {
      // Best-effort marker persistence; failure should not block runtime startup.
    }
  }

  private async refreshExecutorState(force = false): Promise<TaskExecutorConnection> {
    const checkedAtMs = parseIsoDate(this.executorState.lastCheckedAt);
    if (!force && checkedAtMs != null && Date.now() - checkedAtMs < 15_000 && this.executorState.state !== 'unknown') {
      return this.executorState;
    }

    this.executorState = {
      ...this.executorState,
      state: 'connecting',
    };
    this.emitFeedUpdated(true);

    const probed = await this.ironclaw.probe();
    this.executorState = {
      ...this.executorState,
      state: probed.connected ? 'connected' : 'disconnected',
      gatewayUrl: probed.gatewayUrl,
      dashboardUrl: probed.dashboardUrl,
      lastCheckedAt: nowIso(),
      lastError: probed.connected ? null : probed.message,
    };
    this.emitFeedUpdated(true);
    return this.executorState;
  }

  private async reconnectExecutorState(): Promise<TaskExecutorConnection> {
    this.executorState = {
      ...this.executorState,
      state: 'connecting',
      lastError: null,
    };
    this.emitFeedUpdated(true);

    await this.ensureLegacyGatewayLaunchAgentDisabledOnce();
    const result = await this.ironclaw.reconnect();
    this.executorState = {
      ...this.executorState,
      state: result.connected ? 'connected' : 'error',
      gatewayUrl: result.gatewayUrl,
      dashboardUrl: result.dashboardUrl,
      lastCheckedAt: nowIso(),
      lastError: result.connected ? null : result.message ?? 'Unable to reconnect to IronClaw.',
    };
    this.emitFeedUpdated(true);
    return this.executorState;
  }

  private runtimeMetadata(): TasksRuntimeMetadata {
    return {
      ironclawProfile: this.ironclawProfile,
      ironclawVersion: this.ironclawVersion,
      gatewayUrl: this.executorState.gatewayUrl,
      dashboardUrl: this.executorState.dashboardUrl,
      dataImportedAt: this.migrationStatus.importedAt,
      canonicalProjectPath: this.canonicalProjectPath,
    };
  }

  private isGranolaAuthenticated(): boolean {
    return Boolean(this.authState.tokens);
  }

  private authSnapshot(): GranolaAuthStatus {
    const pendingAuthorization = this.isPendingAuthorizationFresh();
    return {
      authenticated: this.isGranolaAuthenticated(),
      pendingAuthorization,
      pendingAuthorizationUrl: pendingAuthorization ? this.authState.pendingAuthorizationUrl ?? null : null,
      pendingStartedAt: pendingAuthorization ? this.authState.pendingStartedAt : null,
      pendingExpiresAt: pendingAuthorization ? this.authState.pendingExpiresAt : null,
      lastAuthAt: this.authState.lastAuthAt,
      lastAuthError: this.authState.lastAuthError,
      lastAuthStage: this.authState.lastAuthStage,
      lastAuthHttpStatus: this.authState.lastAuthHttpStatus,
      lastAuthErrorCode: this.authState.lastAuthErrorCode,
      tokenSavedAt: this.authState.savedAt,
      tokenExpiresAt: inferTokenExpiryIso(this.authState.tokens),
      tokenIdentity: inferTokenIdentity(this.authState.tokens),
    };
  }

  private connectionState(): TasksConnectionState {
    if (
      this.connecting ||
      this.authState.lastAuthStage === 'starting' ||
      this.authState.lastAuthStage === 'callback_received' ||
      this.authState.lastAuthStage === 'exchanging_code'
    ) {
      return 'connecting';
    }
    if (this.isGranolaAuthenticated()) {
      return 'connected';
    }
    if (this.isPendingAuthorizationFresh()) {
      return 'authorizing';
    }
    if (this.authState.lastAuthStage === 'failed' || this.authState.lastAuthError) {
      return 'error';
    }
    return 'disconnected';
  }

  private isPendingAuthorizationFresh(now = Date.now()): boolean {
    const url = String(this.authState.pendingAuthorizationUrl ?? '').trim();
    if (!url) {
      return false;
    }

    const expiresAt = parseIsoDate(this.authState.pendingExpiresAt);
    if (expiresAt != null) {
      return expiresAt > now;
    }

    const startedAt = parseIsoDate(this.authState.pendingStartedAt);
    if (startedAt != null) {
      return startedAt + this.pendingAuthTtlMs > now;
    }

    return false;
  }

  private setAuthStage(stage: AuthState['lastAuthStage']): void {
    this.authState.lastAuthStage = stage;
  }

  private resetAuthDiagnostics(): void {
    this.lastAuthHttpDiagnostic = null;
    this.authState.lastAuthHttpStatus = null;
    this.authState.lastAuthErrorCode = null;
  }

  private updatePendingAuthorization(url: string): void {
    const now = Date.now();
    this.authState.pendingAuthorizationUrl = url;
    this.authState.pendingStartedAt = new Date(now).toISOString();
    this.authState.pendingExpiresAt = new Date(now + this.pendingAuthTtlMs).toISOString();
  }

  private clearPendingAuthorization(options: { clearCodeVerifier?: boolean; clearClientInformation?: boolean } = {}): void {
    this.authState.pendingAuthorizationUrl = undefined;
    this.authState.pendingStartedAt = null;
    this.authState.pendingExpiresAt = null;
    if (options.clearCodeVerifier) {
      this.authState.codeVerifier = undefined;
    }
    if (options.clearClientInformation) {
      this.authState.clientInformation = undefined;
    }
  }

  private invalidateStalePendingAuthorization(): boolean {
    if (this.isPendingAuthorizationFresh()) {
      return false;
    }

    if (!this.authState.pendingAuthorizationUrl) {
      return false;
    }

    this.clearPendingAuthorization({
      clearCodeVerifier: true,
    });
    return true;
  }

  private captureAuthHttpFailure(status: number, bodyText: string): void {
    const snippet = clampText(String(bodyText || '').trim(), 240);
    let errorCode: string | null = null;

    if (snippet) {
      try {
        const parsed = JSON.parse(snippet) as Record<string, unknown>;
        if (typeof parsed.error === 'string') {
          errorCode = parsed.error;
        }
      } catch {
        if (snippet.toLowerCase().includes('unauthorized')) {
          errorCode = 'unauthorized';
        }
      }
    }

    this.lastAuthHttpDiagnostic = {
      status,
      errorCode,
      bodySnippet: snippet || null,
    };
    this.authState.lastAuthHttpStatus = status;
    this.authState.lastAuthErrorCode = errorCode;
  }

  private normalizeAuthFailure(error: unknown): string {
    const diagnostic = this.lastAuthHttpDiagnostic;
    const raw = safeErrorMessage(error).trim();

    if (diagnostic?.status === 401 && (diagnostic.errorCode === 'unauthorized' || !diagnostic.errorCode)) {
      return 'Authorization code was rejected or expired. Click Connect Granola to start a new authorization.';
    }

    if (diagnostic?.errorCode) {
      return `Authorization failed (${diagnostic.errorCode}). Click Connect Granola to start a new authorization.`;
    }

    if (diagnostic?.status) {
      return `Authorization failed with HTTP ${diagnostic.status}. Click Connect Granola to start a new authorization.`;
    }

    if (!raw || raw === 'ServerError') {
      return 'Authorization failed. Click Connect Granola to start a new authorization.';
    }

    return raw;
  }

  private async persistAuthState(): Promise<void> {
    const payload: PersistedAuthDocument = {
      version: 1 as const,
      savedAt: nowIso(),
      oauth: {
        clientInformation: this.authState.clientInformation,
        tokens: this.authState.tokens,
        codeVerifier: this.authState.codeVerifier,
        pendingAuthorizationUrl: this.authState.pendingAuthorizationUrl,
        pendingStartedAt: this.authState.pendingStartedAt,
        pendingExpiresAt: this.authState.pendingExpiresAt,
        lastAuthAt: this.authState.lastAuthAt,
        lastAuthError: this.authState.lastAuthError,
        lastAuthStage: this.authState.lastAuthStage,
        lastAuthHttpStatus: this.authState.lastAuthHttpStatus,
        lastAuthErrorCode: this.authState.lastAuthErrorCode,
      },
    };

    await this.authStore.save(payload);
    this.authState.savedAt = payload.savedAt;
  }

  private async loadPersistedAuthState(): Promise<void> {
    let persisted: PersistedAuthDocument | null = null;
    try {
      persisted = await this.authStore.load();
    } catch {
      this.authState.tokens = undefined;
      this.authState.clientInformation = undefined;
      this.authState.codeVerifier = undefined;
      this.authState.pendingAuthorizationUrl = undefined;
      this.authState.pendingStartedAt = null;
      this.authState.pendingExpiresAt = null;
      this.authState.lastAuthError = 'Stored Granola credentials are invalid. Please reconnect Granola.';
      this.authState.lastAuthStage = 'failed';
      this.authState.lastAuthHttpStatus = null;
      this.authState.lastAuthErrorCode = null;
      return;
    }

    if (!persisted || !persisted.oauth || typeof persisted.oauth !== 'object') {
      return;
    }

    this.authState.clientInformation = persisted.oauth.clientInformation;
    this.authState.tokens = persisted.oauth.tokens;
    this.authState.codeVerifier = persisted.oauth.codeVerifier;
    this.authState.pendingAuthorizationUrl = persisted.oauth.pendingAuthorizationUrl;
    this.authState.pendingStartedAt = persisted.oauth.pendingStartedAt ?? null;
    this.authState.pendingExpiresAt = persisted.oauth.pendingExpiresAt ?? null;
    this.authState.lastAuthAt = persisted.oauth.lastAuthAt ?? null;
    this.authState.lastAuthError = persisted.oauth.lastAuthError ?? null;
    this.authState.lastAuthStage = persisted.oauth.lastAuthStage ?? 'idle';
    this.authState.lastAuthHttpStatus = persisted.oauth.lastAuthHttpStatus ?? null;
    this.authState.lastAuthErrorCode = persisted.oauth.lastAuthErrorCode ?? null;
    this.authState.savedAt = persisted.savedAt ?? null;
  }

  private async loadPersistedCacheState(): Promise<void> {
    const cached = await this.cacheStore.load();
    if (!cached) {
      return;
    }

    const warnings = Array.isArray(cached.warnings) ? cached.warnings : [];
    const compact = compactWarningLines(warnings);
    this.cacheState = {
      meetings: Array.isArray(cached.meetings) ? cached.meetings : [],
      availableTools: Array.isArray(cached.availableTools) ? cached.availableTools : [],
      warnings: compact,
      warningDetails: compact.slice(1, 4),
      fetchedAt: typeof cached.fetchedAt === 'string' ? cached.fetchedAt : null,
      syncMetadata: cached.syncMetadata ?? defaultSyncMetadata(),
    };
    this.lastSyncAt = this.cacheState.fetchedAt;
  }

  private async loadPersistedTodoState(): Promise<void> {
    const persisted = await this.todoStore.load();
    this.todoState.todos = Array.isArray(persisted.todos) ? persisted.todos : [];
    for (const todo of this.todoState.todos) {
      ensureTodoTelemetry(todo);
      todo.status = normalizeTodoStatus(todo.status);
      todo.runState = inferTodoRunState(todo);
    }

    this.todoState.events = Array.isArray(persisted.events) ? persisted.events : [];
    this.todoState.metadata =
      persisted.metadata && typeof persisted.metadata === 'object'
        ? {
            meetingSourceHashes:
              persisted.metadata.meetingSourceHashes && typeof persisted.metadata.meetingSourceHashes === 'object'
                ? persisted.metadata.meetingSourceHashes
                : {},
          }
        : { meetingSourceHashes: {} };

    this.todoState.lastExtractionAt =
      typeof persisted.lastExtractionAt === 'string' ? persisted.lastExtractionAt : null;
    this.todoState.lastExtractionError =
      typeof persisted.lastExtractionError === 'string' ? persisted.lastExtractionError : null;
    this.todoState.lastSubmissionAt =
      typeof persisted.lastSubmissionAt === 'string' ? persisted.lastSubmissionAt : null;
    this.todoState.lastSubmissionError =
      typeof persisted.lastSubmissionError === 'string' ? persisted.lastSubmissionError : null;
    this.todoState.loaded = true;
  }

  private async persistTodoState(): Promise<void> {
    if (!this.todoState.loaded) {
      return;
    }

    await this.todoStore.save({
      todos: this.todoState.todos,
      events: this.todoState.events,
      metadata: this.todoState.metadata,
      lastExtractionAt: this.todoState.lastExtractionAt,
      lastExtractionError: this.todoState.lastExtractionError,
      lastSubmissionAt: this.todoState.lastSubmissionAt,
      lastSubmissionError: this.todoState.lastSubmissionError,
    });
  }

  private async loadPersistedChatState(): Promise<void> {
    const persisted = await this.chatStore.load();
    this.chatState.loaded = true;
    this.chatState.migratedStepEventsAt = persisted.migratedStepEventsAt;
    this.chatState.threads = persisted.threads ?? {};
  }

  private async persistChatState(): Promise<void> {
    if (!this.chatState.loaded) {
      return;
    }

    const document: Partial<TaskChatStoreDocument> = {
      version: 1,
      migratedStepEventsAt: this.chatState.migratedStepEventsAt,
      threads: this.chatState.threads,
    };
    await this.chatStore.save(document);
  }

  private async withChatStateWrite<T>(mutator: () => Promise<T>): Promise<T> {
    const run = async (): Promise<T> => {
      const output = await mutator();
      await this.persistChatState();
      return output;
    };

    const next = this.chatState.saveChain.then(run, run);
    this.chatState.saveChain = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  private queueChatPersist(immediate = false): void {
    const flush = () => {
      void this.withChatStateWrite(async () => undefined);
    };

    if (immediate) {
      if (this.chatPersistTimer) {
        clearTimeout(this.chatPersistTimer);
        this.chatPersistTimer = null;
      }
      flush();
      return;
    }

    if (this.chatPersistTimer) {
      return;
    }

    this.chatPersistTimer = setTimeout(() => {
      this.chatPersistTimer = null;
      flush();
    }, 300);
  }

  private ensureThread(todoId: string): TaskChatMessage[] {
    const existing = this.chatState.threads[todoId];
    if (existing) {
      return existing;
    }
    const created: TaskChatMessage[] = [];
    this.chatState.threads[todoId] = created;
    return created;
  }

  private appendThreadMessage(
    todoId: string,
    role: TaskChatMessage['role'],
    content: string,
    options?: {
      runId?: string | null;
      createdAt?: string;
      streaming?: boolean;
      statusTag?: TaskExecutionPhase | null;
      trace?: TaskChatTrace | null;
      messageId?: string;
      emitRealtime?: boolean;
      messageType?: TaskChatMessageType;
      planDraft?: TaskPlanDraft | null;
    },
  ): TaskChatMessage {
    const createdAt = options?.createdAt ?? nowIso();
    const message: TaskChatMessage = {
      messageId: options?.messageId ?? randomUUID(),
      todoId,
      runId: options?.runId ?? null,
      role,
      content,
      createdAt,
      streaming: options?.streaming === true,
      statusTag: options?.statusTag ?? null,
      trace: options?.trace ?? null,
      messageType: options?.messageType ?? 'default',
      planDraft: options?.planDraft ?? null,
    };
    const thread = this.ensureThread(todoId);
    thread.push(message);
    thread.sort((a, b) => {
      const left = chatSortKey(a);
      const right = chatSortKey(b);
      if (left !== right) {
        return left - right;
      }
      return a.messageId.localeCompare(b.messageId);
    });
    if (options?.emitRealtime !== false) {
      this.emitRealtimeEvent({
        type: 'task-chat-message',
        todoId,
        message,
      });
    }
    return message;
  }

  private updateThreadMessage(
    todoId: string,
    messageId: string,
    updater: (message: TaskChatMessage) => TaskChatMessage,
    options?: { emitRealtime?: boolean },
  ): TaskChatMessage | null {
    const thread = this.chatState.threads[todoId];
    if (!thread) {
      return null;
    }

    const index = thread.findIndex((item) => item.messageId === messageId);
    if (index < 0) {
      return null;
    }

    const next = updater(thread[index] as TaskChatMessage);
    thread[index] = next;
    if (options?.emitRealtime === true) {
      this.emitRealtimeEvent({
        type: 'task-chat-message',
        todoId,
        message: next,
      });
    }
    return next;
  }

  private appendTraceMessage(
    todoId: string,
    runId: string | null,
    trace: TaskChatTrace,
    options?: {
      createdAt?: string;
      emitRealtime?: boolean;
      persist?: boolean;
    },
  ): TaskChatMessage {
    const message = this.appendThreadMessage(todoId, 'status', trace.title, {
      runId,
      createdAt: options?.createdAt,
      statusTag: trace.phase ?? null,
      trace,
      emitRealtime: options?.emitRealtime,
    });
    if (options?.persist !== false) {
      this.queueChatPersist();
    }
    return message;
  }

  private upsertThinkingGroup(
    todoId: string,
    runId: string | null,
    groupId: string,
    detail: string,
    existingMessageId: string | null,
  ): string {
    const nextTrace: TaskChatTrace = {
      kind: 'thought',
      title: 'Thinking through the approach',
      detail: clampText(detail.trim(), 2000),
      groupId,
      phase: 'thinking',
    };
    if (!existingMessageId) {
      return this.appendTraceMessage(todoId, runId, nextTrace).messageId;
    }
    const updated = this.updateThreadMessage(
      todoId,
      existingMessageId,
      (message) => ({
        ...message,
        runId: runId ?? message.runId,
        content: nextTrace.title,
        streaming: false,
        statusTag: 'thinking',
        trace: nextTrace,
      }),
      { emitRealtime: true },
    );
    if (updated) {
      this.queueChatPersist();
      return existingMessageId;
    }
    return this.appendTraceMessage(todoId, runId, nextTrace).messageId;
  }

  private upsertProgressTrace(
    todoId: string,
    runId: string | null,
    groupId: string,
    detail: string,
    existingMessageId: string | null,
  ): string {
    const nextTrace: TaskChatTrace = {
      kind: 'phase',
      title: 'Working on task',
      detail: clampText(detail.trim(), 1200),
      groupId,
      phase: 'streaming',
    };
    if (!existingMessageId) {
      return this.appendTraceMessage(todoId, runId, nextTrace).messageId;
    }
    const updated = this.updateThreadMessage(
      todoId,
      existingMessageId,
      (message) => ({
        ...message,
        runId: runId ?? message.runId,
        content: nextTrace.title,
        streaming: false,
        statusTag: 'streaming',
        trace: nextTrace,
      }),
      { emitRealtime: true },
    );
    if (updated) {
      this.queueChatPersist();
      return existingMessageId;
    }
    return this.appendTraceMessage(todoId, runId, nextTrace).messageId;
  }

  private appendToolTrace(todoId: string, runId: string | null, tool: IronclawToolPayload): TaskChatMessage {
    const isStart = tool.phase === 'start';
    const traceKind: TaskChatTrace['kind'] = isStart ? 'tool_start' : 'tool_result';
    const prettyName = toolLabel(tool.name);
    const title = isStart ? `Starting ${prettyName}` : tool.isError ? `${prettyName} failed` : `${prettyName} completed`;
    const primaryDetail =
      normalizeTraceString((tool.args as Record<string, unknown> | null)?.query, 400) ||
      normalizeTraceString((tool.args as Record<string, unknown> | null)?.url, 400) ||
      normalizeTraceString((tool.args as Record<string, unknown> | null)?.targetUrl, 400) ||
      null;

    return this.appendTraceMessage(todoId, runId, {
      kind: traceKind,
      title,
      detail: primaryDetail,
      toolName: tool.name || null,
      toolArgs: normalizeTraceString(tool.args, 1200),
      toolMeta: normalizeTraceString(tool.meta, 1400),
      isError: tool.isError,
      groupId: tool.toolCallId,
    });
  }

  private async ensureThreadsFromTodos(): Promise<void> {
    if (!this.chatState.loaded) {
      return;
    }

    const alreadyMigrated = Boolean(this.chatState.migratedStepEventsAt);
    if (alreadyMigrated) {
      return;
    }

    await this.withChatStateWrite(async () => {
      for (const todo of this.todoState.todos) {
        const thread = this.ensureThread(todo.todoId);
        if (thread.length > 0) {
          continue;
        }

        this.appendThreadMessage(
          todo.todoId,
          'system',
          `Task imported from Granola notes: ${todo.title}`,
          {
            runId: todo.runId ?? null,
            createdAt: todo.createdAt,
            emitRealtime: false,
          },
        );

        const orderedSteps = [...(todo.stepEvents ?? [])].sort((a, b) => {
          const left = Date.parse(a.createdAt);
          const right = Date.parse(b.createdAt);
          if (Number.isFinite(left) && Number.isFinite(right) && left !== right) {
            return left - right;
          }
          return 0;
        });

        for (const step of orderedSteps) {
          const content = clampText(step.publicMessage || step.adminMessage || step.step || '', 900);
          if (!content.trim()) {
            continue;
          }
          this.appendThreadMessage(todo.todoId, 'status', content, {
            runId: todo.runId ?? null,
            createdAt: step.createdAt,
            emitRealtime: false,
          });
        }
      }

      this.chatState.migratedStepEventsAt = nowIso();
    });
  }

  private async recoverInterruptedExecutions(): Promise<void> {
    const interrupted = this.todoState.todos.filter(
      (todo) => todo.status === 'submitting' || todo.runState === 'running',
    );
    if (interrupted.length === 0) {
      return;
    }

    const now = nowIso();
    await this.withTodoStateWrite(async () => {
      for (const todo of interrupted) {
        todo.status = 'failed';
        todo.runState = 'idle';
        todo.updatedAt = now;
        todo.failedAt = now;
        const interruptedMessage = 'Execution was interrupted when Yogurt closed. Start again to resume.';
        todo.internalError = interruptedMessage;
        appendTodoStep(todo, 'execution_interrupted', interruptedMessage, interruptedMessage);
      }
    });

    await this.withChatStateWrite(async () => {
      for (const todo of interrupted) {
        this.appendThreadMessage(todo.todoId, 'status', 'Execution interrupted on previous app session.', {
          createdAt: now,
          runId: todo.runId,
          statusTag: 'failed',
          emitRealtime: false,
        });
      }
    });
  }

  private async withTodoStateWrite<T>(mutator: () => Promise<T>): Promise<T> {
    const run = async (): Promise<T> => {
      const output = await mutator();
      await this.persistTodoState();
      return output;
    };

    const next = this.todoState.saveChain.then(run, run);
    this.todoState.saveChain = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  private sortedTodos(): TodoRecord[] {
    return [...this.todoState.todos].sort((a, b) => todoSortKey(b) - todoSortKey(a));
  }

  private todoCountsSnapshot(): TaskCounts {
    const counts: TaskCounts = {
      discovered: 0,
      approved: 0,
      queued: 0,
      submitting: 0,
      submitted: 0,
      failed: 0,
      cancelled: 0,
    };

    for (const todo of this.todoState.todos) {
      const status = normalizeTodoStatus(todo.status);
      counts[status] += 1;
    }

    return counts;
  }

  private guardrailBlockedCount(): number {
    return this.todoState.todos.filter((todo) => todo.guardrail?.verdict === 'blocked').length;
  }

  private todoQueueState(todoId: string): 'idle' | 'queued' | 'running' {
    if (this.activeExecutionTodoId === todoId || this.runningExecutions.has(todoId)) {
      return 'running';
    }
    if (this.executionQueue.some((request) => request.todoId === todoId)) {
      return 'queued';
    }
    return 'idle';
  }

  private todoPublicView(todo: TodoRecord): TaskItemPublic {
    ensureTodoTelemetry(todo);

    const steps = todo.stepEvents.slice(-8).map((event) => ({
      step: event.step,
      createdAt: event.createdAt,
      message: clampText(event.publicMessage || event.adminMessage || '', 240),
    }));

    return {
      todoId: todo.todoId,
      meetingId: todo.meetingId,
      meetingTitle: todo.meetingTitle,
      title: todo.title,
      description: todo.description,
      owner: todo.owner,
      dueDate: todo.dueDate,
      priority: todo.priority,
      status: normalizeTodoStatus(todo.status),
      attempts: todo.attempts ?? 0,
      lastUpdatedAt: todo.updatedAt ?? todo.createdAt,
      publicSummary: clampText(todo.publicSummary || todo.internalError || '', 280),
      latestPublicStep: clampText(todo.latestPublicStep ?? '', 240),
      stepCount: Array.isArray(todo.stepEvents) ? todo.stepEvents.length : 0,
      steps,
      runState: inferTodoRunState(todo),
      runQueueState: this.todoQueueState(todo.todoId),
      runId: todo.runId ?? null,
    };
  }

  private createOAuthProvider(redirectUrl: string, onRedirect?: (url: string) => void): unknown {
    return {
      get redirectUrl() {
        return redirectUrl;
      },
      get clientMetadata() {
        return {
          client_name: 'Granola Tasks Desktop',
          redirect_uris: [redirectUrl],
          grant_types: ['authorization_code', 'refresh_token'],
          response_types: ['code'],
          token_endpoint_auth_method: 'none',
        };
      },
      clientInformation: () => this.authState.clientInformation,
      saveClientInformation: async (clientInformation: unknown) => {
        this.authState.clientInformation = clientInformation;
        this.authState.lastAuthError = null;
        this.setAuthStage('starting');
        this.resetAuthDiagnostics();
        await this.persistAuthState();
      },
      tokens: () => this.authState.tokens,
      saveTokens: async (tokens: unknown) => {
        this.authState.tokens = tokens;
        this.authState.lastAuthError = null;
        this.setAuthStage('connected');
        this.resetAuthDiagnostics();
        await this.persistAuthState();
      },
      redirectToAuthorization: async (authorizationUrl: URL) => {
        const url = authorizationUrl.toString();
        this.updatePendingAuthorization(url);
        this.setAuthStage('authorizing');
        this.authState.lastAuthError = null;
        await this.persistAuthState();
        if (onRedirect) {
          onRedirect(url);
        }
      },
      saveCodeVerifier: async (codeVerifier: string) => {
        this.authState.codeVerifier = codeVerifier;
        this.setAuthStage('authorizing');
        await this.persistAuthState();
      },
      codeVerifier: () => {
        if (!this.authState.codeVerifier) {
          throw new Error('Missing PKCE verifier in auth state. Start auth again.');
        }
        return this.authState.codeVerifier;
      },
      invalidateCredentials: async (scope: 'all' | 'client' | 'tokens' | 'verifier') => {
        if (scope === 'all' || scope === 'client') {
          this.authState.clientInformation = undefined;
        }
        if (scope === 'all' || scope === 'tokens') {
          this.authState.tokens = undefined;
        }
        if (scope === 'all' || scope === 'verifier') {
          this.authState.codeVerifier = undefined;
        }
        if (!this.authState.tokens) {
          this.setAuthStage(this.isPendingAuthorizationFresh() ? 'authorizing' : 'idle');
        }
        await this.persistAuthState();
      },
    };
  }

  private createMcpClientAndTransport(
    redirectUrl: string,
    onRedirect?: (url: string) => void,
  ): { client: Client; transport: StreamableHTTPClientTransport } {
    const authFetch: typeof fetch = async (input, init) => {
      const response = await fetch(input, init);

      const method =
        typeof init?.method === 'string'
          ? init.method.toUpperCase()
          : input instanceof Request
            ? input.method.toUpperCase()
            : 'GET';

      if (method === 'POST' && response.url.includes('/oauth2/token') && !response.ok) {
        try {
          const bodyText = await response.clone().text();
          this.captureAuthHttpFailure(response.status, bodyText);
        } catch {
          this.captureAuthHttpFailure(response.status, '');
        }
      }

      return response;
    };

    const transport = new StreamableHTTPClientTransport(new URL(this.mcpUrl), {
      authProvider: this.createOAuthProvider(redirectUrl, onRedirect) as never,
      fetch: authFetch,
    });

    const client = new Client(
      {
        name: 'granola-tasks-desktop',
        version: '0.1.0',
      },
      {
        capabilities: {},
      },
    );

    return { client, transport };
  }

  private async withAuthenticatedClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
    if (!this.isGranolaAuthenticated()) {
      throw new Error('Granola is not authenticated.');
    }

    const redirectUrl = await this.ensureCallbackServerStarted();
    const { client, transport } = this.createMcpClientAndTransport(redirectUrl);

    try {
      await withTimeout(client.connect(transport), this.liveRequestTimeoutMs, 'Granola connection timed out.');
      return await fn(client);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        this.authState.lastAuthError = 'Granola session expired. Reconnect required.';
        this.authState.tokens = undefined;
        this.clearPendingAuthorization({
          clearCodeVerifier: true,
        });
        this.setAuthStage('failed');
        await this.persistAuthState();
      }
      throw error;
    } finally {
      await closeMcp(client, transport);
    }
  }

  private async startGranolaAuthorization(redirectUrl: string): Promise<{
    authenticated: boolean;
    authorizationUrl?: string;
  }> {
    this.clearPendingAuthorization({
      clearCodeVerifier: true,
    });
    this.resetAuthDiagnostics();
    this.setAuthStage('starting');
    this.authState.lastAuthError = null;
    await this.persistAuthState();

    let authUrl: string | undefined;
    const { client, transport } = this.createMcpClientAndTransport(redirectUrl, (url) => {
      authUrl = url;
    });

    try {
      await withTimeout(client.connect(transport), this.liveRequestTimeoutMs, 'Granola OAuth handshake timed out.');
      this.clearPendingAuthorization({
        clearCodeVerifier: true,
      });
      this.authState.lastAuthAt = nowIso();
      this.authState.lastAuthError = null;
      this.setAuthStage('connected');
      this.resetAuthDiagnostics();
      await this.persistAuthState();

      return {
        authenticated: true,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        const authorizationUrl = authUrl ?? this.authState.pendingAuthorizationUrl;
        if (!authorizationUrl) {
          throw new Error('OAuth redirect URL was not provided by Granola.');
        }

        this.updatePendingAuthorization(authorizationUrl);
        this.setAuthStage('authorizing');
        this.authState.lastAuthError = null;
        this.resetAuthDiagnostics();
        await this.persistAuthState();

        return {
          authenticated: false,
          authorizationUrl,
        };
      }

      this.authState.lastAuthError = this.normalizeAuthFailure(error);
      this.setAuthStage('failed');
      await this.persistAuthState();
      throw error;
    } finally {
      await closeMcp(client, transport);
    }
  }

  private async finishGranolaAuthorization(code: string, redirectUrl: string): Promise<void> {
    const { client, transport } = this.createMcpClientAndTransport(redirectUrl);

    try {
      this.setAuthStage('exchanging_code');
      this.authState.lastAuthError = null;
      this.resetAuthDiagnostics();
      await this.persistAuthState();

      await withTimeout(transport.finishAuth(code), this.liveRequestTimeoutMs, 'Granola OAuth exchange timed out.');
      await withTimeout(client.connect(transport), this.liveRequestTimeoutMs, 'Granola reconnect timed out.');
      await withTimeout(client.listTools(), this.liveRequestTimeoutMs, 'Granola tool verification timed out.');

      this.clearPendingAuthorization({
        clearCodeVerifier: true,
      });
      this.authState.lastAuthAt = nowIso();
      this.authState.lastAuthError = null;
      this.setAuthStage('connected');
      this.resetAuthDiagnostics();
      await this.persistAuthState();

      this.startAutoSyncLoop();
      await this.syncNow('oauth-complete');
    } catch (error) {
      this.authState.lastAuthError = this.normalizeAuthFailure(error);
      this.setAuthStage('failed');
      this.clearPendingAuthorization({
        clearCodeVerifier: true,
      });
      await this.persistAuthState();
      throw error;
    } finally {
      await closeMcp(client, transport);
    }
  }

  private async handleOAuthCallback(
    payload: { code: string | null; error: string | null; errorDescription: string | null },
    redirectUrl: string,
  ): Promise<{ ok: boolean; statusCode?: number; title?: string; message?: string }> {
    if (payload.error) {
      const detail = payload.errorDescription?.trim();
      this.clearPendingAuthorization({
        clearCodeVerifier: true,
      });
      this.authState.lastAuthError = detail
        ? `Authorization was not completed (${payload.error}: ${detail}). Click Connect Granola to try again.`
        : `Authorization was not completed (${payload.error}). Click Connect Granola to try again.`;
      this.authState.lastAuthErrorCode = payload.error;
      this.authState.lastAuthHttpStatus = null;
      this.setAuthStage('failed');
      await this.persistAuthState();

      return {
        ok: false,
        statusCode: 400,
        title: 'Authorization cancelled',
        message: detail || 'Please return to the app and click Connect Granola to try again.',
      };
    }

    if (!payload.code) {
      this.setAuthStage('failed');
      this.authState.lastAuthError = 'Missing authorization code. Click Connect Granola to try again.';
      await this.persistAuthState();
      return {
        ok: false,
        statusCode: 400,
        title: 'Missing code',
        message: 'Please return to the app and click Connect Granola to try again.',
      };
    }

    this.setAuthStage('callback_received');
    this.authState.lastAuthError = null;
    await this.persistAuthState();

    try {
      await this.finishGranolaAuthorization(payload.code, redirectUrl);
      return {
        ok: true,
        statusCode: 200,
        title: 'Granola connected',
        message: 'You can return to the app.',
      };
    } catch {
      return {
        ok: false,
        statusCode: 500,
        title: 'Authorization failed',
        message: this.authState.lastAuthError || 'Please return to the app and connect again.',
      };
    }
  }

  async init(): Promise<void> {
    const migrationEnabled =
      this.options.legacyDataMigrationEnabled ?? (process.env.VITEST !== 'true' && process.env.NODE_ENV !== 'test');
    if (migrationEnabled) {
      this.migrationStatus = await migrateLegacyOpenclawData({
        targetDir: this.options.dataDir,
        sourceDir: this.legacyDataDir,
      });
    } else {
      this.migrationStatus = {
        sourceDir: this.legacyDataDir,
        markerPath: path.join(this.options.dataDir, '.legacy-openclaw-import.json'),
        imported: false,
        importedAt: null,
        skippedReason: 'disabled-by-runtime',
        backupDir: null,
        error: null,
        copiedFiles: [],
      };
    }

    await this.loadPersistedAuthState();
    await this.loadPersistedCacheState();
    await this.loadPersistedTodoState();
    await this.loadPersistedChatState();
    await this.ensureLegacyGatewayLaunchAgentDisabledOnce();
    await this.ensureThreadsFromTodos();
    await this.recoverInterruptedExecutions();

    const stalePendingCleared = this.invalidateStalePendingAuthorization();
    if (stalePendingCleared && !this.isGranolaAuthenticated()) {
      this.setAuthStage(this.authState.lastAuthError ? 'failed' : 'idle');
      await this.persistAuthState();
    }

    if (this.isGranolaAuthenticated()) {
      this.setAuthStage('connected');
      this.startAutoSyncLoop();
      void this.syncNow('startup');
    } else if (!this.authState.lastAuthError && !this.isPendingAuthorizationFresh()) {
      this.setAuthStage('idle');
    }

    this.ironclawVersion = await this.ironclaw.getVersion();

    void this.refreshExecutorState().catch(() => {
      this.executorState = {
        ...this.executorState,
        state: 'error',
        lastCheckedAt: nowIso(),
        lastError: 'Unable to verify IronClaw runtime.',
      };
      this.emitFeedUpdated(true);
    });
  }

  async dispose(): Promise<void> {
    if (this.autoSyncTimer) {
      clearTimeout(this.autoSyncTimer);
      this.autoSyncTimer = null;
    }
    this.nextAutoSyncAt = null;

    for (const execution of this.runningExecutions.values()) {
      if (execution.heartbeatTimer) {
        clearInterval(execution.heartbeatTimer);
      }
      execution.cancel();
    }
    this.runningExecutions.clear();
    this.executionQueue = [];
    this.activeExecutionTodoId = null;
    if (this.chatPersistTimer) {
      clearTimeout(this.chatPersistTimer);
      this.chatPersistTimer = null;
    }
    await this.persistChatState();

    await this.callbackServer.close();
    this.oauthRedirectUrl = null;
  }

  private async ensureCallbackServerStarted(): Promise<string> {
    if (this.oauthRedirectUrl) {
      return this.oauthRedirectUrl;
    }

    let redirectUrl = '';
    redirectUrl = await this.callbackServer.start(async (payload) => {
      return await this.handleOAuthCallback(payload, redirectUrl);
    });
    this.oauthRedirectUrl = redirectUrl;
    return redirectUrl;
  }

  private syncCooldownUntilMs(): number | null {
    const raw = this.cacheState.syncMetadata.globalSyncCooldownUntil;
    const parsed = parseIsoDate(raw);
    if (parsed == null) {
      return null;
    }
    return parsed > Date.now() ? parsed : null;
  }

  private syncCooldownUntilIso(): string | null {
    const ms = this.syncCooldownUntilMs();
    return ms == null ? null : new Date(ms).toISOString();
  }

  private isSyncCooldownActive(): boolean {
    return this.syncCooldownUntilMs() != null;
  }

  private computeSyncHealth(): TasksSyncHealth {
    if (this.isSyncCooldownActive()) {
      return 'cooldown';
    }
    if (this.lastSyncError || this.cacheState.warnings.length > 0 || this.todoState.lastExtractionError) {
      return 'degraded';
    }
    return 'healthy';
  }

  private clearAutoSyncTimer(): void {
    if (this.autoSyncTimer) {
      clearTimeout(this.autoSyncTimer);
      this.autoSyncTimer = null;
    }
  }

  private scheduleNextAutoSync(referenceMs = Date.now()): void {
    this.clearAutoSyncTimer();
    this.nextAutoSyncAt = null;

    if (!this.isGranolaAuthenticated() || this.autoSyncIntervalMs <= 0) {
      return;
    }

    const cooldownUntilMs = this.syncCooldownUntilMs();
    const baselineMs = referenceMs + this.autoSyncIntervalMs;
    const nextMs = cooldownUntilMs != null ? Math.max(baselineMs, cooldownUntilMs) : baselineMs;
    const delayMs = Math.max(400, nextMs - Date.now());
    this.nextAutoSyncAt = new Date(nextMs).toISOString();

    this.autoSyncTimer = setTimeout(() => {
      this.autoSyncTimer = null;
      this.nextAutoSyncAt = null;
      void this.syncNow('auto-sync');
    }, delayMs);
  }

  private startAutoSyncLoop(): void {
    this.scheduleNextAutoSync();
  }

  async connect(): Promise<{ ok: boolean; needsBrowser: boolean; message?: string }> {
    if (this.connectInFlightPromise) {
      return await this.connectInFlightPromise;
    }

    const run = this.connectInternal();
    this.connectInFlightPromise = run;

    try {
      return await run;
    } finally {
      if (this.connectInFlightPromise === run) {
        this.connectInFlightPromise = null;
      }
    }
  }

  private async connectInternal(): Promise<{ ok: boolean; needsBrowser: boolean; message?: string }> {
    this.connecting = true;

    try {
      if (this.isGranolaAuthenticated()) {
        this.setAuthStage('connected');
        this.authState.lastAuthError = null;
        this.resetAuthDiagnostics();
        await this.persistAuthState();
        this.startAutoSyncLoop();
        await this.syncNow('connect-existing-session');
        return {
          ok: true,
          needsBrowser: false,
          message: 'Granola is already connected.',
        };
      }

      const stalePendingCleared = this.invalidateStalePendingAuthorization();
      if (stalePendingCleared) {
        await this.persistAuthState();
      }

      const redirectUrl = await this.ensureCallbackServerStarted();

      if (this.isPendingAuthorizationFresh() && this.authState.pendingAuthorizationUrl) {
        this.setAuthStage('authorizing');
        this.authState.lastAuthError = null;
        await this.persistAuthState();
        await this.openExternal(this.authState.pendingAuthorizationUrl);
        return {
          ok: true,
          needsBrowser: true,
          message: 'Resumed pending Granola authorization in your browser.',
        };
      }

      const authStart = await this.startGranolaAuthorization(redirectUrl);
      if (authStart.authenticated) {
        this.startAutoSyncLoop();
        await this.syncNow('connect-existing-session');
        return {
          ok: true,
          needsBrowser: false,
          message: 'Granola is already connected.',
        };
      }

      if (authStart.authorizationUrl) {
        await this.openExternal(authStart.authorizationUrl);
        return {
          ok: true,
          needsBrowser: true,
          message: 'Opened browser for Granola authorization.',
        };
      }

      return {
        ok: false,
        needsBrowser: false,
        message: 'Granola authorization could not be started.',
      };
    } catch (error) {
      const message = this.normalizeAuthFailure(error);
      this.authState.lastAuthError = message;
      this.setAuthStage('failed');
      await this.persistAuthState();
      return {
        ok: false,
        needsBrowser: false,
        message,
      };
    } finally {
      this.connecting = false;
    }
  }

  async openPendingAuthorization(): Promise<{ ok: boolean; message?: string }> {
    const stalePendingCleared = this.invalidateStalePendingAuthorization();
    if (stalePendingCleared) {
      await this.persistAuthState();
    }

    const pendingAuthorizationUrl = this.isPendingAuthorizationFresh()
      ? String(this.authState.pendingAuthorizationUrl ?? '').trim()
      : '';
    if (!pendingAuthorizationUrl) {
      return {
        ok: false,
        message: 'No pending authorization URL. Click Connect Granola to start a new authorization.',
      };
    }

    try {
      await this.ensureCallbackServerStarted();
      this.setAuthStage('authorizing');
      this.authState.lastAuthError = null;
      await this.persistAuthState();
      await this.openExternal(pendingAuthorizationUrl);
      return {
        ok: true,
      };
    } catch (error) {
      const message = this.normalizeAuthFailure(error);
      this.authState.lastAuthError = message;
      this.setAuthStage('failed');
      await this.persistAuthState();
      return {
        ok: false,
        message,
      };
    }
  }

  private countChangedMeetingsForExtraction(meetings: GranolaMeeting[]): number {
    let count = 0;
    for (const meeting of meetings) {
      if (!meeting?.id) {
        continue;
      }
      const sourceHash = createMeetingSourceHash(meeting);
      const previousHash = this.todoState.metadata.meetingSourceHashes?.[meeting.id];
      if (!previousHash || previousHash !== sourceHash) {
        count += 1;
      }
    }
    return count;
  }

  private async appendSyncTelemetry(entry: SyncTelemetryEntry): Promise<void> {
    this.syncTelemetryHistory.unshift(entry);
    if (this.syncTelemetryHistory.length > 30) {
      this.syncTelemetryHistory = this.syncTelemetryHistory.slice(0, 30);
    }

    await this.withTodoStateWrite(async () => {
      const requests = Object.entries(entry.requestCountsByTool)
        .map(([tool, count]) => `${tool}:${count}`)
        .join(', ');
      const message = [
        `reason=${entry.reason}`,
        requests ? `requests=[${requests}]` : 'requests=[]',
        `rateLimited=${entry.rateLimitedTools.join(',') || 'none'}`,
        `transcriptAttempts=${entry.transcriptAttempts}`,
        `transcriptSkipped=${entry.transcriptSkippedCount}`,
        `extractionProcessed=${entry.extractionProcessed}`,
        `extractionDeferred=${entry.extractionDeferred}`,
      ].join(' ');

      this.todoState.events.push({
        type: 'sync_telemetry',
        message: clampText(message, 420),
        createdAt: entry.createdAt,
        todoId: null,
      });
      if (this.todoState.events.length > 400) {
        this.todoState.events = this.todoState.events.slice(-400);
      }
    });
  }

  private syncOptionsSnapshot(): MeetingSyncOptions {
    return {
      listTimeRange: 'last_30_days',
      maxGetMeetingsPerSync: 10,
      maxTranscriptFetchPerSync: 1,
      transcriptPolicy: this.transcriptDisabledForSession ? 'off' : 'hybrid',
      globalTranscriptCooldownUntil: this.cacheState.syncMetadata.globalTranscriptCooldownUntil,
      transcriptCooldownUntilByMeetingId: { ...this.cacheState.syncMetadata.transcriptCooldownUntilByMeetingId },
    };
  }

  private async syncMeetingsWithClient(
    client: Client,
    reason: string,
  ): Promise<{ ok: boolean; meetingCount: number; fetchedAt: string; warning?: string }> {
    const syncOptions = this.syncOptionsSnapshot();
    const livePayload = await withTimeout(
      loadMeetingsWithClient(client, syncOptions),
      this.liveRequestTimeoutMs * 4,
      'Live meeting sync timed out.',
    );

    const merged = mergeMeetingsForCache(this.cacheState.meetings, livePayload.meetings);
    const extractionBacklog = this.countChangedMeetingsForExtraction(merged.meetings);
    const extractionDeferred = Math.max(0, extractionBacklog - GranolaTaskService.MAX_EXTRACTION_MEETINGS_PER_SYNC);
    const warnings = [...livePayload.warnings];
    const fetchedAt = nowIso();
    const rateLimited = livePayload.diagnostics.rateLimitedTools.length > 0 || livePayload.diagnostics.transcriptRateLimited;

    if (merged.reusedDetailsCount > 0) {
      warnings.push(
        `Using cached richer notes for ${merged.reusedDetailsCount} meeting(s).`,
      );
    }

    if (merged.carriedForwardCount > 0) {
      warnings.push(`Retained ${merged.carriedForwardCount} cached meeting(s) outside the current live window.`);
    }

    if (livePayload.diagnostics.transcriptCapabilityUnavailable) {
      const firstDisable = !this.transcriptDisabledForSession;
      this.transcriptDisabledForSession = true;
      if (firstDisable) {
        warnings.push('Transcript access is unavailable for this Granola plan. Continuing with notes only.');
      }
    }

    const nextSyncMetadata: SyncMetadata = {
      detailHydratedAtByMeetingId: { ...this.cacheState.syncMetadata.detailHydratedAtByMeetingId },
      transcriptCooldownUntilByMeetingId: { ...livePayload.diagnostics.transcriptCooldownUntilByMeetingId },
      globalTranscriptCooldownUntil: livePayload.diagnostics.globalTranscriptCooldownUntil,
      globalSyncCooldownUntil: this.cacheState.syncMetadata.globalSyncCooldownUntil,
      syncRateLimitStreak: this.cacheState.syncMetadata.syncRateLimitStreak,
    };

    for (const meeting of merged.meetings) {
      if (!meeting?.id) {
        continue;
      }
      const hasDetail = Boolean(meeting.notes || meeting.enhancedNotes || meeting.privateNotes || meeting.transcript);
      if (hasDetail) {
        nextSyncMetadata.detailHydratedAtByMeetingId[meeting.id] = fetchedAt;
      }
    }

    if (rateLimited) {
      const nextStreak = Math.max(1, nextSyncMetadata.syncRateLimitStreak + 1);
      nextSyncMetadata.syncRateLimitStreak = nextStreak;
      const cooldownMs = nextStreak === 1 ? 2 * 60_000 : nextStreak === 2 ? 5 * 60_000 : 10 * 60_000;
      nextSyncMetadata.globalSyncCooldownUntil = new Date(Date.now() + cooldownMs).toISOString();
      warnings.push(`Sync cooling down until ${formatRetryTime(nextSyncMetadata.globalSyncCooldownUntil)} due to rate limits.`);
    } else {
      nextSyncMetadata.syncRateLimitStreak = 0;
      nextSyncMetadata.globalSyncCooldownUntil = null;
    }

    const availableTools = Array.from(new Set([...livePayload.availableTools, ...this.cacheState.availableTools]));
    const extractionResult = await this.runTodoExtractionInternal(reason, merged.meetings, client);
    if (this.todoState.lastExtractionError) {
      warnings.push(this.todoState.lastExtractionError);
    }
    if (extractionDeferred > 0) {
      warnings.push(`Extraction queued ${extractionDeferred} meeting(s) for the next sync cycle.`);
    }
    const compactWarnings = compactWarningLines(warnings);

    await this.cacheStore.save({
      meetings: merged.meetings,
      availableTools,
      warnings: compactWarnings,
      fetchedAt,
      syncMetadata: nextSyncMetadata,
    });

    this.cacheState = {
      meetings: merged.meetings,
      availableTools,
      warnings: compactWarnings,
      warningDetails: compactWarnings.slice(1, 4),
      fetchedAt,
      syncMetadata: nextSyncMetadata,
    };

    this.lastSyncAt = fetchedAt;
    this.lastSyncError = null;

    await this.appendSyncTelemetry({
      createdAt: fetchedAt,
      reason,
      requestCountsByTool: { ...livePayload.diagnostics.requestCountsByTool },
      rateLimitedTools: [...livePayload.diagnostics.rateLimitedTools],
      transcriptAttempts:
        livePayload.diagnostics.requestCountsByTool.get_meeting_transcript ??
        livePayload.diagnostics.requestCountsByTool.getMeetingTranscript ??
        0,
      transcriptSkippedCount: livePayload.diagnostics.transcriptSkippedCount,
      extractionProcessed: extractionResult.processedMeetings,
      extractionDeferred,
    });

    return {
      ok: true,
      meetingCount: merged.meetings.length,
      fetchedAt,
      warning: compactWarnings[0],
    };
  }

  async syncNow(reason = 'manual-sync'): Promise<{
    ok: boolean;
    meetingCount: number;
    fetchedAt: string;
    warning?: string;
  }> {
    if (this.syncInFlightPromise) {
      return await this.syncInFlightPromise;
    }

    if (!this.isGranolaAuthenticated()) {
      return {
        ok: false,
        meetingCount: 0,
        fetchedAt: nowIso(),
        warning: 'Granola is not connected.',
      };
    }

    const cooldownUntil = this.syncCooldownUntilIso();
    if (cooldownUntil) {
      this.scheduleNextAutoSync();
      return {
        ok: false,
        meetingCount: 0,
        fetchedAt: nowIso(),
        warning: `Granola sync is cooling down until ${formatRetryTime(cooldownUntil)}.`,
      };
    }

    const syncPromise = this.withAuthenticatedClient(async (client) => {
      try {
        return await this.syncMeetingsWithClient(client, reason);
      } catch (error) {
        this.lastSyncError = safeErrorMessage(error);
        return {
          ok: false,
          meetingCount: 0,
          fetchedAt: nowIso(),
          warning: this.lastSyncError,
        };
      }
    });

    this.syncInFlightPromise = syncPromise;

    try {
      return await syncPromise;
    } finally {
      if (this.syncInFlightPromise === syncPromise) {
        this.syncInFlightPromise = null;
      }
      this.scheduleNextAutoSync();
    }
  }

  async runTodoExtraction(reason: string, meetingsInput?: GranolaMeeting[]): Promise<TodoExtractionResult> {
    return await this.runTodoExtractionInternal(reason, meetingsInput);
  }

  private async extractTodoCandidates(
    meeting: GranolaMeeting,
    prompt: string,
    client: Client | null,
  ): Promise<ExtractedTodoCandidate[]> {
    if (this.extractTodosForMeeting) {
      const answer = await this.extractTodosForMeeting(meeting, prompt);
      return parseExtractedTodos(answer);
    }

    if (client) {
      const response = await queryGranolaMeetings(client, prompt, [meeting.id]);
      return parseExtractedTodos(response.answer);
    }

    const response = await this.withAuthenticatedClient(async (freshClient) => {
      return await queryGranolaMeetings(freshClient, prompt, [meeting.id]);
    });

    return parseExtractedTodos(response.answer);
  }

  private async runTodoExtractionInternal(
    reason: string,
    meetingsInput?: GranolaMeeting[],
    sharedClient: Client | null = null,
  ): Promise<TodoExtractionResult> {
    if (!this.allowUnauthenticatedExtraction && !this.isGranolaAuthenticated() && !this.extractTodosForMeeting) {
      return {
        ok: false,
        skipped: true,
        reason: 'disabled_or_not_authenticated',
        processedMeetings: 0,
        extractedCount: 0,
        discoveredCount: 0,
        updatedCount: 0,
      };
    }

    if (this.todoState.extractionInFlight) {
      this.todoState.extractionPendingReason = reason;
      return {
        ok: true,
        skipped: true,
        reason: 'already_running',
        processedMeetings: 0,
        extractedCount: 0,
        discoveredCount: 0,
        updatedCount: 0,
      };
    }

    this.todoState.extractionInFlight = true;
    const extractionStartedAt = nowIso();

    try {
      const meetings = Array.isArray(meetingsInput) ? meetingsInput : this.cacheState.meetings;

      const meetingTasks: Array<{ meeting: GranolaMeeting; sourceHash: string }> = [];
      for (const meeting of meetings) {
        if (!meeting?.id) {
          continue;
        }

        const sourceHash = createMeetingSourceHash(meeting);
        const previousHash = this.todoState.metadata.meetingSourceHashes?.[meeting.id];
        if (previousHash && previousHash === sourceHash) {
          continue;
        }

        meetingTasks.push({
          meeting,
          sourceHash,
        });
      }

      const prioritizedMeetingTasks = [...meetingTasks]
        .sort((a, b) => parseDateForSort(b.meeting.date) - parseDateForSort(a.meeting.date))
        .slice(0, GranolaTaskService.MAX_EXTRACTION_MEETINGS_PER_SYNC);

      const extractionErrors: string[] = [];
      const extractedBuckets: Array<{
        meeting: GranolaMeeting;
        sourceHash: string;
        todos: ExtractedTodoCandidate[];
      }> = [];

      const runForClient = async (client: Client | null): Promise<void> => {
        for (const item of prioritizedMeetingTasks) {
          const prompt = buildTodoExtractionPrompt(item.meeting);

          try {
            const extracted = await withTimeout(
              this.extractTodoCandidates(item.meeting, prompt, client),
              this.liveRequestTimeoutMs * 2,
              'Todo extraction query timed out.',
            );

            extractedBuckets.push({
              meeting: item.meeting,
              sourceHash: item.sourceHash,
              todos: extracted,
            });
          } catch (error) {
            extractionErrors.push(`Meeting ${item.meeting.id}: ${safeErrorMessage(error)}`);
          }
        }
      };

      if (this.extractTodosForMeeting || sharedClient) {
        await runForClient(sharedClient);
      } else {
        await this.withAuthenticatedClient(async (client) => {
          await runForClient(client);
          return null;
        });
      }

      const extractionResult = await this.withTodoStateWrite(async () => {
        const fingerprintMap = new Map(this.todoState.todos.map((todo) => [todo.fingerprint, todo]));
        let discoveredCount = 0;
        let updatedCount = 0;
        let extractedCount = 0;

        for (const bucket of extractedBuckets) {
          if (!this.todoState.metadata.meetingSourceHashes) {
            this.todoState.metadata.meetingSourceHashes = {};
          }

          this.todoState.metadata.meetingSourceHashes[bucket.meeting.id] = bucket.sourceHash;

          for (const candidate of bucket.todos) {
            extractedCount += 1;

            const fingerprint = createTodoFingerprint({
              meetingId: bucket.meeting.id,
              title: candidate.title,
              description: candidate.description,
              dueDate: candidate.dueDate,
              owner: candidate.owner,
            });

            const existing = fingerprintMap.get(fingerprint);
            const currentIso = nowIso();

            if (existing) {
              ensureTodoTelemetry(existing);
              existing.meetingId = bucket.meeting.id;
              existing.meetingTitle = bucket.meeting.title || 'Untitled Meeting';
              existing.sourceHash = bucket.sourceHash;
              existing.title = candidate.title;
              existing.description = candidate.description;
              existing.owner = candidate.owner;
              existing.dueDate = candidate.dueDate;
              existing.priority = candidate.priority;
              existing.evidence = candidate.evidence;
              existing.updatedAt = currentIso;
              existing.runState = inferTodoRunState(existing);
              appendTodoStep(
                existing,
                'extracted',
                'Todo details refreshed from latest meeting notes.',
                `Todo refreshed from extraction (${reason}).`,
              );
              updatedCount += 1;
              continue;
            }

            const todo: TodoRecord = {
              todoId: randomUUID(),
              fingerprint,
              sourceHash: bucket.sourceHash,
              meetingId: bucket.meeting.id,
              meetingTitle: bucket.meeting.title || 'Untitled Meeting',
              title: candidate.title,
              description: candidate.description,
              owner: candidate.owner,
              dueDate: candidate.dueDate,
              priority: candidate.priority,
              evidence: candidate.evidence,
              status: 'discovered',
              attempts: 0,
              createdAt: currentIso,
              updatedAt: currentIso,
              approvedAt: null,
              submittedAt: null,
              failedAt: null,
              nextRetryAt: null,
              publicSummary: '',
              internalError: null,
              runId: null,
              runState: 'idle',
              latestPublicStep: null,
              stepEvents: [],
              guardrail: {
                mode: this.guardrailMode,
                verdict: 'unknown',
                reason: null,
                checkedAt: null,
              },
              openclaw: {
                lastStatus: null,
                lastEndpoint: null,
                lastRunId: null,
                lastResponseAt: null,
                lastError: null,
              },
            };

            appendTodoStep(
              todo,
              'extracted',
              'Todo discovered from meeting notes.',
              `New todo created from extraction (${reason}).`,
            );

            this.todoState.todos.push(todo);
            fingerprintMap.set(fingerprint, todo);
            discoveredCount += 1;
          }
        }

        this.todoState.lastExtractionAt = extractionStartedAt;
        const rateLimitErrors = extractionErrors.filter((message) => isRateLimitLikeMessage(message));
        const nonRateLimitErrors = extractionErrors.filter((message) => !isRateLimitLikeMessage(message));

        const mergedErrors: string[] = [];
        if (rateLimitErrors.length > 0) {
          mergedErrors.push(
            `Todo extraction is rate-limited for ${rateLimitErrors.length} meeting(s). Deferred meetings will retry automatically.`,
          );
        }
        mergedErrors.push(...nonRateLimitErrors.slice(0, 3));
        this.todoState.lastExtractionError = mergedErrors.length > 0 ? mergedErrors.join(' | ') : null;

        return {
          processedMeetings: extractedBuckets.length,
          extractedCount,
          discoveredCount,
          updatedCount,
        };
      });

      return {
        ok: true,
        skipped: false,
        ...extractionResult,
      };
    } finally {
      this.todoState.extractionInFlight = false;

      const pendingReason = this.todoState.extractionPendingReason;
      this.todoState.extractionPendingReason = null;
      if (pendingReason) {
        void this.runTodoExtractionInternal(pendingReason, meetingsInput, sharedClient);
      }
    }
  }

  async tasksRefreshExtraction(): Promise<{
    ok: boolean;
    processedMeetings: number;
    discoveredCount: number;
    updatedCount: number;
  }> {
    const result = await this.runTodoExtractionInternal('manual-extract', this.cacheState.meetings);
    return {
      ok: result.ok,
      processedMeetings: result.processedMeetings,
      discoveredCount: result.discoveredCount,
      updatedCount: result.updatedCount,
    };
  }

  private findTodo(todoId: string): TodoRecord | null {
    const match = this.todoState.todos.find((todo) => todo.todoId === todoId);
    return match ?? null;
  }

  private emitTaskRunEvent(
    todoId: string,
    runId: string | null,
    phase: 'started' | 'delta' | 'completed' | 'failed',
    message: string,
  ): void {
    this.emitRealtimeEvent({
      type: 'task-run',
      todoId,
      runId,
      phase,
      message: clampText(message, 700),
      createdAt: nowIso(),
    });
    this.emitFeedUpdated();
  }

  private emitTaskChatStatus(
    todoId: string,
    runId: string | null,
    phase: TaskExecutionPhase,
    message: string,
  ): void {
    this.emitRealtimeEvent({
      type: 'task-chat-status',
      todoId,
      runId,
      phase,
      message: clampText(message, 700),
      createdAt: nowIso(),
    });
  }

  private emitTaskChatDelta(
    todoId: string,
    runId: string | null,
    messageId: string,
    delta: string,
    content: string,
  ): void {
    this.emitRealtimeEvent({
      type: 'task-chat-delta',
      todoId,
      runId,
      messageId,
      delta: clampText(delta, 1000),
      content: clampText(content, 6000),
      createdAt: nowIso(),
    });
  }

  private threadHistoryForPrompt(todoId: string, maxMessages = 10): string {
    const thread = this.chatState.threads[todoId] ?? [];
    const filtered = thread
      .filter((item) => (item.role === 'user' || item.role === 'assistant') && item.messageType !== 'planning_draft')
      .slice(-maxMessages)
      .map((item) => `[${item.role}] ${item.content.trim()}`);
    return filtered.join('\n');
  }

  private buildExecutionPromptForRequest(
    todo: TodoRecord,
    meeting: GranolaMeeting | null,
    todoId: string,
    latestUserInstruction: string,
    approvedPlanSummary?: string | null,
  ): string {
    const base = buildExecutionPrompt(todo, meeting);
    const history = this.threadHistoryForPrompt(todoId);
    return [
      base,
      '',
      'Conversation history:',
      history || '[No prior conversation]',
      '',
      approvedPlanSummary ? 'Approved plan selection:' : null,
      approvedPlanSummary ? approvedPlanSummary : null,
      approvedPlanSummary ? '' : null,
      'Latest user instruction:',
      latestUserInstruction,
      '',
      'Respond in concise progress updates while working, then deliver final findings.',
    ]
      .filter((line): line is string => typeof line === 'string')
      .join('\n');
  }

  private latestPlanningDraft(todoId: string): TaskPlanDraft | null {
    const thread = this.chatState.threads[todoId] ?? [];
    for (let index = thread.length - 1; index >= 0; index -= 1) {
      const message = thread[index];
      if (message?.planDraft) {
        return message.planDraft;
      }
    }
    return null;
  }

  private approvedPlanSummary(todoId: string, options?: TaskStartOptions): { summary: string; userLine: string } | null {
    const approved = options?.approvedPlan;
    if (!approved?.selection) {
      return null;
    }
    const latestDraft = this.latestPlanningDraft(todoId);
    if (approved.selection.mode === 'custom') {
      const customInstruction = compactSingleLineText(approved.selection.customInstruction ?? '', 1200);
      if (!customInstruction) {
        return null;
      }
      return {
        summary: `Mode: custom\nInstruction: ${customInstruction}`,
        userLine: `Follow this custom planning instruction while executing: ${customInstruction}`,
      };
    }

    const optionId = compactSingleLineText(approved.selection.optionId ?? '', 120);
    if (!optionId || !latestDraft) {
      return null;
    }
    const option = latestDraft.options.find((item) => item.id === optionId);
    if (!option) {
      return null;
    }
    const steps = option.steps.slice(0, 6).map((step) => `- ${step}`).join('\n');
    const summary = [
      `Mode: preset (${option.title})`,
      `Summary: ${option.summary}`,
      `Why: ${option.why}`,
      'Steps:',
      steps,
    ].join('\n');
    return {
      summary,
      userLine: `Follow the approved preset plan: ${option.title}. ${option.summary}`,
    };
  }

  private async generatePlanDraft(
    todo: TodoRecord,
    meeting: GranolaMeeting | null,
    guidance: string,
  ): Promise<{ draft: TaskPlanDraft; usedFallback: boolean; note?: string }> {
    const hasRichContext = Boolean(
      (todo.description && todo.description.trim()) ||
        (todo.evidence && todo.evidence.trim()) ||
        (meeting?.notes && meeting.notes.trim()) ||
        (meeting?.enhancedNotes && meeting.enhancedNotes.trim()) ||
        (meeting?.transcript && meeting.transcript.trim()),
    );
    const targetOptionCount = hasRichContext ? 3 : 2;
    const fallback = fallbackPlanOptions(todo, meeting);
    const guidanceUsed = compactSingleLineText(guidance, 1200) || 'Generate the best execution plan.';
    const baseDraft = (): TaskPlanDraft => {
      const normalized = normalizePlanOptions([], fallback, targetOptionCount);
      return {
        draftId: randomUUID(),
        todoId: todo.todoId,
        generatedAt: nowIso(),
        options: normalized.options,
        recommendedOptionId: normalized.recommendedOptionId,
        guidanceUsed,
      };
    };

    const executor = await this.refreshExecutorState();
    if (executor.state !== 'connected') {
      return {
        draft: baseDraft(),
        usedFallback: true,
        note: executor.lastError || 'IronClaw planner unavailable; generated fallback options.',
      };
    }

    const planningPrompt = buildPlanningPrompt(todo, meeting, guidanceUsed);
    const runHandle = this.ironclaw.startRun({
      prompt: planningPrompt,
      agentId: this.ironclawAgentId,
      sessionKey: `${this.buildExecutionSessionKey(todo.todoId, randomUUID())}:planning`,
      lane: this.executionLane(),
      thinking: 'minimal',
      onEvent: () => {
        // Planning generation is synchronous from the renderer's perspective.
      },
    });

    try {
      const result = await withTimeout(
        runHandle.done,
        this.liveRequestTimeoutMs * 2,
        'Planning generation timed out. Falling back to template options.',
      );
      const responseText = String(result.finalText || result.summary || '').trim();
      const parsed =
        parseJsonObjectStrict(responseText) ??
        extractJsonObjectFromFence(responseText) ??
        extractFirstJsonObject(responseText);
      const candidatesRaw = Array.isArray(parsed?.options)
        ? parsed.options
        : Array.isArray(parsed?.plans)
          ? parsed.plans
          : [];
      const parsedOptions = candidatesRaw
        .map((item, index) => normalizePlanOptionCandidate(item, index))
        .filter((item): item is TaskPlanOption => item !== null);
      const normalized = normalizePlanOptions(parsedOptions, fallback, targetOptionCount);
      const usedFallback = parsedOptions.length < 2;
      return {
        draft: {
          draftId: randomUUID(),
          todoId: todo.todoId,
          generatedAt: nowIso(),
          options: normalized.options,
          recommendedOptionId: normalized.recommendedOptionId,
          guidanceUsed,
        },
        usedFallback,
        note: usedFallback ? 'Planner response was incomplete. Added fallback options.' : undefined,
      };
    } catch (error) {
      return {
        draft: baseDraft(),
        usedFallback: true,
        note: safeErrorMessage(error),
      };
    }
  }

  private async queueExecutionRequest(
    request: ExecutionQueueRequest,
    options: { allowQueueWhenSameTodo: boolean },
  ): Promise<{ ok: boolean; queued: boolean; runId?: string; message?: string }> {
    const todo = this.findTodo(request.todoId);
    if (!todo) {
      return {
        ok: false,
        queued: false,
        message: 'Task not found.',
      };
    }

    const executor = await this.refreshExecutorState();
    if (executor.state !== 'connected') {
      return {
        ok: false,
        queued: false,
        message: executor.lastError || 'IronClaw is not connected. Use Reconnect and try again.',
      };
    }

    if (this.activeExecutionTodoId === request.todoId && !options.allowQueueWhenSameTodo) {
      return {
        ok: false,
        queued: false,
        runId: todo.runId ?? undefined,
        message: 'This task is already running.',
      };
    }

    if (this.activeExecutionTodoId) {
      const sameTodoAsActive = this.activeExecutionTodoId === request.todoId;
      this.executionQueue.push(request);
      await this.withTodoStateWrite(async () => {
        const current = this.findTodo(request.todoId);
        if (!current) {
          return;
        }
        if (!sameTodoAsActive) {
          current.status = 'queued';
          current.runState = 'retry_wait';
        }
        current.updatedAt = nowIso();
        appendTodoStep(current, 'execution_queued', 'Task queued behind another active run.', 'Execution queued.');
      });
      await this.withChatStateWrite(async () => {
        this.appendThreadMessage(request.todoId, 'status', 'Queued behind another running task.', {
          statusTag: 'queued',
        });
      });
      this.emitTaskChatStatus(request.todoId, todo.runId ?? null, 'queued', 'Queued behind another running task.');
      this.emitFeedUpdated(true);
      return {
        ok: true,
        queued: true,
        runId: todo.runId ?? undefined,
        message: 'Task queued. It will start automatically.',
      };
    }

    void this.startExecutionRequest(request);
    return {
      ok: true,
      queued: false,
      runId: todo.runId ?? undefined,
      message: 'Task execution started.',
    };
  }

  private async startExecutionRequest(request: ExecutionQueueRequest): Promise<void> {
    this.activeExecutionTodoId = request.todoId;
    this.emitFeedUpdated(true);

    const todo = this.findTodo(request.todoId);
    if (!todo) {
      this.activeExecutionTodoId = null;
      await this.processQueuedExecutions();
      return;
    }

    const executor = await this.refreshExecutorState();
    if (executor.state !== 'connected') {
      await this.withChatStateWrite(async () => {
        this.appendThreadMessage(request.todoId, 'status', executor.lastError || 'IronClaw is disconnected.', {
          statusTag: 'failed',
        });
      });
      this.emitTaskChatStatus(request.todoId, todo.runId ?? null, 'failed', executor.lastError || 'IronClaw is disconnected.');
      this.activeExecutionTodoId = null;
      this.emitFeedUpdated(true);
      await this.processQueuedExecutions();
      return;
    }

    let assistantMessageId: string | null = null;
    let runStartTraceMessageId: string | null = null;
    let thinkingTraceMessageId: string | null = null;
    const thinkingGroupId = `thought-${request.executionId}`;
    let thinkingBuffer = '';
    let lastThinkingCheckpointAtMs = 0;
    const emittedSourceUrls = new Set<string>();
    await this.withTodoStateWrite(async () => {
      const current = this.findTodo(request.todoId);
      if (!current) {
        return;
      }

      ensureTodoTelemetry(current);
      current.attempts = (current.attempts ?? 0) + 1;
      current.status = 'submitting';
      current.updatedAt = nowIso();
      current.internalError = null;
      current.openclaw.lastError = null;
      current.openclaw.lastEndpoint = executor.gatewayUrl;
      current.runState = 'running';
      appendTodoStep(
        current,
        'execution_started',
        'Task started in IronClaw.',
        request.source === 'chat' ? 'Execution started from in-app chat.' : 'Execution started from task list.',
      );
    });

    await this.withChatStateWrite(async () => {
      if (this.chatTimelineV2Enabled) {
        const startTrace = this.appendTraceMessage(
          request.todoId,
          todo.runId ?? null,
          {
            kind: 'phase',
            title: 'Run started',
            detail: request.source === 'chat' ? 'Started from chat instruction.' : 'Started from task list.',
            phase: 'started',
            groupId: request.executionId,
          },
          { persist: false },
        );
        runStartTraceMessageId = startTrace.messageId;
      } else {
        this.appendThreadMessage(request.todoId, 'status', 'Run started.', {
          statusTag: 'started',
        });
      }
      const assistant = this.appendThreadMessage(request.todoId, 'assistant', '', {
        runId: todo.runId ?? null,
        streaming: true,
        statusTag: 'thinking',
        trace: null,
      });
      assistantMessageId = assistant.messageId;
    });

    this.emitTaskChatStatus(request.todoId, todo.runId ?? null, 'started', 'Run started.');
    this.emitTaskRunEvent(request.todoId, todo.runId ?? null, 'started', 'Task started in IronClaw.');

    let latestAssistantSnapshot = '';
    let lastChatFinalText = '';
    let resultPayloadFinalText = '';
    let progressTraceMessageId: string | null = null;
    let lastProgressCheckpointAtMs = 0;
    const progressGroupId = `progress-${request.executionId}`;
    const runHandle = this.ironclaw.startRun({
      prompt: request.prompt,
      agentId: this.ironclawAgentId,
      sessionKey: this.buildExecutionSessionKey(request.todoId, request.executionId),
      lane: this.executionLane(),
      thinking: 'minimal',
      onEvent: (event) => {
        const current = this.findTodo(request.todoId);
        const running = this.runningExecutions.get(request.todoId);
        if (!current || !running) {
          return;
        }

        if (event.runId) {
          current.runId = event.runId;
          current.openclaw.lastRunId = event.runId;
          running.runId = event.runId;
          if (runStartTraceMessageId) {
            this.updateThreadMessage(
              request.todoId,
              runStartTraceMessageId,
              (message) => ({
                ...message,
                runId: event.runId,
              }),
              { emitRealtime: true },
            );
          }
          if (thinkingTraceMessageId) {
            this.updateThreadMessage(
              request.todoId,
              thinkingTraceMessageId,
              (message) => ({
                ...message,
                runId: event.runId,
              }),
              { emitRealtime: true },
            );
          }
          if (progressTraceMessageId) {
            this.updateThreadMessage(
              request.todoId,
              progressTraceMessageId,
              (message) => ({
                ...message,
                runId: event.runId,
              }),
              { emitRealtime: true },
            );
          }
        }

        if (event.kind === 'started') {
          running.lastDeltaAtMs = Date.now();
          this.emitTaskChatStatus(request.todoId, running.runId, 'thinking', event.message || 'Thinking...');
          this.emitTaskRunEvent(request.todoId, running.runId, 'started', event.message || 'Task started in IronClaw.');
          if (this.chatTimelineV2Enabled && runStartTraceMessageId) {
            const updated = this.updateThreadMessage(
              request.todoId,
              runStartTraceMessageId,
              (message) => ({
                ...message,
                content: 'Run started',
                trace: {
                  ...(message.trace ?? {
                    kind: 'phase',
                    title: 'Run started',
                    phase: 'started' as const,
                    groupId: request.executionId,
                  }),
                  detail: event.message || message.trace?.detail || null,
                },
              }),
              { emitRealtime: true },
            );
            if (updated) {
              this.queueChatPersist();
            }
          }
          return;
        }

        if (event.kind === 'thinking') {
          running.lastDeltaAtMs = Date.now();
          const delta = event.delta ?? event.message;
          if (!delta) {
            return;
          }
          thinkingBuffer = `${thinkingBuffer}${delta}`;
          const nowMs = Date.now();
          const shouldCheckpoint =
            thinkingBuffer.trim().length >= 140 && nowMs - lastThinkingCheckpointAtMs >= 900;
          if (!shouldCheckpoint) {
            return;
          }
          thinkingTraceMessageId = this.upsertThinkingGroup(
            request.todoId,
            running.runId,
            thinkingGroupId,
            thinkingBuffer,
            thinkingTraceMessageId,
          );
          lastThinkingCheckpointAtMs = nowMs;
          this.emitTaskChatStatus(request.todoId, running.runId, 'thinking', 'Thinking through tool strategy…');
          this.emitFeedUpdated();
          return;
        }

        if (event.kind === 'tool' && event.tool) {
          running.lastDeltaAtMs = Date.now();
          if (this.chatTimelineV2Enabled) {
            this.appendToolTrace(request.todoId, running.runId, event.tool);
            if (event.tool.phase === 'result') {
              const urls = new Set<string>();
              extractUrlCandidates(event.tool.args, urls, 24);
              extractUrlCandidates(event.tool.meta, urls, 24);
              for (const sourceUrl of urls) {
                if (emittedSourceUrls.has(sourceUrl)) {
                  continue;
                }
                emittedSourceUrls.add(sourceUrl);
                this.appendTraceMessage(request.todoId, running.runId, {
                  kind: 'source_fetch',
                  title: domainFromUrl(sourceUrl) ? `Fetched ${String(domainFromUrl(sourceUrl))}` : 'Fetched source',
                  detail: sourceUrl,
                  sourceUrl,
                  domain: domainFromUrl(sourceUrl),
                  groupId: event.tool.toolCallId,
                });
              }
            }
          }
          this.emitTaskChatStatus(request.todoId, running.runId, 'working', event.message || 'Running tool step…');
          this.emitFeedUpdated();
          return;
        }

        if (event.kind === 'delta') {
          running.lastDeltaAtMs = Date.now();
          const mergeDelta = event.delta ?? (event.snapshot ? undefined : event.message);
          const mergeSnapshot = event.snapshot ?? (event.finalText ? event.message : undefined);
          const merge = mergeAssistantBuffer(latestAssistantSnapshot, mergeDelta, mergeSnapshot);
          if (!merge.changed) {
            if (event.finalText && event.finalText.trim()) {
              lastChatFinalText = event.finalText;
            }
            return;
          }
          latestAssistantSnapshot = merge.next;
          const normalized = clampText(latestAssistantSnapshot.trim(), 6000);
          current.publicSummary = normalized;
          current.latestPublicStep = clampText((merge.emittedDelta || mergeDelta || '').trim() || normalized, 240);
          current.updatedAt = nowIso();
          if (event.finalText && event.finalText.trim()) {
            lastChatFinalText = event.finalText;
          }

          if (assistantMessageId) {
            const updatedMessage = this.updateThreadMessage(request.todoId, assistantMessageId, (message) => ({
              ...message,
              runId: running.runId,
              content: normalized,
              streaming: true,
              statusTag: 'streaming',
              trace: null,
            }));
            if (updatedMessage) {
              this.emitTaskChatDelta(
                request.todoId,
                running.runId,
                assistantMessageId,
                merge.emittedDelta || mergeDelta || event.message,
                updatedMessage.content,
              );
            }
            this.queueChatPersist();
          }

          if (this.chatTimelineV2Enabled) {
            const checkpoint = progressCheckpointLine(merge.emittedDelta || mergeDelta || normalized);
            const nowMs = Date.now();
            if (checkpoint && nowMs - lastProgressCheckpointAtMs >= 1_200) {
              progressTraceMessageId = this.upsertProgressTrace(
                request.todoId,
                running.runId,
                progressGroupId,
                checkpoint,
                progressTraceMessageId,
              );
              lastProgressCheckpointAtMs = nowMs;
            }
          }

          this.emitTaskChatStatus(request.todoId, running.runId, 'streaming', 'Streaming latest research…');
          this.emitTaskRunEvent(request.todoId, running.runId, 'delta', merge.emittedDelta || mergeDelta || event.message);
          this.emitFeedUpdated();
          return;
        }

        if ((event.kind === 'completed' || event.kind === 'failed') && event.finalText && event.finalText.trim()) {
          resultPayloadFinalText = event.finalText;
        }
      },
    });

    const heartbeatTimer = setInterval(() => {
      const running = this.runningExecutions.get(request.todoId);
      if (!running) {
        return;
      }
      const elapsedSeconds = Math.floor((Date.now() - running.startedAtMs) / 1000);
      const sinceDeltaSeconds = Math.floor((Date.now() - running.lastDeltaAtMs) / 1000);
      if (sinceDeltaSeconds >= 10) {
        if (this.chatTimelineV2Enabled) {
          progressTraceMessageId = this.upsertProgressTrace(
            request.todoId,
            running.runId,
            progressGroupId,
            `Still working… ${elapsedSeconds}s elapsed.`,
            progressTraceMessageId,
          );
        }
        this.emitTaskChatStatus(request.todoId, running.runId, 'working', `Working… ${elapsedSeconds}s`);
      }
    }, 10_000);

    this.runningExecutions.set(request.todoId, {
      executionId: request.executionId,
      todoId: request.todoId,
      startedAt: nowIso(),
      startedAtMs: Date.now(),
      runId: todo.runId ?? null,
      cancel: runHandle.cancel,
      heartbeatTimer,
      lastDeltaAtMs: Date.now(),
      assistantMessageId,
      cancelled: false,
    });
    this.emitFeedUpdated(true);

    const flushPendingThinkingTrace = (runId: string | null): void => {
      if (!this.chatTimelineV2Enabled) {
        return;
      }
      if (!thinkingBuffer.trim()) {
        return;
      }
      thinkingTraceMessageId = this.upsertThinkingGroup(
        request.todoId,
        runId,
        thinkingGroupId,
        thinkingBuffer,
        thinkingTraceMessageId,
      );
      thinkingBuffer = '';
    };

    void runHandle.done
      .then(async (result) => {
        const running = this.runningExecutions.get(request.todoId);
        if (running?.heartbeatTimer) {
          clearInterval(running.heartbeatTimer);
        }
        flushPendingThinkingTrace(running?.runId ?? result.runId ?? todo.runId ?? null);
        this.runningExecutions.delete(request.todoId);
        this.activeExecutionTodoId = null;
        const cancelled = running?.cancelled === true;
        const summary = result.summary || (result.ok ? 'Execution completed.' : cancelled ? 'Execution cancelled.' : 'Execution failed.');
        const resolvedFinalText = lastChatFinalText || result.finalText || latestAssistantSnapshot || result.summary || null;
        const resolvedFinalSource = lastChatFinalText
          ? 'chat_final'
          : result.finalText
            ? result.finalTextSource ?? 'result_payload_last'
            : latestAssistantSnapshot
              ? 'stream_buffer'
              : 'summary';
        const retryBudget = maxProgressRetryAttempts(this.progressOnlyAutoRetry);
        const progressOnly = isProgressOnlyFinal(resolvedFinalText);
        if (!cancelled && progressOnly && request.retryCount < retryBudget) {
          await this.withChatStateWrite(async () => {
            this.appendTraceMessage(request.todoId, result.runId ?? running?.runId ?? todo.runId ?? null, {
              kind: 'phase',
              title: 'Auto-retry triggered',
              detail: 'Incomplete progress-only output detected. Retrying once for a complete final answer.',
              phase: 'working',
              groupId: request.executionId,
            });
          });
          this.emitTaskChatStatus(
            request.todoId,
            result.runId ?? running?.runId ?? todo.runId ?? null,
            'working',
            'Auto-retrying because the first result looked incomplete.',
          );
          this.executionQueue.unshift({
            ...request,
            executionId: randomUUID(),
            prompt: this.retryPrompt(request.prompt),
            retryCount: request.retryCount + 1,
            requestedAt: nowIso(),
          });
          await this.processQueuedExecutions();
          return;
        }

        const incompleteAfterRetry = !cancelled && progressOnly && retryBudget > 0 && request.retryCount >= retryBudget;
        const incompleteMessage = incompleteAfterRetry
          ? 'Run ended with progress-only output after automatic retry.'
          : null;
        await this.finalizeTaskExecution(request.todoId, {
          ...result,
          ok: incompleteAfterRetry ? false : result.ok,
          summary: incompleteMessage ?? summary,
          finalText: resolvedFinalText,
          finalTextSource: resolvedFinalSource,
          error: incompleteMessage ?? result.error,
          cancelled,
          assistantMessageId: running?.assistantMessageId ?? assistantMessageId,
        });
        await this.processQueuedExecutions();
      })
      .catch(async (error: unknown) => {
        const running = this.runningExecutions.get(request.todoId);
        if (running?.heartbeatTimer) {
          clearInterval(running.heartbeatTimer);
        }
        flushPendingThinkingTrace(running?.runId ?? todo.runId ?? null);
        this.runningExecutions.delete(request.todoId);
        this.activeExecutionTodoId = null;
        const message = safeErrorMessage(error);
        const resolvedFinalText = lastChatFinalText || resultPayloadFinalText || latestAssistantSnapshot || null;
        await this.finalizeTaskExecution(request.todoId, {
          ok: false,
          runId: running?.runId ?? todo.runId,
          summary: message,
          finalText: resolvedFinalText,
          finalTextSource: resolvedFinalText
            ? lastChatFinalText
              ? 'chat_final'
              : resultPayloadFinalText
                ? 'result_payload_last'
                : 'stream_buffer'
            : 'summary',
          error: message,
          cancelled: running?.cancelled === true,
          assistantMessageId: running?.assistantMessageId ?? assistantMessageId,
        });
        await this.processQueuedExecutions();
      });
  }

  private async processQueuedExecutions(): Promise<void> {
    if (this.activeExecutionTodoId || this.executionQueue.length === 0) {
      this.emitFeedUpdated(true);
      return;
    }

    const next = this.executionQueue.shift();
    if (!next) {
      this.emitFeedUpdated(true);
      return;
    }
    void this.startExecutionRequest(next);
  }

  private async finalizeTaskExecution(
    todoId: string,
    result: {
      ok: boolean;
      runId: string | null;
      summary: string;
      finalText: string | null;
      finalTextSource?:
        | 'result_payload_last'
        | 'chat_final'
        | 'stream_buffer'
        | 'summary'
        | 'fallback_summary';
      error?: string;
      cancelled?: boolean;
      assistantMessageId?: string | null;
    },
  ): Promise<void> {
    const completedAtMs = Date.now();
    const completedAt = new Date(completedAtMs).toISOString();
    const finalMessageAt = new Date(completedAtMs + 1).toISOString();
    const completionPhase: TaskExecutionPhase = result.cancelled
      ? 'cancelled'
      : result.ok
        ? 'completed'
        : 'failed';

    await this.withTodoStateWrite(async () => {
      const todo = this.findTodo(todoId);
      if (!todo) {
        return;
      }

      ensureTodoTelemetry(todo);
      todo.updatedAt = completedAt;
      todo.runId = result.runId ?? todo.runId ?? null;
      todo.openclaw.lastRunId = todo.runId;
      todo.openclaw.lastResponseAt = completedAt;

      if (result.cancelled) {
        todo.status = 'cancelled';
        todo.internalError = result.error ?? 'Execution cancelled.';
        appendTodoStep(
          todo,
          'execution_cancelled',
          'Run cancelled from Yogurt.',
          `IronClaw execution cancelled (${todo.runId ?? 'unknown run'}).`,
        );
      } else if (result.ok) {
        todo.status = 'submitted';
        todo.submittedAt = completedAt;
        todo.failedAt = null;
        todo.internalError = null;
        if (result.finalText) {
          todo.publicSummary = clampText(result.finalText, 5000);
        } else if (result.summary) {
          todo.publicSummary = clampText(result.summary, 5000);
        }
        appendTodoStep(
          todo,
          'execution_completed',
          'IronClaw completed research for this task.',
          `IronClaw run completed (${todo.runId ?? 'unknown run'}).`,
        );
        this.todoState.lastSubmissionAt = completedAt;
        this.todoState.lastSubmissionError = null;
      } else {
        todo.status = 'failed';
        todo.failedAt = completedAt;
        todo.internalError = result.error ?? result.summary;
        todo.openclaw.lastError = result.error ?? result.summary;
        appendTodoStep(
          todo,
          'execution_failed',
          result.error ? `IronClaw failed: ${result.error}` : 'IronClaw run failed.',
          `IronClaw execution failed (${todo.runId ?? 'unknown run'}).`,
        );
        this.todoState.lastSubmissionError = result.error ?? result.summary;
      }

      todo.runState = inferTodoRunState(todo);
    });

    let finalSource: 'result_payload_last' | 'chat_final' | 'stream_buffer' | 'summary' | 'fallback_summary' =
      result.finalTextSource ?? 'summary';
    await this.withChatStateWrite(async () => {
      if (result.assistantMessageId) {
        this.updateThreadMessage(
          todoId,
          result.assistantMessageId,
          (message) => {
            const hasStreamedText = Boolean(message.content && message.content.trim());
            finalSource = result.finalText
              ? result.finalTextSource ?? 'result_payload_last'
              : hasStreamedText
                ? 'stream_buffer'
                : 'summary';
            return {
              ...message,
              runId: result.runId ?? message.runId,
              content: clampText(result.finalText || message.content || result.summary, 6000),
              createdAt: finalMessageAt,
              streaming: false,
              statusTag: null,
              trace: null,
            };
          },
          { emitRealtime: true },
        );
      } else {
        finalSource = result.finalText ? result.finalTextSource ?? 'stream_buffer' : 'summary';
        this.appendThreadMessage(todoId, 'assistant', clampText(result.finalText || result.summary, 6000), {
          runId: result.runId,
          createdAt: finalMessageAt,
          streaming: false,
          trace: null,
        });
      }
      if (this.chatTimelineV2Enabled) {
        this.appendTraceMessage(
          todoId,
          result.runId,
          {
            kind: 'phase',
            title: result.cancelled ? 'Run cancelled' : result.ok ? 'Run completed' : 'Run failed',
            detail: result.cancelled
              ? result.error ?? 'Execution cancelled.'
              : result.ok
                ? result.summary
                : result.error ?? result.summary,
            phase: completionPhase,
            groupId: result.runId,
          },
          { createdAt: completedAt, persist: false },
        );
      } else {
        this.appendThreadMessage(
          todoId,
          'status',
          result.cancelled
            ? 'Run cancelled.'
            : result.ok
              ? 'Run completed.'
              : `Run failed: ${result.error ?? result.summary}`,
          {
            runId: result.runId,
            createdAt: completedAt,
            statusTag: completionPhase,
          },
        );
      }
    });

    if (process.env.NODE_ENV !== 'production' && !process.env.VITEST) {
      process.stderr.write(`[yogurt][task-final] source=${finalSource} runId=${result.runId ?? 'unknown'}\n`);
    }

    this.emitFeedUpdated(true);
    this.emitTaskChatStatus(
      todoId,
      result.runId,
      completionPhase,
      result.cancelled
        ? 'Run cancelled.'
        : result.ok
          ? 'Run completed.'
          : result.error || result.summary || 'Run failed.',
    );
    this.emitTaskRunEvent(todoId, result.runId, result.ok ? 'completed' : 'failed', result.summary || result.error || 'Execution finished.');
  }

  async tasksGetThread(todoId: string, cursor?: string | null, limit?: number): Promise<TaskChatThreadPage> {
    const safeLimit = Math.min(100, Math.max(10, typeof limit === 'number' ? Math.floor(limit) : 40));
    const thread = [...(this.chatState.threads[todoId] ?? [])].sort((a, b) => {
      const left = chatSortKey(a);
      const right = chatSortKey(b);
      if (left !== right) {
        return left - right;
      }
      return a.messageId.localeCompare(b.messageId);
    });

    let end = thread.length;
    const decodedCursor = decodeCursor(cursor ?? null);
    if (decodedCursor) {
      const index = thread.findIndex((item) => item.messageId === decodedCursor.messageId);
      if (index >= 0) {
        end = index;
      } else {
        const cursorMs = Date.parse(decodedCursor.createdAt);
        if (Number.isFinite(cursorMs)) {
          end = thread.findIndex((item) => chatSortKey(item) >= cursorMs);
          if (end < 0) {
            end = thread.length;
          }
        }
      }
    }

    const start = Math.max(0, end - safeLimit);
    const messages = thread.slice(start, end);
    const hasMore = start > 0;
    const nextCursor = hasMore && messages.length > 0 ? encodeCursor(messages[0] as TaskChatMessage) : null;

    return {
      todoId,
      messages,
      nextCursor,
      hasMore,
      loadedAt: nowIso(),
    };
  }

  async tasksGetPlanningContext(todoId: string): Promise<TaskPlanningContext> {
    const todo = this.findTodo(todoId);
    if (!todo) {
      throw new Error('Task not found.');
    }
    const meeting = this.cacheState.meetings.find((item) => item.id === todo.meetingId) ?? null;
    const executor = await this.refreshExecutorState();
    if (!this.ironclawVersion) {
      this.ironclawVersion = await this.ironclaw.getVersion();
    }
    const auth = this.authSnapshot();
    const latestDraft = this.latestPlanningDraft(todoId);

    const granolaBullets = [
      `Task: ${compactSingleLineText(todo.title, 140) || 'Untitled task'}`,
      `Description: ${compactSingleLineText(todo.description || 'No description provided.', 180)}`,
      `Meeting: ${compactSingleLineText(meeting?.title || todo.meetingTitle || 'Unknown meeting', 140)}`,
      `Owner: ${compactSingleLineText(todo.owner || 'Unassigned', 80)}`,
      `Due date: ${compactSingleLineText(todo.dueDate || 'Not specified', 80)}`,
    ];
    if (meeting?.attendees?.length) {
      granolaBullets.push(`Attendees: ${meeting.attendees.slice(0, 6).join(', ')}`);
    }

    const plannerBullets = [
      'AI planner proposes 2-3 options and marks exactly one as recommended.',
      latestDraft
        ? `Latest draft generated at ${formatDateIso(latestDraft.generatedAt)}.`
        : 'No draft yet. Generate options to begin.',
      latestDraft ? `Last guidance: ${compactSingleLineText(latestDraft.guidanceUsed, 200)}` : 'Guidance defaults to concise action planning.',
    ];

    const ironclawBullets = [
      `Executor state: ${executor.state}`,
      `Profile: ${this.ironclawProfile}`,
      `Version: ${this.ironclawVersion || 'unknown'}`,
      `Gateway: ${executor.gatewayUrl || 'Unavailable'}`,
      `Account: ${auth.tokenIdentity || 'Not available'}`,
      `Last sync: ${this.lastSyncAt ? formatDateIso(this.lastSyncAt) : 'Never'}`,
    ];
    if (executor.lastError) {
      ironclawBullets.push(`Runtime note: ${compactSingleLineText(executor.lastError, 200)}`);
    }

    return {
      todoId,
      generatedAt: nowIso(),
      sections: [
        {
          id: 'granola',
          title: 'Granola context',
          bullets: granolaBullets,
        },
        {
          id: 'planner',
          title: 'OpenAI/IronClaw planner',
          bullets: plannerBullets,
        },
        {
          id: 'ironclaw',
          title: 'IronClaw runtime',
          bullets: ironclawBullets,
        },
      ],
    };
  }

  async tasksPlanMessage(todoId: string, instruction: string): Promise<{ ok: boolean; plan?: TaskPlanDraft; message?: string }> {
    const todo = this.findTodo(todoId);
    if (!todo) {
      return {
        ok: false,
        message: 'Task not found.',
      };
    }

    const trimmed = instruction.trim();
    const guidance = trimmed || 'Generate 2-3 concise execution plans for this task.';
    const meeting = this.cacheState.meetings.find((item) => item.id === todo.meetingId) ?? null;

    await this.withChatStateWrite(async () => {
      this.appendThreadMessage(todoId, 'user', guidance, {
        runId: todo.runId,
        messageType: 'planning_user',
      });
    });

    let generated: { draft: TaskPlanDraft; usedFallback: boolean; note?: string };
    try {
      generated = await this.generatePlanDraft(todo, meeting, guidance);
    } catch (error) {
      return {
        ok: false,
        message: safeErrorMessage(error),
      };
    }

    await this.withChatStateWrite(async () => {
      this.appendThreadMessage(todoId, 'assistant', planningDraftMarkdown(generated.draft), {
        runId: todo.runId,
        messageType: 'planning_draft',
        planDraft: generated.draft,
      });
    });
    this.emitFeedUpdated();

    return {
      ok: true,
      plan: generated.draft,
      message: generated.note,
    };
  }

  async tasksSendMessage(todoId: string, text: string): Promise<{ ok: boolean; queued: boolean; runId?: string; message?: string }> {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        ok: false,
        queued: false,
        message: 'Message cannot be empty.',
      };
    }

    const todo = this.findTodo(todoId);
    if (!todo) {
      return {
        ok: false,
        queued: false,
        message: 'Task not found.',
      };
    }

    const meeting = this.cacheState.meetings.find((item) => item.id === todo.meetingId) ?? null;
    const prompt = this.buildExecutionPromptForRequest(todo, meeting, todoId, trimmed);

    await this.withChatStateWrite(async () => {
      this.appendThreadMessage(todoId, 'user', trimmed, {
        runId: todo.runId,
      });
    });
    this.emitFeedUpdated();

    return await this.queueExecutionRequest(
      {
        executionId: randomUUID(),
        todoId,
        prompt,
        retryCount: 0,
        requestedAt: nowIso(),
        source: 'chat',
      },
      { allowQueueWhenSameTodo: true },
    );
  }

  async tasksCancelActiveRun(todoId: string): Promise<{ ok: boolean; message?: string }> {
    const running = this.runningExecutions.get(todoId);
    if (!running || this.activeExecutionTodoId !== todoId) {
      return {
        ok: false,
        message: 'No active run for this task.',
      };
    }

    running.cancelled = true;
    running.cancel();
    this.emitTaskChatStatus(todoId, running.runId, 'cancelled', 'Cancelling run…');
    this.emitFeedUpdated(true);
    return {
      ok: true,
      message: 'Cancellation requested.',
    };
  }

  async tasksClearThread(todoId: string): Promise<{ ok: boolean; message?: string }> {
    await this.withChatStateWrite(async () => {
      this.chatState.threads[todoId] = [];
    });
    this.emitFeedUpdated(true);
    return {
      ok: true,
      message: 'Thread cleared.',
    };
  }

  async tasksStart(todoId: string, options?: TaskStartOptions): Promise<{ ok: boolean; runId?: string; message?: string }> {
    const todo = this.findTodo(todoId);
    if (!todo) {
      return {
        ok: false,
        message: 'Task not found.',
      };
    }

    const meeting = this.cacheState.meetings.find((item) => item.id === todo.meetingId) ?? null;
    const approvedPlan = this.approvedPlanSummary(todoId, options);
    const userInstruction = approvedPlan
      ? `${approvedPlan.userLine}\n\nStart this task and stream progress updates in Yogurt chat: ${todo.title}`
      : `Start this task and stream progress updates in Yogurt chat: ${todo.title}`;
    const prompt = this.buildExecutionPromptForRequest(todo, meeting, todoId, userInstruction, approvedPlan?.summary ?? null);

    await this.withChatStateWrite(async () => {
      if (approvedPlan) {
        this.appendThreadMessage(todoId, 'system', `Approved plan captured for execution.\n\n${approvedPlan.summary}`, {
          runId: todo.runId,
          messageType: 'planning_approved',
        });
      }
      this.appendThreadMessage(todoId, 'user', userInstruction, {
        runId: todo.runId,
      });
    });
    this.emitFeedUpdated();

    const queued = await this.queueExecutionRequest(
      {
        executionId: randomUUID(),
        todoId,
        prompt,
        retryCount: 0,
        requestedAt: nowIso(),
        source: 'start',
      },
      { allowQueueWhenSameTodo: false },
    );
    return {
      ok: queued.ok,
      runId: queued.runId,
      message: queued.message,
    };
  }

  async tasksExecutorReconnect(): Promise<{ ok: boolean; message?: string }> {
    const state = await this.reconnectExecutorState();
    if (state.state === 'connected') {
      return {
        ok: true,
        message: 'Connected to IronClaw.',
      };
    }

    return {
      ok: false,
      message: state.lastError || 'Unable to reconnect to IronClaw.',
    };
  }

  async tasksOpenRun(todoId: string): Promise<{ ok: boolean; url?: string; message?: string }> {
    const todo = this.findTodo(todoId);
    if (!todo) {
      return {
        ok: false,
        message: 'Task not found.',
      };
    }

    const state = await this.refreshExecutorState();
    const url = state.dashboardUrl || (await this.ironclaw.getDashboardUrl().catch(() => null));
    if (!url) {
      return {
        ok: false,
        message: 'IronClaw dashboard URL is unavailable. Reconnect and try again.',
      };
    }

    try {
      await this.openExternal(url);
      this.executorState = {
        ...this.executorState,
        dashboardUrl: url,
      };
      this.emitFeedUpdated();
      return {
        ok: true,
        url,
      };
    } catch (error) {
      return {
        ok: false,
        message: safeErrorMessage(error),
      };
    }
  }

  async tasksRuntimeCheck(): Promise<TasksRuntimeCheck> {
    const executor = await this.refreshExecutorState(true);
    this.ironclawVersion = await this.ironclaw.getVersion();

    return {
      ok: executor.state === 'connected' && (this.isGranolaAuthenticated() || this.isPendingAuthorizationFresh()),
      ironclaw: {
        profile: this.ironclawProfile,
        version: this.ironclawVersion,
        state: executor.state,
        gatewayUrl: executor.gatewayUrl,
        dashboardUrl: executor.dashboardUrl,
        lastError: executor.lastError,
      },
      granola: {
        authenticated: this.isGranolaAuthenticated(),
        connectionState: this.connectionState(),
        lastSyncAt: this.lastSyncAt,
        lastSyncError: this.lastSyncError,
      },
      migration: {
        sourceDir: this.migrationStatus.sourceDir,
        imported: this.migrationStatus.imported,
        importedAt: this.migrationStatus.importedAt,
        skippedReason: this.migrationStatus.skippedReason,
        error: this.migrationStatus.error,
        markerPath: this.migrationStatus.markerPath,
      },
    };
  }

  getFeed(): TasksFeed {
    const warning = this.todoState.lastSubmissionError
      ? 'Todo executor has recent submission issues. Admin review is required.'
      : this.cacheState.warnings[0] ?? null;

    return {
      connectionState: this.connectionState(),
      auth: this.authSnapshot(),
      executor: this.executorState,
      runtime: this.runtimeMetadata(),
      syncInFlight: Boolean(this.syncInFlightPromise),
      executionEnabled: this.executorState.state === 'connected',
      guardrailMode: this.guardrailMode,
      uiRefreshMs: this.uiRefreshMs,
      todos: this.sortedTodos().map((todo) => this.todoPublicView(todo)),
      counts: this.todoCountsSnapshot(),
      guardrailBlockedCount: this.guardrailBlockedCount(),
      lastSyncAt: this.lastSyncAt,
      lastSyncError: this.lastSyncError,
      syncHealth: this.computeSyncHealth(),
      nextAutoSyncAt: this.nextAutoSyncAt,
      cooldownUntil: this.syncCooldownUntilIso(),
      lastExtractionAt: this.todoState.lastExtractionAt,
      lastExtractionError: this.todoState.lastExtractionError,
      lastSubmissionAt: this.todoState.lastSubmissionAt,
      warning,
      warningDetails: warning && !this.todoState.lastSubmissionError ? this.cacheState.warningDetails : [],
      activeRunTodoId: this.activeExecutionTodoId,
      queuedRunCount: this.executionQueue.length,
      selectedTodoIdHint: this.activeExecutionTodoId ?? this.sortedTodos()[0]?.todoId ?? null,
    };
  }
}
