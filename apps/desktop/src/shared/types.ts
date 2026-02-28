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
}

export interface TaskChatThreadPage {
  todoId: string;
  messages: TaskChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
  loadedAt: string;
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

export interface GranolaAPI {
  getAppInfo(): Promise<AppInfo>;
  windowCommand(cmd: WindowCommand): Promise<void>;
  notesList(): Promise<NoteSummary[]>;
  noteGet(id: string): Promise<Note>;
  noteUpdate(id: string, patch: NoteUpdatePatch): Promise<Note>;
  settingsGet(): Promise<AppSettings>;
  settingsUpdate(patch: AppSettingsPatch): Promise<AppSettings>;
  tasksGetFeed(): Promise<TasksFeed>;
  tasksConnect(): Promise<{ ok: boolean; needsBrowser: boolean; message?: string }>;
  tasksOpenPendingAuthorization(): Promise<{ ok: boolean; message?: string }>;
  tasksSyncNow(): Promise<{ ok: boolean; meetingCount: number; fetchedAt: string; warning?: string }>;
  tasksStart(todoId: string): Promise<{ ok: boolean; runId?: string; message?: string }>;
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
}
