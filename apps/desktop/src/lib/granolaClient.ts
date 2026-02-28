import { mockNotes, mockSettings } from '../shared/mockData';
import type {
  AppInfo,
  AppSettings,
  AppSettingsPatch,
  GranolaAPI,
  Note,
  NoteSummary,
  NoteUpdatePatch,
  TasksRealtimeEvent,
  WindowCommand,
} from '../shared/types';

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const localState: {
  notes: Note[];
  settings: AppSettings;
} = {
  notes: deepClone(mockNotes),
  settings: deepClone(mockSettings),
};

function ensureWindowCommand(command: WindowCommand): void {
  if (!['minimize', 'maximize', 'close'].includes(command)) {
    throw new Error(`invalid window command: ${String(command)}`);
  }
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
  async tasksStart() {
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
