import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  CodexAIStatus,
  ContextPacket,
  DocVersionSummary,
  DocsDocument,
  DocsHome,
  GranolaChatRecipe,
  GranolaChatThread,
  HomeFeed,
  HomeNoteDetail,
  TaskChatMessage,
  TaskPlanDraft,
  TaskPlanningContext,
  TaskSuggestionDeck,
  TasksWorkspace,
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
    makeContextPacket,
    makeDocsDocument,
    makeWorkspace,
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

  const makeWorkspace = (feed: TasksFeed): TasksWorkspace => ({
    sections: [
      { id: 'all', label: 'All', description: 'Every extracted task', itemCount: feed.todos.length },
      { id: 'assigned', label: 'Assigned', description: 'Tasks with an owner', itemCount: feed.todos.filter((todo) => Boolean(todo.owner)).length },
      { id: 'running', label: 'Running', description: 'Tasks with active execution', itemCount: feed.todos.filter((todo) => todo.runQueueState === 'running' || todo.runQueueState === 'queued').length },
      { id: 'completed', label: 'Completed', description: 'Completed execution history', itemCount: feed.todos.filter((todo) => todo.status === 'submitted').length },
      { id: 'activity', label: 'Activity', description: 'Recent task movement', itemCount: feed.todos.length },
    ],
    lists: [
      { id: 'meeting:meeting-1', label: 'Weekly GTM review', itemCount: 1, kind: 'meeting' },
      { id: 'meeting:meeting-2', label: 'Prospecting strategy', itemCount: 1, kind: 'meeting' },
    ],
    boardColumns: [
      { id: 'inbox', label: 'Inbox', itemCount: 1 },
      { id: 'ready', label: 'Ready', itemCount: 0 },
      { id: 'running', label: 'Running', itemCount: 0 },
      { id: 'done', label: 'Done', itemCount: 1 },
      { id: 'blocked', label: 'Blocked', itemCount: 0 },
    ],
    assignees: [{ id: 'assignee:motasim', label: 'Motasim', initials: 'M', tone: 'blue' }],
    prefs: {
      viewMode: 'list',
      groupBy: 'board',
      sortBy: 'updated',
    },
    items: feed.todos.map((todo) => ({
      ...todo,
      createdAt: todo.lastUpdatedAt,
      creatorLabel: 'Granola',
      assignee: todo.owner
        ? { id: 'assignee:motasim', label: todo.owner, initials: 'M', tone: 'blue' as const }
        : null,
      listId: `meeting:${todo.meetingId}`,
      boardColumnId: todo.todoId === 'todo-2' ? 'done' : 'inbox',
      following: false,
      latestBrief: null,
    })),
    selectedTodoIdHint: feed.selectedTodoIdHint,
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
        launchInstruction: 'Start with a focused fast path, collect key evidence, and draft concise recommendations.',
        recommended: true,
      },
      {
        id: 'option-2',
        title: 'Evidence-first validation',
        summary: 'Validate high-impact claims before proposing actions.',
        steps: ['List core claims', 'Verify against sources', 'Call out confidence levels'],
        why: 'Best when risk tolerance is low.',
        launchInstruction: 'Start with an evidence-first validation pass and verify high-impact claims before proposing actions.',
        recommended: false,
      },
      {
        id: 'option-3',
        title: 'Context deep-dive',
        summary: 'Use richer meeting context to tailor a nuanced plan.',
        steps: ['Extract constraints', 'Resolve unknowns', 'Create phased execution checklist'],
        why: 'Best when details are ambiguous.',
        launchInstruction: 'Start with a context deep-dive and use the meeting constraints to shape a phased execution checklist.',
        recommended: false,
      },
    ],
    recommendedOptionId: 'option-1',
    guidanceUsed,
  });

  const makePlanSuggestions = (todoId: string): TaskSuggestionDeck => {
    const draft = makePlanDraft(todoId, 'Generate the best task plan.');
    return {
      todoId,
      phase: 'planning',
      generatedAt: draft.generatedAt,
      source: 'ai',
      actions: draft.options.map((option) => ({
        id: option.id,
        phase: 'planning',
        label: option.title,
        summary: option.summary,
        instruction: option.launchInstruction,
        recommended: option.recommended,
        actionMode: 'start',
        editable: true,
        steps: option.steps,
        reason: option.why,
      })),
    };
  };

  const makeNextMoveSuggestions = (todoId: string): TaskSuggestionDeck => ({
    todoId,
    phase: 'next_move',
    generatedAt: new Date().toISOString(),
    source: 'ai',
    actions: [
      {
        id: 'next-refine',
        phase: 'next_move',
        label: 'Refine recommendations',
        summary: 'Tighten the strongest ideas into a cleaner recommendation set.',
        instruction: 'Refine the strongest ideas into a cleaner recommendation set with sharper tradeoffs.',
        recommended: true,
        actionMode: 'message',
        editable: true,
        reason: 'Best next move when the task already has a useful draft.',
      },
      {
        id: 'next-draft',
        phase: 'next_move',
        label: 'Draft follow-up',
        summary: 'Turn the findings into a concise follow-up message.',
        instruction: 'Turn the findings into a concise follow-up message that is ready for review.',
        recommended: false,
        actionMode: 'message',
        editable: true,
        reason: 'Best when the next step is communication.',
      },
    ],
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

  const makeContextPacket = (
    todoId: string,
    overrides: Partial<ContextPacket> = {},
  ): ContextPacket => ({
    packetId: overrides.packetId ?? `packet-${todoId}`,
    linkedTodoId: todoId,
    title: overrides.title ?? (state.feed.todos.find((todo) => todo.todoId === todoId)?.title ?? 'Context task'),
    objective:
      overrides.objective ??
      (state.feed.todos.find((todo) => todo.todoId === todoId)?.description ?? 'Create a task from linked context.'),
    createdAt: overrides.createdAt ?? '2026-03-22T18:00:00.000Z',
    origin: overrides.origin ?? 'meeting_extraction',
    sources:
      overrides.sources ??
      [
        {
          kind: 'meeting',
          meetingId: state.feed.todos.find((todo) => todo.todoId === todoId)?.meetingId ?? 'meeting-1',
          meetingTitle: state.feed.todos.find((todo) => todo.todoId === todoId)?.meetingTitle ?? 'Weekly GTM review',
          label: state.feed.todos.find((todo) => todo.todoId === todoId)?.meetingTitle ?? 'Weekly GTM review',
          excerpt: state.feed.todos.find((todo) => todo.todoId === todoId)?.description ?? 'Meeting-backed context',
          citation: `Meeting · ${state.feed.todos.find((todo) => todo.todoId === todoId)?.meetingTitle ?? 'Weekly GTM review'}`,
        },
      ],
    people: overrides.people ?? [],
    entities: overrides.entities ?? [state.feed.todos.find((todo) => todo.todoId === todoId)?.title ?? 'Task'],
    citations: overrides.citations ?? [],
    preview:
      overrides.preview ?? {
        summary: 'Resolved context packet preview.',
        stats: ['Using 1 source'],
        excerpt: state.feed.todos.find((todo) => todo.todoId === todoId)?.description ?? 'Meeting-backed context',
      },
    writeback:
      overrides.writeback ?? {
        chatThreadId: 'chat-1',
        docId: 'doc-1',
        docTitle: 'Campaign Plan',
        docSectionHeading: 'Task update',
      },
  });

  const state = {
    feed: makeFeed(),
    workspace: null as TasksWorkspace | null,
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
    planSuggestionDecks: new Map<string, TaskSuggestionDeck>(),
    nextMoveSuggestionDecks: new Map<string, TaskSuggestionDeck>(),
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
    contextPackets: new Map<string, ContextPacket>(),
    docHistories: new Map<string, DocVersionSummary[]>(),
    docVersionSnapshots: new Map<string, DocsDocument>(),
    aiStatus: {
      profile: 'ironclaw',
      state: 'connected',
      connected: true,
      profileId: 'openai-codex:test',
      expiresAt: null,
      remainingMs: null,
      reason: null,
      gatewayState: 'connected',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      modelLabel: 'Codex / Auto',
      lastCheckedAt: '2026-02-28T10:01:00.000Z',
    } as CodexAIStatus,
  };
  state.workspace = makeWorkspace(state.feed);
  state.contextPackets.set('todo-1', makeContextPacket('todo-1'));
  state.contextPackets.set(
    'todo-2',
    makeContextPacket('todo-2', {
      preview: {
        summary: 'Context packet pulled from prospecting strategy.',
        stats: ['Using 1 source', 'Ready for write-back'],
        excerpt: 'Prioritize high-intent targets and capture next actions.',
      },
      writeback: {
        chatThreadId: 'chat-2',
        docId: 'doc-3',
        docTitle: 'Weekly Brief March 21',
        docSectionHeading: 'Task update',
      },
    }),
  );

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
    docsGetHistory: vi.fn(async (docId: string) => JSON.parse(JSON.stringify(state.docHistories.get(docId) ?? []))),
    docsRestoreVersion: vi.fn(async (docId: string, versionId: string) => {
      const snapshot = state.docVersionSnapshots.get(versionId);
      if (!snapshot) {
        throw new Error(`missing docs snapshot for ${versionId}`);
      }
      state.docsDocuments.set(docId, JSON.parse(JSON.stringify(snapshot)));
      const restoredVersion: DocVersionSummary = {
        versionId: `version-${Date.now()}`,
        docId,
        createdAt: new Date().toISOString(),
        label: 'Restored version',
        restoredFromVersionId: versionId,
        preview: snapshot.preview,
      };
      state.docHistories.set(docId, [...(state.docHistories.get(docId) ?? []), restoredVersion]);
      return JSON.parse(JSON.stringify(snapshot));
    }),
    tasksGetFeed: vi.fn(async () => JSON.parse(JSON.stringify(state.feed))),
    tasksGetWorkspace: vi.fn(async () => JSON.parse(JSON.stringify(state.workspace))),
    tasksCreateFromContext: vi.fn(async (input: {
      title?: string | null;
      objective?: string | null;
      origin: 'chat_selection' | 'doc_selection' | 'mixed';
      chatSelection?: {
        threadId: string;
        threadTitle?: string | null;
        anchorMessageId?: string | null;
        mode: 'message' | 'thread';
        messages?: Array<{ messageId: string; author: string; content: string; createdAt: string }>;
      };
      docSelection?: {
        docId: string;
        blockId?: string | null;
        mode: 'block' | 'section' | 'checklist';
      };
      writeback?: {
        chatThreadId?: string | null;
        docId?: string | null;
        docTitle?: string | null;
        docSectionHeading?: string | null;
      };
    }) => {
      const todoId = `todo-context-${Date.now()}`;
      const packetId = `packet-${todoId}`;
      const createdAt = new Date().toISOString();
      const title = input.title?.trim() || 'Context task';
      const objective = input.objective?.trim() || title;
      const sourceMeetingTitle =
        input.docSelection?.docId
          ? state.docsDocuments.get(input.docSelection.docId)?.title ?? 'Document context'
          : input.chatSelection?.threadTitle ?? 'Chat context';
      const nextTodo = {
        todoId,
        meetingId: `context-${todoId}`,
        meetingTitle: sourceMeetingTitle,
        title,
        description: objective,
        owner: null,
        dueDate: null,
        priority: 'medium' as const,
        status: 'discovered' as const,
        attempts: 0,
        lastUpdatedAt: createdAt,
        publicSummary: '',
        latestPublicStep: '',
        stepCount: 0,
        steps: [],
        runState: 'idle' as const,
        runQueueState: 'idle' as const,
        runId: null,
      };
      state.feed = {
        ...state.feed,
        todos: [nextTodo, ...state.feed.todos],
        counts: {
          ...state.feed.counts,
          discovered: state.feed.counts.discovered + 1,
        },
        selectedTodoIdHint: todoId,
      };
      state.workspace = makeWorkspace(state.feed);
      const packet = makeContextPacket(todoId, {
        packetId,
        title,
        objective,
        origin: input.origin,
        sources: input.chatSelection
          ? [
              {
                kind: 'chat',
                threadId: input.chatSelection.threadId,
                threadTitle: input.chatSelection.threadTitle ?? 'Chat thread',
                anchorMessageId: input.chatSelection.anchorMessageId ?? null,
                messageIds: input.chatSelection.messages?.map((message) => message.messageId) ?? [],
                mode: input.chatSelection.mode,
                label: input.chatSelection.threadTitle ?? 'Chat thread',
                excerpt: input.chatSelection.messages?.map((message) => `${message.author}: ${message.content}`).join('\n') ?? objective,
                citation: `Chat · ${input.chatSelection.threadTitle ?? 'Chat thread'}`,
              },
            ]
          : input.docSelection
            ? [
                {
                  kind: 'doc',
                  docId: input.docSelection.docId,
                  docTitle: state.docsDocuments.get(input.docSelection.docId)?.title ?? 'Document',
                  blockIds: input.docSelection.blockId ? [input.docSelection.blockId] : [],
                  sectionTitle: state.docsDocuments.get(input.docSelection.docId)?.title ?? 'Document',
                  versionId: null,
                  mode: input.docSelection.mode,
                  label: state.docsDocuments.get(input.docSelection.docId)?.title ?? 'Document',
                  excerpt: objective,
                  citation: `Doc · ${state.docsDocuments.get(input.docSelection.docId)?.title ?? 'Document'}`,
                },
              ]
            : undefined,
        preview: {
          summary: objective,
          stats: input.chatSelection
            ? [`Using ${input.chatSelection.messages?.length ?? 0} messages`]
            : input.docSelection
              ? ['Using 1 doc section']
              : ['Using 1 source'],
          excerpt: objective,
        },
        writeback: {
          chatThreadId: input.writeback?.chatThreadId ?? input.chatSelection?.threadId ?? null,
          docId: input.writeback?.docId ?? input.docSelection?.docId ?? null,
          docTitle:
            input.writeback?.docTitle ??
            (input.docSelection?.docId ? state.docsDocuments.get(input.docSelection.docId)?.title ?? null : null),
          docSectionHeading: input.writeback?.docSectionHeading ?? 'Task update',
        },
      });
      state.contextPackets.set(todoId, packet);
      return { todoId, packetId };
    }),
    tasksGetContextPacket: vi.fn(async (todoId: string) => {
      const packet = state.contextPackets.get(todoId);
      if (!packet) {
        throw new Error(`missing context packet for ${todoId}`);
      }
      return JSON.parse(JSON.stringify(packet));
    }),
    tasksSetWriteback: vi.fn(async (todoId: string, patch: { chatThreadId?: string | null; docId?: string | null; docTitle?: string | null; docSectionHeading?: string | null }) => {
      const current = state.contextPackets.get(todoId);
      if (!current) {
        throw new Error(`missing context packet for ${todoId}`);
      }
      state.contextPackets.set(todoId, {
        ...current,
        writeback: {
          ...current.writeback,
          ...patch,
        },
      });
    }),
    tasksWriteBack: vi.fn(async (todoId: string, target: 'chat' | 'doc' | 'followup') => {
      const packet = state.contextPackets.get(todoId);
      const todo = state.feed.todos.find((item) => item.todoId === todoId);
      if (!packet || !todo) {
        return { ok: false, message: 'missing context packet' };
      }
      if (target === 'followup') {
        const next = [...(state.threads.get(todoId) ?? [])];
        next.push({
          messageId: `followup-${next.length + 1}`,
          todoId,
          runId: null,
          role: 'assistant',
          content: `Draft external follow-up for ${todo.title}.`,
          createdAt: new Date().toISOString(),
          streaming: false,
          statusTag: 'completed',
        });
        state.threads.set(todoId, next);
        return { ok: true, artifactId: `followup-${todoId}` };
      }
      if (target === 'chat' && packet.writeback.chatThreadId?.startsWith('chat-')) {
        const thread = state.chatThreads.get(packet.writeback.chatThreadId);
        if (!thread) {
          return { ok: false, message: 'missing chat thread' };
        }
        const createdAt = new Date().toISOString();
        thread.messages.push({
          messageId: `${thread.threadId}-assistant-${Date.now()}`,
          threadId: thread.threadId,
          role: 'assistant',
          content: `## Task update: ${todo.title}\n\n${todo.publicSummary || todo.description}`,
          createdAt,
          status: 'completed',
          thoughtDurationSeconds: null,
        });
        thread.updatedAt = createdAt;
        state.chatThreads.set(thread.threadId, thread);
        return { ok: true, artifactId: `${thread.threadId}-writeback` };
      }
      if (target === 'doc') {
        const docId = packet.writeback.docId ?? `doc-${Date.now()}`;
        const current = state.docsDocuments.get(docId) ?? makeDocsDocument(docId, packet.writeback.docTitle ?? 'Task output', 'home');
        const versionId = `version-${Date.now()}`;
        state.docVersionSnapshots.set(versionId, JSON.parse(JSON.stringify(current)));
        const historyEntry: DocVersionSummary = {
          versionId,
          docId,
          createdAt: new Date().toISOString(),
          label: `Task update · ${todo.title}`,
          sourceTaskId: todoId,
          sourcePacketId: packet.packetId,
          preview: todo.publicSummary || todo.description,
        };
        state.docHistories.set(docId, [...(state.docHistories.get(docId) ?? []), historyEntry]);
        const nextDocument: DocsDocument = {
          ...current,
          updatedAt: new Date().toISOString(),
          preview: todo.publicSummary || todo.description,
          blocks: [
            ...current.blocks,
            { id: `${docId}-divider-${Date.now()}`, type: 'divider' },
            { id: `${docId}-heading-${Date.now()}`, type: 'heading', text: packet.writeback.docSectionHeading ?? 'Task update' },
            { id: `${docId}-paragraph-${Date.now()}`, type: 'paragraph', text: todo.publicSummary || todo.description },
          ],
        };
        state.docsDocuments.set(docId, nextDocument);
        state.contextPackets.set(todoId, {
          ...packet,
          writeback: {
            ...packet.writeback,
            docId,
            docTitle: nextDocument.title,
          },
        });
        return { ok: true, artifactId: versionId };
      }
      return { ok: true, artifactId: `${target}-${todoId}` };
    }),
    tasksUpdateMetadata: vi.fn(async (todoId: string, patch: { assigneeId?: string | null; listId?: string; boardColumnId?: string; following?: boolean; latestBrief?: { content: string; generatedAt: string; modelLabel: string } | null }) => {
      const current = state.workspace?.items.find((item) => item.todoId === todoId);
      if (!current || !state.workspace) {
        throw new Error(`missing workspace item for ${todoId}`);
      }
      const updated = {
        ...current,
        assignee:
          typeof patch.assigneeId === 'string' && patch.assigneeId
            ? state.workspace.assignees.find((assignee) => assignee.id === patch.assigneeId) ?? current.assignee
            : patch.assigneeId === null
              ? null
              : current.assignee,
        listId: typeof patch.listId === 'string' ? patch.listId : current.listId,
        boardColumnId: typeof patch.boardColumnId === 'string' ? patch.boardColumnId : current.boardColumnId,
        following: typeof patch.following === 'boolean' ? patch.following : current.following,
        latestBrief: Object.prototype.hasOwnProperty.call(patch, 'latestBrief') ? patch.latestBrief ?? null : current.latestBrief,
      };
      state.workspace = {
        ...state.workspace,
        items: state.workspace.items.map((item) => (item.todoId === todoId ? updated : item)),
      };
      return JSON.parse(JSON.stringify(updated));
    }),
    tasksUpdateWorkspacePrefs: vi.fn(async (patch: Partial<TasksWorkspace['prefs']>) => {
      if (!state.workspace) {
        throw new Error('missing workspace');
      }
      state.workspace = {
        ...state.workspace,
        prefs: {
          ...state.workspace.prefs,
          ...patch,
        },
      };
      return JSON.parse(JSON.stringify(state.workspace.prefs));
    }),
    tasksConnect: vi.fn(async () => ({ ok: true, needsBrowser: true })),
    tasksOpenPendingAuthorization: vi.fn(async () => ({ ok: true })),
    tasksSyncNow: vi.fn(async () => ({ ok: true, meetingCount: 0, fetchedAt: new Date().toISOString() })),
    tasksStart: vi.fn(async () => ({ ok: true })),
    tasksGetPlanningContext: vi.fn(async (todoId: string) => state.planningContexts.get(todoId) ?? makePlanningContext(todoId)),
    tasksGetPlanSuggestions: vi.fn(async (todoId: string) => {
      if (!state.planSuggestionDecks.has(todoId)) {
        state.planSuggestionDecks.set(todoId, makePlanSuggestions(todoId));
      }
      return JSON.parse(JSON.stringify(state.planSuggestionDecks.get(todoId)));
    }),
    tasksGetNextMoveSuggestions: vi.fn(async (todoId: string) => {
      if (!state.nextMoveSuggestionDecks.has(todoId)) {
        state.nextMoveSuggestionDecks.set(todoId, makeNextMoveSuggestions(todoId));
      }
      return JSON.parse(JSON.stringify(state.nextMoveSuggestionDecks.get(todoId)));
    }),
    tasksExecuteSuggestion: vi.fn(async (todoId: string, input: { phase: 'planning' | 'next_move'; actionId: string; editedInstruction?: string | null }) => {
      if (input.phase === 'planning') {
        const next = [...(state.threads.get(todoId) ?? [])];
        next.push({
          messageId: `exec-plan-${next.length + 1}`,
          todoId,
          runId: 'run-started',
          role: 'user',
          content: input.editedInstruction?.trim() || `Approved plan ${input.actionId}`,
          createdAt: new Date().toISOString(),
          streaming: false,
          statusTag: null,
        });
        state.threads.set(todoId, next);
        return { ok: true, queued: false, runId: 'run-started' };
      }
      const next = [...(state.threads.get(todoId) ?? [])];
      next.push({
        messageId: `exec-next-${next.length + 1}`,
        todoId,
        runId: null,
        role: 'user',
        content: input.editedInstruction?.trim() || `Executed ${input.actionId}`,
        createdAt: new Date().toISOString(),
        streaming: false,
        statusTag: null,
      });
      state.threads.set(todoId, next);
      return { ok: true, queued: false };
    }),
    tasksPlanMessage: vi.fn(async (todoId: string, instruction: string) => {
      const guidance = instruction.trim() || 'Generate a concise task plan.';
      const plan = makePlanDraft(todoId, guidance);
      state.latestPlans.set(todoId, plan);
      state.planSuggestionDecks.set(todoId, {
        todoId,
        phase: 'planning',
        generatedAt: plan.generatedAt,
        source: 'ai',
        actions: plan.options.map((option) => ({
          id: option.id,
          phase: 'planning',
          label: option.title,
          summary: option.summary,
          instruction: option.launchInstruction,
          recommended: option.recommended,
          actionMode: 'start',
          editable: true,
          steps: option.steps,
          reason: option.why,
        })),
      });
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
    aiGetStatus: vi.fn(async () => JSON.parse(JSON.stringify(state.aiStatus))),
    aiConnect: vi.fn(async () => {
      state.aiStatus = {
        ...state.aiStatus,
        state: 'connected',
        connected: true,
        profileId: 'openai-codex:test',
        reason: null,
      };
      return { ok: true, launchedInteractive: true };
    }),
    aiDisconnect: vi.fn(async () => {
      state.aiStatus = {
        ...state.aiStatus,
        state: 'disconnected',
        connected: false,
        profileId: null,
        reason: 'Disconnected for test.',
      };
      return { ok: true };
    }),
    aiGenerate: vi.fn(async () => ({
      ok: true,
      runId: 'ai-run-1',
      content: '## Goal\n\n- Move this task forward\n\n## Current Context\n\n- Generated from mock state.',
      message: 'Completed.',
      modelLabel: 'Codex / Auto',
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
    makeContextPacket,
    makeDocsDocument,
    makeDocsHome,
    makeWorkspace,
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

  async function openTasksWorkspace(
    user = userEvent.setup(),
    options: { openDetail?: boolean; taskTitle?: string } = { openDetail: true, taskTitle: 'Research top CRM vendors' },
  ) {
    await user.click(screen.getByRole('button', { name: 'Tasks' }));
    await screen.findByLabelText('Tasks workspace');
    await screen.findByRole('heading', { name: 'Tasks' });
    if (options.openDetail ?? true) {
      await user.click(clickTaskRow(options.taskTitle ?? 'Research top CRM vendors'));
      await screen.findByRole('complementary', { name: 'Task detail' });
      await screen.findByRole('button', { name: /Start Task/i });
    }
    return user;
  }

  function clickTaskRow(title: string) {
    const row = screen
      .getAllByText(title)
      .map((node) => node.closest('button'))
      .find((node): node is HTMLButtonElement => Boolean(node));

    if (!row) {
      throw new Error(`Unable to find task row for ${title}`);
    }

    return row;
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
    state.workspace = makeWorkspace(state.feed);
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
    state.planSuggestionDecks = new Map<string, TaskSuggestionDeck>();
    state.nextMoveSuggestionDecks = new Map<string, TaskSuggestionDeck>();
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
    state.contextPackets = new Map<string, ContextPacket>([
      ['todo-1', makeContextPacket('todo-1')],
      [
        'todo-2',
        makeContextPacket('todo-2', {
          preview: {
            summary: 'Context packet pulled from prospecting strategy.',
            stats: ['Using 1 source', 'Ready for write-back'],
            excerpt: 'Prioritize high-intent targets and capture next actions.',
          },
          writeback: {
            chatThreadId: 'chat-2',
            docId: 'doc-3',
            docTitle: 'Weekly Brief March 21',
            docSectionHeading: 'Task update',
          },
        }),
      ],
    ]);
    state.docHistories = new Map<string, DocVersionSummary[]>();
    state.docVersionSnapshots = new Map<string, DocsDocument>();
    state.aiStatus = {
      profile: 'ironclaw',
      state: 'connected',
      connected: true,
      profileId: 'openai-codex:test',
      expiresAt: null,
      remainingMs: null,
      reason: null,
      gatewayState: 'connected',
      gatewayUrl: 'ws://127.0.0.1:19789',
      dashboardUrl: 'http://127.0.0.1:19789/#token=test',
      modelLabel: 'Codex / Auto',
      lastCheckedAt: '2026-02-28T10:01:00.000Z',
    };
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

    await user.click(await screen.findByRole('button', { name: /List recent todos/i }));
    await screen.findByLabelText('Tasks workspace');

    expect(screen.getByText('Research top CRM vendors')).toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'Task detail' })).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /(Connect|Sync) Granola/i })).toHaveLength(1);
    });
  }, 10000);

  it('opens Tasks copilot from the sidebar tasks item on home', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Tasks' }));

    await screen.findByRole('heading', { name: 'Tasks' });
    expect(screen.getByLabelText('Tasks workspace')).toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'Task detail' })).not.toBeInTheDocument();
    expect(document.querySelector('.granola-sidebar')).toHaveClass('granola-sidebar');
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
    await waitFor(() => {
      expect(state.subscriber).not.toBeNull();
    });

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

    await waitFor(() => {
      expect(granolaClientMock.homeGetFeed).toHaveBeenCalledTimes(2);
    }, { timeout: 2000 });
    expect(await screen.findByText('Freshly synced note')).toBeInTheDocument();
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

  it('creates a task from a seeded team-thread message with bounded chat context', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Chat' }));
    await user.click(await screen.findByRole('button', { name: /#launch-war-room/i }));
    await screen.findByRole('region', { name: /Team thread #launch-war-room/i });

    await user.click(screen.getAllByRole('button', { name: /Create task from Laura's message/i })[0] as HTMLButtonElement);
    const createTaskDialog = await screen.findByRole('dialog', { name: /Create task from team thread/i });
    expect(createTaskDialog).toBeInTheDocument();
    await user.click(within(createTaskDialog).getByRole('button', { name: /^Create task$/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksCreateFromContext).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: 'chat_selection',
          chatSelection: expect.objectContaining({
            threadId: 'team-thread:team-channel-launch-war-room',
            threadTitle: '#launch-war-room',
            mode: 'message',
            messages: expect.arrayContaining([
              expect.objectContaining({
                author: 'Laura',
              }),
            ]),
          }),
          writeback: {
            chatThreadId: 'team-thread:team-channel-launch-war-room',
          },
        }),
      );
    });
    expect(await screen.findByRole('heading', { name: 'Tasks' })).toBeInTheDocument();
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
  }, 10000);

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
  }, 10000);

  it('posts task write-back into the linked team discussion without using the backend chat write-back path', async () => {
    const user = userEvent.setup();
    state.contextPackets.set(
      'todo-2',
      makeContextPacket('todo-2', {
        origin: 'chat_selection',
        sources: [
          {
            kind: 'chat',
            threadId: 'team-thread:team-channel-launch-war-room',
            threadTitle: '#launch-war-room',
            anchorMessageId: 'launch-5',
            messageIds: ['launch-1', 'launch-2', 'launch-3', 'launch-4', 'launch-5'],
            mode: 'thread',
            label: '#launch-war-room',
            excerpt: 'Laura asked for the final deck once the narrative is locked.',
            citation: 'Chat · #launch-war-room',
          },
        ],
        preview: {
          summary: 'Launch-room chat context connected to this task.',
          stats: ['Using 5 messages'],
          excerpt: 'Laura asked for the final deck once the narrative is locked.',
        },
        writeback: {
          chatThreadId: 'team-thread:team-channel-launch-war-room',
          docId: null,
          docTitle: null,
          docSectionHeading: null,
        },
      }),
    );

    render(<App />);
    await openTasksWorkspace(user, { taskTitle: 'Build outreach lead list' });

    await user.click(screen.getByRole('button', { name: /Post to chat/i }));

    expect(granolaClientMock.tasksWriteBack).not.toHaveBeenCalledWith('todo-2', 'chat');

    await user.click(screen.getByRole('button', { name: 'Chat' }));
    await user.click(await screen.findByRole('button', { name: /#launch-war-room/i }));
    expect(await screen.findByText(/Task update: Build outreach lead list/i)).toBeInTheDocument();
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

    await user.click(screen.getByRole('button', { name: /Start Task/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksStart).toHaveBeenCalledWith('todo-1');
    });
    expect(screen.getByText('Execution timeline')).toBeInTheDocument();
  });

  it('renders tasks as a two-column workspace by default and opens detail on selection', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user, { openDetail: false });

    expect(screen.queryByRole('complementary', { name: 'Task detail' })).not.toBeInTheDocument();

    await user.click(clickTaskRow('Research top CRM vendors'));

    expect(await screen.findByRole('complementary', { name: 'Task detail' })).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'Task detail tabs' })).toBeInTheDocument();
  });

  it('closes the task detail pane and returns to the two-column workspace', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user);

    await user.click(screen.getByRole('button', { name: /Back to all tasks/i }));

    await waitFor(() => {
      expect(screen.queryByRole('complementary', { name: 'Task detail' })).not.toBeInTheDocument();
    });
  });

  it('defaults to the plan tab for a pre-start task and activity for a threaded task', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', []);
    render(<App />);
    await openTasksWorkspace(user, { taskTitle: 'Research top CRM vendors' });

    expect(screen.getByRole('tab', { name: 'Plan', selected: true })).toBeInTheDocument();
    expect(screen.getByText('Start options')).toBeInTheDocument();
    expect(screen.queryByText('Planner')).not.toBeInTheDocument();

    await user.click(clickTaskRow('Build outreach lead list'));

    expect(await screen.findByRole('tab', { name: 'Activity', selected: true })).toBeInTheDocument();
    expect(screen.getByText('Execution timeline')).toBeInTheDocument();
  });

  it('sends chat messages in selected task thread', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user, { taskTitle: 'Build outreach lead list' });

    const composer = await screen.findByPlaceholderText(/Message task copilot/i);
    await user.type(composer, 'Continue with competitor research');
    await user.click(screen.getByRole('button', { name: /^Send$/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksSendMessage).toHaveBeenCalledWith('todo-2', 'Continue with competitor research');
    });
  });

  it('runs dynamic next moves through the suggestion execution API', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user, { taskTitle: 'Build outreach lead list' });

    const draftArticle = screen.getByText('Draft follow-up', { selector: 'strong' }).closest('article');
    expect(draftArticle).toBeTruthy();
    await user.click(within(draftArticle as HTMLElement).getByRole('button', { name: /Run Draft follow-up/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksExecuteSuggestion).toHaveBeenCalledWith(
        'todo-2',
        expect.objectContaining({
          phase: 'next_move',
          actionId: 'next-draft',
        }),
      );
    });
  });

  it('lets you edit a next move before executing it', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user, { taskTitle: 'Build outreach lead list' });

    await user.click(screen.getByRole('button', { name: /Edit Refine recommendations/i }));
    const editor = screen.getByDisplayValue(
      'Refine the strongest ideas into a cleaner recommendation set with sharper tradeoffs.',
    );
    await user.clear(editor);
    await user.type(editor, 'Send the outreach now with a warmer tone.');
    await user.click(screen.getByRole('button', { name: /Run edited/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksExecuteSuggestion).toHaveBeenCalledWith(
        'todo-2',
        expect.objectContaining({
          phase: 'next_move',
          actionId: 'next-refine',
          editedInstruction: 'Send the outreach now with a warmer tone.',
        }),
      );
    });
  });

  it('shows auto-loaded start options instead of the old planner chrome', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', []);
    render(<App />);
    await openTasksWorkspace(user);

    expect(await screen.findByText('Start options')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Plan task/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Research operator/i })).not.toBeInTheDocument();
    expect(screen.getByText('Fast path execution')).toBeInTheDocument();
    expect(screen.getAllByText(/^Recommended$/i, { selector: 'span' }).length).toBeGreaterThan(0);
  });

  it('uses planning API (not execution send) from composer while pre-start planning is active', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', []);
    render(<App />);
    await openTasksWorkspace(user);

    const composer = await screen.findByPlaceholderText(/Ask for different start options/i);
    await user.type(composer, 'Prioritize speed and include links');
    await user.click(screen.getByRole('button', { name: /^Refresh ideas$/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksPlanMessage).toHaveBeenCalledWith('todo-1', 'Prioritize speed and include links');
    });
    expect(granolaClientMock.tasksSendMessage).not.toHaveBeenCalled();
  });

  it('executes a planning suggestion directly from the start options card', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', []);
    render(<App />);
    await openTasksWorkspace(user);

    const fastPathArticle = screen.getByText('Fast path execution', { selector: 'strong' }).closest('article');
    expect(fastPathArticle).toBeTruthy();
    await user.click(
      within(fastPathArticle as HTMLElement).getByRole('button', {
        name: /Run Fast path execution/i,
      }),
    );

    await waitFor(() => {
      expect(granolaClientMock.tasksExecuteSuggestion).toHaveBeenCalledWith(
        'todo-1',
        expect.objectContaining({
          phase: 'planning',
          actionId: 'option-1',
        }),
      );
    });
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Activity', selected: true })).toBeInTheDocument();
    });
  });

  it('lets you edit a planning suggestion before executing it', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', []);
    render(<App />);
    await openTasksWorkspace(user);

    await user.click(screen.getByRole('button', { name: /Edit Fast path execution/i }));
    const editor = screen.getByDisplayValue(
      'Start with a focused fast path, collect key evidence, and draft concise recommendations.',
    );
    await user.clear(editor);
    await user.type(editor, 'Focus on enterprise CRM players first.');
    await user.click(screen.getByRole('button', { name: /Run edited/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksExecuteSuggestion).toHaveBeenCalledWith(
        'todo-1',
        expect.objectContaining({
          phase: 'planning',
          actionId: 'option-1',
          editedInstruction: 'Focus on enterprise CRM players first.',
        }),
      );
    });
  });

  it('refreshes start options from the composer for pre-start tasks', async () => {
    const user = userEvent.setup();
    state.threads.set('todo-1', []);
    render(<App />);
    await openTasksWorkspace(user);

    const composer = await screen.findByPlaceholderText(/Ask for different start options/i);
    await user.type(composer, 'Bias toward a concise competitive analysis.');
    await user.click(screen.getByRole('button', { name: /^Refresh ideas$/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksPlanMessage).toHaveBeenCalledWith('todo-1', 'Bias toward a concise competitive analysis.');
    });
  });

  it('switches selected tasks and loads their threads', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user);

    await user.click(clickTaskRow('Build outreach lead list'));

    await waitFor(() => {
      expect(granolaClientMock.tasksGetThread).toHaveBeenCalledWith('todo-2', null, 40);
    });
  });

  it('renders assistant markdown and links in chat view', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user, { taskTitle: 'Build outreach lead list' });

    const link = await screen.findByRole('link', { name: /CRM docs/i });
    expect(link).toHaveAttribute('href', 'https://example.com/crm');
    expect(screen.getByText(/Compare pricing/i)).toBeInTheDocument();
  });

  it('enters focus mode to expand the execution view without leaving the drawer', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user, { taskTitle: 'Build outreach lead list' });

    await user.click(screen.getByRole('button', { name: /Enter focus mode/i }));

    expect(await screen.findByRole('button', { name: /Show next moves/i })).toBeInTheDocument();
    expect(screen.queryByText('These suggestions adapt to the latest task state and run output.')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Show next moves/i }));
    expect(await screen.findByText('These suggestions adapt to the latest task state and run output.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Exit focus mode/i })).toBeInTheDocument();
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

    expect(await screen.findByText('Run started')).toBeInTheDocument();
    expect(screen.getByText('Thinking through the approach')).toBeInTheDocument();
    expect(screen.getByText('Starting web search')).toBeInTheDocument();
    expect(screen.getByText('Fetched example.com')).toBeInTheDocument();
    expect(screen.getByText(/Vendor shortlist ready/i)).toBeInTheDocument();
    expect(screen.queryByText(/\"query\"/i)).not.toBeInTheDocument();

    for (const button of screen.getAllByRole('button', { name: /Show details/i })) {
      await user.click(button as HTMLButtonElement);
    }
    expect(screen.getByText(/\"query\"/i)).toBeInTheDocument();
  });

  it('hides raw streaming assistant text while selected task is actively running', async () => {
    const user = userEvent.setup();
    state.feed.activeRunTodoId = 'todo-1';
    state.workspace = makeWorkspace(state.feed);
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

  it('switches the task workspace to kanban and creates a Codex-backed brief', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openTasksWorkspace(user);

    const workspace = screen.getByLabelText('Tasks workspace');
    await user.click(within(workspace).getByRole('button', { name: /Kanban/i }));

    await waitFor(() => {
      expect(granolaClientMock.tasksUpdateWorkspacePrefs).toHaveBeenCalledWith({ viewMode: 'kanban' });
    });
    await waitFor(() => {
      expect(screen.getAllByText('Inbox').length).toBeGreaterThan(0);
    });

    await user.click(screen.getByRole('tab', { name: 'AI Brief' }));
    await user.click(screen.getByRole('button', { name: /Create brief/i }));

    await waitFor(() => {
      expect(granolaClientMock.aiGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'task-brief',
          sessionKey: 'task-brief:todo-1',
        }),
      );
    });
    expect(await screen.findByText(/Move this task forward/i)).toBeInTheDocument();
  });

  it('renders global AI settings and supports reconnect/disconnect actions', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'AI' }));

    expect(await screen.findByRole('heading', { name: 'AI' })).toBeInTheDocument();
    expect(screen.getAllByText(/openai-codex/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Codex / Auto').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /Reconnect Codex/i }));
    await waitFor(() => {
      expect(granolaClientMock.aiConnect).toHaveBeenCalled();
    });

    await user.click(screen.getByRole('button', { name: /^Disconnect$/i }));
    await waitFor(() => {
      expect(granolaClientMock.aiDisconnect).toHaveBeenCalled();
    });
  });
});
