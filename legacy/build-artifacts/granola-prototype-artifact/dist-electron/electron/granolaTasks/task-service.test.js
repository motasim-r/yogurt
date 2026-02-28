// @vitest-environment node
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GranolaTaskService } from './task-service.js';
const tempDirs = [];
async function makeTempDir() {
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
function meeting(id, notes) {
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
function setFreshPendingAuth(service, url = 'https://example.com/oauth') {
    const state = service.authState;
    const now = Date.now();
    state.pendingAuthorizationUrl = url;
    state.pendingStartedAt = new Date(now).toISOString();
    state.pendingExpiresAt = new Date(now + 5 * 60_000).toISOString();
    state.lastAuthStage = 'authorizing';
}
function textResult(payload) {
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(payload),
            },
        ],
    };
}
describe('GranolaTaskService', () => {
    it('upserts extracted todos by fingerprint and avoids duplicates', async () => {
        const dataDir = await makeTempDir();
        const service = new GranolaTaskService({
            dataDir,
            allowUnauthenticatedExtraction: true,
            extractTodosForMeeting: async () => JSON.stringify({
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
            extractTodosForMeeting: async () => JSON.stringify({
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
            extractTodosForMeeting: async (item) => JSON.stringify({
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
        const openExternal = vi.fn(async () => { });
        const service = new GranolaTaskService({
            dataDir,
            openExternal,
            allowUnauthenticatedExtraction: true,
            extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
        });
        await service.init();
        setFreshPendingAuth(service, 'https://example.com/oauth');
        service.ensureCallbackServerStarted = vi.fn(async () => 'http://127.0.0.1:43110/oauth/callback');
        const result = await service.openPendingAuthorization();
        expect(result).toEqual({ ok: true });
        expect(openExternal).toHaveBeenCalledWith('https://example.com/oauth');
        await service.dispose();
    });
    it('fails opening pending authorization when URL is missing', async () => {
        const dataDir = await makeTempDir();
        const service = new GranolaTaskService({
            dataDir,
            openExternal: async () => { },
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
        const openExternal = vi.fn(async () => { });
        const service = new GranolaTaskService({
            dataDir,
            openExternal,
            allowUnauthenticatedExtraction: true,
            extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
        });
        await service.init();
        setFreshPendingAuth(service, 'https://example.com/oauth');
        const internals = service;
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
        const internals = service;
        internals.ensureCallbackServerStarted = vi.fn(async () => 'http://127.0.0.1:43110/oauth/callback');
        const [a, b] = await Promise.all([service.connect(), service.connect()]);
        expect(a.ok).toBe(true);
        expect(b.ok).toBe(true);
        expect(openExternal).toHaveBeenCalledTimes(1);
        await service.dispose();
    });
    it('invalidates stale pending auth and starts a fresh OAuth flow', async () => {
        const dataDir = await makeTempDir();
        const openExternal = vi.fn(async () => { });
        const service = new GranolaTaskService({
            dataDir,
            openExternal,
            allowUnauthenticatedExtraction: true,
            extractTodosForMeeting: async () => JSON.stringify({ todos: [] }),
        });
        await service.init();
        const state = service.authState;
        state.pendingAuthorizationUrl = 'https://stale.example/oauth';
        state.pendingStartedAt = new Date(Date.now() - 30 * 60_000).toISOString();
        state.pendingExpiresAt = new Date(Date.now() - 25 * 60_000).toISOString();
        state.codeVerifier = 'old-verifier';
        const internals = service;
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
        const state = service.authState;
        state.codeVerifier = 'test-verifier';
        const internals = service;
        internals.createMcpClientAndTransport = vi.fn(() => ({
            client: {
                connect: vi.fn(async () => { }),
                listTools: vi.fn(async () => { }),
                close: vi.fn(async () => { }),
            },
            transport: {
                finishAuth: vi.fn(async () => {
                    internals.captureAuthHttpFailure(401, '{"error":"unauthorized"}');
                    throw new Error('ServerError');
                }),
                close: vi.fn(async () => { }),
            },
        }));
        await expect(internals.finishGranolaAuthorization('test-code', 'http://127.0.0.1:43110/oauth/callback')).rejects.toThrowError();
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
        const outcome = await service.handleOAuthCallback({
            code: null,
            error: 'access_denied',
            errorDescription: 'User cancelled the authorization.',
        }, 'http://127.0.0.1:43110/oauth/callback');
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
        const authState = service.authState;
        authState.tokens = { access_token: 'test-token' };
        authState.lastAuthStage = 'connected';
        const callTool = vi.fn(async ({ name }) => {
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
        service.withAuthenticatedClient = async (fn) => await fn(fakeClient);
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
        const internals = service;
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
            callTool: vi.fn(async ({ name }) => {
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
        internals.withAuthenticatedClient = async (fn) => await fn(fakeClient);
        const result = await service.syncNow('manual-sync');
        expect(result.ok).toBe(true);
        const feed = service.getFeed();
        expect(feed.cooldownUntil).toBeNull();
        expect(feed.syncHealth).toBe('healthy');
        await service.dispose();
    });
    it('caps extraction to two changed meetings per run and defers backlog', async () => {
        const dataDir = await makeTempDir();
        const extractTodosForMeeting = vi.fn(async (item) => JSON.stringify({
            todos: [
                {
                    title: `Todo ${item.id}`,
                    description: 'Generated',
                    owner: 'Me',
                    due_date: 'Tomorrow',
                    priority: 'medium',
                },
            ],
        }));
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
            extractTodosForMeeting: async () => JSON.stringify({
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
        const internals = service;
        internals.refreshExecutorState = vi.fn(async () => ({
            state: 'connected',
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
        const openExternal = vi.fn(async () => { });
        const service = new GranolaTaskService({
            dataDir,
            openExternal,
            allowUnauthenticatedExtraction: true,
            extractTodosForMeeting: async () => JSON.stringify({
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
        const internals = service;
        internals.refreshExecutorState = vi.fn(async () => ({
            state: 'connected',
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
});
