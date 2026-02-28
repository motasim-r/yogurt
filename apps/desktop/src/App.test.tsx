import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TaskChatMessage, TasksFeed } from './shared/types';

const {
  state,
  makeFeed,
  makeThread,
  granolaClientMock,
} = vi.hoisted(() => {
  const makeFeed = (): TasksFeed => ({
    connectionState: 'connected',
    auth: {
      authenticated: true,
      pendingAuthorization: false,
      pendingAuthorizationUrl: null,
      pendingStartedAt: null,
      pendingExpiresAt: null,
      lastAuthAt: null,
      lastAuthError: null,
      lastAuthStage: 'connected',
      lastAuthHttpStatus: null,
      lastAuthErrorCode: null,
      tokenSavedAt: null,
      tokenExpiresAt: null,
      tokenIdentity: 'motasim@example.com',
    },
    executor: {
      state: 'connected',
      profile: 'ironclaw',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      lastCheckedAt: '2026-02-28T10:00:00.000Z',
      lastError: null,
    },
    runtime: {
      ironclawProfile: 'ironclaw',
      ironclawVersion: '2026.2.15-1.7',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      dataImportedAt: null,
      canonicalProjectPath: '/Users/motasimrahman/Desktop/codex/yogurt',
    },
    syncInFlight: false,
    executionEnabled: true,
    guardrailMode: 'workspace_only',
    uiRefreshMs: 5000,
    todos: [
      {
        todoId: 'todo-1',
        meetingId: 'meeting-1',
        meetingTitle: 'Weekly GTM review',
        title: 'Research top CRM vendors',
        description: 'Collect options with links and pricing notes.',
        owner: 'Motasim',
        dueDate: null,
        priority: 'high',
        status: 'discovered',
        attempts: 0,
        lastUpdatedAt: '2026-02-28T10:00:00.000Z',
        publicSummary: '',
        latestPublicStep: '',
        stepCount: 0,
        steps: [],
        runState: 'idle',
        runQueueState: 'idle',
        runId: null,
      },
      {
        todoId: 'todo-2',
        meetingId: 'meeting-2',
        meetingTitle: 'Prospecting strategy',
        title: 'Build outreach lead list',
        description: 'Prioritize high-intent targets.',
        owner: null,
        dueDate: null,
        priority: 'medium',
        status: 'submitted',
        attempts: 1,
        lastUpdatedAt: '2026-02-28T09:00:00.000Z',
        publicSummary: 'Initial list prepared.',
        latestPublicStep: 'Run completed.',
        stepCount: 2,
        steps: [],
        runState: 'done',
        runQueueState: 'idle',
        runId: 'run-2',
      },
    ],
    counts: {
      discovered: 1,
      approved: 0,
      queued: 0,
      submitting: 0,
      submitted: 1,
      failed: 0,
      cancelled: 0,
    },
    guardrailBlockedCount: 0,
    lastSyncAt: '2026-02-28T10:01:00.000Z',
    lastSyncError: null,
    syncHealth: 'healthy',
    nextAutoSyncAt: '2026-02-28T10:06:00.000Z',
    cooldownUntil: null,
    lastExtractionAt: '2026-02-28T10:01:00.000Z',
    lastExtractionError: null,
    lastSubmissionAt: null,
    warning: null,
    warningDetails: [],
    activeRunTodoId: null,
    queuedRunCount: 0,
    selectedTodoIdHint: 'todo-1',
  });

  const makeThread = (todoId: string): TaskChatMessage[] => [
    {
      messageId: `${todoId}-m1`,
      todoId,
      runId: null,
      role: 'system',
      content: 'Task imported from Granola notes.',
      createdAt: '2026-02-28T10:00:00.000Z',
      streaming: false,
      statusTag: null,
    },
    {
      messageId: `${todoId}-m2`,
      todoId,
      runId: null,
      role: 'assistant',
      content: '## Research plan\\n- Compare pricing\\n- Include links\\n\\n[CRM docs](https://example.com/crm)',
      createdAt: '2026-02-28T10:01:00.000Z',
      streaming: false,
      statusTag: 'completed',
    },
  ];

  const state = {
    feed: makeFeed(),
    threads: new Map<string, TaskChatMessage[]>([
      ['todo-1', makeThread('todo-1')],
      ['todo-2', makeThread('todo-2')],
    ]),
  };

  const granolaClientMock = {
    getAppInfo: vi.fn(async () => ({ version: '0.1.0-test', platform: 'test' })),
    windowCommand: vi.fn(async () => {}),
    notesList: vi.fn(async () => []),
    noteGet: vi.fn(async () => {
      throw new Error('not implemented');
    }),
    noteUpdate: vi.fn(async () => {
      throw new Error('not implemented');
    }),
    settingsGet: vi.fn(async () => ({
      autoStart: false,
      theme: 'system' as const,
      transcriptLanguage: 'English',
      showMeetingOverlay: true,
    })),
    settingsUpdate: vi.fn(async () => ({
      autoStart: false,
      theme: 'system' as const,
      transcriptLanguage: 'English',
      showMeetingOverlay: true,
    })),
    tasksGetFeed: vi.fn(async () => JSON.parse(JSON.stringify(state.feed))),
    tasksConnect: vi.fn(async () => ({ ok: true, needsBrowser: true })),
    tasksOpenPendingAuthorization: vi.fn(async () => ({ ok: true })),
    tasksSyncNow: vi.fn(async () => ({ ok: true, meetingCount: 0, fetchedAt: new Date().toISOString() })),
    tasksStart: vi.fn(async () => ({ ok: true })),
    tasksGetThread: vi.fn(async (todoId: string) => ({
      todoId,
      messages: JSON.parse(JSON.stringify(state.threads.get(todoId) ?? [])),
      nextCursor: null,
      hasMore: false,
      loadedAt: new Date().toISOString(),
    })),
    tasksSendMessage: vi.fn(async (todoId: string, text: string) => {
      const next = [...(state.threads.get(todoId) ?? [])];
      next.push({
        messageId: `new-${next.length + 1}`,
        todoId,
        runId: null,
        role: 'user',
        content: text,
        createdAt: new Date().toISOString(),
        streaming: false,
        statusTag: null,
      });
      state.threads.set(todoId, next);
      return { ok: true, queued: false };
    }),
    tasksCancelActiveRun: vi.fn(async () => ({ ok: true })),
    tasksClearThread: vi.fn(async (todoId: string) => {
      state.threads.set(todoId, []);
      return { ok: true };
    }),
    tasksExecutorReconnect: vi.fn(async () => ({ ok: true })),
    tasksOpenRun: vi.fn(async () => ({ ok: true, url: 'http://127.0.0.1:19789/#token=test' })),
    tasksRuntimeCheck: vi.fn(async () => ({
      ok: true,
      ironclaw: {
        profile: 'ironclaw',
        version: '2026.2.15-1.7',
        state: 'connected' as const,
        gatewayUrl: 'ws://127.0.0.1:19789',
        dashboardUrl: 'http://127.0.0.1:19789/#token=test',
        lastError: null,
      },
      granola: {
        authenticated: true,
        connectionState: 'connected' as const,
        lastSyncAt: state.feed.lastSyncAt,
        lastSyncError: null,
      },
      migration: {
        sourceDir: '/Users/motasimrahman/Desktop/granola-openclaw/data',
        imported: false,
        importedAt: null,
        skippedReason: null,
        error: null,
        markerPath: '/tmp/.legacy-openclaw-import.json',
      },
    })),
    tasksSubscribe: vi.fn(() => () => {}),
    tasksRefreshExtraction: vi.fn(async () => ({
      ok: true,
      processedMeetings: 0,
      discoveredCount: 0,
      updatedCount: 0,
    })),
  };

  return {
    state,
    makeFeed,
    makeThread,
    granolaClientMock,
  };
});

vi.mock('./lib/granolaClient', () => ({
  granolaClient: granolaClientMock,
}));

import App from './App';

describe('App task copilot', () => {
  beforeEach(() => {
    state.feed = makeFeed();
    state.threads = new Map<string, TaskChatMessage[]>([
      ['todo-1', makeThread('todo-1')],
      ['todo-2', makeThread('todo-2')],
    ]);
    vi.clearAllMocks();
  });

  it('renders list-first Tasks copilot and one connect control', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument();
    expect(screen.getByLabelText('Task list')).toBeInTheDocument();
    expect(screen.queryByLabelText('Task chat')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /(Connect|Sync) Granola/i })).toHaveLength(1);
    });
    expect(screen.getAllByRole('button', { name: /Start Task/i }).length).toBeGreaterThan(0);
  });

  it('starts a selected task from the list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click((await screen.findAllByRole('button', { name: /Start Task/i }))[0] as HTMLButtonElement);

    await waitFor(() => {
      expect(granolaClientMock.tasksStart).toHaveBeenCalledWith('todo-1');
    });
    expect(screen.getByLabelText('Task chat')).toBeInTheDocument();
  });

  it('sends chat messages in selected task thread', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[0] as HTMLButtonElement);
    const composer = await screen.findByPlaceholderText(/Message task copilot/i);
    await user.type(composer, 'Continue with competitor research');
    await user.click(screen.getByRole('button', { name: /Send/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksSendMessage).toHaveBeenCalledWith('todo-1', 'Continue with competitor research');
    });
  });

  it('switches selected tasks and loads their threads', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[1] as HTMLButtonElement);

    await waitFor(() => {
      expect(granolaClientMock.tasksGetThread).toHaveBeenCalledWith('todo-2', null, 40);
    });
  });

  it('renders assistant markdown and links in chat view', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[0] as HTMLButtonElement);

    const link = await screen.findByRole('link', { name: /CRM docs/i });
    expect(link).toHaveAttribute('href', 'https://example.com/crm');
    expect(screen.getByText(/Compare pricing/i)).toBeInTheDocument();
  });
});
