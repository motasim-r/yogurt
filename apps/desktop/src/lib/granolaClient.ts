import { mockNotes, mockSettings } from '../shared/mockData';
import type {
  AppInfo,
  AppSettings,
  AppSettingsPatch,
  CodexAIActionInput,
  CodexAIActionResult,
  CodexAIStatus,
  DocsBlock,
  DocsCreateInput,
  DocsDocument,
  DocsHome,
  DocsTemplate,
  DocsUpdatePatch,
  GranolaAPI,
  GranolaChatHome,
  GranolaChatMessage,
  GranolaChatRecipe,
  GranolaChatThread,
  HomeFeed,
  HomeNoteDetail,
  Note,
  NoteSummary,
  NoteUpdatePatch,
  TaskMetadataPatch,
  TaskWorkspaceItem,
  TaskWorkspacePrefs,
  TaskWorkspacePrefsPatch,
  TasksWorkspace,
  TasksRealtimeEvent,
  WindowCommand,
} from '../shared/types';

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createBrowserDocsBlock(type: DocsBlock['type'], text = ''): DocsBlock {
  const id = `${type}-${Math.random().toString(16).slice(2, 10)}`;
  if (type === 'divider') {
    return { id, type: 'divider' };
  }
  if (type === 'checklist') {
    return { id, type: 'checklist', text, checked: false };
  }
  return { id, type, text };
}

const browserDocsTemplates: DocsTemplate[] = [
  {
    templateId: 'browser-template-campaign-plan',
    label: 'Campaign Plan',
    description: 'Launch-ready goals, narrative, and workback.',
    section: 'home',
    iconTone: 'blue',
    blocks: [
      createBrowserDocsBlock('heading', 'Campaign objective'),
      createBrowserDocsBlock('paragraph', 'Define the one thing this launch needs to move.'),
      createBrowserDocsBlock('bullet', 'Lock narrative'),
      createBrowserDocsBlock('bullet', 'Align proof points'),
    ],
  },
  {
    templateId: 'browser-template-weekly-brief',
    label: 'Weekly Brief',
    description: 'Summarize the week, risks, and next actions.',
    section: 'drive',
    iconTone: 'amber',
    blocks: [
      createBrowserDocsBlock('heading', 'Wins'),
      createBrowserDocsBlock('bullet', 'Top outcome'),
      createBrowserDocsBlock('heading', 'Risks'),
      createBrowserDocsBlock('callout', 'What still needs attention'),
    ],
  },
];

function browserDocLocationLabel(section: DocsDocument['section']): string {
  switch (section) {
    case 'drive':
      return 'Drive / Operating Docs';
    case 'wiki':
      return 'Pinned Wiki';
    default:
      return 'My Document Library';
  }
}

function browserDocBreadcrumbs(section: DocsDocument['section']): string[] {
  switch (section) {
    case 'drive':
      return ['Docs', 'Drive'];
    case 'wiki':
      return ['Docs', 'Wiki'];
    default:
      return ['Docs', 'Home'];
  }
}

function browserDocPreview(blocks: DocsBlock[]): string {
  for (const block of blocks) {
    if ('text' in block) {
      const normalized = block.text.replace(/\s+/g, ' ').trim();
      if (normalized) {
        return normalized.slice(0, 120);
      }
    }
  }
  return 'Empty document';
}

function browserDocRecentLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return value;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function makeBrowserDoc(input: Omit<DocsDocument, 'locationLabel' | 'recentLabel' | 'preview' | 'breadcrumbs'>): DocsDocument {
  return {
    ...input,
    locationLabel: browserDocLocationLabel(input.section),
    recentLabel: browserDocRecentLabel(input.updatedAt),
    preview: browserDocPreview(input.blocks),
    breadcrumbs: browserDocBreadcrumbs(input.section),
  };
}

const localState: {
  notes: Note[];
  settings: AppSettings;
  chatRecipes: GranolaChatRecipe[];
  chatThreads: GranolaChatThread[];
  docsTemplates: DocsTemplate[];
  docsDocuments: DocsDocument[];
} = {
  notes: deepClone(mockNotes),
  settings: deepClone(mockSettings),
  chatRecipes: [
    {
      id: 'browser-list-recent-todos',
      label: 'List recent todos',
      description: 'Extracts and displays your recent action items.',
      instructions: 'List my recent action items from meetings.',
      creatorLabel: 'Granola',
    },
    {
      id: 'browser-coach-me-matt',
      label: 'Coach me Matt',
      description: 'Delivers leadership coaching based on recent meetings.',
      instructions: 'Coach me using my recent meetings.',
      creatorLabel: 'Matt Mochary',
    },
    {
      id: 'browser-weekly-recap',
      label: 'Write weekly recap',
      description: 'Summarizes the current week.',
      instructions: 'Write my weekly recap.',
      creatorLabel: 'Granola',
    },
  ],
  chatThreads: [
    {
      threadId: 'browser-thread-1',
      title: 'Demo with Joshim then Fix VectorHaul No Shows',
      scope: 'all_meetings',
      updatedAt: new Date(Date.now() - 3 * 60_000).toISOString(),
      messages: [
        {
          messageId: 'browser-message-1',
          threadId: 'browser-thread-1',
          role: 'user',
          content: 'what do i need to focus on now',
          createdAt: new Date(Date.now() - 3 * 60_000).toISOString(),
          status: 'completed',
          thoughtDurationSeconds: null,
        },
        {
          messageId: 'browser-message-2',
          threadId: 'browser-thread-1',
          role: 'assistant',
          content: '## Immediate focus\n\n- Prepare for your next meeting\n- Follow up on your highest-risk project',
          createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
          status: 'completed',
          thoughtDurationSeconds: 3,
        },
      ],
    },
  ],
  docsTemplates: deepClone(browserDocsTemplates),
  docsDocuments: [
    makeBrowserDoc({
      docId: 'browser-doc-1',
      title: 'Campaign Plan',
      section: 'home',
      ownerLabel: 'Motasim Rahmar',
      createdAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
      updatedAt: new Date(Date.now() - 45 * 60_000).toISOString(),
      favorite: true,
      shared: false,
      pinned: false,
      iconTone: 'blue',
      blocks: [
        createBrowserDocsBlock('heading', 'Launch target'),
        createBrowserDocsBlock('paragraph', 'Shape the launch story around conversion lift.'),
        createBrowserDocsBlock('bullet', 'Tighten hero message'),
      ],
    }),
    makeBrowserDoc({
      docId: 'browser-doc-2',
      title: 'Ops Wiki',
      section: 'wiki',
      ownerLabel: 'Laura Bennett',
      createdAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
      favorite: false,
      shared: true,
      pinned: true,
      iconTone: 'violet',
      blocks: [
        createBrowserDocsBlock('heading', 'Escalation loop'),
        createBrowserDocsBlock('paragraph', 'Capture how launch issues move across teams.'),
      ],
    }),
  ],
};

function ensureWindowCommand(command: WindowCommand): void {
  if (!['minimize', 'maximize', 'close'].includes(command)) {
    throw new Error(`invalid window command: ${String(command)}`);
  }
}

function formatHomeGroupLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return 'Recent';
  }

  const today = new Date();
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  if (sameDay) {
    return 'Today';
  }

  const options: Intl.DateTimeFormatOptions =
    date.getFullYear() === today.getFullYear()
      ? { weekday: 'short', month: 'short', day: 'numeric' }
      : { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatHomeTimeLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return '--:--';
  }
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
}

function formatCompactRelativeTime(value: string): string {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    return '';
  }
  const diffMs = Math.max(0, Date.now() - parsed);
  if (diffMs < 60 * 60_000) {
    return `${Math.max(1, Math.round(diffMs / 60_000))}m`;
  }
  if (diffMs < 24 * 60 * 60_000) {
    return `${Math.max(1, Math.round(diffMs / (60 * 60_000)))}h`;
  }
  return `${Math.max(1, Math.round(diffMs / (24 * 60 * 60_000)))}d`;
}

function browserHomeFeed(): HomeFeed {
  const recentNotes = [...localState.notes]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .map((note) => ({
      id: note.id,
      title: note.title,
      ownerLabel: note.ownerLabel,
      groupLabel: formatHomeGroupLabel(note.updatedAt),
      timeLabel: formatHomeTimeLabel(note.updatedAt),
      visibility: note.visibility,
    }));

  return {
    recentNotes,
    upcomingMeeting: null,
    lastSyncAt: null,
    syncInFlight: false,
    connectionState: 'disconnected',
    warning: null,
    warningDetails: [],
  };
}

function browserChatHome(): GranolaChatHome {
  const recentThreads = [...localState.chatThreads]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .map((thread) => ({
      threadId: thread.threadId,
      title: thread.title,
      updatedAt: thread.updatedAt,
      timeLabel: formatCompactRelativeTime(thread.updatedAt),
    }));

  return {
    connectionState: 'disconnected',
    lastSyncAt: null,
    warning: null,
    warningDetails: [],
    recipes: deepClone(localState.chatRecipes),
    recentThreads,
    defaultScope: 'all_meetings',
    modelLabel: 'Auto',
  };
}

function browserDocsHome(): DocsHome {
  return {
    workspaceTitle: 'Docs',
    sections: [
      { id: 'home', label: 'Home', description: 'Your recent and owned docs', itemCount: localState.docsDocuments.length },
      {
        id: 'drive',
        label: 'Drive',
        description: 'Structured operating docs',
        itemCount: localState.docsDocuments.filter((document) => document.section === 'drive').length,
      },
      {
        id: 'wiki',
        label: 'Wiki',
        description: 'Pinned references and spaces',
        itemCount: localState.docsDocuments.filter((document) => document.section === 'wiki').length,
      },
    ],
    quickActions: [
      { id: 'new', label: 'New', description: 'Create a new document', enabled: true },
      { id: 'upload', label: 'Upload', description: 'Upload local files', enabled: false },
      { id: 'templates', label: 'Templates', description: 'Go to template gallery', enabled: true },
    ],
    templates: deepClone(localState.docsTemplates),
    displayMode: 'list',
    documents: localState.docsDocuments
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
  };
}

const browserFallback: GranolaAPI = {
  async getAppInfo(): Promise<AppInfo> {
    return {
      version: '0.1.0-browser-fallback',
      platform: 'browser',
    };
  },
  async windowCommand(command): Promise<void> {
    ensureWindowCommand(command);
  },
  async notesList(): Promise<NoteSummary[]> {
    return localState.notes
      .map((note) => ({
        id: note.id,
        title: note.title,
        updatedAt: note.updatedAt,
        timeLabel: note.timeLabel,
        groupLabel: note.groupLabel,
        ownerLabel: note.ownerLabel,
        visibility: note.visibility,
        attendeeCount: note.attendeeCount,
        tags: [...note.tags],
      }))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  },
  async noteGet(id): Promise<Note> {
    const note = localState.notes.find((candidate) => candidate.id === id);
    if (!note) {
      throw new Error(`note not found: ${id}`);
    }
    return deepClone(note);
  },
  async noteUpdate(id, patch: NoteUpdatePatch): Promise<Note> {
    const note = localState.notes.find((candidate) => candidate.id === id);
    if (!note) {
      throw new Error(`note not found: ${id}`);
    }

    if (typeof patch.title === 'string' && patch.title.trim().length > 0) {
      note.title = patch.title.trim();
    }

    if (typeof patch.body === 'string' && patch.body.trim().length > 0) {
      note.body = patch.body.trim();
    }

    if (Array.isArray(patch.tags)) {
      note.tags = patch.tags.filter((tag) => typeof tag === 'string' && tag.trim().length > 0);
    }

    if (patch.status === 'draft' || patch.status === 'final') {
      note.status = patch.status;
    }

    note.updatedAt = new Date().toISOString();
    return deepClone(note);
  },
  async settingsGet(): Promise<AppSettings> {
    return deepClone(localState.settings);
  },
  async settingsUpdate(patch: AppSettingsPatch): Promise<AppSettings> {
    localState.settings = {
      ...localState.settings,
      ...patch,
    };
    return deepClone(localState.settings);
  },
  async homeGetFeed(): Promise<HomeFeed> {
    return deepClone(browserHomeFeed());
  },
  async homeGetNoteDetail(id: string): Promise<HomeNoteDetail> {
    const note = localState.notes.find((candidate) => candidate.id === id);
    if (!note) {
      throw new Error(`note not found: ${id}`);
    }

    return deepClone({
      id: note.id,
      meetingId: note.id,
      title: note.title,
      dateLabel: `${note.groupLabel} • ${note.timeLabel}`,
      ownerLabel: note.ownerLabel,
      body: note.body,
      shareUrl: `https://notes.granola.ai/t/${note.id}`,
    });
  },
  async chatGetHome(): Promise<GranolaChatHome> {
    return deepClone(browserChatHome());
  },
  async chatGetThread(threadId: string): Promise<GranolaChatThread> {
    const thread = localState.chatThreads.find((candidate) => candidate.threadId === threadId);
    if (!thread) {
      throw new Error(`chat thread not found: ${threadId}`);
    }
    return deepClone(thread);
  },
  async chatSendMessage(input): Promise<{
    ok: boolean;
    threadId: string;
    userMessage?: GranolaChatMessage;
    assistantMessage?: GranolaChatMessage;
    message?: string;
  }> {
    const threadId = typeof input.threadId === 'string' && input.threadId.trim() ? input.threadId.trim() : `thread-${Date.now()}`;
    const now = new Date().toISOString();
    const existing = localState.chatThreads.find((candidate) => candidate.threadId === threadId);
    const userMessage: GranolaChatMessage = {
      messageId: `user-${Date.now()}`,
      threadId,
      role: 'user',
      content: input.text,
      createdAt: now,
      status: 'completed',
      thoughtDurationSeconds: null,
    };
    const assistantMessage: GranolaChatMessage = {
      messageId: `assistant-${Date.now()}`,
      threadId,
      role: 'assistant',
      content: `## Browser fallback\n\n- Scope: ${input.scope}\n- Prompt: ${input.text}`,
      createdAt: new Date(Date.now() + 1000).toISOString(),
      status: 'completed',
      thoughtDurationSeconds: 1,
    };

    if (existing) {
      existing.messages.push(userMessage, assistantMessage);
      existing.updatedAt = assistantMessage.createdAt;
    } else {
      localState.chatThreads.unshift({
        threadId,
        title: input.text.trim() || 'New chat',
        scope: 'all_meetings',
        updatedAt: assistantMessage.createdAt,
        messages: [userMessage, assistantMessage],
      });
    }

    return deepClone({
      ok: true,
      threadId,
      userMessage,
      assistantMessage,
    });
  },
  async docsGetHome(): Promise<DocsHome> {
    return deepClone(browserDocsHome());
  },
  async docsGetDocument(docId: string): Promise<DocsDocument> {
    const document = localState.docsDocuments.find((candidate) => candidate.docId === docId);
    if (!document) {
      throw new Error(`document not found: ${docId}`);
    }
    return deepClone(document);
  },
  async docsCreate(input?: DocsCreateInput): Promise<DocsDocument> {
    const template =
      input?.templateId ? localState.docsTemplates.find((candidate) => candidate.templateId === input.templateId) ?? null : null;
    const section = input?.section === 'drive' || input?.section === 'wiki' || input?.section === 'home' ? input.section : template?.section ?? 'home';
    const now = new Date().toISOString();
    const document = makeBrowserDoc({
      docId: `browser-doc-${Date.now()}`,
      title: template?.label ?? 'Untitled document',
      section,
      ownerLabel: 'Motasim Rahmar',
      createdAt: now,
      updatedAt: now,
      favorite: false,
      shared: false,
      pinned: false,
      iconTone: template?.iconTone ?? 'blue',
      blocks: deepClone(template?.blocks ?? [createBrowserDocsBlock('paragraph', '')]),
    });
    localState.docsDocuments.unshift(document);
    return deepClone(document);
  },
  async docsUpdate(docId: string, patch: DocsUpdatePatch): Promise<DocsDocument> {
    const document = localState.docsDocuments.find((candidate) => candidate.docId === docId);
    if (!document) {
      throw new Error(`document not found: ${docId}`);
    }

    if (typeof patch.title === 'string' && patch.title.trim()) {
      document.title = patch.title.trim();
    }
    if (patch.section === 'home' || patch.section === 'drive' || patch.section === 'wiki') {
      document.section = patch.section;
    }
    if (typeof patch.favorite === 'boolean') {
      document.favorite = patch.favorite;
    }
    if (typeof patch.shared === 'boolean') {
      document.shared = patch.shared;
    }
    if (typeof patch.pinned === 'boolean') {
      document.pinned = patch.pinned;
    }
    if (
      patch.iconTone === 'blue' ||
      patch.iconTone === 'green' ||
      patch.iconTone === 'amber' ||
      patch.iconTone === 'violet' ||
      patch.iconTone === 'rose' ||
      patch.iconTone === 'slate'
    ) {
      document.iconTone = patch.iconTone;
    }
    if (Array.isArray(patch.blocks)) {
      document.blocks = deepClone(patch.blocks);
    }

    document.updatedAt = new Date().toISOString();
    document.locationLabel = browserDocLocationLabel(document.section);
    document.recentLabel = browserDocRecentLabel(document.updatedAt);
    document.preview = browserDocPreview(document.blocks);
    document.breadcrumbs = browserDocBreadcrumbs(document.section);
    return deepClone(document);
  },
  async tasksGetFeed() {
    return {
      connectionState: 'disconnected',
      auth: {
        authenticated: false,
        pendingAuthorization: false,
        pendingAuthorizationUrl: null,
        pendingStartedAt: null,
        pendingExpiresAt: null,
        lastAuthAt: null,
        lastAuthError: null,
        lastAuthStage: 'idle',
        lastAuthHttpStatus: null,
        lastAuthErrorCode: null,
        tokenSavedAt: null,
        tokenExpiresAt: null,
        tokenIdentity: null,
      },
      executor: {
        state: 'disconnected',
        profile: 'ironclaw',
        gatewayUrl: null,
        dashboardUrl: null,
        lastCheckedAt: null,
        lastError: null,
      },
      runtime: {
        ironclawProfile: 'ironclaw',
        ironclawVersion: null,
        gatewayUrl: null,
        dashboardUrl: null,
        dataImportedAt: null,
        canonicalProjectPath: '',
      },
      syncInFlight: false,
      executionEnabled: false,
      guardrailMode: 'workspace_only',
      uiRefreshMs: 5000,
      todos: [],
      counts: {
        discovered: 0,
        approved: 0,
        queued: 0,
        submitting: 0,
        submitted: 0,
        failed: 0,
        cancelled: 0,
      },
      guardrailBlockedCount: 0,
      lastSyncAt: null,
      lastSyncError: null,
      syncHealth: 'healthy',
      nextAutoSyncAt: null,
      cooldownUntil: null,
      lastExtractionAt: null,
      lastExtractionError: null,
      lastSubmissionAt: null,
      warning: null,
      warningDetails: [],
      activeRunTodoId: null,
      queuedRunCount: 0,
      selectedTodoIdHint: null,
    };
  },
  async tasksGetWorkspace(): Promise<TasksWorkspace> {
    return {
      sections: [
        { id: 'all', label: 'All', description: 'Every extracted task', itemCount: 0 },
        { id: 'assigned', label: 'Assigned', description: 'Tasks with an owner', itemCount: 0 },
        { id: 'running', label: 'Running', description: 'Tasks with active execution', itemCount: 0 },
        { id: 'completed', label: 'Completed', description: 'Completed execution history', itemCount: 0 },
        { id: 'activity', label: 'Activity', description: 'Recent task movement', itemCount: 0 },
      ],
      lists: [{ id: 'granola-feed', label: 'Granola feed', itemCount: 0, kind: 'inbox' }],
      boardColumns: [
        { id: 'inbox', label: 'Inbox', itemCount: 0 },
        { id: 'ready', label: 'Ready', itemCount: 0 },
        { id: 'running', label: 'Running', itemCount: 0 },
        { id: 'done', label: 'Done', itemCount: 0 },
        { id: 'blocked', label: 'Blocked', itemCount: 0 },
      ],
      assignees: [],
      prefs: {
        viewMode: 'list',
        groupBy: 'board',
        sortBy: 'updated',
      },
      items: [],
      selectedTodoIdHint: null,
    };
  },
  async tasksUpdateMetadata(todoId: string, patch: TaskMetadataPatch): Promise<TaskWorkspaceItem> {
    throw new Error(`Task workspace metadata is only available in Electron runtime (${todoId} ${JSON.stringify(patch)}).`);
  },
  async tasksUpdateWorkspacePrefs(_patch: TaskWorkspacePrefsPatch): Promise<TaskWorkspacePrefs> {
    return {
      viewMode: 'list',
      groupBy: 'board',
      sortBy: 'updated',
    };
  },
  async tasksConnect() {
    return {
      ok: false,
      needsBrowser: false,
      message: 'Granola task service is only available in Electron runtime.',
    };
  },
  async tasksOpenPendingAuthorization() {
    return {
      ok: false,
      message: 'Granola task service is only available in Electron runtime.',
    };
  },
  async tasksSyncNow() {
    return {
      ok: false,
      meetingCount: 0,
      fetchedAt: new Date().toISOString(),
      warning: 'Granola task service is only available in Electron runtime.',
    };
  },
  async tasksGetPlanningContext(todoId: string) {
    const now = new Date().toISOString();
    return {
      todoId,
      generatedAt: now,
      sections: [
        {
          id: 'granola' as const,
          title: 'Granola context',
          bullets: ['Task context is only available in Electron runtime.'],
        },
        {
          id: 'planner' as const,
          title: 'Planner context',
          bullets: ['AI planning is only available in Electron runtime.'],
        },
        {
          id: 'ironclaw' as const,
          title: 'IronClaw runtime',
          bullets: ['Runtime status is only available in Electron runtime.'],
        },
      ],
    };
  },
  async tasksPlanMessage(todoId: string, instruction: string) {
    const now = new Date().toISOString();
    const guidanceUsed = instruction.trim() || 'Generate the best task plan.';
    return {
      ok: true,
      plan: {
        draftId: `draft-${todoId}`,
        todoId,
        generatedAt: now,
        options: [
          {
            id: 'option-1',
            title: 'Fast research pass',
            summary: 'Collect top findings quickly, then refine.',
            steps: ['Scan primary sources', 'Capture key findings', 'Flag gaps for follow-up'],
            why: 'Best for speed when context is limited.',
            recommended: true,
          },
          {
            id: 'option-2',
            title: 'Deep evidence-first pass',
            summary: 'Validate each claim with stronger references.',
            steps: ['Map claims to sources', 'Verify assumptions', 'Draft structured output'],
            why: 'Best when quality and defensibility matter most.',
            recommended: false,
          },
        ],
        recommendedOptionId: 'option-1',
        guidanceUsed,
      },
      message: 'Generated fallback planning options in browser runtime.',
    };
  },
  async tasksStart(_todoId: string, _options) {
    return {
      ok: false,
      message: 'Task execution is only available in Electron runtime.',
    };
  },
  async tasksGetThread(todoId: string) {
    return {
      todoId,
      messages: [],
      nextCursor: null,
      hasMore: false,
      loadedAt: new Date().toISOString(),
    };
  },
  async tasksSendMessage() {
    return {
      ok: false,
      queued: false,
      message: 'Task execution is only available in Electron runtime.',
    };
  },
  async tasksCancelActiveRun() {
    return {
      ok: false,
      message: 'Task execution is only available in Electron runtime.',
    };
  },
  async tasksClearThread() {
    return {
      ok: false,
      message: 'Task execution is only available in Electron runtime.',
    };
  },
  async tasksExecutorReconnect() {
    return {
      ok: false,
      message: 'Task execution is only available in Electron runtime.',
    };
  },
  async tasksOpenRun() {
    return {
      ok: false,
      message: 'Task execution is only available in Electron runtime.',
    };
  },
  async tasksRuntimeCheck() {
    return {
      ok: false,
      ironclaw: {
        profile: 'ironclaw',
        version: null,
        state: 'disconnected' as const,
        gatewayUrl: null,
        dashboardUrl: null,
        lastError: 'Granola task service is only available in Electron runtime.',
      },
      granola: {
        authenticated: false,
        connectionState: 'disconnected' as const,
        lastSyncAt: null,
        lastSyncError: 'Granola task service is only available in Electron runtime.',
      },
      migration: {
        sourceDir: '/Users/motasimrahman/Desktop/granola-openclaw/data',
        imported: false,
        importedAt: null,
        skippedReason: 'electron-runtime-required',
        error: 'Granola task service is only available in Electron runtime.',
        markerPath: '',
      },
    };
  },
  async aiGetStatus(): Promise<CodexAIStatus> {
    return {
      profile: 'ironclaw',
      state: 'disconnected',
      connected: false,
      profileId: null,
      expiresAt: null,
      remainingMs: null,
      reason: 'Codex AI is only available in Electron runtime.',
      gatewayState: 'disconnected',
      gatewayUrl: null,
      dashboardUrl: null,
      modelLabel: 'Codex / Auto',
      lastCheckedAt: new Date().toISOString(),
    };
  },
  async aiConnect() {
    return {
      ok: false,
      launchedInteractive: false,
      message: 'Codex AI is only available in Electron runtime.',
    };
  },
  async aiDisconnect() {
    return {
      ok: false,
      message: 'Codex AI is only available in Electron runtime.',
    };
  },
  async aiGenerate(_input: CodexAIActionInput): Promise<CodexAIActionResult> {
    return {
      ok: false,
      runId: null,
      content: null,
      message: 'Codex AI is only available in Electron runtime.',
      modelLabel: 'Codex / Auto',
    };
  },
  tasksSubscribe(_listener: (event: TasksRealtimeEvent) => void) {
    return () => {};
  },
  async tasksRefreshExtraction() {
    return {
      ok: false,
      processedMeetings: 0,
      discoveredCount: 0,
      updatedCount: 0,
    };
  },
};

export const granolaClient: GranolaAPI =
  typeof window !== 'undefined' && window.granola ? window.granola : browserFallback;
