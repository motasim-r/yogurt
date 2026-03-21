import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  DocsDocument,
  DocsHome,
  GranolaChatRecipe,
  GranolaChatThread,
  HomeFeed,
  HomeNoteDetail,
  TaskChatMessage,
  TaskPlanDraft,
  TaskPlanningContext,
  TasksFeed,
  TasksRealtimeEvent,
} from './shared/types';

const DISMISSED_WARNING_STORAGE_KEY = 'granola:copilot:dismissed-warnings:v1';

const {
  state,
  makeFeed,
  makeHomeFeed,
  makeHomeNoteDetail,
  makeChatRecipes,
  makeChatThread,
  makeDocsDocument,
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

  const makeHomeFeed = (): HomeFeed => ({
    recentNotes: [
      {
        id: 'meeting-1',
        title: 'LA influencer strategy for song promotion',
        ownerLabel: 'Me',
        groupLabel: 'Today',
        timeLabel: '11:49 am',
        visibility: 'private',
      },
      {
        id: 'meeting-2',
        title: 'VectorHaul call conversion review',
        ownerLabel: 'Me',
        groupLabel: 'Mon, Mar 16',
        timeLabel: '4:27 pm',
        visibility: 'private',
      },
      {
        id: 'meeting-3',
        title: 'Testing audio connection setup',
        ownerLabel: 'Me',
        groupLabel: 'Sun, Mar 1',
        timeLabel: '5:25 pm',
        visibility: 'private',
      },
    ],
    upcomingMeeting: null,
    lastSyncAt: '2026-02-28T10:01:00.000Z',
    syncInFlight: false,
    connectionState: 'connected',
    warning: null,
    warningDetails: [],
  });

  const makeHomeNoteDetail = (noteId: string): HomeNoteDetail => ({
    id: noteId,
    meetingId: noteId,
    title: noteId === 'meeting-2' ? 'VectorHaul call conversion review' : 'LA influencer strategy for song promotion',
    dateLabel: noteId === 'meeting-2' ? 'Mar 16' : 'Mar 21',
    ownerLabel: 'Me',
    body:
      noteId === 'meeting-2'
        ? '## VectorHaul\n\n- Review all calls to identify issues\n- Major problem identified: 56% no-show rate'
        : '## Summary\n\n- Outline campaign angle\n- Build shortlist of creators',
    shareUrl: `https://notes.granola.ai/t/${noteId}`,
  });

  const makeChatRecipes = (): GranolaChatRecipe[] => [
    {
      id: 'recipe-list-recent-todos',
      label: 'List recent todos',
      description: 'Pull action items from meetings.',
      instructions: 'List my recent todos across meetings.',
      creatorLabel: 'Granola',
    },
    {
      id: 'recipe-coach-me-matt',
      label: 'Coach me Matt',
      description: 'Coaching advice from recent meetings.',
      instructions: 'Coach me using my recent meetings.',
      creatorLabel: 'Matt Mochary',
    },
    {
      id: 'recipe-weekly-recap',
      label: 'Write weekly recap',
      description: 'Summarize the week.',
      instructions: 'Write my weekly recap based on meetings.',
      creatorLabel: 'Granola',
    },
    {
      id: 'recipe-streamline-calendar',
      label: 'Streamline my calendar',
      description: 'Find scheduling improvements.',
      instructions: 'Streamline my calendar based on meeting load.',
      creatorLabel: 'Peter Yang',
    },
    {
      id: 'recipe-blind-spots',
      label: 'Blind spots',
      description: 'Identify risks and blind spots.',
      instructions: 'Find my blind spots in recent meetings.',
      creatorLabel: 'Tom',
    },
  ];

  const makeChatThread = (
    threadId: string,
    title: string,
    updatedAt: string,
    userPrompt = 'what should i focus on',
  ): GranolaChatThread => ({
    threadId,
    title,
    scope: 'all_meetings',
    updatedAt,
    messages: [
      {
        messageId: `${threadId}-user-1`,
        threadId,
        role: 'user',
        content: userPrompt,
        createdAt: updatedAt,
        status: 'completed',
        thoughtDurationSeconds: null,
      },
      {
        messageId: `${threadId}-assistant-1`,
        threadId,
        role: 'assistant',
        content: `## ${title}\n\n- Follow up on the highest priority item\n- Prep for the next meeting`,
        createdAt: new Date(Date.parse(updatedAt) + 1000).toISOString(),
        status: 'completed',
        thoughtDurationSeconds: 3,
        sources: [
          {
            id: `${threadId}-source-1`,
            label: 'Meeting note',
            url: `https://notes.granola.ai/t/${threadId}`,
          },
        ],
      },
      ],
  });

  const makeDocsDocument = (
    docId: string,
    title: string,
    section: DocsDocument['section'],
    overrides: Partial<DocsDocument> = {},
  ): DocsDocument => {
    const createdAt = overrides.createdAt ?? new Date(Date.now() - 60 * 60_000).toISOString();
    const updatedAt = overrides.updatedAt ?? new Date(Date.now() - 10 * 60_000).toISOString();
    return {
      docId,
      title,
      section,
      locationLabel:
        section === 'drive' ? 'Drive / Operating Docs' : section === 'wiki' ? 'Pinned Wiki' : 'My Document Library',
      ownerLabel: overrides.ownerLabel ?? 'Motasim Rahmar',
      createdAt,
      updatedAt,
      recentLabel: overrides.recentLabel ?? '17:08 Today',
      preview: overrides.preview ?? 'Shape the launch story around conversion lift.',
      favorite: overrides.favorite ?? false,
      shared: overrides.shared ?? false,
      pinned: overrides.pinned ?? false,
      iconTone: overrides.iconTone ?? 'blue',
      breadcrumbs: overrides.breadcrumbs ?? ['Docs', section === 'drive' ? 'Drive' : section === 'wiki' ? 'Wiki' : 'Home'],
      blocks:
        overrides.blocks ??
        [
          { id: `${docId}-heading`, type: 'heading', text: 'Launch target' },
          { id: `${docId}-p1`, type: 'paragraph', text: 'Shape the launch story around conversion lift.' },
        ],
    };
  };

  const makeDocsHome = (documents: DocsDocument[]): DocsHome => ({
    workspaceTitle: 'Docs',
    sections: [
      { id: 'home', label: 'Home', description: 'Your recent and owned docs', itemCount: documents.length },
      {
        id: 'drive',
        label: 'Drive',
        description: 'Structured operating docs',
        itemCount: documents.filter((document) => document.section === 'drive').length,
      },
      {
        id: 'wiki',
        label: 'Wiki',
        description: 'Pinned references and spaces',
        itemCount: documents.filter((document) => document.section === 'wiki').length,
      },
    ],
    quickActions: [
      { id: 'new', label: 'New', description: 'Create a new document', enabled: true },
      { id: 'upload', label: 'Upload', description: 'Upload local files', enabled: false },
      { id: 'templates', label: 'Templates', description: 'Go to template gallery', enabled: true },
    ],
    templates: [
      {
        templateId: 'template-campaign-plan',
        label: 'Campaign Plan',
        description: 'Launch-ready goals, narrative, and workback.',
        section: 'home',
        iconTone: 'blue',
        blocks: [
          { id: 'template-heading', type: 'heading', text: 'Campaign objective' },
          { id: 'template-paragraph', type: 'paragraph', text: 'Define the one thing this launch needs to move.' },
        ],
      },
      {
        templateId: 'template-weekly-brief',
        label: 'Weekly Brief',
        description: 'Summarize the week, risks, and next actions.',
        section: 'drive',
        iconTone: 'amber',
        blocks: [
          { id: 'template-brief-heading', type: 'heading', text: 'Wins' },
          { id: 'template-brief-paragraph', type: 'paragraph', text: 'Summarize the week here.' },
        ],
      },
    ],
    displayMode: 'list',
    documents: documents
      .map((document) => ({
        docId: document.docId,
        title: document.title,
        section: document.section,
        locationLabel: document.locationLabel,
        ownerLabel: document.ownerLabel,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
        recentLabel: document.recentLabel,
        preview: document.preview,
        favorite: document.favorite,
        shared: document.shared,
        pinned: document.pinned,
        iconTone: document.iconTone,
      }))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
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
    homeFeed: makeHomeFeed(),
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
    homeDetails: new Map<string, HomeNoteDetail>([
      ['meeting-1', makeHomeNoteDetail('meeting-1')],
      ['meeting-2', makeHomeNoteDetail('meeting-2')],
      ['meeting-3', makeHomeNoteDetail('meeting-3')],
    ]),
    chatRecipes: makeChatRecipes(),
    chatThreads: new Map<string, GranolaChatThread>([
      ['chat-1', makeChatThread('chat-1', 'Demo with Joshim then Fix VectorHaul No Shows', new Date(Date.now() - 3 * 60_000).toISOString())],
      ['chat-2', makeChatThread('chat-2', 'What action items do I have?', new Date(Date.now() - 19 * 60_000).toISOString(), 'what action items do i have?')],
      ['chat-3', makeChatThread('chat-3', 'Write my weekly recap', new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString(), 'write my weekly recap')],
    ]),
    docsDocuments: new Map<string, DocsDocument>([
      ['doc-1', makeDocsDocument('doc-1', 'Campaign Plan', 'home', { favorite: true, recentLabel: '17:08 Today' })],
      ['doc-2', makeDocsDocument('doc-2', 'VectorHaul Launch Narrative', 'wiki', { shared: true, pinned: true, ownerLabel: 'Laura Bennett', iconTone: 'violet', recentLabel: '13:42 Today' })],
      ['doc-3', makeDocsDocument('doc-3', 'Weekly Brief March 21', 'drive', { shared: true, iconTone: 'amber', recentLabel: '12:11 Today' })],
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
    homeGetFeed: vi.fn(async () => JSON.parse(JSON.stringify(state.homeFeed))),
    homeGetNoteDetail: vi.fn(async (noteId: string) => {
      const detail = state.homeDetails.get(noteId);
      if (!detail) {
        throw new Error(`missing home note detail for ${noteId}`);
      }
      return JSON.parse(JSON.stringify(detail));
    }),
    chatGetHome: vi.fn(async () => ({
      connectionState: 'connected' as const,
      lastSyncAt: state.feed.lastSyncAt,
      warning: state.feed.warning,
      warningDetails: [...state.feed.warningDetails],
      recipes: JSON.parse(JSON.stringify(state.chatRecipes)),
      recentThreads: [...state.chatThreads.values()]
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .map((thread) => ({
          threadId: thread.threadId,
          title: thread.title,
          updatedAt: thread.updatedAt,
          timeLabel: '3m',
        })),
      defaultScope: 'all_meetings' as const,
      modelLabel: 'Auto',
    })),
    chatGetThread: vi.fn(async (threadId: string) => {
      const thread = state.chatThreads.get(threadId);
      if (!thread) {
        throw new Error(`missing chat thread for ${threadId}`);
      }
      return JSON.parse(JSON.stringify(thread));
    }),
    chatSendMessage: vi.fn(async (input: { threadId?: string | null; text: string; scope: 'all_meetings'; recipeId?: string | null }) => {
      const threadId = input.threadId?.trim() || `chat-${Date.now()}`;
      const now = new Date().toISOString();
      const existing = state.chatThreads.get(threadId);
      const recipe = state.chatRecipes.find((item) => item.id === input.recipeId) ?? null;
      const titleSource = (recipe?.label || input.text).trim() || 'New chat';
      const title = titleSource.slice(0, 86);
      const userMessage = {
        messageId: `${threadId}-user-${Date.now()}`,
        threadId,
        role: 'user' as const,
        content: input.text,
        createdAt: now,
        status: 'completed' as const,
        thoughtDurationSeconds: null,
      };
      const assistantMessage = {
        messageId: `${threadId}-assistant-${Date.now()}`,
        threadId,
        role: 'assistant' as const,
        content: `## ${title}\n\n- Scope: ${input.scope}\n- Prompt: ${recipe?.instructions || input.text}`,
        createdAt: new Date(Date.now() + 1000).toISOString(),
        status: 'completed' as const,
        thoughtDurationSeconds: 2,
        sources: [
          {
            id: `${threadId}-source-${Date.now()}`,
            label: 'Meeting note',
            url: `https://notes.granola.ai/t/${threadId}`,
          },
        ],
      };

      if (existing) {
        state.chatThreads.set(threadId, {
          ...existing,
          title: existing.title || title,
          updatedAt: assistantMessage.createdAt,
          messages: [...existing.messages, userMessage, assistantMessage],
        });
      } else {
        state.chatThreads.set(threadId, {
          threadId,
          title,
          scope: 'all_meetings',
          updatedAt: assistantMessage.createdAt,
          messages: [userMessage, assistantMessage],
        });
      }

      return { ok: true, threadId, userMessage, assistantMessage };
    }),
    docsGetHome: vi.fn(async () => makeDocsHome([...state.docsDocuments.values()])),
    docsGetDocument: vi.fn(async (docId: string) => {
      const document = state.docsDocuments.get(docId);
      if (!document) {
        throw new Error(`missing docs document for ${docId}`);
      }
      return JSON.parse(JSON.stringify(document));
    }),
    docsCreate: vi.fn(async (input?: { templateId?: string | null; section?: 'home' | 'drive' | 'wiki' | null }) => {
      const now = new Date().toISOString();
      const docId = `doc-${Date.now()}`;
      const templateId = input?.templateId ?? null;
      const document =
        templateId === 'template-weekly-brief'
          ? makeDocsDocument(docId, 'Weekly Brief', 'drive', {
              createdAt: now,
              updatedAt: now,
              iconTone: 'amber',
              recentLabel: '17:09 Today',
              blocks: [
                { id: `${docId}-heading`, type: 'heading', text: 'Wins' },
                { id: `${docId}-paragraph`, type: 'paragraph', text: 'Summarize the week here.' },
              ],
            })
          : makeDocsDocument(docId, 'Untitled document', input?.section ?? 'home', {
              createdAt: now,
              updatedAt: now,
              recentLabel: '17:09 Today',
              blocks: [{ id: `${docId}-paragraph`, type: 'paragraph', text: '' }],
            });
      state.docsDocuments.set(docId, document);
      return JSON.parse(JSON.stringify(document));
    }),
    docsUpdate: vi.fn(async (docId: string, patch: { title?: string; favorite?: boolean; pinned?: boolean; blocks?: DocsDocument['blocks'] }) => {
      const current = state.docsDocuments.get(docId);
      if (!current) {
        throw new Error(`missing docs document for ${docId}`);
      }
      const updated: DocsDocument = {
        ...current,
        title: typeof patch.title === 'string' && patch.title.trim() ? patch.title.trim() : current.title,
        favorite: typeof patch.favorite === 'boolean' ? patch.favorite : current.favorite,
        pinned: typeof patch.pinned === 'boolean' ? patch.pinned : current.pinned,
        blocks: Array.isArray(patch.blocks) ? JSON.parse(JSON.stringify(patch.blocks)) : current.blocks,
        updatedAt: new Date().toISOString(),
      };
      const previewBlock = updated.blocks.find((block): block is Exclude<DocsDocument['blocks'][number], { type: 'divider' }> => 'text' in block && block.text.trim().length > 0);
      updated.preview = previewBlock?.text ?? 'Empty document';
      updated.recentLabel = '17:10 Today';
      state.docsDocuments.set(docId, updated);
      return JSON.parse(JSON.stringify(updated));
    }),
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
    makeHomeFeed,
    makeHomeNoteDetail,
    makeChatRecipes,
    makeChatThread,
    makeDocsDocument,
    makeDocsHome,
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
  const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');

  async function openTasksWorkspace(user = userEvent.setup()) {
    await user.click(await screen.findByRole('button', { name: /List recent todos/i }));
    await screen.findByRole('heading', { name: 'Tasks' });
    await screen.findByText('Research top CRM vendors');
    return user;
  }

  beforeEach(() => {
    const store = new Map<string, string>();
    const storageMock: Storage = {
      get length() {
        return store.size;
      },
      clear() {
        store.clear();
      },
      getItem(key) {
        return store.get(key) ?? null;
      },
      key(index) {
        return [...store.keys()][index] ?? null;
      },
      removeItem(key) {
        store.delete(key);
      },
      setItem(key, value) {
        store.set(key, String(value));
      },
    };
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: storageMock,
    });

    const storage = window.localStorage;
    if (storage && typeof storage.removeItem === 'function') {
      storage.removeItem(DISMISSED_WARNING_STORAGE_KEY);
    } else if (storage && typeof storage.setItem === 'function') {
      storage.setItem(DISMISSED_WARNING_STORAGE_KEY, '[]');
    }
    state.feed = makeFeed();
    state.homeFeed = makeHomeFeed();
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
    state.homeDetails = new Map<string, HomeNoteDetail>([
      ['meeting-1', makeHomeNoteDetail('meeting-1')],
      ['meeting-2', makeHomeNoteDetail('meeting-2')],
      ['meeting-3', makeHomeNoteDetail('meeting-3')],
    ]);
    state.chatRecipes = makeChatRecipes();
    state.chatThreads = new Map<string, GranolaChatThread>([
      ['chat-1', makeChatThread('chat-1', 'Demo with Joshim then Fix VectorHaul No Shows', new Date(Date.now() - 3 * 60_000).toISOString())],
      ['chat-2', makeChatThread('chat-2', 'What action items do I have?', new Date(Date.now() - 19 * 60_000).toISOString(), 'what action items do i have?')],
      ['chat-3', makeChatThread('chat-3', 'Write my weekly recap', new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString(), 'write my weekly recap')],
    ]);
    state.docsDocuments = new Map<string, DocsDocument>([
      ['doc-1', makeDocsDocument('doc-1', 'Campaign Plan', 'home', { favorite: true, recentLabel: '17:08 Today' })],
      ['doc-2', makeDocsDocument('doc-2', 'VectorHaul Launch Narrative', 'wiki', { shared: true, pinned: true, ownerLabel: 'Laura Bennett', iconTone: 'violet', recentLabel: '13:42 Today' })],
      ['doc-3', makeDocsDocument('doc-3', 'Weekly Brief March 21', 'drive', { shared: true, iconTone: 'amber', recentLabel: '12:11 Today' })],
    ]);
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (originalLocalStorageDescriptor) {
      Object.defineProperty(window, 'localStorage', originalLocalStorageDescriptor);
    }
  });

  it('renders Granola home and opens list-first Tasks copilot from the dock', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Coming up' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Quick note/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create note/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tasks' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /(Connect|Sync) Granola/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /List recent todos/i })).toBeInTheDocument();
    expect(await screen.findByText('LA influencer strategy for song promotion')).toBeInTheDocument();
    expect(granolaClientMock.homeGetFeed).toHaveBeenCalled();

    await openTasksWorkspace(user);

    expect(screen.getByLabelText('Task list')).toBeInTheDocument();
    expect(screen.queryByLabelText('Task chat')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /(Connect|Sync) Granola/i })).toHaveLength(1);
    });
    expect(screen.getAllByRole('button', { name: /Start Task/i }).length).toBeGreaterThan(0);
  });

  it('opens Tasks copilot from the sidebar tasks item on home', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Tasks' }));

    await screen.findByRole('heading', { name: 'Tasks' });
    expect(screen.getByLabelText('Task list')).toBeInTheDocument();
  });

  it('falls back to the static upcoming card when the home feed has no future meeting', async () => {
    render(<App />);

    expect(await screen.findByText('mo/joshim - demo')).toBeInTheDocument();
    expect(screen.getByText('5:30 - 6:30 PM')).toBeInTheDocument();
  });

  it('renders a live upcoming meeting when the home feed provides one', async () => {
    state.homeFeed = {
      ...makeHomeFeed(),
      upcomingMeeting: {
        id: 'upcoming-1',
        title: 'Board prep',
        dayLabel: '24',
        monthLabel: 'March',
        weekdayLabel: 'Tue',
        timeLabel: '9:00 AM',
        startsAt: '2026-03-24T09:00:00.000Z',
      },
    };

    render(<App />);

    expect(await screen.findByText('Board prep')).toBeInTheDocument();
    expect(screen.getByText('9:00 AM')).toBeInTheDocument();
    expect(screen.queryByText('mo/joshim - demo')).not.toBeInTheDocument();
  });

  it('opens a home note detail and returns back to the same home list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click((await screen.findByText('VectorHaul call conversion review')).closest('button') as HTMLButtonElement);

    expect(await screen.findByRole('heading', { name: 'VectorHaul call conversion review' })).toBeInTheDocument();
    expect(screen.getByText('Write follow up email')).toBeInTheDocument();
    expect(screen.getByText(/Chat with meeting transcript:/i)).toBeInTheDocument();
    expect(granolaClientMock.homeGetNoteDetail).toHaveBeenCalledWith('meeting-2');

    await user.click(screen.getByRole('button', { name: /Back to Home/i }));

    expect(await screen.findByRole('heading', { name: 'Coming up' })).toBeInTheDocument();
    expect(screen.getByText('VectorHaul call conversion review')).toBeInTheDocument();
  });

  it('refreshes the home feed after a tasks-feed-updated event', async () => {
    render(<App />);
    await screen.findByText('LA influencer strategy for song promotion');

    state.homeFeed = {
      ...makeHomeFeed(),
      recentNotes: [
        {
          id: 'meeting-9',
          title: 'Freshly synced note',
          ownerLabel: 'Me',
          groupLabel: 'Today',
          timeLabel: '12:30 pm',
          visibility: 'private',
        },
      ],
    };

    state.subscriber?.({ type: 'tasks-feed-updated' });

    expect(await screen.findByText('Freshly synced note')).toBeInTheDocument();
    expect(granolaClientMock.homeGetFeed).toHaveBeenCalledTimes(2);
  });

  it('renders the Granola chat landing with real recipes and recents', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Chat' }));

    expect(await screen.findByRole('heading', { name: 'Ask anything' })).toBeInTheDocument();
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /#launch-war-room/i })).toBeInTheDocument();
    expect(screen.getByText(/^Laura$/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /List recent todos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Blind spots/i })).toBeInTheDocument();
    expect(screen.getByText('Demo with Joshim then Fix VectorHaul No Shows')).toBeInTheDocument();
    expect(granolaClientMock.chatGetHome).toHaveBeenCalled();
  });

  it('opens seeded team chats from the nested messenger list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Chat' }));
    await user.click(await screen.findByRole('button', { name: /#launch-war-room/i }));

    expect(await screen.findByRole('region', { name: /Team thread #launch-war-room/i })).toBeInTheDocument();
    expect(screen.getByText(/Need the launch room crisp today/i)).toBeInTheDocument();
    expect(screen.getByText(/Pinned launch sequence/i)).toBeInTheDocument();
  });

  it('filters the nested messenger list with a controlled empty state', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Chat' }));
    await user.type(await screen.findByPlaceholderText(/Search chats/i), 'zzzz');

    expect(screen.getByText('No chats match your search.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /#launch-war-room/i })).not.toBeInTheDocument();
  });

  it('opens a recent chat thread from the landing screen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Chat' }));
    await user.click(await screen.findByRole('button', { name: /What action items do I have\?/i }));

    expect(await screen.findByRole('button', { name: /New chat/i })).toBeInTheDocument();
    expect(screen.getAllByText(/^what action items do i have\?$/i).length).toBeGreaterThan(0);
    expect(granolaClientMock.chatGetThread).toHaveBeenCalledWith('chat-2');
  });

  it('appends local messages in team chats and preserves them while mounted', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Chat' }));
    await user.click((await screen.findByText(/^Laura$/)).closest('button') as HTMLButtonElement);

    const composer = await screen.findByPlaceholderText(/Message Laura/i);
    await user.type(composer, 'Please ship the final deck tonight');
    await user.click(screen.getByRole('button', { name: /Send team message/i }));

    expect((await screen.findAllByText(/Please ship the final deck tonight/i)).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /#design-crit/i }));
    await screen.findByRole('region', { name: /Team thread #design-crit/i });
    await user.click(screen.getByText(/^Laura$/).closest('button') as HTMLButtonElement);

    expect((await screen.findAllByText(/Please ship the final deck tonight/i)).length).toBeGreaterThan(0);
  });

  it('sends a freeform chat prompt and opens the resulting thread', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Chat' }));
    const composer = await screen.findByPlaceholderText(/What action items do I have\?/i);
    await user.type(composer, 'Summarize what I should focus on');
    await user.click(screen.getByRole('button', { name: /Send message/i }));

    await waitFor(() => {
      expect(granolaClientMock.chatSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Summarize what I should focus on',
          scope: 'all_meetings',
          recipeId: null,
        }),
      );
    });
    expect(await screen.findByRole('button', { name: /New chat/i })).toBeInTheDocument();
    expect(screen.getByText(/Prompt: Summarize what I should focus on/i)).toBeInTheDocument();
  });

  it('runs a recipe chip with its recipe id and supports say more + new chat', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Chat' }));
    await user.click(await screen.findByRole('button', { name: /^List recent todos$/i }));

    await waitFor(() => {
      expect(granolaClientMock.chatSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'List recent todos',
          recipeId: 'recipe-list-recent-todos',
        }),
      );
    });

    await user.click(await screen.findByRole('button', { name: /^Say more$/i }));
    await waitFor(() => {
      expect(granolaClientMock.chatSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Say more',
          scope: 'all_meetings',
        }),
      );
    });

    await user.click(screen.getByRole('button', { name: /New chat/i }));
    expect(await screen.findByRole('heading', { name: 'Ask anything' })).toBeInTheDocument();
    expect(screen.getByText('Demo with Joshim then Fix VectorHaul No Shows')).toBeInTheDocument();
  });

  it('refreshes chat home after a tasks-feed-updated event', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Chat' }));
    await screen.findByRole('heading', { name: 'Ask anything' });

    state.chatThreads.set(
      'chat-fresh',
      makeChatThread('chat-fresh', 'Fresh sync thread', new Date().toISOString(), 'what changed?'),
    );

    state.subscriber?.({ type: 'tasks-feed-updated' });

    expect(await screen.findByText('Fresh sync thread')).toBeInTheDocument();
    expect(granolaClientMock.chatGetHome).toHaveBeenCalledTimes(2);
  });

  it('renders the Docs tab with the Lark-style workspace chrome', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Docs' }));

    expect(await screen.findByRole('heading', { name: 'Docs' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Home' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Drive' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wiki' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Templates' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open Campaign Plan' })).toBeInTheDocument();
    expect(granolaClientMock.docsGetHome).toHaveBeenCalled();
  });

  it('filters docs home and toggles between list and grid views', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Docs' }));
    await user.type(await screen.findByPlaceholderText('Search'), 'Vector');
    expect(screen.getByRole('button', { name: 'VectorHaul Launch Narrative' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Campaign Plan$/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Shared With Me' }));
    expect(screen.getByRole('button', { name: 'VectorHaul Launch Narrative' })).toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText('Search'));
    await user.click(screen.getByRole('button', { name: 'Grid view' }));
    expect(screen.getByLabelText('Documents grid')).toBeInTheDocument();
  });

  it('creates docs from blank and template flows and opens the editor', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Docs' }));
    await user.click(await screen.findByRole('button', { name: 'New' }));
    expect(await screen.findByLabelText('Docs editor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Untitled document')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Back to Docs/i }));
    await user.click(screen.getByRole('button', { name: 'Templates' }));
    await user.click(await screen.findByRole('button', { name: 'Weekly Brief' }));

    expect(await screen.findByDisplayValue('Weekly Brief')).toBeInTheDocument();
    expect(granolaClientMock.docsCreate).toHaveBeenCalledWith({
      templateId: 'template-weekly-brief',
      section: 'drive',
    });
  });

  it('persists docs title and block edits when navigating away and back', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Docs' }));
    await user.click(await screen.findByRole('button', { name: 'Campaign Plan' }));

    const titleInput = await screen.findByDisplayValue('Campaign Plan');
    await user.clear(titleInput);
    await user.type(titleInput, 'Launch Storyline');

    const headingInput = screen.getByDisplayValue('Launch target');
    await user.clear(headingInput);
    await user.type(headingInput, 'Launch narrative');

    const paragraph = screen.getByDisplayValue('Shape the launch story around conversion lift.');
    await user.clear(paragraph);
    await user.type(paragraph, '/checklist');
    await user.click(await screen.findByRole('button', { name: /Checklist/i }));

    const checklist = await screen.findByPlaceholderText('Type / for commands');
    await user.type(checklist, 'Share the revised story');

    await waitFor(() => {
      expect(granolaClientMock.docsUpdate).toHaveBeenLastCalledWith(
        'doc-1',
        expect.objectContaining({
          blocks: expect.arrayContaining([expect.objectContaining({ type: 'checklist', text: 'Share the revised story' })]),
        }),
      );
    });

    await user.click(screen.getByRole('button', { name: /Back to Docs/i }));
    await user.click(screen.getByRole('button', { name: 'Launch Storyline' }));

    expect(await screen.findByDisplayValue('Launch Storyline')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Launch narrative')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Share the revised story')).toBeInTheDocument();
  });

  it('starts a selected task from the list', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user);

    await user.click((await screen.findAllByRole('button', { name: /Start Task/i }))[0] as HTMLButtonElement);

    await waitFor(() => {
      expect(granolaClientMock.tasksStart).toHaveBeenCalledWith('todo-1');
    });
    expect(screen.getByLabelText('Task chat')).toBeInTheDocument();
  });

  it('sends chat messages in selected task thread', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user);

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
    await openTasksWorkspace(user);

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
    await openTasksWorkspace(user);

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
    await openTasksWorkspace(user);

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
    await openTasksWorkspace(user);

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
    await openTasksWorkspace(user);

    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[1] as HTMLButtonElement);

    await waitFor(() => {
      expect(granolaClientMock.tasksGetThread).toHaveBeenCalledWith('todo-2', null, 40);
    });
  });

  it('renders assistant markdown and links in chat view', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user);

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
    await openTasksWorkspace(user);
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
    await openTasksWorkspace(user);
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
    await openTasksWorkspace(user);
    await user.click((await screen.findAllByRole('button', { name: /Open Chat/i }))[0] as HTMLButtonElement);

    expect(await screen.findByText('Auto-retry triggered')).toBeInTheDocument();
    expect(screen.getByText(/Complete findings after retry/i)).toBeInTheDocument();
  });

  it('hides warning banner persistently when dismissed', async () => {
    const user = userEvent.setup();
    state.feed.warning = 'Using cached richer notes for 5 meeting(s).';
    state.feed.warningDetails = ['Retained 6 cached meeting(s) outside the current live window.'];

    const view = render(<App />);
    await openTasksWorkspace(user);

    expect(await screen.findByText(/Using cached richer notes/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hide' }));

    await waitFor(() => {
      expect(screen.queryByText(/Using cached richer notes/i)).not.toBeInTheDocument();
    });

    view.unmount();
    render(<App />);
    await openTasksWorkspace(user);

    await waitFor(() => {
      expect(screen.queryByText(/Using cached richer notes/i)).not.toBeInTheDocument();
    });
  });
});
