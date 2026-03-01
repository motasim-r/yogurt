import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TaskChatMessage, TaskPlanDraft, TaskPlanningContext, TasksFeed, TasksRealtimeEvent } from './shared/types';

const DISMISSED_WARNING_STORAGE_KEY = 'granola:copilot:dismissed-warnings:v1';

const {
  state,
  makeFeed,
  makeThread,
  makePlanningContext,
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

  const makePlanDraft = (todoId: string, guidanceUsed: string): TaskPlanDraft => ({
    draftId: `draft-${todoId}-${Date.now()}`,
    todoId,
    generatedAt: new Date().toISOString(),
    options: [
      {
        id: 'option-1',
        title: 'Fast path execution',
        summary: 'Run a focused pass to generate quick, actionable output.',
        steps: ['Clarify output', 'Collect key evidence', 'Draft concise recommendations'],
        why: 'Best default for speed and momentum.',
        recommended: true,
      },
      {
        id: 'option-2',
        title: 'Evidence-first validation',
        summary: 'Validate high-impact claims before proposing actions.',
        steps: ['List core claims', 'Verify against sources', 'Call out confidence levels'],
        why: 'Best when risk tolerance is low.',
        recommended: false,
      },
      {
        id: 'option-3',
        title: 'Context deep-dive',
        summary: 'Use richer meeting context to tailor a nuanced plan.',
        steps: ['Extract constraints', 'Resolve unknowns', 'Create phased execution checklist'],
        why: 'Best when details are ambiguous.',
        recommended: false,
      },
    ],
    recommendedOptionId: 'option-1',
    guidanceUsed,
  });

  const makePlanningContext = (todoId: string): TaskPlanningContext => ({
    todoId,
    generatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'granola',
        title: 'Granola context',
        bullets: ['Task + meeting details are available.'],
      },
      {
        id: 'planner',
        title: 'OpenAI/IronClaw planner',
        bullets: ['Planner can generate 2-3 options with one recommended.'],
      },
      {
        id: 'ironclaw',
        title: 'IronClaw runtime',
        bullets: ['Runtime is connected.'],
      },
    ],
  });

  const state = {
    feed: makeFeed(),
    threads: new Map<string, TaskChatMessage[]>([
      ['todo-1', makeThread('todo-1')],
      ['todo-2', makeThread('todo-2')],
    ]),
    subscriber: null as ((event: TasksRealtimeEvent) => void) | null,
    planningContexts: new Map<string, TaskPlanningContext>([
      ['todo-1', makePlanningContext('todo-1')],
      ['todo-2', makePlanningContext('todo-2')],
    ]),
    latestPlans: new Map<string, TaskPlanDraft>(),
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
    tasksGetPlanningContext: vi.fn(async (todoId: string) => state.planningContexts.get(todoId) ?? makePlanningContext(todoId)),
    tasksPlanMessage: vi.fn(async (todoId: string, instruction: string) => {
      const guidance = instruction.trim() || 'Generate a concise task plan.';
      const plan = makePlanDraft(todoId, guidance);
      state.latestPlans.set(todoId, plan);
      const next = [...(state.threads.get(todoId) ?? [])];
      next.push({
        messageId: `plan-user-${next.length + 1}`,
        todoId,
        runId: null,
        role: 'user',
        content: guidance,
        createdAt: new Date().toISOString(),
        streaming: false,
        statusTag: null,
        messageType: 'planning_user',
        planDraft: null,
      });
      next.push({
        messageId: `plan-draft-${next.length + 1}`,
        todoId,
        runId: null,
        role: 'assistant',
        content: 'Planning options generated.',
        createdAt: new Date().toISOString(),
        streaming: false,
        statusTag: null,
        messageType: 'planning_draft',
        planDraft: plan,
      });
      state.threads.set(todoId, next);
      return { ok: true, plan };
    }),
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
    tasksSubscribe: vi.fn((listener: (event: TasksRealtimeEvent) => void) => {
      state.subscriber = listener;
      return () => {
        if (state.subscriber === listener) {
          state.subscriber = null;
        }
      };
    }),
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
    makePlanningContext,
    granolaClientMock,
  };
});

vi.mock('./lib/granolaClient', () => ({
  granolaClient: granolaClientMock,
}));

import App from './App';

describe('App task copilot', () => {
  beforeEach(() => {
    const storage = window.localStorage;
    if (storage && typeof storage.removeItem === 'function') {
      storage.removeItem(DISMISSED_WARNING_STORAGE_KEY);
    } else if (storage && typeof storage.setItem === 'function') {
      storage.setItem(DISMISSED_WARNING_STORAGE_KEY, '[]');
    }
    state.feed = makeFeed();
    state.threads = new Map<string, TaskChatMessage[]>([
      ['todo-1', makeThread('todo-1')],
      ['todo-2', makeThread('todo-2')],
    ]);
    state.subscriber = null;
    state.planningContexts = new Map<string, TaskPlanningContext>([
      ['todo-1', makePlanningContext('todo-1')],
      ['todo-2', makePlanningContext('todo-2')],
    ]);
    state.latestPlans = new Map<string, TaskPlanDraft>();
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

  it('shows planning module for an empty task thread and renders custom option last', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', []);
    render(<App />);

    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[0] as HTMLButtonElement);
    expect(await screen.findByText(/Plan before launch/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Plan task/i }));
    await waitFor(() => {
      expect(granolaClientMock.tasksPlanMessage).toHaveBeenCalled();
    });

    expect(await screen.findByText(/^Recommended$/i, { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Custom$/i })).toBeInTheDocument();
    const optionCards = document.querySelectorAll('.task-plan-option');
    expect(optionCards).toHaveLength(4);
    expect(optionCards[3]?.className).toContain('is-custom');
  });

  it('uses planning API (not execution send) from composer while pre-start planning is active', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', []);
    render(<App />);

    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[0] as HTMLButtonElement);
    const composer = await screen.findByPlaceholderText(/Tell planner how this task should be planned/i);
    await user.type(composer, 'Prioritize speed and include links');
    await user.click(screen.getByRole('button', { name: /^Plan$/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksPlanMessage).toHaveBeenCalledWith('todo-1', 'Prioritize speed and include links');
    });
    expect(granolaClientMock.tasksSendMessage).not.toHaveBeenCalled();
  });

  it('starts with selected recommended preset plan payload', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', []);
    render(<App />);

    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[0] as HTMLButtonElement);
    await user.click(await screen.findByRole('button', { name: /Plan task/i }));
    await waitFor(() => {
      expect(granolaClientMock.tasksPlanMessage).toHaveBeenCalled();
    });

    await user.click(screen.getByRole('button', { name: /^Start Task$/i }));
    await waitFor(() => {
      expect(granolaClientMock.tasksStart).toHaveBeenCalledWith(
        'todo-1',
        expect.objectContaining({
          approvedPlan: expect.objectContaining({
            selection: expect.objectContaining({
              mode: 'preset',
              optionId: 'option-1',
            }),
          }),
        }),
      );
    });
  });

  it('starts with custom planning instruction payload', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', []);
    render(<App />);

    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[0] as HTMLButtonElement);
    await user.click(await screen.findByRole('button', { name: /Plan task/i }));
    await waitFor(() => {
      expect(granolaClientMock.tasksPlanMessage).toHaveBeenCalled();
    });

    await user.click(screen.getByRole('button', { name: /^Custom$/i }));
    const customField = screen.getByPlaceholderText(/Type extra planning instructions/i);
    await user.clear(customField);
    await user.type(customField, 'Focus on enterprise CRM players first.');
    await user.click(screen.getByRole('button', { name: /^Start Task$/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksStart).toHaveBeenCalledWith(
        'todo-1',
        expect.objectContaining({
          approvedPlan: expect.objectContaining({
            selection: expect.objectContaining({
              mode: 'custom',
              customInstruction: 'Focus on enterprise CRM players first.',
            }),
          }),
        }),
      );
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

  it('renders timeline traces with details collapsed by default and final answer styling', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', [
      {
        messageId: 'trace-start',
        todoId: 'todo-1',
        runId: 'run-1',
        role: 'status',
        content: 'Run started',
        createdAt: '2026-02-28T10:02:00.000Z',
        streaming: false,
        statusTag: 'started',
        trace: {
          kind: 'phase',
          title: 'Run started',
          detail: 'Started from task list.',
          phase: 'started',
          groupId: 'run-1',
        },
      },
      {
        messageId: 'trace-thought',
        todoId: 'todo-1',
        runId: 'run-1',
        role: 'status',
        content: 'Thinking through the approach',
        createdAt: '2026-02-28T10:02:10.000Z',
        streaming: false,
        statusTag: 'thinking',
        trace: {
          kind: 'thought',
          title: 'Thinking through the approach',
          detail: 'Compare vendors and normalize pricing models.',
          phase: 'thinking',
          groupId: 'run-1',
        },
      },
      {
        messageId: 'trace-tool',
        todoId: 'todo-1',
        runId: 'run-1',
        role: 'status',
        content: 'Starting web search',
        createdAt: '2026-02-28T10:02:20.000Z',
        streaming: false,
        statusTag: null,
        trace: {
          kind: 'tool_start',
          title: 'Starting web search',
          toolName: 'web_search',
          toolArgs: '{\"query\":\"crm vendors\"}',
          groupId: 'tool-1',
        },
      },
      {
        messageId: 'trace-source',
        todoId: 'todo-1',
        runId: 'run-1',
        role: 'status',
        content: 'Fetched example.com',
        createdAt: '2026-02-28T10:02:30.000Z',
        streaming: false,
        statusTag: null,
        trace: {
          kind: 'source_fetch',
          title: 'Fetched example.com',
          sourceUrl: 'https://example.com/result',
          domain: 'example.com',
          groupId: 'tool-1',
        },
      },
      {
        messageId: 'final-answer',
        todoId: 'todo-1',
        runId: 'run-1',
        role: 'assistant',
        content: '## Final\n- Vendor shortlist ready',
        createdAt: '2026-02-28T10:03:00.000Z',
        streaming: false,
        statusTag: null,
      },
    ]);

    render(<App />);
    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[0] as HTMLButtonElement);

    expect(await screen.findByText('Thought')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText(/Fetched 1 source/i)).toBeInTheDocument();
    expect(screen.getByText(/Final result/i)).toBeInTheDocument();
    expect(screen.queryByText(/\"query\"/i)).not.toBeInTheDocument();

    for (const button of screen.getAllByRole('button', { name: /Show details/i })) {
      await user.click(button as HTMLButtonElement);
    }
    expect(screen.getByText(/\"query\"/i)).toBeInTheDocument();
  });

  it('hides raw streaming assistant text while selected task is actively running', async () => {
    const user = userEvent.setup();
    state.feed.activeRunTodoId = 'todo-1';
    state.threads.set('todo-1', [
      {
        messageId: 'active-trace',
        todoId: 'todo-1',
        runId: 'run-active',
        role: 'status',
        content: 'Run started',
        createdAt: '2026-02-28T10:05:00.000Z',
        streaming: false,
        statusTag: 'started',
        trace: {
          kind: 'phase',
          title: 'Run started',
          phase: 'started',
          groupId: 'run-active',
        },
      },
      {
        messageId: 'active-stream',
        todoId: 'todo-1',
        runId: 'run-active',
        role: 'assistant',
        content: 'Progress update Progress update Progress update',
        createdAt: '2026-02-28T10:05:10.000Z',
        streaming: true,
        statusTag: 'streaming',
      },
    ]);

    render(<App />);
    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[0] as HTMLButtonElement);

    expect(await screen.findByText('Run started')).toBeInTheDocument();
    expect(screen.queryByText(/Progress update Progress update/i)).not.toBeInTheDocument();
  });

  it('shows auto-retry trace rows in the timeline when retry occurs', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', [
      {
        messageId: 'retry-trace',
        todoId: 'todo-1',
        runId: 'run-retry',
        role: 'status',
        content: 'Auto-retry triggered',
        createdAt: '2026-02-28T10:06:00.000Z',
        streaming: false,
        statusTag: 'working',
        trace: {
          kind: 'phase',
          title: 'Auto-retry triggered',
          detail: 'Incomplete progress-only output detected. Retrying once for a complete final answer.',
          phase: 'working',
          groupId: 'run-retry',
        },
      },
      {
        messageId: 'retry-final',
        todoId: 'todo-1',
        runId: 'run-retry',
        role: 'assistant',
        content: '## Final result\n- Complete findings after retry',
        createdAt: '2026-02-28T10:06:30.000Z',
        streaming: false,
        statusTag: null,
      },
    ]);

    render(<App />);
    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[0] as HTMLButtonElement);

    expect(await screen.findByText('Auto-retry triggered')).toBeInTheDocument();
    expect(screen.getByText(/Complete findings after retry/i)).toBeInTheDocument();
  });

  it('hides warning banner persistently when dismissed', async () => {
    const user = userEvent.setup();
    state.feed.warning = 'Using cached richer notes for 5 meeting(s).';
    state.feed.warningDetails = ['Retained 6 cached meeting(s) outside the current live window.'];

    const view = render(<App />);

    expect(await screen.findByText(/Using cached richer notes/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hide' }));

    await waitFor(() => {
      expect(screen.queryByText(/Using cached richer notes/i)).not.toBeInTheDocument();
    });

    view.unmount();
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/Using cached richer notes/i)).not.toBeInTheDocument();
    });
  });
});
