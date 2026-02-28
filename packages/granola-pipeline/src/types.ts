export interface GranolaMeeting {
  id: string;
  title: string;
  date: string | null;
  attendees: string[];
  notes: string | null;
  enhancedNotes: string | null;
  privateNotes: string | null;
  transcript: string | null;
  raw: unknown;
}

export interface ExtractedTodoCandidate {
  title: string;
  description: string;
  owner: string | null;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  evidence: string | null;
}

export interface TodoStepEvent {
  step: string;
  createdAt: string;
  publicMessage: string;
  adminMessage: string;
}

export interface TodoRecord {
  todoId: string;
  fingerprint: string;
  sourceHash: string;
  meetingId: string;
  meetingTitle: string;
  title: string;
  description: string;
  owner: string | null;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  evidence: string | null;
  status: 'discovered' | 'approved' | 'queued' | 'submitting' | 'submitted' | 'failed' | 'cancelled';
  attempts: number;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  submittedAt: string | null;
  failedAt: string | null;
  nextRetryAt: string | null;
  publicSummary: string;
  internalError: string | null;
  runId: string | null;
  runState: 'idle' | 'running' | 'retry_wait' | 'done' | 'blocked';
  latestPublicStep: string | null;
  stepEvents: TodoStepEvent[];
  guardrail: {
    mode: 'workspace_only' | 'off';
    verdict: 'unknown' | 'blocked' | 'clear';
    reason: string | null;
    checkedAt: string | null;
  };
  openclaw: {
    lastStatus: number | null;
    lastEndpoint: string | null;
    lastRunId: string | null;
    lastResponseAt: string | null;
    lastError: string | null;
  };
}

export interface TodoStoreDocument {
  version: 1;
  savedAt: string | null;
  todos: TodoRecord[];
  events: Array<{
    type: string;
    message: string;
    createdAt: string;
    todoId: string | null;
  }>;
  metadata: {
    meetingSourceHashes: Record<string, string>;
  };
  lastExtractionAt: string | null;
  lastExtractionError: string | null;
  lastSubmissionAt: string | null;
  lastSubmissionError: string | null;
}

export interface CachedMeetingsDocument {
  version: 1;
  savedAt: string;
  meetings: GranolaMeeting[];
  availableTools: string[];
  warnings: string[];
  fetchedAt: string;
  syncMetadata?: SyncMetadata;
}

export interface SyncMetadata {
  detailHydratedAtByMeetingId: Record<string, string>;
  transcriptCooldownUntilByMeetingId: Record<string, string>;
  globalTranscriptCooldownUntil: string | null;
  globalSyncCooldownUntil: string | null;
  syncRateLimitStreak: number;
}

export interface PersistedAuthDocument {
  version: 1;
  savedAt: string;
  oauth: {
    clientInformation?: unknown;
    tokens?: unknown;
    codeVerifier?: string;
    pendingAuthorizationUrl?: string;
    pendingStartedAt?: string | null;
    pendingExpiresAt?: string | null;
    lastAuthAt?: string | null;
    lastAuthError?: string | null;
    lastAuthStage?:
      | 'idle'
      | 'starting'
      | 'authorizing'
      | 'callback_received'
      | 'exchanging_code'
      | 'connected'
      | 'failed';
    lastAuthHttpStatus?: number | null;
    lastAuthErrorCode?: string | null;
  };
}

export interface MeetingsLoadResult {
  meetings: GranolaMeeting[];
  availableTools: string[];
  warnings: string[];
  diagnostics: MeetingSyncDiagnostics;
}

export interface QueryMeetingResult {
  answer: string;
  raw: unknown;
  usedArgs: Record<string, unknown>;
}

export type TranscriptPolicy = 'off' | 'hybrid';

export interface MeetingSyncOptions {
  listTimeRange: 'this_week' | 'last_week' | 'last_30_days' | 'custom';
  maxGetMeetingsPerSync: number;
  maxTranscriptFetchPerSync: number;
  transcriptPolicy: TranscriptPolicy;
  globalTranscriptCooldownUntil: string | null;
  transcriptCooldownUntilByMeetingId: Record<string, string>;
}

export interface MeetingSyncDiagnostics {
  requestCountsByTool: Record<string, number>;
  rateLimitedTools: string[];
  degradedSteps: string[];
  transcriptSkippedCount: number;
  transcriptRateLimited: boolean;
  transcriptCapabilityUnavailable: boolean;
  transcriptCooldownUntilByMeetingId: Record<string, string>;
  globalTranscriptCooldownUntil: string | null;
  warningsSummary: string[];
}

export type TodoExtractionResult =
  | {
      ok: false;
      skipped: true;
      reason: string;
      processedMeetings: number;
      extractedCount: number;
      discoveredCount: number;
      updatedCount: number;
    }
  | {
      ok: true;
      skipped: boolean;
      reason?: string;
      processedMeetings: number;
      extractedCount: number;
      discoveredCount: number;
      updatedCount: number;
    };
