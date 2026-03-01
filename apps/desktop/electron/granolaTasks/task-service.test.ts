// @vitest-environment node

import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GranolaTaskService } from './task-service.js';
import type { GranolaMeeting } from '../../../../packages/granola-pipeline/src/types.js';
import type { TaskChatMessage, TaskChatTrace } from '../../src/shared/types.js';

const tempDirs: string[] = [];

async function makeTempDir(): Promise<string> {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'granola-task-service-'));
  tempDirs.push(temp);
  return temp;
}

afterEach(async () => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      await rm(dir, { recursive: true, force: true });
    }
  }
});

function meeting(id: string, notes: string): GranolaMeeting {
  return {
    id,
    title: `Meeting ${id}`,
    date: '2026-02-27T10:00:00.000Z',
    attendees: ['Me'],
    notes,
    enhancedNotes: null,
    privateNotes: null,
    transcript: null,
    raw: null,
  };
}

function setFreshPendingAuth(service: GranolaTaskService, url = 'https://example.com/oauth'): void {
  const state = (service as unknown as { authState: Record<string, unknown> }).authState;
  const now = Date.now();
  state.pendingAuthorizationUrl = url;
  state.pendingStartedAt = new Date(now).toISOString();
  state.pendingExpiresAt = new Date(now + 5 * 60_000).toISOString();
  state.lastAuthStage = 'authorizing';
}

function textResult(payload: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(payload),
      },
    ],
  };
}

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function waitUntil(predicate: () => boolean, timeoutMs = 1200): Promise<void> {
  const startedAt = Date.now();
  while (!predicate()) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error('Timed out waiting for condition.');
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

describe('GranolaTaskService', () => {
  it('upserts extracted todos by fingerprint and avoids duplicates', async () => {
    const dataDir = await makeTempDir();

    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Prepare launch checklist',
              description: 'Create list of launch blockers',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'high',
            },
          ],
        }),
    });

    await service.init();

    const first = await service.runTodoExtraction('initial', [meeting('m-1', 'notes-v1')]);
    expect(first.ok).toBe(true);
    expect(first.discoveredCount).toBe(1);

    const second = await service.runTodoExtraction('refresh', [meeting('m-1', 'notes-v2')]);
    expect(second.ok).toBe(true);
    expect(second.discoveredCount).toBe(0);
    expect(second.updatedCount).toBe(1);

    const feed = service.getFeed();
    expect(feed.todos).toHaveLength(1);
    expect(feed.counts.discovered).toBe(1);

    await service.dispose();
  });

  it('skips extraction when meeting source hash has not changed', async () => {
    const dataDir = await makeTempDir();

    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Review transcript',
              description: 'Extract action items',
              owner: 'Me',
              due_date: 'Friday',
              priority: 'medium',
            },
          ],
        }),
    });

    await service.init();

    await service.runTodoExtraction('initial', [meeting('m-2', 'same-notes')]);
    const skipped = await service.runTodoExtraction('repeat', [meeting('m-2', 'same-notes')]);

    expect(skipped.ok).toBe(true);
    expect(skipped.processedMeetings).toBe(0);
    expect(skipped.discoveredCount).toBe(0);
    expect(skipped.updatedCount).toBe(0);

    await service.dispose();
  });

  it('persists task state across restarts and preserves ordering/counts', async () => {
    const dataDir = await makeTempDir();

    const firstService = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async (item) =>
        JSON.stringify({
          todos: [
            {
              title: `Task from ${item.id}`,
              description: 'Generated from note extraction',
              owner: 'Me',
              due_date: item.id === 'm-4' ? 'Monday' : 'Tuesday',
              priority: item.id === 'm-4' ? 'urgent' : 'low',
            },
          ],
        }),
    });

    await firstService.init();
    await firstService.runTodoExtraction('batch-a', [meeting('m-3', 'notes A')]);
    await firstService.runTodoExtraction('batch-b', [meeting('m-4', 'notes B')]);

    const feedBefore = firstService.getFeed();
    expect(feedBefore.todos).toHaveLength(2);
    expect(feedBefore.counts.discovered).toBe(2);

    await firstService.dispose();

    const secondService = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });

    await secondService.init();
    const feedAfter = secondService.getFeed();

    expect(feedAfter.todos).toHaveLength(2);
    expect(feedAfter.counts.discovered).toBe(2);
    expect(feedAfter.todos[0]?.lastUpdatedAt >= feedAfter.todos[1]?.lastUpdatedAt).toBe(true);

    await secondService.dispose();
  });

  it('opens pending authorization URL via configured openExternal', async () => {
    const dataDir = await makeTempDir();
    const openExternal = vi.fn(async () => {});

    const service = new GranolaTaskService({
      dataDir,
      openExternal,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });

    await service.init();
    setFreshPendingAuth(service, 'https://example.com/oauth');
    (
      service as unknown as {
        ensureCallbackServerStarted: () => Promise<string>;
      }
    ).ensureCallbackServerStarted = vi.fn(async () => 'http://127.0.0.1:43110/oauth/callback');

    const result = await service.openPendingAuthorization();

    expect(result).toEqual({ ok: true });
    expect(openExternal).toHaveBeenCalledWith('https://example.com/oauth');

    await service.dispose();
  });

  it('fails opening pending authorization when URL is missing', async () => {
    const dataDir = await makeTempDir();

    const service = new GranolaTaskService({
      dataDir,
      openExternal: async () => {},
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });

    await service.init();
    const result = await service.openPendingAuthorization();

    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/No pending authorization URL/i);

    await service.dispose();
  });

  it('reopens a fresh pending authorization URL without restarting OAuth', async () => {
    const dataDir = await makeTempDir();
    const openExternal = vi.fn(async () => {});

    const service = new GranolaTaskService({
      dataDir,
      openExternal,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });

    await service.init();
    setFreshPendingAuth(service, 'https://example.com/oauth');

    const internals = service as unknown as {
      ensureCallbackServerStarted: () => Promise<string>;
      startGranolaAuthorization: (redirectUrl: string) => Promise<{ authenticated: boolean; authorizationUrl?: string }>;
    };
    internals.ensureCallbackServerStarted = vi.fn(async () => 'http://127.0.0.1:43110/oauth/callback');
    const startSpy = vi.fn(async () => ({ authenticated: false, authorizationUrl: 'https://new-auth.example' }));
    internals.startGranolaAuthorization = startSpy;

    const result = await service.connect();

    expect(result.ok).toBe(true);
    expect(result.needsBrowser).toBe(true);
    expect(openExternal).toHaveBeenCalledWith('https://example.com/oauth');
    expect(startSpy).not.toHaveBeenCalled();

    await service.dispose();
  });

  it('clears pending authorization with mismatched redirect URI and starts a new OAuth flow', async () => {
    const dataDir = await makeTempDir();
    const openExternal = vi.fn(async () => {});

    const service = new GranolaTaskService({
      dataDir,
      openExternal,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });

    await service.init();
    const mismatchedRedirect = encodeURIComponent('http://127.0.0.1:43112/oauth/callback');
    setFreshPendingAuth(service, `https://example.com/oauth?redirect_uri=${mismatchedRedirect}`);
    const state = (service as unknown as { authState: Record<string, unknown> }).authState;
    state.codeVerifier = 'old-verifier';

    const internals = service as unknown as {
      ensureCallbackServerStarted: () => Promise<string>;
      startGranolaAuthorization: (redirectUrl: string) => Promise<{ authenticated: boolean; authorizationUrl?: string }>;
    };
    internals.ensureCallbackServerStarted = vi.fn(async () => 'http://127.0.0.1:43110/oauth/callback');
    const startSpy = vi.fn(async () => {
      expect(state.pendingAuthorizationUrl).toBeUndefined();
      expect(state.codeVerifier).toBeUndefined();
      return { authenticated: false, authorizationUrl: 'https://fresh.example/oauth' };
    });
    internals.startGranolaAuthorization = startSpy;

    const result = await service.connect();

    expect(result.ok).toBe(true);
    expect(result.needsBrowser).toBe(true);
    expect(startSpy).toHaveBeenCalledWith('http://127.0.0.1:43110/oauth/callback');
    expect(openExternal).toHaveBeenCalledWith('https://fresh.example/oauth');

    await service.dispose();
  });

  it('deduplicates rapid connect calls so browser opens once', async () => {
    const dataDir = await makeTempDir();
    const openExternal = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 30));
    });

    const service = new GranolaTaskService({
      dataDir,
      openExternal,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });

    await service.init();
    setFreshPendingAuth(service, 'https://example.com/oauth');

    const internals = service as unknown as { ensureCallbackServerStarted: () => Promise<string> };
    internals.ensureCallbackServerStarted = vi.fn(async () => 'http://127.0.0.1:43110/oauth/callback');

    const [a, b] = await Promise.all([service.connect(), service.connect()]);

    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
    expect(openExternal).toHaveBeenCalledTimes(1);

    await service.dispose();
  });

  it('refuses opening pending authorization when redirect URI no longer matches callback server', async () => {
    const dataDir = await makeTempDir();
    const openExternal = vi.fn(async () => {});

    const service = new GranolaTaskService({
      dataDir,
      openExternal,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });

    await service.init();
    const mismatchedRedirect = encodeURIComponent('http://127.0.0.1:43112/oauth/callback');
    setFreshPendingAuth(service, `https://example.com/oauth?redirect_uri=${mismatchedRedirect}`);
    (
      service as unknown as {
        ensureCallbackServerStarted: () => Promise<string>;
      }
    ).ensureCallbackServerStarted = vi.fn(async () => 'http://127.0.0.1:43110/oauth/callback');

    const result = await service.openPendingAuthorization();
    const state = (service as unknown as { authState: Record<string, unknown> }).authState;

    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/stale/i);
    expect(state.pendingAuthorizationUrl).toBeUndefined();
    expect(openExternal).not.toHaveBeenCalled();

    await service.dispose();
  });

  it('invalidates stale pending auth and starts a fresh OAuth flow', async () => {
    const dataDir = await makeTempDir();
    const openExternal = vi.fn(async () => {});

    const service = new GranolaTaskService({
      dataDir,
      openExternal,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });

    await service.init();
    const state = (service as unknown as { authState: Record<string, unknown> }).authState;
    state.pendingAuthorizationUrl = 'https://stale.example/oauth';
    state.pendingStartedAt = new Date(Date.now() - 30 * 60_000).toISOString();
    state.pendingExpiresAt = new Date(Date.now() - 25 * 60_000).toISOString();
    state.codeVerifier = 'old-verifier';

    const internals = service as unknown as {
      ensureCallbackServerStarted: () => Promise<string>;
      startGranolaAuthorization: (redirectUrl: string) => Promise<{ authenticated: boolean; authorizationUrl?: string }>;
    };
    internals.ensureCallbackServerStarted = vi.fn(async () => 'http://127.0.0.1:43110/oauth/callback');
    internals.startGranolaAuthorization = vi.fn(async () => {
      expect(state.pendingAuthorizationUrl).toBeUndefined();
      expect(state.codeVerifier).toBeUndefined();
      return {
        authenticated: false,
        authorizationUrl: 'https://fresh.example/oauth',
      };
    });

    const result = await service.connect();

    expect(result.ok).toBe(true);
    expect(result.needsBrowser).toBe(true);
    expect(openExternal).toHaveBeenCalledWith('https://fresh.example/oauth');

    await service.dispose();
  });

  it('maps OAuth 401 unauthorized exchange failures to actionable error and clears pending auth state', async () => {
    const dataDir = await makeTempDir();

    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });

    await service.init();
    setFreshPendingAuth(service, 'https://example.com/oauth');
    const state = (service as unknown as { authState: Record<string, unknown> }).authState;
    state.codeVerifier = 'test-verifier';

    const internals = service as unknown as {
      captureAuthHttpFailure: (status: number, bodyText: string) => void;
      createMcpClientAndTransport: (redirectUrl: string) => {
        client: { connect: () => Promise<void>; listTools: () => Promise<void>; close: () => Promise<void> };
        transport: { finishAuth: () => Promise<void>; close: () => Promise<void> };
      };
      finishGranolaAuthorization: (code: string, redirectUrl: string) => Promise<void>;
    };
    internals.createMcpClientAndTransport = vi.fn(() => ({
      client: {
        connect: vi.fn(async () => {}),
        listTools: vi.fn(async () => {}),
        close: vi.fn(async () => {}),
      },
      transport: {
        finishAuth: vi.fn(async () => {
          internals.captureAuthHttpFailure(401, '{"error":"unauthorized"}');
          throw new Error('ServerError');
        }),
        close: vi.fn(async () => {}),
      },
    }));

    await expect(
      internals.finishGranolaAuthorization('test-code', 'http://127.0.0.1:43110/oauth/callback'),
    ).rejects.toThrowError();

    const feed = service.getFeed();
    expect(feed.auth.lastAuthStage).toBe('failed');
    expect(feed.auth.lastAuthError).toMatch(/Authorization code was rejected or expired/i);
    expect(feed.auth.lastAuthHttpStatus).toBe(401);
    expect(feed.auth.lastAuthErrorCode).toBe('unauthorized');
    expect(state.pendingAuthorizationUrl).toBeUndefined();
    expect(state.codeVerifier).toBeUndefined();

    await service.dispose();
  });

  it('handles OAuth callback access_denied and surfaces a clear failed state', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });
    await service.init();
    setFreshPendingAuth(service);

    const outcome = await (
      service as unknown as {
        handleOAuthCallback: (
          payload: { code: string | null; error: string | null; errorDescription: string | null },
          redirectUrl: string,
        ) => Promise<{ ok: boolean; statusCode?: number }>;
      }
    ).handleOAuthCallback(
      {
        code: null,
        error: 'access_denied',
        errorDescription: 'User cancelled the authorization.',
      },
      'http://127.0.0.1:43110/oauth/callback',
    );

    const feed = service.getFeed();
    expect(outcome.ok).toBe(false);
    expect(outcome.statusCode).toBe(400);
    expect(feed.auth.lastAuthStage).toBe('failed');
    expect(feed.auth.lastAuthErrorCode).toBe('access_denied');
    expect(feed.auth.lastAuthError).toMatch(/Authorization was not completed/i);

    await service.dispose();
  });

  it('sets cooldown after rate-limit diagnostics and skips manual sync during cooldown', async () => {
    const dataDir = await makeTempDir();

    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });
    await service.init();

    const authState = (service as unknown as { authState: Record<string, unknown> }).authState;
    authState.tokens = { access_token: 'test-token' };
    authState.lastAuthStage = 'connected';

    const callTool = vi.fn(async ({ name }: { name: string }) => {
      if (name === 'list_meetings') {
        return textResult({
          meetings: [
            {
              meeting_id: 'm-1',
              title: 'Weekly',
              notes: null,
            },
          ],
        });
      }
      if (name === 'get_meetings') {
        throw new Error('Granola rate limit while calling get_meetings.');
      }
      throw new Error(`unexpected tool ${name}`);
    });

    const fakeClient = {
      listTools: vi.fn(async () => ({
        tools: [
          { name: 'list_meetings', inputSchema: { type: 'object', properties: {} } },
          { name: 'get_meetings', inputSchema: { type: 'object', properties: { meeting_ids: { type: 'array' } } } },
        ],
      })),
      callTool,
    };

    (
      service as unknown as {
        withAuthenticatedClient: <T>(fn: (client: unknown) => Promise<T>) => Promise<T>;
      }
    ).withAuthenticatedClient = async <T>(fn: (client: unknown) => Promise<T>) => await fn(fakeClient);

    const first = await service.syncNow('manual-sync');
    expect(first.ok).toBe(true);
    const feedAfterFirst = service.getFeed();
    expect(feedAfterFirst.syncHealth).toBe('cooldown');
    expect(feedAfterFirst.cooldownUntil).not.toBeNull();

    const callCountBeforeSecond = callTool.mock.calls.length;
    const second = await service.syncNow('manual-sync');
    expect(second.ok).toBe(false);
    expect(second.warning).toMatch(/cooling down until/i);
    expect(callTool.mock.calls.length).toBe(callCountBeforeSecond);

    await service.dispose();
  });

  it('resets cooldown metadata after a healthy sync', async () => {
    const dataDir = await makeTempDir();

    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });
    await service.init();

    const internals = service as unknown as {
      authState: Record<string, unknown>;
      cacheState: {
        syncMetadata: {
          globalSyncCooldownUntil: string | null;
          syncRateLimitStreak: number;
        };
      };
      withAuthenticatedClient: <T>(fn: (client: unknown) => Promise<T>) => Promise<T>;
    };

    internals.authState.tokens = { access_token: 'test-token' };
    internals.authState.lastAuthStage = 'connected';
    internals.cacheState.syncMetadata.globalSyncCooldownUntil = new Date(Date.now() - 60_000).toISOString();
    internals.cacheState.syncMetadata.syncRateLimitStreak = 2;

    const fakeClient = {
      listTools: vi.fn(async () => ({
        tools: [
          { name: 'list_meetings', inputSchema: { type: 'object', properties: {} } },
          { name: 'get_meetings', inputSchema: { type: 'object', properties: { meeting_ids: { type: 'array' } } } },
        ],
      })),
      callTool: vi.fn(async ({ name }: { name: string }) => {
        if (name === 'list_meetings') {
          return textResult({
            meetings: [
              {
                meeting_id: 'm-2',
                title: 'Healthy Sync',
                notes: 'notes present',
              },
            ],
          });
        }
        if (name === 'get_meetings') {
          return textResult({ meetings: [] });
        }
        throw new Error(`unexpected tool ${name}`);
      }),
    };

    internals.withAuthenticatedClient = async <T>(fn: (client: unknown) => Promise<T>) => await fn(fakeClient);

    const result = await service.syncNow('manual-sync');
    expect(result.ok).toBe(true);
    const feed = service.getFeed();
    expect(feed.cooldownUntil).toBeNull();
    expect(feed.syncHealth).toBe('healthy');

    await service.dispose();
  });

  it('caps extraction to two changed meetings per run and defers backlog', async () => {
    const dataDir = await makeTempDir();
    const extractTodosForMeeting = vi.fn(async (item: GranolaMeeting) =>
      JSON.stringify({
        todos: [
          {
            title: `Todo ${item.id}`,
            description: 'Generated',
            owner: 'Me',
            due_date: 'Tomorrow',
            priority: 'medium',
          },
        ],
      }),
    );

    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting,
    });
    await service.init();

    const meetings = [
      meeting('m-1', 'n1'),
      { ...meeting('m-2', 'n2'), date: '2026-02-27T10:01:00.000Z' },
      { ...meeting('m-3', 'n3'), date: '2026-02-27T10:02:00.000Z' },
      { ...meeting('m-4', 'n4'), date: '2026-02-27T10:03:00.000Z' },
    ];

    const first = await service.runTodoExtraction('batch-1', meetings);
    const second = await service.runTodoExtraction('batch-2', meetings);

    expect(first.ok).toBe(true);
    expect(first.processedMeetings).toBe(2);
    expect(second.ok).toBe(true);
    expect(second.processedMeetings).toBe(2);
    expect(extractTodosForMeeting).toHaveBeenCalledTimes(4);
    expect(service.getFeed().todos).toHaveLength(4);

    await service.dispose();
  });

  it('starts a task in IronClaw and stores completed run metadata', async () => {
    const dataDir = await makeTempDir();

    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Research GTM channels',
              description: 'Find top channels and supporting links',
              owner: 'Me',
              due_date: 'Friday',
              priority: 'high',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-exec-1', 'Discussed GTM strategy and competitors')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: {
        startRun: ReturnType<typeof vi.fn>;
      };
    };

    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = vi.fn(() => ({
      cancel: vi.fn(),
      done: Promise.resolve({
        ok: true,
        runId: 'run-test-1',
        summary: 'completed',
        finalText: 'Completed research with three useful links.',
      }),
    }));

    const started = await service.tasksStart(String(todoId));
    expect(started.ok).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 40));

    const updatedTodo = service.getFeed().todos.find((item) => item.todoId === todoId);
    expect(updatedTodo?.status).toBe('submitted');
    expect(updatedTodo?.runId).toBe('run-test-1');
    expect(updatedTodo?.publicSummary).toMatch(/Completed research/i);

    await service.dispose();
  });

  it('opens the IronClaw dashboard for an existing task run', async () => {
    const dataDir = await makeTempDir();
    const openExternal = vi.fn(async () => {});

    const service = new GranolaTaskService({
      dataDir,
      openExternal,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Compile user interview summary',
              description: 'Use notes to draft summary',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'medium',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-open-1', 'Interview notes and action items')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));

    const opened = await service.tasksOpenRun(String(todoId));
    expect(opened.ok).toBe(true);
    expect(opened.url).toMatch(/127\.0\.0\.1:19789/);
    expect(openExternal).toHaveBeenCalledTimes(1);

    await service.dispose();
  });

  it('queues runs globally and starts next task after active run completes', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async (item) =>
        JSON.stringify({
          todos: [
            {
              title: `Task ${item.id}`,
              description: 'Queue test',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'medium',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-q-1', 'notes 1'), meeting('m-q-2', 'notes 2')]);
    const [firstTodo, secondTodo] = service.getFeed().todos;
    expect(firstTodo?.todoId).toBeTruthy();
    expect(secondTodo?.todoId).toBeTruthy();

    const firstRun = deferred<{ ok: boolean; runId: string; summary: string; finalText: string }>();
    const secondRun = deferred<{ ok: boolean; runId: string; summary: string; finalText: string }>();
    const startRun = vi
      .fn()
      .mockImplementationOnce(() => ({ cancel: vi.fn(), done: firstRun.promise }))
      .mockImplementationOnce(() => ({ cancel: vi.fn(), done: secondRun.promise }));

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: { startRun: typeof startRun };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = startRun;

    const started = await service.tasksStart(String(firstTodo?.todoId));
    const queued = await service.tasksStart(String(secondTodo?.todoId));
    expect(started.ok).toBe(true);
    expect(queued.ok).toBe(true);
    await waitUntil(() => service.getFeed().activeRunTodoId === firstTodo?.todoId);
    expect(service.getFeed().queuedRunCount).toBe(1);

    firstRun.resolve({
      ok: true,
      runId: 'run-1',
      summary: 'done-1',
      finalText: 'first done',
    });
    await waitUntil(() => startRun.mock.calls.length === 2);
    await waitUntil(() => service.getFeed().activeRunTodoId === secondTodo?.todoId);

    secondRun.resolve({
      ok: true,
      runId: 'run-2',
      summary: 'done-2',
      finalText: 'second done',
    });
    await waitUntil(() => service.getFeed().activeRunTodoId === null);
    expect(service.getFeed().activeRunTodoId).toBeNull();
    expect(service.getFeed().queuedRunCount).toBe(0);

    await service.dispose();
  });

  it('stores user chat messages and supports paginated thread reads', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Chat task',
              description: 'Thread test',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'medium',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-thread', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: { startRun: ReturnType<typeof vi.fn> };
      chatState: { threads: Record<string, TaskChatMessage[]> };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = vi.fn(() => ({
      cancel: vi.fn(),
      done: Promise.resolve({
        ok: true,
        runId: 'run-thread',
        summary: 'done',
        finalText: 'assistant output',
      }),
    }));

    await service.tasksSendMessage(String(todoId), 'Please continue this task');
    await new Promise((resolve) => setTimeout(resolve, 40));

    // Seed extra messages for deterministic pagination assertions.
    const seeded = [...(internals.chatState.threads[String(todoId)] ?? [])];
    for (let index = 0; index < 25; index += 1) {
      seeded.push({
        messageId: `seed-${index}`,
        todoId: String(todoId),
        runId: null,
        role: 'status',
        content: `seed-message-${index}`,
        createdAt: new Date(1_700_000_000_000 + index * 1000).toISOString(),
        streaming: false,
        statusTag: null,
      });
    }
    internals.chatState.threads[String(todoId)] = seeded;

    const firstPage = await service.tasksGetThread(String(todoId), null, 10);
    expect(firstPage.messages).toHaveLength(10);
    expect(firstPage.hasMore).toBe(true);
    expect(firstPage.nextCursor).toBeTruthy();
    expect(firstPage.messages.some((item) => item.role === 'user' && item.content.includes('continue'))).toBe(true);

    const secondPage = await service.tasksGetThread(String(todoId), firstPage.nextCursor, 10);
    expect(secondPage.messages).toHaveLength(10);
    expect(secondPage.loadedAt).toBeTruthy();

    await service.dispose();
  });

  it('generates and stores planning options without starting execution', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Plan task',
              description: 'Need planning options',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'high',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-plan', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: { startRun: ReturnType<typeof vi.fn> };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = vi.fn(() => ({
      cancel: vi.fn(),
      done: Promise.resolve({
        ok: true,
        runId: 'run-plan',
        summary: '',
        finalText: JSON.stringify({
          options: [
            {
              id: 'o1',
              title: 'Fast path',
              summary: 'Ship quick result',
              steps: ['Clarify output', 'Collect evidence', 'Respond'],
              why: 'Fastest path',
              recommended: true,
            },
            {
              id: 'o2',
              title: 'Deep path',
              summary: 'Validate key assumptions',
              steps: ['List assumptions', 'Validate claims', 'Draft findings'],
              why: 'Higher confidence',
              recommended: false,
            },
            {
              id: 'o3',
              title: 'Context-first',
              summary: 'Use meeting details first',
              steps: ['Extract constraints', 'Resolve ambiguities', 'Draft plan'],
              why: 'Better context fit',
              recommended: false,
            },
          ],
        }),
      }),
    }));

    const planned = await service.tasksPlanMessage(String(todoId), 'Focus on speed.');
    expect(planned.ok).toBe(true);
    expect(planned.plan?.options.length).toBeGreaterThanOrEqual(2);
    expect(planned.plan?.options.length).toBeLessThanOrEqual(3);
    expect(planned.plan?.options.filter((option) => option.recommended)).toHaveLength(1);

    const thread = await service.tasksGetThread(String(todoId), null, 80);
    const planningDraft = thread.messages.find((message) => message.messageType === 'planning_draft');
    expect(planningDraft).toBeTruthy();
    expect(planningDraft?.planDraft?.recommendedOptionId).toBeTruthy();

    const feed = service.getFeed();
    expect(feed.activeRunTodoId).toBeNull();
    expect(feed.queuedRunCount).toBe(0);
    expect(feed.todos[0]?.attempts ?? 0).toBe(0);

    await service.dispose();
  });

  it('falls back to template planning options when planner output is invalid', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Fallback plan task',
              description: 'Need fallback',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'medium',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-plan-fallback', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: { startRun: ReturnType<typeof vi.fn> };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = vi.fn(() => ({
      cancel: vi.fn(),
      done: Promise.resolve({
        ok: true,
        runId: 'run-plan-bad',
        summary: 'This is not valid JSON output',
        finalText: 'I would do this and that.',
      }),
    }));

    const planned = await service.tasksPlanMessage(String(todoId), '');
    expect(planned.ok).toBe(true);
    expect(planned.plan?.options.length).toBeGreaterThanOrEqual(2);
    expect(planned.plan?.options.length).toBeLessThanOrEqual(3);
    expect(planned.plan?.options.filter((option) => option.recommended)).toHaveLength(1);

    await service.dispose();
  });

  it('injects approved plan into start prompt', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Start with plan',
              description: 'Verify approved plan prompt injection',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'high',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-start-plan', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: { startRun: ReturnType<typeof vi.fn> };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = vi.fn(() => ({
      cancel: vi.fn(),
      done: Promise.resolve({
        ok: true,
        runId: 'run-plan',
        summary: '',
        finalText: JSON.stringify({
          options: [
            {
              id: 'rec',
              title: 'Recommended path',
              summary: 'Do the recommended thing',
              steps: ['First', 'Second', 'Third'],
              why: 'Best fit',
              recommended: true,
            },
            {
              id: 'alt',
              title: 'Alternate path',
              summary: 'Do the alternate thing',
              steps: ['A', 'B', 'C'],
              why: 'Alternative',
              recommended: false,
            },
          ],
        }),
      }),
    }));

    const planned = await service.tasksPlanMessage(String(todoId), 'Prioritize speed');
    expect(planned.ok).toBe(true);
    const recommendedId = planned.plan?.recommendedOptionId;
    expect(recommendedId).toBeTruthy();

    internals.ironclaw.startRun = vi.fn(() => ({
      cancel: vi.fn(),
      done: Promise.resolve({
        ok: true,
        runId: 'run-exec',
        summary: 'done',
        finalText: 'Execution completed.',
      }),
    }));

    const started = await service.tasksStart(String(todoId), {
      approvedPlan: {
        draftId: planned.plan?.draftId,
        selection: {
          mode: 'preset',
          optionId: String(recommendedId),
        },
      },
    });
    expect(started.ok).toBe(true);
    await waitUntil(() => internals.ironclaw.startRun.mock.calls.length > 0);

    const startCall = internals.ironclaw.startRun.mock.calls[0]?.[0] as { prompt?: string } | undefined;
    expect(startCall?.prompt ?? '').toContain('Approved plan selection:');
    expect(startCall?.prompt ?? '').toContain('Recommended path');

    await service.dispose();
  });

  it('merges snapshot and delta chunks without duplicate assistant output', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Delta merge task',
              description: 'Verify snapshot + delta dedupe.',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'high',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-delta', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const done = deferred<{ ok: boolean; runId: string; summary: string; finalText: string }>();
    let emitRunEvent: ((event: Record<string, unknown>) => void) | undefined;

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: {
        startRun: ReturnType<typeof vi.fn>;
      };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = vi.fn(({ onEvent: callback }: { onEvent: (event: Record<string, unknown>) => void }) => {
      emitRunEvent = callback;
      return {
        cancel: vi.fn(),
        done: done.promise,
      };
    });

    const started = await service.tasksStart(String(todoId));
    expect(started.ok).toBe(true);
    await waitUntil(() => typeof emitRunEvent === 'function');
    if (!emitRunEvent) {
      throw new Error('Missing onEvent callback');
    }

    emitRunEvent({
      runId: 'run-delta',
      kind: 'delta',
      message: 'Progress update',
      delta: 'Progress update',
      snapshot: 'Progress update',
    });
    emitRunEvent({
      runId: 'run-delta',
      kind: 'delta',
      message: 'Progress update complete',
      delta: ' complete',
      snapshot: 'Progress update complete',
    });
    emitRunEvent({
      runId: 'run-delta',
      kind: 'delta',
      message: 'Progress update complete',
      delta: ' complete',
      snapshot: 'Progress update complete',
    });

    done.resolve({
      ok: true,
      runId: 'run-delta',
      summary: 'done',
      finalText: 'Progress update complete',
    });

    await waitUntil(() => service.getFeed().activeRunTodoId === null);
    const thread = await service.tasksGetThread(String(todoId), null, 80);
    const assistant = [...thread.messages].reverse().find((message) => message.role === 'assistant');
    expect(assistant?.content).toBe('Progress update complete');

    await service.dispose();
  });

  it('uses chat-final fallback when result payload text is absent and pins final assistant to completion', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Chat final fallback task',
              description: 'Verify final answer fallback.',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'high',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-final-fallback', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const done = deferred<{ ok: boolean; runId: string; summary: string; finalText: string | null }>();
    let emitRunEvent: ((event: Record<string, unknown>) => void) | undefined;

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: {
        startRun: ReturnType<typeof vi.fn>;
      };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = vi.fn(({ onEvent: callback }: { onEvent: (event: Record<string, unknown>) => void }) => {
      emitRunEvent = callback;
      return {
        cancel: vi.fn(),
        done: done.promise,
      };
    });

    const started = await service.tasksStart(String(todoId));
    expect(started.ok).toBe(true);
    await waitUntil(() => typeof emitRunEvent === 'function');
    if (!emitRunEvent) {
      throw new Error('Missing onEvent callback');
    }

    emitRunEvent({
      runId: 'run-final-fallback',
      kind: 'delta',
      message: 'Progress update',
      delta: 'Progress update',
      snapshot: 'Progress update',
    });
    emitRunEvent({
      runId: 'run-final-fallback',
      kind: 'delta',
      message: 'Final answer from chat final event.',
      snapshot: 'Final answer from chat final event.',
      finalText: 'Final answer from chat final event.',
    });

    done.resolve({
      ok: true,
      runId: 'run-final-fallback',
      summary: 'completed',
      finalText: null,
    });

    await waitUntil(() => service.getFeed().activeRunTodoId === null);
    const thread = await service.tasksGetThread(String(todoId), null, 120);
    const assistant = [...thread.messages].reverse().find((message) => message.role === 'assistant');
    const completionTrace = [...thread.messages].reverse().find((message) => message.trace?.kind === 'phase' && message.trace.phase === 'completed');

    expect(assistant?.content).toBe('Final answer from chat final event.');
    expect(assistant?.streaming).toBe(false);
    expect(assistant && completionTrace ? Date.parse(assistant.createdAt) > Date.parse(completionTrace.createdAt) : false).toBe(true);

    await service.dispose();
  });

  it('does not let terminal completed payload overwrite earlier chat-final text', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Final clobber guard task',
              description: 'Ensure completed payload cannot downgrade final text.',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'high',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-final-guard', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const done = deferred<{ ok: boolean; runId: string; summary: string; finalText: string | null }>();
    let emitRunEvent: ((event: Record<string, unknown>) => void) | undefined;

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: {
        startRun: ReturnType<typeof vi.fn>;
      };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = vi.fn(({ onEvent: callback }: { onEvent: (event: Record<string, unknown>) => void }) => {
      emitRunEvent = callback;
      return {
        cancel: vi.fn(),
        done: done.promise,
      };
    });

    const started = await service.tasksStart(String(todoId));
    expect(started.ok).toBe(true);
    await waitUntil(() => typeof emitRunEvent === 'function');
    if (!emitRunEvent) {
      throw new Error('Missing onEvent callback');
    }

    emitRunEvent({
      runId: 'run-final-guard',
      kind: 'delta',
      message: 'Final answer from chat-final stream.',
      snapshot: 'Final answer from chat-final stream.',
      finalText: 'Final answer from chat-final stream.',
    });
    emitRunEvent({
      runId: 'run-final-guard',
      kind: 'completed',
      message: 'completed',
      finalText: 'Progress update: Step 1/4 started.',
    });

    done.resolve({
      ok: true,
      runId: 'run-final-guard',
      summary: 'completed',
      finalText: 'Progress update: Step 1/4 started.',
    });

    await waitUntil(() => service.getFeed().activeRunTodoId === null);
    const thread = await service.tasksGetThread(String(todoId), null, 120);
    const assistant = [...thread.messages].reverse().find((message) => message.role === 'assistant');
    expect(assistant?.content).toBe('Final answer from chat-final stream.');

    await service.dispose();
  });

  it('passes per-task isolated session key and web lane to runtime startRun', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Session key task',
              description: 'Verify runtime options for isolation.',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'medium',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-session-key', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const startRun = vi.fn(() => ({
      cancel: vi.fn(),
      done: Promise.resolve({
        ok: true,
        runId: 'run-session-key',
        summary: 'completed',
        finalText: 'done',
      }),
    }));

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: { startRun: typeof startRun };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = startRun;

    const started = await service.tasksStart(String(todoId));
    expect(started.ok).toBe(true);
    await waitUntil(() => service.getFeed().activeRunTodoId === null);

    expect(startRun).toHaveBeenCalledTimes(1);
    const firstCall = (startRun.mock.calls.at(0)?.at(0) ?? null) as unknown as Record<string, unknown> | null;
    expect(firstCall?.lane).toBe('web');
    expect(firstCall?.thinking).toBe('minimal');
    expect(firstCall?.sessionKey).toBe(`agent:main:web:yogurt:${String(todoId)}`);

    await service.dispose();
  });

  it('auto-retries once when the first run ends with progress-only output', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Auto-retry task',
              description: 'Retry if first completion is progress-only.',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'high',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-auto-retry', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const firstRun = deferred<{ ok: boolean; runId: string; summary: string; finalText: string | null }>();
    const secondRun = deferred<{ ok: boolean; runId: string; summary: string; finalText: string | null }>();
    const startRun = vi
      .fn()
      .mockImplementationOnce(() => ({ cancel: vi.fn(), done: firstRun.promise }))
      .mockImplementationOnce(() => ({ cancel: vi.fn(), done: secondRun.promise }));

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: { startRun: typeof startRun };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = startRun;

    const started = await service.tasksStart(String(todoId));
    expect(started.ok).toBe(true);

    firstRun.resolve({
      ok: true,
      runId: 'run-progress-only',
      summary: 'completed',
      finalText: 'Progress update: Step 1/4 started — pulling candidates now.',
    });
    await waitUntil(() => startRun.mock.calls.length === 2);

    secondRun.resolve({
      ok: true,
      runId: 'run-progress-retry',
      summary: 'completed',
      finalText: 'Final findings with links: https://example.com',
    });
    await waitUntil(() => service.getFeed().activeRunTodoId === null);

    const thread = await service.tasksGetThread(String(todoId), null, 160);
    expect(thread.messages.some((message) => message.trace?.title === 'Auto-retry triggered')).toBe(true);
    const assistant = [...thread.messages].reverse().find((message) => message.role === 'assistant');
    expect(assistant?.content).toContain('Final findings with links');

    await service.dispose();
  });

  it('runs legacy launchagent cleanup only once', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });

    const internals = service as unknown as {
      launchctl: ReturnType<typeof vi.fn>;
      ensureLegacyGatewayLaunchAgentDisabledOnce: () => Promise<void>;
      legacyGatewayCleanupAttempted: boolean;
    };
    internals.launchctl = vi.fn(async () => ({ ok: true, output: '' }));
    await service.init();

    const expectedCalls = process.platform === 'darwin' ? 2 : 0;
    expect(internals.launchctl).toHaveBeenCalledTimes(expectedCalls);

    internals.legacyGatewayCleanupAttempted = false;
    await internals.ensureLegacyGatewayLaunchAgentDisabledOnce();
    expect(internals.launchctl).toHaveBeenCalledTimes(expectedCalls);

    await service.dispose();
  });

  it('does not open external browser windows when starting a task run', async () => {
    const dataDir = await makeTempDir();
    const openExternal = vi.fn(async () => {});
    const service = new GranolaTaskService({
      dataDir,
      openExternal,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Background run task',
              description: 'Ensure no external open on start.',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'medium',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-no-open', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: {
        startRun: ReturnType<typeof vi.fn>;
      };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = vi.fn(() => ({
      cancel: vi.fn(),
      done: Promise.resolve({
        ok: true,
        runId: 'run-no-open',
        summary: 'completed',
        finalText: 'done',
      }),
    }));

    const started = await service.tasksStart(String(todoId));
    expect(started.ok).toBe(true);
    await waitUntil(() => service.getFeed().activeRunTodoId === null);
    expect(openExternal).not.toHaveBeenCalled();

    await service.dispose();
  });

  it('records thought/tool/source traces and completion phase for timeline chat', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () =>
        JSON.stringify({
          todos: [
            {
              title: 'Trace timeline task',
              description: 'Ensure trace events are persisted.',
              owner: 'Me',
              due_date: 'Tomorrow',
              priority: 'high',
            },
          ],
        }),
    });

    await service.init();
    await service.runTodoExtraction('seed', [meeting('m-trace', 'notes')]);
    const todoId = service.getFeed().todos[0]?.todoId;
    expect(todoId).toBeTruthy();

    const done = deferred<{ ok: boolean; runId: string; summary: string; finalText: string }>();
    let emitRunEvent: ((event: Record<string, unknown>) => void) | undefined;

    const internals = service as unknown as {
      refreshExecutorState: () => Promise<{
        state: 'connected';
        profile: string;
        gatewayUrl: string;
        dashboardUrl: string;
        lastCheckedAt: string;
        lastError: null;
      }>;
      ironclaw: {
        startRun: ReturnType<typeof vi.fn>;
      };
    };
    internals.refreshExecutorState = vi.fn(async () => ({
      state: 'connected' as const,
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: new Date().toISOString(),
      lastError: null,
    }));
    internals.ironclaw.startRun = vi.fn(({ onEvent: callback }: { onEvent: (event: Record<string, unknown>) => void }) => {
      emitRunEvent = callback;
      return {
        cancel: vi.fn(),
        done: done.promise,
      };
    });

    const started = await service.tasksStart(String(todoId));
    expect(started.ok).toBe(true);
    await waitUntil(() => typeof emitRunEvent === 'function');
    if (!emitRunEvent) {
      throw new Error('Missing onEvent callback');
    }

    emitRunEvent({
      runId: 'run-trace',
      kind: 'thinking',
      message: 'Thinking',
      delta:
        'Gathering relevant links, deciding sequence, and validating confidence before composing the final result output.',
    });
    emitRunEvent({
      runId: 'run-trace',
      kind: 'tool',
      message: 'Starting web search',
      tool: {
        phase: 'start',
        name: 'web_search',
        toolCallId: 'tool-1',
        args: { query: 'yogurt workflow ui' },
        meta: null,
        isError: false,
      },
    });
    emitRunEvent({
      runId: 'run-trace',
      kind: 'tool',
      message: 'web search completed',
      tool: {
        phase: 'result',
        name: 'web_search',
        toolCallId: 'tool-1',
        args: { query: 'yogurt workflow ui' },
        meta: {
          resultUrl: 'https://example.com/search-result',
        },
        isError: false,
      },
    });

    done.resolve({
      ok: true,
      runId: 'run-trace',
      summary: 'done',
      finalText: 'Final research summary.',
    });

    await waitUntil(() => service.getFeed().activeRunTodoId === null);
    const thread = await service.tasksGetThread(String(todoId), null, 120);
    const traces = thread.messages.map((item) => item.trace).filter((trace): trace is TaskChatTrace => Boolean(trace));

    expect(traces.some((trace) => trace.kind === 'thought')).toBe(true);
    expect(traces.some((trace) => trace.kind === 'tool_start' && trace.toolName === 'web_search')).toBe(true);
    expect(traces.some((trace) => trace.kind === 'tool_result' && trace.toolName === 'web_search')).toBe(true);
    expect(traces.some((trace) => trace.kind === 'source_fetch' && trace.sourceUrl?.includes('example.com'))).toBe(true);
    expect(traces.some((trace) => trace.kind === 'phase' && trace.phase === 'completed')).toBe(true);

    await service.dispose();

    const reloaded = new GranolaTaskService({
      dataDir,
      allowUnauthenticatedExtraction: true,
      extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
    });
    await reloaded.init();
    const reloadedThread = await reloaded.tasksGetThread(String(todoId), null, 120);
    expect(reloadedThread.messages.some((message) => message.trace?.kind === 'source_fetch')).toBe(true);
    expect(reloadedThread.messages.some((message) => message.role === 'assistant')).toBe(true);
    await reloaded.dispose();
  });
});
