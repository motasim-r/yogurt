export type UIRoute = 'dashboard' | 'note_detail' | 'settings';

export type NoteStatus = 'draft' | 'final';
export type Visibility = 'private' | 'shared';

export interface NoteSummary {
  id: string;
  title: string;
  updatedAt: string;
  timeLabel: string;
  groupLabel: string;
  ownerLabel: string;
  visibility: Visibility;
  attendeeCount: number;
  tags: string[];
}

export interface Note extends NoteSummary {
  body: string;
  attendees: string[];
  status: NoteStatus;
}

export type NoteUpdatePatch = Partial<Pick<Note, 'title' | 'body' | 'tags' | 'status'>>;

export interface AppSettings {
  autoStart: boolean;
  theme: 'light' | 'system';
  transcriptLanguage: string;
  showMeetingOverlay: boolean;
}

export type AppSettingsPatch = Partial<AppSettings>;

export interface AppInfo {
  version: string;
  platform: string;
}

export type WindowCommand = 'minimize' | 'maximize' | 'close';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus =
  | 'discovered'
  | 'approved'
  | 'queued'
  | 'submitting'
  | 'submitted'
  | 'failed'
  | 'cancelled';
export type TaskRunState = 'idle' | 'running' | 'retry_wait' | 'done' | 'blocked';
export type TaskRunQueueState = 'idle' | 'queued' | 'running';
export type TaskExecutionPhase =
  | 'queued'
  | 'started'
  | 'thinking'
  | 'working'
  | 'streaming'
  | 'completed'
  | 'failed'
  | 'cancelled';
export type TaskChatRole = 'user' | 'assistant' | 'system' | 'status';
export type TaskChatTraceKind = 'thought' | 'tool_start' | 'tool_result' | 'source_fetch' | 'phase';
export type TaskChatMessageType = 'default' | 'planning_context' | 'planning_user' | 'planning_draft' | 'planning_approved';

export interface TaskChatTrace {
  kind: TaskChatTraceKind;
  title: string;
  detail?: string | null;
  toolName?: string | null;
  toolArgs?: string | null;
  toolMeta?: string | null;
  isError?: boolean | null;
  sourceUrl?: string | null;
  domain?: string | null;
  phase?: TaskExecutionPhase | null;
  groupId?: string | null;
}

export interface TaskStep {
  step: string;
  createdAt: string;
  message: string;
}

export interface TaskPlanOption {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  why: string;
  recommended: boolean;
}

export interface TaskPlanDraft {
  draftId: string;
  todoId: string;
  generatedAt: string;
  options: TaskPlanOption[];
  recommendedOptionId: string;
  guidanceUsed: string;
}

export interface TaskPlanningContextSection {
  id: 'granola' | 'planner' | 'ironclaw';
  title: string;
  bullets: string[];
}

export interface TaskPlanningContext {
  todoId: string;
  generatedAt: string;
  sections: TaskPlanningContextSection[];
}

export interface TaskPlanSelection {
  mode: 'preset' | 'custom';
  optionId?: string;
  customInstruction?: string;
}

export interface TaskStartOptions {
  approvedPlan?: {
    draftId?: string;
    selection: TaskPlanSelection;
  };
}

export interface TaskItemPublic {
  todoId: string;
  meetingId: string;
  meetingTitle: string;
  title: string;
  description: string;
  owner: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  attempts: number;
  lastUpdatedAt: string;
  publicSummary: string;
  latestPublicStep: string;
  stepCount: number;
  steps: TaskStep[];
  runState: TaskRunState;
  runQueueState: TaskRunQueueState;
  runId: string | null;
}

export interface TaskChatMessage {
  messageId: string;
  todoId: string;
  runId: string | null;
  role: TaskChatRole;
  content: string;
  createdAt: string;
  streaming: boolean;
  statusTag: TaskExecutionPhase | null;
  trace?: TaskChatTrace | null;
  messageType?: TaskChatMessageType;
  planDraft?: TaskPlanDraft | null;
}

export interface TaskChatThreadPage {
  todoId: string;
  messages: TaskChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
  loadedAt: string;
}

export type TaskWorkspaceViewMode = 'list' | 'kanban';
export type TaskWorkspaceGroupBy = 'board' | 'meeting' | 'assignee' | 'priority' | 'status';
export type TaskWorkspaceSortBy = 'updated' | 'created' | 'priority' | 'title' | 'due';
export type TaskWorkspaceSectionId = 'all' | 'assigned' | 'running' | 'completed' | 'activity';
export type TaskAssigneeTone = 'olive' | 'blue' | 'violet' | 'amber' | 'rose' | 'slate';
export type TaskListKind = 'inbox' | 'meeting' | 'project';

export interface TaskWorkspaceSection {
  id: TaskWorkspaceSectionId;
  label: string;
  description: string;
  itemCount: number;
}

export interface TaskAssignee {
  id: string;
  label: string;
  initials: string;
  tone: TaskAssigneeTone;
}

export interface TaskList {
  id: string;
  label: string;
  itemCount: number;
  kind: TaskListKind;
}

export interface TaskBoardColumn {
  id: string;
  label: string;
  itemCount: number;
}

export interface TaskAIBrief {
  content: string;
  generatedAt: string;
  modelLabel: string;
}

export interface TaskWorkspacePrefs {
  viewMode: TaskWorkspaceViewMode;
  groupBy: TaskWorkspaceGroupBy;
  sortBy: TaskWorkspaceSortBy;
}

export interface TaskWorkspacePrefsPatch {
  viewMode?: TaskWorkspaceViewMode;
  groupBy?: TaskWorkspaceGroupBy;
  sortBy?: TaskWorkspaceSortBy;
}

export interface TaskMetadataPatch {
  assigneeId?: string | null;
  listId?: string;
  boardColumnId?: string;
  following?: boolean;
  latestBrief?: TaskAIBrief | null;
}

export interface TaskWorkspaceItem extends TaskItemPublic {
  createdAt: string;
  creatorLabel: string;
  assignee: TaskAssignee | null;
  listId: string;
  boardColumnId: string;
  following: boolean;
  latestBrief: TaskAIBrief | null;
}

export interface TasksWorkspace {
  sections: TaskWorkspaceSection[];
  lists: TaskList[];
  boardColumns: TaskBoardColumn[];
  assignees: TaskAssignee[];
  prefs: TaskWorkspacePrefs;
  items: TaskWorkspaceItem[];
  selectedTodoIdHint: string | null;
}

export interface TaskCounts {
  discovered: number;
  approved: number;
  queued: number;
  submitting: number;
  submitted: number;
  failed: number;
  cancelled: number;
}

export interface GranolaAuthStatus {
  authenticated: boolean;
  pendingAuthorization: boolean;
  pendingAuthorizationUrl: string | null;
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
  tokenSavedAt: string | null;
  tokenExpiresAt: string | null;
  tokenIdentity: string | null;
}

export type TasksConnectionState = 'disconnected' | 'connecting' | 'authorizing' | 'connected' | 'error';
export type TasksSyncHealth = 'healthy' | 'degraded' | 'cooldown';
export type TasksExecutorState = 'unknown' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface TaskExecutorConnection {
  state: TasksExecutorState;
  profile: string;
  gatewayUrl: string | null;
  dashboardUrl: string | null;
  lastCheckedAt: string | null;
  lastError: string | null;
}

export interface TasksRuntimeMetadata {
  ironclawProfile: string;
  ironclawVersion: string | null;
  gatewayUrl: string | null;
  dashboardUrl: string | null;
  dataImportedAt: string | null;
  canonicalProjectPath: string;
}

export interface TasksRuntimeCheck {
  ok: boolean;
  ironclaw: {
    profile: string;
    version: string | null;
    state: TasksExecutorState;
    gatewayUrl: string | null;
    dashboardUrl: string | null;
    lastError: string | null;
  };
  granola: {
    authenticated: boolean;
    connectionState: TasksConnectionState;
    lastSyncAt: string | null;
    lastSyncError: string | null;
  };
  migration: {
    sourceDir: string;
    imported: boolean;
    importedAt: string | null;
    skippedReason: string | null;
    error: string | null;
    markerPath: string;
  };
}

export interface TaskRunRealtimeEvent {
  type: 'task-run';
  todoId: string;
  runId: string | null;
  phase: 'started' | 'delta' | 'completed' | 'failed';
  message: string;
  createdAt: string;
}

export interface TaskChatMessageRealtimeEvent {
  type: 'task-chat-message';
  todoId: string;
  message: TaskChatMessage;
}

export interface TaskChatDeltaRealtimeEvent {
  type: 'task-chat-delta';
  todoId: string;
  runId: string | null;
  messageId: string;
  delta: string;
  content: string;
  createdAt: string;
}

export interface TaskChatStatusRealtimeEvent {
  type: 'task-chat-status';
  todoId: string;
  runId: string | null;
  phase: TaskExecutionPhase;
  message: string;
  createdAt: string;
}

export interface TasksFeedUpdatedRealtimeEvent {
  type: 'tasks-feed-updated';
}

export type TasksRealtimeEvent =
  | TaskRunRealtimeEvent
  | TaskChatMessageRealtimeEvent
  | TaskChatDeltaRealtimeEvent
  | TaskChatStatusRealtimeEvent
  | TasksFeedUpdatedRealtimeEvent;

export interface TasksFeed {
  connectionState: TasksConnectionState;
  auth: GranolaAuthStatus;
  executor: TaskExecutorConnection;
  runtime: TasksRuntimeMetadata;
  syncInFlight: boolean;
  executionEnabled: boolean;
  guardrailMode: 'workspace_only' | 'off';
  uiRefreshMs: number;
  todos: TaskItemPublic[];
  counts: TaskCounts;
  guardrailBlockedCount: number;
  lastSyncAt: string | null;
  lastSyncError: string | null;
  syncHealth: TasksSyncHealth;
  nextAutoSyncAt: string | null;
  cooldownUntil: string | null;
  lastExtractionAt: string | null;
  lastExtractionError: string | null;
  lastSubmissionAt: string | null;
  warning: string | null;
  warningDetails: string[];
  activeRunTodoId: string | null;
  queuedRunCount: number;
  selectedTodoIdHint: string | null;
}

export type CodexAIConnectionState = 'connected' | 'disconnected' | 'error';
export type CodexAIActionKind = 'task-brief' | 'context-summary';

export interface CodexAIStatus {
  profile: string;
  state: CodexAIConnectionState;
  connected: boolean;
  profileId: string | null;
  expiresAt: string | null;
  remainingMs: number | null;
  reason: string | null;
  gatewayState: TasksExecutorState;
  gatewayUrl: string | null;
  dashboardUrl: string | null;
  modelLabel: string;
  lastCheckedAt: string | null;
}

export interface CodexAIActionInput {
  kind: CodexAIActionKind;
  title: string;
  prompt: string;
  context: string[];
  sessionKey?: string | null;
}

export interface CodexAIActionResult {
  ok: boolean;
  runId: string | null;
  content: string | null;
  message: string;
  modelLabel: string;
}

export interface HomeRecentNote {
  id: string;
  title: string;
  ownerLabel: string;
  groupLabel: string;
  timeLabel: string;
  visibility: Visibility;
}

export interface HomeUpcomingMeeting {
  id: string;
  title: string;
  dayLabel: string;
  monthLabel: string;
  weekdayLabel: string;
  timeLabel: string;
  startsAt: string | null;
}

export interface HomeFeed {
  recentNotes: HomeRecentNote[];
  upcomingMeeting: HomeUpcomingMeeting | null;
  lastSyncAt: string | null;
  syncInFlight: boolean;
  connectionState: TasksConnectionState;
  warning: string | null;
  warningDetails: string[];
}

export interface HomeNoteDetail {
  id: string;
  meetingId: string;
  title: string;
  dateLabel: string;
  ownerLabel: string;
  body: string;
  shareUrl: string | null;
}

export type GranolaChatScope = 'all_meetings';
export type GranolaChatMessageRole = 'user' | 'assistant';
export type GranolaChatMessageStatus = 'completed' | 'error';

export interface GranolaChatSource {
  id: string;
  label: string;
  url: string;
}

export interface GranolaChatMessage {
  messageId: string;
  threadId: string;
  role: GranolaChatMessageRole;
  content: string;
  createdAt: string;
  status: GranolaChatMessageStatus;
  sources?: GranolaChatSource[];
  thoughtDurationSeconds?: number | null;
}

export interface GranolaChatRecipe {
  id: string;
  label: string;
  description: string;
  instructions: string;
  creatorLabel: string;
}

export interface GranolaChatRecentThread {
  threadId: string;
  title: string;
  updatedAt: string;
  timeLabel: string;
}

export interface GranolaChatHome {
  connectionState: TasksConnectionState;
  lastSyncAt: string | null;
  warning: string | null;
  warningDetails: string[];
  recipes: GranolaChatRecipe[];
  recentThreads: GranolaChatRecentThread[];
  defaultScope: GranolaChatScope;
  modelLabel: string;
}

export interface GranolaChatThread {
  threadId: string;
  title: string;
  scope: GranolaChatScope;
  messages: GranolaChatMessage[];
  updatedAt: string;
}

export type DocsSection = 'home' | 'drive' | 'wiki';
export type DocsDisplayMode = 'list' | 'grid';
export type DocsHomeFilter = 'recent' | 'owned' | 'shared' | 'favorites';
export type DocsIconTone = 'blue' | 'green' | 'amber' | 'violet' | 'rose' | 'slate';
export type DocsBlockType = 'paragraph' | 'heading' | 'bullet' | 'checklist' | 'callout' | 'divider';

export interface DocsSidebarSection {
  id: DocsSection;
  label: string;
  description: string;
  itemCount: number;
}

export interface DocsQuickAction {
  id: 'new' | 'upload' | 'templates';
  label: string;
  description: string;
  enabled: boolean;
}

export type DocsBlock =
  | {
      id: string;
      type: 'paragraph' | 'heading' | 'bullet' | 'callout';
      text: string;
    }
  | {
      id: string;
      type: 'checklist';
      text: string;
      checked: boolean;
    }
  | {
      id: string;
      type: 'divider';
    };

export interface DocsTemplate {
  templateId: string;
  label: string;
  description: string;
  section: DocsSection;
  iconTone: DocsIconTone;
  blocks: DocsBlock[];
}

export interface DocsDocumentSummary {
  docId: string;
  title: string;
  section: DocsSection;
  locationLabel: string;
  ownerLabel: string;
  createdAt: string;
  updatedAt: string;
  recentLabel: string;
  preview: string;
  favorite: boolean;
  shared: boolean;
  pinned: boolean;
  iconTone: DocsIconTone;
}

export interface DocsHome {
  workspaceTitle: string;
  sections: DocsSidebarSection[];
  quickActions: DocsQuickAction[];
  templates: DocsTemplate[];
  displayMode: DocsDisplayMode;
  documents: DocsDocumentSummary[];
}

export interface DocsDocument extends DocsDocumentSummary {
  breadcrumbs: string[];
  blocks: DocsBlock[];
}

export interface DocsCreateInput {
  templateId?: string | null;
  section?: DocsSection | null;
}

export interface DocsUpdatePatch {
  title?: string;
  section?: DocsSection;
  favorite?: boolean;
  shared?: boolean;
  pinned?: boolean;
  iconTone?: DocsIconTone;
  blocks?: DocsBlock[];
}

export interface GranolaAPI {
  getAppInfo(): Promise<AppInfo>;
  windowCommand(cmd: WindowCommand): Promise<void>;
  notesList(): Promise<NoteSummary[]>;
  noteGet(id: string): Promise<Note>;
  noteUpdate(id: string, patch: NoteUpdatePatch): Promise<Note>;
  settingsGet(): Promise<AppSettings>;
  settingsUpdate(patch: AppSettingsPatch): Promise<AppSettings>;
  homeGetFeed(): Promise<HomeFeed>;
  homeGetNoteDetail(id: string): Promise<HomeNoteDetail>;
  chatGetHome(): Promise<GranolaChatHome>;
  chatGetThread(threadId: string): Promise<GranolaChatThread>;
  chatSendMessage(input: {
    threadId?: string | null;
    text: string;
    scope: GranolaChatScope;
    recipeId?: string | null;
  }): Promise<{
    ok: boolean;
    threadId: string;
    userMessage?: GranolaChatMessage;
    assistantMessage?: GranolaChatMessage;
    message?: string;
  }>;
  docsGetHome(): Promise<DocsHome>;
  docsGetDocument(docId: string): Promise<DocsDocument>;
  docsCreate(input?: DocsCreateInput): Promise<DocsDocument>;
  docsUpdate(docId: string, patch: DocsUpdatePatch): Promise<DocsDocument>;
  tasksGetFeed(): Promise<TasksFeed>;
  tasksGetWorkspace(): Promise<TasksWorkspace>;
  tasksUpdateMetadata(todoId: string, patch: TaskMetadataPatch): Promise<TaskWorkspaceItem>;
  tasksUpdateWorkspacePrefs(patch: TaskWorkspacePrefsPatch): Promise<TaskWorkspacePrefs>;
  tasksConnect(): Promise<{ ok: boolean; needsBrowser: boolean; message?: string }>;
  tasksOpenPendingAuthorization(): Promise<{ ok: boolean; message?: string }>;
  tasksSyncNow(): Promise<{ ok: boolean; meetingCount: number; fetchedAt: string; warning?: string }>;
  tasksGetPlanningContext(todoId: string): Promise<TaskPlanningContext>;
  tasksPlanMessage(todoId: string, instruction: string): Promise<{ ok: boolean; plan?: TaskPlanDraft; message?: string }>;
  tasksStart(todoId: string, options?: TaskStartOptions): Promise<{ ok: boolean; runId?: string; message?: string }>;
  tasksGetThread(todoId: string, cursor?: string | null, limit?: number): Promise<TaskChatThreadPage>;
  tasksSendMessage(todoId: string, text: string): Promise<{ ok: boolean; queued: boolean; runId?: string; message?: string }>;
  tasksCancelActiveRun(todoId: string): Promise<{ ok: boolean; message?: string }>;
  tasksClearThread(todoId: string): Promise<{ ok: boolean; message?: string }>;
  tasksExecutorReconnect(): Promise<{ ok: boolean; message?: string }>;
  tasksOpenRun(todoId: string): Promise<{ ok: boolean; url?: string; message?: string }>;
  tasksRuntimeCheck(): Promise<TasksRuntimeCheck>;
  tasksSubscribe(listener: (event: TasksRealtimeEvent) => void): () => void;
  tasksRefreshExtraction(): Promise<{
    ok: boolean;
    processedMeetings: number;
    discoveredCount: number;
    updatedCount: number;
  }>;
  aiGetStatus(): Promise<CodexAIStatus>;
  aiConnect(): Promise<{ ok: boolean; launchedInteractive: boolean; message?: string }>;
  aiDisconnect(): Promise<{ ok: boolean; message?: string }>;
  aiGenerate(input: CodexAIActionInput): Promise<CodexAIActionResult>;
}
