import crypto from 'node:crypto';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { UnauthorizedError } from '@modelcontextprotocol/sdk/client/auth.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { buildTodoExtractionPrompt, createMeetingSourceHash, createTodoFingerprint, parseExtractedTodos, } from './todo-extractor.js';
import { MeetingsCacheStore } from './cache-store.js';
import { EncryptedTokenStore } from './token-store.js';
import { TodoStore } from './todo-store.js';
import { OAuthCallbackServer } from './oauth-callback.js';
import { IronclawRuntime } from './ironclaw-runtime.js';
import { loadMeetingsWithClient, queryGranolaMeetings, safeErrorMessage } from './meeting-sync.js';
function nowIso() {
    return new Date().toISOString();
}
function withTimeout(promise, timeoutMs, timeoutMessage) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error(timeoutMessage));
        }, timeoutMs);
        promise
            .then((value) => {
            clearTimeout(timeout);
            resolve(value);
        })
            .catch((error) => {
            clearTimeout(timeout);
            reject(error);
        });
    });
}
function clampText(value, maxLength) {
    if (value.length <= maxLength) {
        return value;
    }
    return `${value.slice(0, maxLength)}...`;
}
function parseIsoDate(value) {
    if (!value) {
        return null;
    }
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
}
function normalizeTodoStatus(status) {
    switch (status) {
        case 'approved':
        case 'queued':
        case 'submitting':
        case 'submitted':
        case 'failed':
        case 'cancelled':
            return status;
        default:
            return 'discovered';
    }
}
function inferTodoRunState(todo) {
    if (todo.status === 'submitting') {
        return 'running';
    }
    if (todo.status === 'submitted') {
        return 'done';
    }
    if (todo.status === 'failed' && todo.guardrail?.verdict === 'blocked') {
        return 'blocked';
    }
    if (todo.nextRetryAt) {
        const retryAt = Date.parse(todo.nextRetryAt);
        if (Number.isFinite(retryAt) && retryAt > Date.now()) {
            return 'retry_wait';
        }
    }
    return 'idle';
}
function ensureTodoTelemetry(todo) {
    if (!Array.isArray(todo.stepEvents)) {
        todo.stepEvents = [];
    }
    todo.runState = inferTodoRunState(todo);
    if (!todo.guardrail || typeof todo.guardrail !== 'object') {
        todo.guardrail = {
            mode: 'workspace_only',
            verdict: 'unknown',
            reason: null,
            checkedAt: null,
        };
    }
    if (!todo.openclaw || typeof todo.openclaw !== 'object') {
        todo.openclaw = {
            lastStatus: null,
            lastEndpoint: null,
            lastRunId: null,
            lastResponseAt: null,
            lastError: null,
        };
    }
    if (!todo.latestPublicStep && todo.stepEvents.length > 0) {
        const latest = [...todo.stepEvents].reverse().find((item) => item.publicMessage);
        todo.latestPublicStep = latest?.publicMessage ?? null;
    }
}
function appendTodoStep(todo, step, publicMessage, adminMessage) {
    ensureTodoTelemetry(todo);
    const event = {
        step,
        createdAt: nowIso(),
        publicMessage,
        adminMessage,
    };
    todo.stepEvents.push(event);
    if (todo.stepEvents.length > 200) {
        todo.stepEvents = todo.stepEvents.slice(-200);
    }
    todo.latestPublicStep = publicMessage;
}
function todoSortKey(todo) {
    const updatedAt = Date.parse(todo.updatedAt ?? '');
    const createdAt = Date.parse(todo.createdAt ?? '');
    if (Number.isFinite(updatedAt)) {
        return updatedAt;
    }
    if (Number.isFinite(createdAt)) {
        return createdAt;
    }
    return 0;
}
function decodeJwtPayload(token) {
    const parts = token.split('.');
    if (parts.length < 2 || !parts[1]) {
        return null;
    }
    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = Buffer.from(base64, 'base64').toString('utf8');
        const payload = JSON.parse(json);
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
            return payload;
        }
        return null;
    }
    catch {
        return null;
    }
}
function inferTokenExpiryIso(tokens) {
    if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
        return null;
    }
    const record = tokens;
    const expiresAt = record.expires_at ?? record.expiresAt;
    if (typeof expiresAt === 'number' && Number.isFinite(expiresAt)) {
        const ms = expiresAt > 1_000_000_000_000 ? expiresAt : expiresAt * 1000;
        return new Date(ms).toISOString();
    }
    if (typeof record.access_token === 'string') {
        const payload = decodeJwtPayload(record.access_token);
        const exp = payload?.exp;
        if (typeof exp === 'number' && Number.isFinite(exp)) {
            return new Date(exp * 1000).toISOString();
        }
    }
    return null;
}
function inferTokenIdentity(tokens) {
    if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
        return null;
    }
    const record = tokens;
    if (typeof record.id_token === 'string') {
        const payload = decodeJwtPayload(record.id_token);
        const identity = payload?.email ?? payload?.sub ?? payload?.name;
        if (typeof identity === 'string') {
            return identity;
        }
    }
    if (typeof record.access_token === 'string') {
        const payload = decodeJwtPayload(record.access_token);
        const identity = payload?.email ?? payload?.sub ?? payload?.name;
        if (typeof identity === 'string') {
            return identity;
        }
    }
    return null;
}
function mergeMeeting(existing, incoming) {
    if (!existing) {
        return incoming;
    }
    return {
        id: incoming.id || existing.id,
        title: incoming.title || existing.title,
        date: incoming.date || existing.date,
        attendees: incoming.attendees.length > 0 ? incoming.attendees : existing.attendees,
        notes: richerText(existing.notes, incoming.notes),
        enhancedNotes: richerText(existing.enhancedNotes, incoming.enhancedNotes),
        privateNotes: richerText(existing.privateNotes, incoming.privateNotes),
        transcript: richerText(existing.transcript, incoming.transcript),
        raw: incoming.raw ?? existing.raw,
    };
}
function richerText(a, b) {
    const left = String(a ?? '').trim();
    const right = String(b ?? '').trim();
    if (!left) {
        return right || null;
    }
    if (!right) {
        return left || null;
    }
    return right.length >= left.length ? right : left;
}
function parseDateForSort(value) {
    if (!value) {
        return 0;
    }
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
}
function compactWarningLines(input) {
    const seen = new Set();
    const output = [];
    for (const message of input) {
        const normalized = String(message ?? '').replace(/\s+/g, ' ').trim();
        if (!normalized || seen.has(normalized)) {
            continue;
        }
        seen.add(normalized);
        output.push(normalized);
    }
    return output.slice(0, 4);
}
function formatRetryTime(iso) {
    if (!iso) {
        return 'soon';
    }
    const parsed = Date.parse(iso);
    if (!Number.isFinite(parsed)) {
        return iso;
    }
    return new Date(parsed).toLocaleTimeString();
}
function isRateLimitLikeMessage(message) {
    const lowered = message.toLowerCase();
    return lowered.includes('rate limit') || lowered.includes('too many requests') || lowered.includes('429');
}
function defaultSyncMetadata() {
    return {
        detailHydratedAtByMeetingId: {},
        transcriptCooldownUntilByMeetingId: {},
        globalTranscriptCooldownUntil: null,
        globalSyncCooldownUntil: null,
        syncRateLimitStreak: 0,
    };
}
function compactMultilineText(value, maxLength = 2200) {
    const normalized = String(value ?? '')
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    if (!normalized) {
        return '';
    }
    return clampText(normalized, maxLength);
}
function formatMeetingContext(meeting) {
    if (!meeting) {
        return 'No cached meeting context was found for this task.';
    }
    const sections = [];
    sections.push(`Meeting title: ${meeting.title || 'Untitled meeting'}`);
    sections.push(`Meeting date: ${meeting.date || 'Unknown date'}`);
    if (meeting.attendees.length > 0) {
        sections.push(`Attendees: ${meeting.attendees.join(', ')}`);
    }
    const notes = compactMultilineText(meeting.notes, 1800);
    if (notes) {
        sections.push(`Notes:\n${notes}`);
    }
    const enhanced = compactMultilineText(meeting.enhancedNotes, 1800);
    if (enhanced) {
        sections.push(`Enhanced notes:\n${enhanced}`);
    }
    const privateNotes = compactMultilineText(meeting.privateNotes, 1200);
    if (privateNotes) {
        sections.push(`Private notes:\n${privateNotes}`);
    }
    const transcript = compactMultilineText(meeting.transcript, 1200);
    if (transcript) {
        sections.push(`Transcript excerpt:\n${transcript}`);
    }
    return sections.join('\n\n');
}
function buildExecutionPrompt(todo, meeting) {
    const evidence = compactMultilineText(todo.evidence, 1200);
    const objective = [
        `Task title: ${todo.title}`,
        `Task description: ${todo.description || 'No description provided.'}`,
        `Owner: ${todo.owner || 'Unassigned'}`,
        `Due date: ${todo.dueDate || 'Not specified'}`,
        `Priority: ${todo.priority}`,
        evidence ? `Evidence from extraction:\n${evidence}` : null,
    ]
        .filter(Boolean)
        .join('\n');
    return [
        'You are assisting on a task extracted from Granola meeting notes.',
        'Perform focused research and return concrete findings with links when available.',
        '',
        'Task context:',
        objective,
        '',
        'Meeting context:',
        formatMeetingContext(meeting),
        '',
        'Response format:',
        '1) One-paragraph summary',
        '2) 3-6 bullet findings with links or references',
        '3) Suggested next steps',
        '',
        'Keep the response concise and action-oriented.',
    ].join('\n');
}
function mergeMeetingsForCache(existing, live) {
    const map = new Map();
    let reusedDetailsCount = 0;
    let carriedForwardCount = 0;
    for (const meeting of live) {
        map.set(meeting.id, meeting);
    }
    for (const cached of existing) {
        const current = map.get(cached.id);
        if (current) {
            const merged = mergeMeeting(current, cached);
            const reusedAnyDetail = (!current.notes && Boolean(merged.notes)) ||
                (!current.enhancedNotes && Boolean(merged.enhancedNotes)) ||
                (!current.privateNotes && Boolean(merged.privateNotes)) ||
                (!current.transcript && Boolean(merged.transcript));
            if (reusedAnyDetail) {
                reusedDetailsCount += 1;
            }
            map.set(cached.id, merged);
            continue;
        }
        map.set(cached.id, cached);
        carriedForwardCount += 1;
    }
    const meetings = [...map.values()].sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date));
    return {
        meetings,
        reusedDetailsCount,
        carriedForwardCount,
    };
}
async function closeMcp(client, transport) {
    try {
        await client.close();
    }
    catch {
        // ignore close failures
    }
    try {
        await transport.close();
    }
    catch {
        // ignore close failures
    }
}
export class GranolaTaskService {
    options;
    static MAX_EXTRACTION_MEETINGS_PER_SYNC = 2;
    mcpUrl;
    liveRequestTimeoutMs;
    autoSyncIntervalMs;
    pendingAuthTtlMs;
    openExternal;
    allowUnauthenticatedExtraction;
    extractTodosForMeeting;
    authStore;
    cacheStore;
    todoStore;
    callbackServer;
    guardrailMode = 'off';
    ironclawProfile;
    ironclawAgentId;
    ironclaw;
    realtimeEvents = new EventEmitter();
    uiRefreshMs = 5000;
    authState = {
        clientInformation: undefined,
        tokens: undefined,
        codeVerifier: undefined,
        pendingAuthorizationUrl: undefined,
        pendingStartedAt: null,
        pendingExpiresAt: null,
        lastAuthAt: null,
        lastAuthError: null,
        lastAuthStage: 'idle',
        lastAuthHttpStatus: null,
        lastAuthErrorCode: null,
        savedAt: null,
    };
    cacheState = {
        meetings: [],
        availableTools: [],
        warnings: [],
        warningDetails: [],
        fetchedAt: null,
        syncMetadata: defaultSyncMetadata(),
    };
    todoState = {
        loaded: false,
        todos: [],
        events: [],
        metadata: {
            meetingSourceHashes: {},
        },
        saveChain: Promise.resolve(),
        extractionInFlight: false,
        extractionPendingReason: null,
        lastExtractionAt: null,
        lastExtractionError: null,
        lastSubmissionAt: null,
        lastSubmissionError: null,
    };
    lastSyncAt = null;
    lastSyncError = null;
    autoSyncTimer = null;
    nextAutoSyncAt = null;
    syncInFlightPromise = null;
    connecting = false;
    connectInFlightPromise = null;
    oauthRedirectUrl = null;
    lastAuthHttpDiagnostic = null;
    syncTelemetryHistory = [];
    transcriptDisabledForSession = false;
    executorState = {
        state: 'unknown',
        profile: 'ironclaw',
        gatewayUrl: null,
        dashboardUrl: null,
        lastCheckedAt: null,
        lastError: null,
    };
    runningExecutions = new Map();
    lastFeedBroadcastAt = 0;
    constructor(options) {
        this.options = options;
        this.mcpUrl = options.mcpUrl ?? 'https://mcp.granola.ai/mcp';
        this.liveRequestTimeoutMs = options.liveRequestTimeoutMs ?? 12_000;
        this.autoSyncIntervalMs = options.autoSyncIntervalMs ?? 300_000;
        this.pendingAuthTtlMs = Math.max(60_000, options.pendingAuthTtlMs ?? 10 * 60_000);
        this.allowUnauthenticatedExtraction = options.allowUnauthenticatedExtraction === true;
        this.extractTodosForMeeting = options.extractTodosForMeeting;
        this.ironclawProfile = options.ironclawProfile ?? 'ironclaw';
        this.ironclawAgentId = options.ironclawAgentId ?? 'main';
        this.ironclaw = new IronclawRuntime({
            profile: this.ironclawProfile,
        });
        const tokenKey = options.tokenEncryptionKey ?? this.deriveTokenEncryptionKey(options.dataDir);
        this.authStore = new EncryptedTokenStore(path.join(options.dataDir, 'granola-token.enc'), tokenKey);
        this.cacheStore = new MeetingsCacheStore(path.join(options.dataDir, 'meetings-cache.json'));
        this.todoStore = new TodoStore(path.join(options.dataDir, 'todo-store.json'));
        this.callbackServer = new OAuthCallbackServer({
            host: options.callbackHost ?? '127.0.0.1',
            preferredPort: options.callbackPort ?? 43110,
            maxPort: options.callbackMaxPort ?? 43130,
            callbackPath: '/oauth/callback',
        });
        this.executorState.profile = this.ironclawProfile;
        this.realtimeEvents.setMaxListeners(64);
        this.openExternal = async (url) => {
            if (options.openExternal) {
                await options.openExternal(url);
            }
        };
    }
    deriveTokenEncryptionKey(seed) {
        return crypto.createHash('sha256').update(seed).digest('hex');
    }
    onRealtimeEvent(listener) {
        this.realtimeEvents.on('event', listener);
        return () => {
            this.realtimeEvents.off('event', listener);
        };
    }
    emitRealtimeEvent(event) {
        this.realtimeEvents.emit('event', event);
    }
    emitFeedUpdated(force = false) {
        const now = Date.now();
        if (!force && now - this.lastFeedBroadcastAt < 200) {
            return;
        }
        this.lastFeedBroadcastAt = now;
        this.emitRealtimeEvent({ type: 'tasks-feed-updated' });
    }
    async refreshExecutorState(force = false) {
        const checkedAtMs = parseIsoDate(this.executorState.lastCheckedAt);
        if (!force && checkedAtMs != null && Date.now() - checkedAtMs < 15_000 && this.executorState.state !== 'unknown') {
            return this.executorState;
        }
        this.executorState = {
            ...this.executorState,
            state: 'connecting',
        };
        this.emitFeedUpdated(true);
        const probed = await this.ironclaw.probe();
        this.executorState = {
            ...this.executorState,
            state: probed.connected ? 'connected' : 'disconnected',
            gatewayUrl: probed.gatewayUrl,
            dashboardUrl: probed.dashboardUrl,
            lastCheckedAt: nowIso(),
            lastError: probed.connected ? null : probed.message,
        };
        this.emitFeedUpdated(true);
        return this.executorState;
    }
    async reconnectExecutorState() {
        this.executorState = {
            ...this.executorState,
            state: 'connecting',
            lastError: null,
        };
        this.emitFeedUpdated(true);
        const result = await this.ironclaw.reconnect();
        this.executorState = {
            ...this.executorState,
            state: result.connected ? 'connected' : 'error',
            gatewayUrl: result.gatewayUrl,
            dashboardUrl: result.dashboardUrl,
            lastCheckedAt: nowIso(),
            lastError: result.connected ? null : result.message ?? 'Unable to reconnect to IronClaw.',
        };
        this.emitFeedUpdated(true);
        return this.executorState;
    }
    isGranolaAuthenticated() {
        return Boolean(this.authState.tokens);
    }
    authSnapshot() {
        const pendingAuthorization = this.isPendingAuthorizationFresh();
        return {
            authenticated: this.isGranolaAuthenticated(),
            pendingAuthorization,
            pendingAuthorizationUrl: pendingAuthorization ? this.authState.pendingAuthorizationUrl ?? null : null,
            pendingStartedAt: pendingAuthorization ? this.authState.pendingStartedAt : null,
            pendingExpiresAt: pendingAuthorization ? this.authState.pendingExpiresAt : null,
            lastAuthAt: this.authState.lastAuthAt,
            lastAuthError: this.authState.lastAuthError,
            lastAuthStage: this.authState.lastAuthStage,
            lastAuthHttpStatus: this.authState.lastAuthHttpStatus,
            lastAuthErrorCode: this.authState.lastAuthErrorCode,
            tokenSavedAt: this.authState.savedAt,
            tokenExpiresAt: inferTokenExpiryIso(this.authState.tokens),
            tokenIdentity: inferTokenIdentity(this.authState.tokens),
        };
    }
    connectionState() {
        if (this.connecting ||
            this.authState.lastAuthStage === 'starting' ||
            this.authState.lastAuthStage === 'callback_received' ||
            this.authState.lastAuthStage === 'exchanging_code') {
            return 'connecting';
        }
        if (this.isGranolaAuthenticated()) {
            return 'connected';
        }
        if (this.isPendingAuthorizationFresh()) {
            return 'authorizing';
        }
        if (this.authState.lastAuthStage === 'failed' || this.authState.lastAuthError) {
            return 'error';
        }
        return 'disconnected';
    }
    isPendingAuthorizationFresh(now = Date.now()) {
        const url = String(this.authState.pendingAuthorizationUrl ?? '').trim();
        if (!url) {
            return false;
        }
        const expiresAt = parseIsoDate(this.authState.pendingExpiresAt);
        if (expiresAt != null) {
            return expiresAt > now;
        }
        const startedAt = parseIsoDate(this.authState.pendingStartedAt);
        if (startedAt != null) {
            return startedAt + this.pendingAuthTtlMs > now;
        }
        return false;
    }
    setAuthStage(stage) {
        this.authState.lastAuthStage = stage;
    }
    resetAuthDiagnostics() {
        this.lastAuthHttpDiagnostic = null;
        this.authState.lastAuthHttpStatus = null;
        this.authState.lastAuthErrorCode = null;
    }
    updatePendingAuthorization(url) {
        const now = Date.now();
        this.authState.pendingAuthorizationUrl = url;
        this.authState.pendingStartedAt = new Date(now).toISOString();
        this.authState.pendingExpiresAt = new Date(now + this.pendingAuthTtlMs).toISOString();
    }
    clearPendingAuthorization(options = {}) {
        this.authState.pendingAuthorizationUrl = undefined;
        this.authState.pendingStartedAt = null;
        this.authState.pendingExpiresAt = null;
        if (options.clearCodeVerifier) {
            this.authState.codeVerifier = undefined;
        }
        if (options.clearClientInformation) {
            this.authState.clientInformation = undefined;
        }
    }
    invalidateStalePendingAuthorization() {
        if (this.isPendingAuthorizationFresh()) {
            return false;
        }
        if (!this.authState.pendingAuthorizationUrl) {
            return false;
        }
        this.clearPendingAuthorization({
            clearCodeVerifier: true,
        });
        return true;
    }
    captureAuthHttpFailure(status, bodyText) {
        const snippet = clampText(String(bodyText || '').trim(), 240);
        let errorCode = null;
        if (snippet) {
            try {
                const parsed = JSON.parse(snippet);
                if (typeof parsed.error === 'string') {
                    errorCode = parsed.error;
                }
            }
            catch {
                if (snippet.toLowerCase().includes('unauthorized')) {
                    errorCode = 'unauthorized';
                }
            }
        }
        this.lastAuthHttpDiagnostic = {
            status,
            errorCode,
            bodySnippet: snippet || null,
        };
        this.authState.lastAuthHttpStatus = status;
        this.authState.lastAuthErrorCode = errorCode;
    }
    normalizeAuthFailure(error) {
        const diagnostic = this.lastAuthHttpDiagnostic;
        const raw = safeErrorMessage(error).trim();
        if (diagnostic?.status === 401 && (diagnostic.errorCode === 'unauthorized' || !diagnostic.errorCode)) {
            return 'Authorization code was rejected or expired. Click Connect Granola to start a new authorization.';
        }
        if (diagnostic?.errorCode) {
            return `Authorization failed (${diagnostic.errorCode}). Click Connect Granola to start a new authorization.`;
        }
        if (diagnostic?.status) {
            return `Authorization failed with HTTP ${diagnostic.status}. Click Connect Granola to start a new authorization.`;
        }
        if (!raw || raw === 'ServerError') {
            return 'Authorization failed. Click Connect Granola to start a new authorization.';
        }
        return raw;
    }
    async persistAuthState() {
        const payload = {
            version: 1,
            savedAt: nowIso(),
            oauth: {
                clientInformation: this.authState.clientInformation,
                tokens: this.authState.tokens,
                codeVerifier: this.authState.codeVerifier,
                pendingAuthorizationUrl: this.authState.pendingAuthorizationUrl,
                pendingStartedAt: this.authState.pendingStartedAt,
                pendingExpiresAt: this.authState.pendingExpiresAt,
                lastAuthAt: this.authState.lastAuthAt,
                lastAuthError: this.authState.lastAuthError,
                lastAuthStage: this.authState.lastAuthStage,
                lastAuthHttpStatus: this.authState.lastAuthHttpStatus,
                lastAuthErrorCode: this.authState.lastAuthErrorCode,
            },
        };
        await this.authStore.save(payload);
        this.authState.savedAt = payload.savedAt;
    }
    async loadPersistedAuthState() {
        const persisted = await this.authStore.load();
        if (!persisted || !persisted.oauth || typeof persisted.oauth !== 'object') {
            return;
        }
        this.authState.clientInformation = persisted.oauth.clientInformation;
        this.authState.tokens = persisted.oauth.tokens;
        this.authState.codeVerifier = persisted.oauth.codeVerifier;
        this.authState.pendingAuthorizationUrl = persisted.oauth.pendingAuthorizationUrl;
        this.authState.pendingStartedAt = persisted.oauth.pendingStartedAt ?? null;
        this.authState.pendingExpiresAt = persisted.oauth.pendingExpiresAt ?? null;
        this.authState.lastAuthAt = persisted.oauth.lastAuthAt ?? null;
        this.authState.lastAuthError = persisted.oauth.lastAuthError ?? null;
        this.authState.lastAuthStage = persisted.oauth.lastAuthStage ?? 'idle';
        this.authState.lastAuthHttpStatus = persisted.oauth.lastAuthHttpStatus ?? null;
        this.authState.lastAuthErrorCode = persisted.oauth.lastAuthErrorCode ?? null;
        this.authState.savedAt = persisted.savedAt ?? null;
    }
    async loadPersistedCacheState() {
        const cached = await this.cacheStore.load();
        if (!cached) {
            return;
        }
        const warnings = Array.isArray(cached.warnings) ? cached.warnings : [];
        const compact = compactWarningLines(warnings);
        this.cacheState = {
            meetings: Array.isArray(cached.meetings) ? cached.meetings : [],
            availableTools: Array.isArray(cached.availableTools) ? cached.availableTools : [],
            warnings: compact,
            warningDetails: compact.slice(1, 4),
            fetchedAt: typeof cached.fetchedAt === 'string' ? cached.fetchedAt : null,
            syncMetadata: cached.syncMetadata ?? defaultSyncMetadata(),
        };
        this.lastSyncAt = this.cacheState.fetchedAt;
    }
    async loadPersistedTodoState() {
        const persisted = await this.todoStore.load();
        this.todoState.todos = Array.isArray(persisted.todos) ? persisted.todos : [];
        for (const todo of this.todoState.todos) {
            ensureTodoTelemetry(todo);
            todo.status = normalizeTodoStatus(todo.status);
            todo.runState = inferTodoRunState(todo);
        }
        this.todoState.events = Array.isArray(persisted.events) ? persisted.events : [];
        this.todoState.metadata =
            persisted.metadata && typeof persisted.metadata === 'object'
                ? {
                    meetingSourceHashes: persisted.metadata.meetingSourceHashes && typeof persisted.metadata.meetingSourceHashes === 'object'
                        ? persisted.metadata.meetingSourceHashes
                        : {},
                }
                : { meetingSourceHashes: {} };
        this.todoState.lastExtractionAt =
            typeof persisted.lastExtractionAt === 'string' ? persisted.lastExtractionAt : null;
        this.todoState.lastExtractionError =
            typeof persisted.lastExtractionError === 'string' ? persisted.lastExtractionError : null;
        this.todoState.lastSubmissionAt =
            typeof persisted.lastSubmissionAt === 'string' ? persisted.lastSubmissionAt : null;
        this.todoState.lastSubmissionError =
            typeof persisted.lastSubmissionError === 'string' ? persisted.lastSubmissionError : null;
        this.todoState.loaded = true;
    }
    async persistTodoState() {
        if (!this.todoState.loaded) {
            return;
        }
        await this.todoStore.save({
            todos: this.todoState.todos,
            events: this.todoState.events,
            metadata: this.todoState.metadata,
            lastExtractionAt: this.todoState.lastExtractionAt,
            lastExtractionError: this.todoState.lastExtractionError,
            lastSubmissionAt: this.todoState.lastSubmissionAt,
            lastSubmissionError: this.todoState.lastSubmissionError,
        });
    }
    async withTodoStateWrite(mutator) {
        const run = async () => {
            const output = await mutator();
            await this.persistTodoState();
            return output;
        };
        const next = this.todoState.saveChain.then(run, run);
        this.todoState.saveChain = next.then(() => undefined, () => undefined);
        return next;
    }
    sortedTodos() {
        return [...this.todoState.todos].sort((a, b) => todoSortKey(b) - todoSortKey(a));
    }
    todoCountsSnapshot() {
        const counts = {
            discovered: 0,
            approved: 0,
            queued: 0,
            submitting: 0,
            submitted: 0,
            failed: 0,
            cancelled: 0,
        };
        for (const todo of this.todoState.todos) {
            const status = normalizeTodoStatus(todo.status);
            counts[status] += 1;
        }
        return counts;
    }
    guardrailBlockedCount() {
        return this.todoState.todos.filter((todo) => todo.guardrail?.verdict === 'blocked').length;
    }
    todoPublicView(todo) {
        ensureTodoTelemetry(todo);
        const steps = todo.stepEvents.slice(-8).map((event) => ({
            step: event.step,
            createdAt: event.createdAt,
            message: clampText(event.publicMessage || event.adminMessage || '', 240),
        }));
        return {
            todoId: todo.todoId,
            meetingId: todo.meetingId,
            meetingTitle: todo.meetingTitle,
            title: todo.title,
            description: todo.description,
            owner: todo.owner,
            dueDate: todo.dueDate,
            priority: todo.priority,
            status: normalizeTodoStatus(todo.status),
            attempts: todo.attempts ?? 0,
            lastUpdatedAt: todo.updatedAt ?? todo.createdAt,
            publicSummary: clampText(todo.publicSummary || todo.internalError || '', 280),
            latestPublicStep: clampText(todo.latestPublicStep ?? '', 240),
            stepCount: Array.isArray(todo.stepEvents) ? todo.stepEvents.length : 0,
            steps,
            runState: inferTodoRunState(todo),
            runId: todo.runId ?? null,
        };
    }
    createOAuthProvider(redirectUrl, onRedirect) {
        return {
            get redirectUrl() {
                return redirectUrl;
            },
            get clientMetadata() {
                return {
                    client_name: 'Granola Tasks Desktop',
                    redirect_uris: [redirectUrl],
                    grant_types: ['authorization_code', 'refresh_token'],
                    response_types: ['code'],
                    token_endpoint_auth_method: 'none',
                };
            },
            clientInformation: () => this.authState.clientInformation,
            saveClientInformation: async (clientInformation) => {
                this.authState.clientInformation = clientInformation;
                this.authState.lastAuthError = null;
                this.setAuthStage('starting');
                this.resetAuthDiagnostics();
                await this.persistAuthState();
            },
            tokens: () => this.authState.tokens,
            saveTokens: async (tokens) => {
                this.authState.tokens = tokens;
                this.authState.lastAuthError = null;
                this.setAuthStage('connected');
                this.resetAuthDiagnostics();
                await this.persistAuthState();
            },
            redirectToAuthorization: async (authorizationUrl) => {
                const url = authorizationUrl.toString();
                this.updatePendingAuthorization(url);
                this.setAuthStage('authorizing');
                this.authState.lastAuthError = null;
                await this.persistAuthState();
                if (onRedirect) {
                    onRedirect(url);
                }
            },
            saveCodeVerifier: async (codeVerifier) => {
                this.authState.codeVerifier = codeVerifier;
                this.setAuthStage('authorizing');
                await this.persistAuthState();
            },
            codeVerifier: () => {
                if (!this.authState.codeVerifier) {
                    throw new Error('Missing PKCE verifier in auth state. Start auth again.');
                }
                return this.authState.codeVerifier;
            },
            invalidateCredentials: async (scope) => {
                if (scope === 'all' || scope === 'client') {
                    this.authState.clientInformation = undefined;
                }
                if (scope === 'all' || scope === 'tokens') {
                    this.authState.tokens = undefined;
                }
                if (scope === 'all' || scope === 'verifier') {
                    this.authState.codeVerifier = undefined;
                }
                if (!this.authState.tokens) {
                    this.setAuthStage(this.isPendingAuthorizationFresh() ? 'authorizing' : 'idle');
                }
                await this.persistAuthState();
            },
        };
    }
    createMcpClientAndTransport(redirectUrl, onRedirect) {
        const authFetch = async (input, init) => {
            const response = await fetch(input, init);
            const method = typeof init?.method === 'string'
                ? init.method.toUpperCase()
                : input instanceof Request
                    ? input.method.toUpperCase()
                    : 'GET';
            if (method === 'POST' && response.url.includes('/oauth2/token') && !response.ok) {
                try {
                    const bodyText = await response.clone().text();
                    this.captureAuthHttpFailure(response.status, bodyText);
                }
                catch {
                    this.captureAuthHttpFailure(response.status, '');
                }
            }
            return response;
        };
        const transport = new StreamableHTTPClientTransport(new URL(this.mcpUrl), {
            authProvider: this.createOAuthProvider(redirectUrl, onRedirect),
            fetch: authFetch,
        });
        const client = new Client({
            name: 'granola-tasks-desktop',
            version: '0.1.0',
        }, {
            capabilities: {},
        });
        return { client, transport };
    }
    async withAuthenticatedClient(fn) {
        if (!this.isGranolaAuthenticated()) {
            throw new Error('Granola is not authenticated.');
        }
        const redirectUrl = await this.ensureCallbackServerStarted();
        const { client, transport } = this.createMcpClientAndTransport(redirectUrl);
        try {
            await withTimeout(client.connect(transport), this.liveRequestTimeoutMs, 'Granola connection timed out.');
            return await fn(client);
        }
        catch (error) {
            if (error instanceof UnauthorizedError) {
                this.authState.lastAuthError = 'Granola session expired. Reconnect required.';
                this.authState.tokens = undefined;
                this.clearPendingAuthorization({
                    clearCodeVerifier: true,
                });
                this.setAuthStage('failed');
                await this.persistAuthState();
            }
            throw error;
        }
        finally {
            await closeMcp(client, transport);
        }
    }
    async startGranolaAuthorization(redirectUrl) {
        this.clearPendingAuthorization({
            clearCodeVerifier: true,
        });
        this.resetAuthDiagnostics();
        this.setAuthStage('starting');
        this.authState.lastAuthError = null;
        await this.persistAuthState();
        let authUrl;
        const { client, transport } = this.createMcpClientAndTransport(redirectUrl, (url) => {
            authUrl = url;
        });
        try {
            await withTimeout(client.connect(transport), this.liveRequestTimeoutMs, 'Granola OAuth handshake timed out.');
            this.clearPendingAuthorization({
                clearCodeVerifier: true,
            });
            this.authState.lastAuthAt = nowIso();
            this.authState.lastAuthError = null;
            this.setAuthStage('connected');
            this.resetAuthDiagnostics();
            await this.persistAuthState();
            return {
                authenticated: true,
            };
        }
        catch (error) {
            if (error instanceof UnauthorizedError) {
                const authorizationUrl = authUrl ?? this.authState.pendingAuthorizationUrl;
                if (!authorizationUrl) {
                    throw new Error('OAuth redirect URL was not provided by Granola.');
                }
                this.updatePendingAuthorization(authorizationUrl);
                this.setAuthStage('authorizing');
                this.authState.lastAuthError = null;
                this.resetAuthDiagnostics();
                await this.persistAuthState();
                return {
                    authenticated: false,
                    authorizationUrl,
                };
            }
            this.authState.lastAuthError = this.normalizeAuthFailure(error);
            this.setAuthStage('failed');
            await this.persistAuthState();
            throw error;
        }
        finally {
            await closeMcp(client, transport);
        }
    }
    async finishGranolaAuthorization(code, redirectUrl) {
        const { client, transport } = this.createMcpClientAndTransport(redirectUrl);
        try {
            this.setAuthStage('exchanging_code');
            this.authState.lastAuthError = null;
            this.resetAuthDiagnostics();
            await this.persistAuthState();
            await withTimeout(transport.finishAuth(code), this.liveRequestTimeoutMs, 'Granola OAuth exchange timed out.');
            await withTimeout(client.connect(transport), this.liveRequestTimeoutMs, 'Granola reconnect timed out.');
            await withTimeout(client.listTools(), this.liveRequestTimeoutMs, 'Granola tool verification timed out.');
            this.clearPendingAuthorization({
                clearCodeVerifier: true,
            });
            this.authState.lastAuthAt = nowIso();
            this.authState.lastAuthError = null;
            this.setAuthStage('connected');
            this.resetAuthDiagnostics();
            await this.persistAuthState();
            this.startAutoSyncLoop();
            await this.syncNow('oauth-complete');
        }
        catch (error) {
            this.authState.lastAuthError = this.normalizeAuthFailure(error);
            this.setAuthStage('failed');
            this.clearPendingAuthorization({
                clearCodeVerifier: true,
            });
            await this.persistAuthState();
            throw error;
        }
        finally {
            await closeMcp(client, transport);
        }
    }
    async handleOAuthCallback(payload, redirectUrl) {
        if (payload.error) {
            const detail = payload.errorDescription?.trim();
            this.clearPendingAuthorization({
                clearCodeVerifier: true,
            });
            this.authState.lastAuthError = detail
                ? `Authorization was not completed (${payload.error}: ${detail}). Click Connect Granola to try again.`
                : `Authorization was not completed (${payload.error}). Click Connect Granola to try again.`;
            this.authState.lastAuthErrorCode = payload.error;
            this.authState.lastAuthHttpStatus = null;
            this.setAuthStage('failed');
            await this.persistAuthState();
            return {
                ok: false,
                statusCode: 400,
                title: 'Authorization cancelled',
                message: detail || 'Please return to the app and click Connect Granola to try again.',
            };
        }
        if (!payload.code) {
            this.setAuthStage('failed');
            this.authState.lastAuthError = 'Missing authorization code. Click Connect Granola to try again.';
            await this.persistAuthState();
            return {
                ok: false,
                statusCode: 400,
                title: 'Missing code',
                message: 'Please return to the app and click Connect Granola to try again.',
            };
        }
        this.setAuthStage('callback_received');
        this.authState.lastAuthError = null;
        await this.persistAuthState();
        try {
            await this.finishGranolaAuthorization(payload.code, redirectUrl);
            return {
                ok: true,
                statusCode: 200,
                title: 'Granola connected',
                message: 'You can return to the app.',
            };
        }
        catch {
            return {
                ok: false,
                statusCode: 500,
                title: 'Authorization failed',
                message: this.authState.lastAuthError || 'Please return to the app and connect again.',
            };
        }
    }
    async init() {
        await this.loadPersistedAuthState();
        await this.loadPersistedCacheState();
        await this.loadPersistedTodoState();
        const stalePendingCleared = this.invalidateStalePendingAuthorization();
        if (stalePendingCleared && !this.isGranolaAuthenticated()) {
            this.setAuthStage(this.authState.lastAuthError ? 'failed' : 'idle');
            await this.persistAuthState();
        }
        if (this.isGranolaAuthenticated()) {
            this.setAuthStage('connected');
            this.startAutoSyncLoop();
            void this.syncNow('startup');
        }
        else if (!this.authState.lastAuthError && !this.isPendingAuthorizationFresh()) {
            this.setAuthStage('idle');
        }
        void this.refreshExecutorState().catch(() => {
            this.executorState = {
                ...this.executorState,
                state: 'error',
                lastCheckedAt: nowIso(),
                lastError: 'Unable to verify IronClaw runtime.',
            };
            this.emitFeedUpdated(true);
        });
    }
    async dispose() {
        if (this.autoSyncTimer) {
            clearTimeout(this.autoSyncTimer);
            this.autoSyncTimer = null;
        }
        this.nextAutoSyncAt = null;
        for (const execution of this.runningExecutions.values()) {
            execution.cancel();
        }
        this.runningExecutions.clear();
        await this.callbackServer.close();
        this.oauthRedirectUrl = null;
    }
    async ensureCallbackServerStarted() {
        if (this.oauthRedirectUrl) {
            return this.oauthRedirectUrl;
        }
        let redirectUrl = '';
        redirectUrl = await this.callbackServer.start(async (payload) => {
            return await this.handleOAuthCallback(payload, redirectUrl);
        });
        this.oauthRedirectUrl = redirectUrl;
        return redirectUrl;
    }
    syncCooldownUntilMs() {
        const raw = this.cacheState.syncMetadata.globalSyncCooldownUntil;
        const parsed = parseIsoDate(raw);
        if (parsed == null) {
            return null;
        }
        return parsed > Date.now() ? parsed : null;
    }
    syncCooldownUntilIso() {
        const ms = this.syncCooldownUntilMs();
        return ms == null ? null : new Date(ms).toISOString();
    }
    isSyncCooldownActive() {
        return this.syncCooldownUntilMs() != null;
    }
    computeSyncHealth() {
        if (this.isSyncCooldownActive()) {
            return 'cooldown';
        }
        if (this.lastSyncError || this.cacheState.warnings.length > 0 || this.todoState.lastExtractionError) {
            return 'degraded';
        }
        return 'healthy';
    }
    clearAutoSyncTimer() {
        if (this.autoSyncTimer) {
            clearTimeout(this.autoSyncTimer);
            this.autoSyncTimer = null;
        }
    }
    scheduleNextAutoSync(referenceMs = Date.now()) {
        this.clearAutoSyncTimer();
        this.nextAutoSyncAt = null;
        if (!this.isGranolaAuthenticated() || this.autoSyncIntervalMs <= 0) {
            return;
        }
        const cooldownUntilMs = this.syncCooldownUntilMs();
        const baselineMs = referenceMs + this.autoSyncIntervalMs;
        const nextMs = cooldownUntilMs != null ? Math.max(baselineMs, cooldownUntilMs) : baselineMs;
        const delayMs = Math.max(400, nextMs - Date.now());
        this.nextAutoSyncAt = new Date(nextMs).toISOString();
        this.autoSyncTimer = setTimeout(() => {
            this.autoSyncTimer = null;
            this.nextAutoSyncAt = null;
            void this.syncNow('auto-sync');
        }, delayMs);
    }
    startAutoSyncLoop() {
        this.scheduleNextAutoSync();
    }
    async connect() {
        if (this.connectInFlightPromise) {
            return await this.connectInFlightPromise;
        }
        const run = this.connectInternal();
        this.connectInFlightPromise = run;
        try {
            return await run;
        }
        finally {
            if (this.connectInFlightPromise === run) {
                this.connectInFlightPromise = null;
            }
        }
    }
    async connectInternal() {
        this.connecting = true;
        try {
            if (this.isGranolaAuthenticated()) {
                this.setAuthStage('connected');
                this.authState.lastAuthError = null;
                this.resetAuthDiagnostics();
                await this.persistAuthState();
                this.startAutoSyncLoop();
                await this.syncNow('connect-existing-session');
                return {
                    ok: true,
                    needsBrowser: false,
                    message: 'Granola is already connected.',
                };
            }
            const stalePendingCleared = this.invalidateStalePendingAuthorization();
            if (stalePendingCleared) {
                await this.persistAuthState();
            }
            const redirectUrl = await this.ensureCallbackServerStarted();
            if (this.isPendingAuthorizationFresh() && this.authState.pendingAuthorizationUrl) {
                this.setAuthStage('authorizing');
                this.authState.lastAuthError = null;
                await this.persistAuthState();
                await this.openExternal(this.authState.pendingAuthorizationUrl);
                return {
                    ok: true,
                    needsBrowser: true,
                    message: 'Resumed pending Granola authorization in your browser.',
                };
            }
            const authStart = await this.startGranolaAuthorization(redirectUrl);
            if (authStart.authenticated) {
                this.startAutoSyncLoop();
                await this.syncNow('connect-existing-session');
                return {
                    ok: true,
                    needsBrowser: false,
                    message: 'Granola is already connected.',
                };
            }
            if (authStart.authorizationUrl) {
                await this.openExternal(authStart.authorizationUrl);
                return {
                    ok: true,
                    needsBrowser: true,
                    message: 'Opened browser for Granola authorization.',
                };
            }
            return {
                ok: false,
                needsBrowser: false,
                message: 'Granola authorization could not be started.',
            };
        }
        catch (error) {
            const message = this.normalizeAuthFailure(error);
            this.authState.lastAuthError = message;
            this.setAuthStage('failed');
            await this.persistAuthState();
            return {
                ok: false,
                needsBrowser: false,
                message,
            };
        }
        finally {
            this.connecting = false;
        }
    }
    async openPendingAuthorization() {
        const stalePendingCleared = this.invalidateStalePendingAuthorization();
        if (stalePendingCleared) {
            await this.persistAuthState();
        }
        const pendingAuthorizationUrl = this.isPendingAuthorizationFresh()
            ? String(this.authState.pendingAuthorizationUrl ?? '').trim()
            : '';
        if (!pendingAuthorizationUrl) {
            return {
                ok: false,
                message: 'No pending authorization URL. Click Connect Granola to start a new authorization.',
            };
        }
        try {
            await this.ensureCallbackServerStarted();
            this.setAuthStage('authorizing');
            this.authState.lastAuthError = null;
            await this.persistAuthState();
            await this.openExternal(pendingAuthorizationUrl);
            return {
                ok: true,
            };
        }
        catch (error) {
            const message = this.normalizeAuthFailure(error);
            this.authState.lastAuthError = message;
            this.setAuthStage('failed');
            await this.persistAuthState();
            return {
                ok: false,
                message,
            };
        }
    }
    countChangedMeetingsForExtraction(meetings) {
        let count = 0;
        for (const meeting of meetings) {
            if (!meeting?.id) {
                continue;
            }
            const sourceHash = createMeetingSourceHash(meeting);
            const previousHash = this.todoState.metadata.meetingSourceHashes?.[meeting.id];
            if (!previousHash || previousHash !== sourceHash) {
                count += 1;
            }
        }
        return count;
    }
    async appendSyncTelemetry(entry) {
        this.syncTelemetryHistory.unshift(entry);
        if (this.syncTelemetryHistory.length > 30) {
            this.syncTelemetryHistory = this.syncTelemetryHistory.slice(0, 30);
        }
        await this.withTodoStateWrite(async () => {
            const requests = Object.entries(entry.requestCountsByTool)
                .map(([tool, count]) => `${tool}:${count}`)
                .join(', ');
            const message = [
                `reason=${entry.reason}`,
                requests ? `requests=[${requests}]` : 'requests=[]',
                `rateLimited=${entry.rateLimitedTools.join(',') || 'none'}`,
                `transcriptAttempts=${entry.transcriptAttempts}`,
                `transcriptSkipped=${entry.transcriptSkippedCount}`,
                `extractionProcessed=${entry.extractionProcessed}`,
                `extractionDeferred=${entry.extractionDeferred}`,
            ].join(' ');
            this.todoState.events.push({
                type: 'sync_telemetry',
                message: clampText(message, 420),
                createdAt: entry.createdAt,
                todoId: null,
            });
            if (this.todoState.events.length > 400) {
                this.todoState.events = this.todoState.events.slice(-400);
            }
        });
    }
    syncOptionsSnapshot() {
        return {
            listTimeRange: 'last_30_days',
            maxGetMeetingsPerSync: 10,
            maxTranscriptFetchPerSync: 1,
            transcriptPolicy: this.transcriptDisabledForSession ? 'off' : 'hybrid',
            globalTranscriptCooldownUntil: this.cacheState.syncMetadata.globalTranscriptCooldownUntil,
            transcriptCooldownUntilByMeetingId: { ...this.cacheState.syncMetadata.transcriptCooldownUntilByMeetingId },
        };
    }
    async syncMeetingsWithClient(client, reason) {
        const syncOptions = this.syncOptionsSnapshot();
        const livePayload = await withTimeout(loadMeetingsWithClient(client, syncOptions), this.liveRequestTimeoutMs * 4, 'Live meeting sync timed out.');
        const merged = mergeMeetingsForCache(this.cacheState.meetings, livePayload.meetings);
        const extractionBacklog = this.countChangedMeetingsForExtraction(merged.meetings);
        const extractionDeferred = Math.max(0, extractionBacklog - GranolaTaskService.MAX_EXTRACTION_MEETINGS_PER_SYNC);
        const warnings = [...livePayload.warnings];
        const fetchedAt = nowIso();
        const rateLimited = livePayload.diagnostics.rateLimitedTools.length > 0 || livePayload.diagnostics.transcriptRateLimited;
        if (merged.reusedDetailsCount > 0) {
            warnings.push(`Using cached richer notes for ${merged.reusedDetailsCount} meeting(s).`);
        }
        if (merged.carriedForwardCount > 0) {
            warnings.push(`Retained ${merged.carriedForwardCount} cached meeting(s) outside the current live window.`);
        }
        if (livePayload.diagnostics.transcriptCapabilityUnavailable) {
            const firstDisable = !this.transcriptDisabledForSession;
            this.transcriptDisabledForSession = true;
            if (firstDisable) {
                warnings.push('Transcript access is unavailable for this Granola plan. Continuing with notes only.');
            }
        }
        const nextSyncMetadata = {
            detailHydratedAtByMeetingId: { ...this.cacheState.syncMetadata.detailHydratedAtByMeetingId },
            transcriptCooldownUntilByMeetingId: { ...livePayload.diagnostics.transcriptCooldownUntilByMeetingId },
            globalTranscriptCooldownUntil: livePayload.diagnostics.globalTranscriptCooldownUntil,
            globalSyncCooldownUntil: this.cacheState.syncMetadata.globalSyncCooldownUntil,
            syncRateLimitStreak: this.cacheState.syncMetadata.syncRateLimitStreak,
        };
        for (const meeting of merged.meetings) {
            if (!meeting?.id) {
                continue;
            }
            const hasDetail = Boolean(meeting.notes || meeting.enhancedNotes || meeting.privateNotes || meeting.transcript);
            if (hasDetail) {
                nextSyncMetadata.detailHydratedAtByMeetingId[meeting.id] = fetchedAt;
            }
        }
        if (rateLimited) {
            const nextStreak = Math.max(1, nextSyncMetadata.syncRateLimitStreak + 1);
            nextSyncMetadata.syncRateLimitStreak = nextStreak;
            const cooldownMs = nextStreak === 1 ? 2 * 60_000 : nextStreak === 2 ? 5 * 60_000 : 10 * 60_000;
            nextSyncMetadata.globalSyncCooldownUntil = new Date(Date.now() + cooldownMs).toISOString();
            warnings.push(`Sync cooling down until ${formatRetryTime(nextSyncMetadata.globalSyncCooldownUntil)} due to rate limits.`);
        }
        else {
            nextSyncMetadata.syncRateLimitStreak = 0;
            nextSyncMetadata.globalSyncCooldownUntil = null;
        }
        const availableTools = Array.from(new Set([...livePayload.availableTools, ...this.cacheState.availableTools]));
        const extractionResult = await this.runTodoExtractionInternal(reason, merged.meetings, client);
        if (this.todoState.lastExtractionError) {
            warnings.push(this.todoState.lastExtractionError);
        }
        if (extractionDeferred > 0) {
            warnings.push(`Extraction queued ${extractionDeferred} meeting(s) for the next sync cycle.`);
        }
        const compactWarnings = compactWarningLines(warnings);
        await this.cacheStore.save({
            meetings: merged.meetings,
            availableTools,
            warnings: compactWarnings,
            fetchedAt,
            syncMetadata: nextSyncMetadata,
        });
        this.cacheState = {
            meetings: merged.meetings,
            availableTools,
            warnings: compactWarnings,
            warningDetails: compactWarnings.slice(1, 4),
            fetchedAt,
            syncMetadata: nextSyncMetadata,
        };
        this.lastSyncAt = fetchedAt;
        this.lastSyncError = null;
        await this.appendSyncTelemetry({
            createdAt: fetchedAt,
            reason,
            requestCountsByTool: { ...livePayload.diagnostics.requestCountsByTool },
            rateLimitedTools: [...livePayload.diagnostics.rateLimitedTools],
            transcriptAttempts: livePayload.diagnostics.requestCountsByTool.get_meeting_transcript ??
                livePayload.diagnostics.requestCountsByTool.getMeetingTranscript ??
                0,
            transcriptSkippedCount: livePayload.diagnostics.transcriptSkippedCount,
            extractionProcessed: extractionResult.processedMeetings,
            extractionDeferred,
        });
        return {
            ok: true,
            meetingCount: merged.meetings.length,
            fetchedAt,
            warning: compactWarnings[0],
        };
    }
    async syncNow(reason = 'manual-sync') {
        if (this.syncInFlightPromise) {
            return await this.syncInFlightPromise;
        }
        if (!this.isGranolaAuthenticated()) {
            return {
                ok: false,
                meetingCount: 0,
                fetchedAt: nowIso(),
                warning: 'Granola is not connected.',
            };
        }
        const cooldownUntil = this.syncCooldownUntilIso();
        if (cooldownUntil) {
            this.scheduleNextAutoSync();
            return {
                ok: false,
                meetingCount: 0,
                fetchedAt: nowIso(),
                warning: `Granola sync is cooling down until ${formatRetryTime(cooldownUntil)}.`,
            };
        }
        const syncPromise = this.withAuthenticatedClient(async (client) => {
            try {
                return await this.syncMeetingsWithClient(client, reason);
            }
            catch (error) {
                this.lastSyncError = safeErrorMessage(error);
                return {
                    ok: false,
                    meetingCount: 0,
                    fetchedAt: nowIso(),
                    warning: this.lastSyncError,
                };
            }
        });
        this.syncInFlightPromise = syncPromise;
        try {
            return await syncPromise;
        }
        finally {
            if (this.syncInFlightPromise === syncPromise) {
                this.syncInFlightPromise = null;
            }
            this.scheduleNextAutoSync();
        }
    }
    async runTodoExtraction(reason, meetingsInput) {
        return await this.runTodoExtractionInternal(reason, meetingsInput);
    }
    async extractTodoCandidates(meeting, prompt, client) {
        if (this.extractTodosForMeeting) {
            const answer = await this.extractTodosForMeeting(meeting, prompt);
            return parseExtractedTodos(answer);
        }
        if (client) {
            const response = await queryGranolaMeetings(client, prompt, [meeting.id]);
            return parseExtractedTodos(response.answer);
        }
        const response = await this.withAuthenticatedClient(async (freshClient) => {
            return await queryGranolaMeetings(freshClient, prompt, [meeting.id]);
        });
        return parseExtractedTodos(response.answer);
    }
    async runTodoExtractionInternal(reason, meetingsInput, sharedClient = null) {
        if (!this.allowUnauthenticatedExtraction && !this.isGranolaAuthenticated() && !this.extractTodosForMeeting) {
            return {
                ok: false,
                skipped: true,
                reason: 'disabled_or_not_authenticated',
                processedMeetings: 0,
                extractedCount: 0,
                discoveredCount: 0,
                updatedCount: 0,
            };
        }
        if (this.todoState.extractionInFlight) {
            this.todoState.extractionPendingReason = reason;
            return {
                ok: true,
                skipped: true,
                reason: 'already_running',
                processedMeetings: 0,
                extractedCount: 0,
                discoveredCount: 0,
                updatedCount: 0,
            };
        }
        this.todoState.extractionInFlight = true;
        const extractionStartedAt = nowIso();
        try {
            const meetings = Array.isArray(meetingsInput) ? meetingsInput : this.cacheState.meetings;
            const meetingTasks = [];
            for (const meeting of meetings) {
                if (!meeting?.id) {
                    continue;
                }
                const sourceHash = createMeetingSourceHash(meeting);
                const previousHash = this.todoState.metadata.meetingSourceHashes?.[meeting.id];
                if (previousHash && previousHash === sourceHash) {
                    continue;
                }
                meetingTasks.push({
                    meeting,
                    sourceHash,
                });
            }
            const prioritizedMeetingTasks = [...meetingTasks]
                .sort((a, b) => parseDateForSort(b.meeting.date) - parseDateForSort(a.meeting.date))
                .slice(0, GranolaTaskService.MAX_EXTRACTION_MEETINGS_PER_SYNC);
            const extractionErrors = [];
            const extractedBuckets = [];
            const runForClient = async (client) => {
                for (const item of prioritizedMeetingTasks) {
                    const prompt = buildTodoExtractionPrompt(item.meeting);
                    try {
                        const extracted = await withTimeout(this.extractTodoCandidates(item.meeting, prompt, client), this.liveRequestTimeoutMs * 2, 'Todo extraction query timed out.');
                        extractedBuckets.push({
                            meeting: item.meeting,
                            sourceHash: item.sourceHash,
                            todos: extracted,
                        });
                    }
                    catch (error) {
                        extractionErrors.push(`Meeting ${item.meeting.id}: ${safeErrorMessage(error)}`);
                    }
                }
            };
            if (this.extractTodosForMeeting || sharedClient) {
                await runForClient(sharedClient);
            }
            else {
                await this.withAuthenticatedClient(async (client) => {
                    await runForClient(client);
                    return null;
                });
            }
            const extractionResult = await this.withTodoStateWrite(async () => {
                const fingerprintMap = new Map(this.todoState.todos.map((todo) => [todo.fingerprint, todo]));
                let discoveredCount = 0;
                let updatedCount = 0;
                let extractedCount = 0;
                for (const bucket of extractedBuckets) {
                    if (!this.todoState.metadata.meetingSourceHashes) {
                        this.todoState.metadata.meetingSourceHashes = {};
                    }
                    this.todoState.metadata.meetingSourceHashes[bucket.meeting.id] = bucket.sourceHash;
                    for (const candidate of bucket.todos) {
                        extractedCount += 1;
                        const fingerprint = createTodoFingerprint({
                            meetingId: bucket.meeting.id,
                            title: candidate.title,
                            description: candidate.description,
                            dueDate: candidate.dueDate,
                            owner: candidate.owner,
                        });
                        const existing = fingerprintMap.get(fingerprint);
                        const currentIso = nowIso();
                        if (existing) {
                            ensureTodoTelemetry(existing);
                            existing.meetingId = bucket.meeting.id;
                            existing.meetingTitle = bucket.meeting.title || 'Untitled Meeting';
                            existing.sourceHash = bucket.sourceHash;
                            existing.title = candidate.title;
                            existing.description = candidate.description;
                            existing.owner = candidate.owner;
                            existing.dueDate = candidate.dueDate;
                            existing.priority = candidate.priority;
                            existing.evidence = candidate.evidence;
                            existing.updatedAt = currentIso;
                            existing.runState = inferTodoRunState(existing);
                            appendTodoStep(existing, 'extracted', 'Todo details refreshed from latest meeting notes.', `Todo refreshed from extraction (${reason}).`);
                            updatedCount += 1;
                            continue;
                        }
                        const todo = {
                            todoId: randomUUID(),
                            fingerprint,
                            sourceHash: bucket.sourceHash,
                            meetingId: bucket.meeting.id,
                            meetingTitle: bucket.meeting.title || 'Untitled Meeting',
                            title: candidate.title,
                            description: candidate.description,
                            owner: candidate.owner,
                            dueDate: candidate.dueDate,
                            priority: candidate.priority,
                            evidence: candidate.evidence,
                            status: 'discovered',
                            attempts: 0,
                            createdAt: currentIso,
                            updatedAt: currentIso,
                            approvedAt: null,
                            submittedAt: null,
                            failedAt: null,
                            nextRetryAt: null,
                            publicSummary: '',
                            internalError: null,
                            runId: null,
                            runState: 'idle',
                            latestPublicStep: null,
                            stepEvents: [],
                            guardrail: {
                                mode: this.guardrailMode,
                                verdict: 'unknown',
                                reason: null,
                                checkedAt: null,
                            },
                            openclaw: {
                                lastStatus: null,
                                lastEndpoint: null,
                                lastRunId: null,
                                lastResponseAt: null,
                                lastError: null,
                            },
                        };
                        appendTodoStep(todo, 'extracted', 'Todo discovered from meeting notes.', `New todo created from extraction (${reason}).`);
                        this.todoState.todos.push(todo);
                        fingerprintMap.set(fingerprint, todo);
                        discoveredCount += 1;
                    }
                }
                this.todoState.lastExtractionAt = extractionStartedAt;
                const rateLimitErrors = extractionErrors.filter((message) => isRateLimitLikeMessage(message));
                const nonRateLimitErrors = extractionErrors.filter((message) => !isRateLimitLikeMessage(message));
                const mergedErrors = [];
                if (rateLimitErrors.length > 0) {
                    mergedErrors.push(`Todo extraction is rate-limited for ${rateLimitErrors.length} meeting(s). Deferred meetings will retry automatically.`);
                }
                mergedErrors.push(...nonRateLimitErrors.slice(0, 3));
                this.todoState.lastExtractionError = mergedErrors.length > 0 ? mergedErrors.join(' | ') : null;
                return {
                    processedMeetings: extractedBuckets.length,
                    extractedCount,
                    discoveredCount,
                    updatedCount,
                };
            });
            return {
                ok: true,
                skipped: false,
                ...extractionResult,
            };
        }
        finally {
            this.todoState.extractionInFlight = false;
            const pendingReason = this.todoState.extractionPendingReason;
            this.todoState.extractionPendingReason = null;
            if (pendingReason) {
                void this.runTodoExtractionInternal(pendingReason, meetingsInput, sharedClient);
            }
        }
    }
    async tasksRefreshExtraction() {
        const result = await this.runTodoExtractionInternal('manual-extract', this.cacheState.meetings);
        return {
            ok: result.ok,
            processedMeetings: result.processedMeetings,
            discoveredCount: result.discoveredCount,
            updatedCount: result.updatedCount,
        };
    }
    findTodo(todoId) {
        const match = this.todoState.todos.find((todo) => todo.todoId === todoId);
        return match ?? null;
    }
    emitTaskRunEvent(todoId, runId, phase, message) {
        this.emitRealtimeEvent({
            type: 'task-run',
            todoId,
            runId,
            phase,
            message: clampText(message, 700),
            createdAt: nowIso(),
        });
        this.emitFeedUpdated();
    }
    async finalizeTaskExecution(todoId, result) {
        await this.withTodoStateWrite(async () => {
            const todo = this.findTodo(todoId);
            if (!todo) {
                return;
            }
            ensureTodoTelemetry(todo);
            const completedAt = nowIso();
            todo.updatedAt = completedAt;
            todo.runId = result.runId ?? todo.runId ?? null;
            todo.openclaw.lastRunId = todo.runId;
            todo.openclaw.lastResponseAt = completedAt;
            if (result.ok) {
                todo.status = 'submitted';
                todo.submittedAt = completedAt;
                todo.failedAt = null;
                todo.internalError = null;
                if (result.finalText) {
                    todo.publicSummary = clampText(result.finalText, 5000);
                }
                else if (result.summary) {
                    todo.publicSummary = clampText(result.summary, 5000);
                }
                appendTodoStep(todo, 'execution_completed', 'IronClaw completed research for this task.', `IronClaw run completed (${todo.runId ?? 'unknown run'}).`);
                this.todoState.lastSubmissionAt = completedAt;
                this.todoState.lastSubmissionError = null;
            }
            else {
                todo.status = 'failed';
                todo.failedAt = completedAt;
                todo.internalError = result.error ?? result.summary;
                todo.openclaw.lastError = result.error ?? result.summary;
                appendTodoStep(todo, 'execution_failed', result.error ? `IronClaw failed: ${result.error}` : 'IronClaw run failed.', `IronClaw execution failed (${todo.runId ?? 'unknown run'}).`);
                this.todoState.lastSubmissionError = result.error ?? result.summary;
            }
            todo.runState = inferTodoRunState(todo);
        });
        this.emitFeedUpdated(true);
        this.emitTaskRunEvent(todoId, result.runId, result.ok ? 'completed' : 'failed', result.summary || result.error || 'Execution finished.');
    }
    async tasksStart(todoId) {
        const todo = this.findTodo(todoId);
        if (!todo) {
            return {
                ok: false,
                message: 'Task not found.',
            };
        }
        if (this.runningExecutions.has(todoId)) {
            return {
                ok: false,
                runId: todo.runId ?? undefined,
                message: 'Task is already running in IronClaw.',
            };
        }
        const executor = await this.refreshExecutorState();
        if (executor.state !== 'connected') {
            return {
                ok: false,
                message: executor.lastError || 'IronClaw is not connected. Use Reconnect and try again.',
            };
        }
        const meeting = this.cacheState.meetings.find((item) => item.id === todo.meetingId) ?? null;
        const prompt = buildExecutionPrompt(todo, meeting);
        await this.withTodoStateWrite(async () => {
            const current = this.findTodo(todoId);
            if (!current) {
                return;
            }
            ensureTodoTelemetry(current);
            current.attempts = (current.attempts ?? 0) + 1;
            current.status = 'submitting';
            current.updatedAt = nowIso();
            current.internalError = null;
            current.openclaw.lastError = null;
            current.openclaw.lastEndpoint = executor.gatewayUrl;
            current.runState = 'running';
            appendTodoStep(current, 'execution_started', 'Task started in IronClaw.', 'Execution started from Yogurt Tasks view.');
        });
        this.emitTaskRunEvent(todoId, todo.runId, 'started', 'Task started in IronClaw.');
        let latestSummary = '';
        const runHandle = this.ironclaw.startRun({
            prompt,
            agentId: this.ironclawAgentId,
            onEvent: (event) => {
                const current = this.findTodo(todoId);
                if (!current) {
                    return;
                }
                if (event.runId) {
                    current.runId = event.runId;
                    current.openclaw.lastRunId = event.runId;
                }
                if (event.kind === 'delta') {
                    latestSummary = event.message;
                    current.publicSummary = clampText(event.message, 5000);
                    current.latestPublicStep = clampText(event.message, 240);
                    current.updatedAt = nowIso();
                    this.emitTaskRunEvent(todoId, current.runId, 'delta', event.message);
                    return;
                }
                if (event.kind === 'started') {
                    current.updatedAt = nowIso();
                    this.emitTaskRunEvent(todoId, current.runId, 'started', event.message);
                    return;
                }
                if (event.finalText) {
                    latestSummary = event.finalText;
                }
            },
        });
        this.runningExecutions.set(todoId, {
            todoId,
            startedAt: nowIso(),
            runId: todo.runId ?? null,
            cancel: runHandle.cancel,
        });
        this.emitFeedUpdated(true);
        void runHandle.done
            .then(async (result) => {
            this.runningExecutions.delete(todoId);
            const summary = result.summary || (result.ok ? 'Execution completed.' : 'Execution failed.');
            await this.finalizeTaskExecution(todoId, {
                ...result,
                summary,
                finalText: result.finalText || latestSummary || null,
            });
        })
            .catch(async (error) => {
            this.runningExecutions.delete(todoId);
            const message = safeErrorMessage(error);
            await this.finalizeTaskExecution(todoId, {
                ok: false,
                runId: todo.runId,
                summary: message,
                finalText: latestSummary || null,
                error: message,
            });
        });
        return {
            ok: true,
            runId: todo.runId ?? undefined,
            message: 'Task execution started.',
        };
    }
    async tasksExecutorReconnect() {
        const state = await this.reconnectExecutorState();
        if (state.state === 'connected') {
            return {
                ok: true,
                message: 'Connected to IronClaw.',
            };
        }
        return {
            ok: false,
            message: state.lastError || 'Unable to reconnect to IronClaw.',
        };
    }
    async tasksOpenRun(todoId) {
        const todo = this.findTodo(todoId);
        if (!todo) {
            return {
                ok: false,
                message: 'Task not found.',
            };
        }
        const state = await this.refreshExecutorState();
        const url = state.dashboardUrl || (await this.ironclaw.getDashboardUrl().catch(() => null));
        if (!url) {
            return {
                ok: false,
                message: 'IronClaw dashboard URL is unavailable. Reconnect and try again.',
            };
        }
        try {
            await this.openExternal(url);
            this.executorState = {
                ...this.executorState,
                dashboardUrl: url,
            };
            this.emitFeedUpdated();
            return {
                ok: true,
                url,
            };
        }
        catch (error) {
            return {
                ok: false,
                message: safeErrorMessage(error),
            };
        }
    }
    getFeed() {
        const warning = this.todoState.lastSubmissionError
            ? 'Todo executor has recent submission issues. Admin review is required.'
            : this.cacheState.warnings[0] ?? null;
        return {
            connectionState: this.connectionState(),
            auth: this.authSnapshot(),
            executor: this.executorState,
            syncInFlight: Boolean(this.syncInFlightPromise),
            executionEnabled: this.executorState.state === 'connected',
            guardrailMode: this.guardrailMode,
            uiRefreshMs: this.uiRefreshMs,
            todos: this.sortedTodos().map((todo) => this.todoPublicView(todo)),
            counts: this.todoCountsSnapshot(),
            guardrailBlockedCount: this.guardrailBlockedCount(),
            lastSyncAt: this.lastSyncAt,
            lastSyncError: this.lastSyncError,
            syncHealth: this.computeSyncHealth(),
            nextAutoSyncAt: this.nextAutoSyncAt,
            cooldownUntil: this.syncCooldownUntilIso(),
            lastExtractionAt: this.todoState.lastExtractionAt,
            lastExtractionError: this.todoState.lastExtractionError,
            lastSubmissionAt: this.todoState.lastSubmissionAt,
            warning,
            warningDetails: warning && !this.todoState.lastSubmissionError ? this.cacheState.warningDetails : [],
        };
    }
}
