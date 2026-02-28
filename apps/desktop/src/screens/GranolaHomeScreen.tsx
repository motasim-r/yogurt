import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconButton, SidebarItem } from '../design-system/primitives';
import {
  BuildingsIcon,
  ChatIcon,
  FileIcon,
  FolderIcon,
  GrabberIcon,
  HomeIcon,
  LockIcon,
  PencilIcon,
  PeopleIcon,
  PlanPlusIcon,
  RecipesIcon,
  SearchIcon,
  SharedIcon,
  SparkleIcon,
  TrashIcon,
} from '../design-system/icons';
import { granolaClient } from '../lib/granolaClient';
import type { TaskChatMessage, TaskChatTrace, TaskItemPublic, TasksFeed, TasksRealtimeEvent } from '../shared/types';
import { MarkdownMessage } from '../components/MarkdownMessage';

type MainTab = 'home' | 'tasks';
type TasksViewMode = 'list' | 'chat';
const DISMISSED_WARNING_STORAGE_KEY = 'granola:copilot:dismissed-warnings:v1';

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function createWarningKey(summary: string, details: string[]): string {
  const normalizedSummary = summary.trim();
  const normalizedDetails = details.map((item) => item.trim()).filter((item) => item.length > 0);
  return `${normalizedSummary}::${normalizedDetails.join('|')}`;
}

function readDismissedWarningKeys(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(DISMISSED_WARNING_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function writeDismissedWarningKeys(values: Set<string>): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(DISMISSED_WARNING_STORAGE_KEY, JSON.stringify([...values]));
  } catch {
    // Ignore storage write failures (private mode/storage quota).
  }
}

function formatDate(value: string | null): string {
  if (!value) {
    return 'Never';
  }

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return value;
  }
  return date.toLocaleString();
}

function formatClock(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return '--:--';
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isPendingAuthorizationFresh(feed: TasksFeed | null): boolean {
  if (!feed?.auth.pendingAuthorizationUrl || !feed.auth.pendingExpiresAt) {
    return false;
  }
  const expiresAt = Date.parse(feed.auth.pendingExpiresAt);
  if (!Number.isFinite(expiresAt)) {
    return false;
  }
  return expiresAt > Date.now();
}

function priorityLabel(priority: TaskItemPublic['priority']): string {
  switch (priority) {
    case 'urgent':
      return 'Urgent';
    case 'high':
      return 'High';
    case 'low':
      return 'Low';
    default:
      return 'Medium';
  }
}

function statusLabel(status: TaskItemPublic['status']): string {
  return status.replace('_', ' ');
}

function runQueueLabel(task: TaskItemPublic): string {
  if (task.runQueueState === 'running' || task.runState === 'running') {
    return 'Running';
  }
  if (task.runQueueState === 'queued') {
    return 'Queued';
  }
  return 'Idle';
}

function syncHealthLabel(feed: TasksFeed | null): string {
  if (!feed) {
    return 'Healthy';
  }
  if (feed.syncHealth === 'cooldown') {
    return `Cooling down until ${formatDate(feed.cooldownUntil)}`;
  }
  if (feed.syncHealth === 'degraded') {
    return 'Degraded';
  }
  return 'Healthy';
}

function normalizeTask(task: TaskItemPublic): TaskItemPublic {
  const queueState =
    task.runQueueState === 'queued' || task.runQueueState === 'running' || task.runQueueState === 'idle'
      ? task.runQueueState
      : 'idle';
  return {
    ...task,
    runQueueState: queueState,
  };
}

function mergeMessageList(previous: TaskChatMessage[], incoming: TaskChatMessage[]): TaskChatMessage[] {
  const map = new Map<string, TaskChatMessage>();
  for (const item of previous) {
    map.set(item.messageId, item);
  }
  for (const item of incoming) {
    map.set(item.messageId, item);
  }
  return [...map.values()].sort((a, b) => {
    const left = Date.parse(a.createdAt);
    const right = Date.parse(b.createdAt);
    if (Number.isFinite(left) && Number.isFinite(right) && left !== right) {
      return left - right;
    }
    return a.messageId.localeCompare(b.messageId);
  });
}

function applyRealtimeEventToMessages(messages: TaskChatMessage[], event: TasksRealtimeEvent): TaskChatMessage[] {
  if (event.type === 'task-chat-message') {
    return mergeMessageList(messages, [event.message]);
  }
  if (event.type !== 'task-chat-delta') {
    return messages;
  }

  const next = [...messages];
  const index = next.findIndex((item) => item.messageId === event.messageId);
  if (index >= 0) {
    next[index] = {
      ...next[index],
      runId: event.runId,
      content: event.content,
      streaming: true,
      statusTag: 'streaming',
      createdAt: event.createdAt,
      trace: null,
    };
    return next;
  }

  next.push({
    messageId: event.messageId,
    todoId: event.todoId,
    runId: event.runId,
    role: 'assistant',
    content: event.content,
    createdAt: event.createdAt,
    streaming: true,
    statusTag: 'streaming',
    trace: null,
  });
  return mergeMessageList([], next);
}

type ChatRenderBlock =
  | { kind: 'trace-group'; key: string; messages: TaskChatMessage[] }
  | { kind: 'message'; key: string; message: TaskChatMessage };

type SourceRow = {
  key: string;
  domain: string;
  url: string;
};

function buildChatRenderBlocks(messages: TaskChatMessage[]): ChatRenderBlock[] {
  const blocks: ChatRenderBlock[] = [];
  let pendingTraceMessages: TaskChatMessage[] = [];
  let pendingGroupKey: string | null = null;

  const flushTrace = () => {
    if (pendingTraceMessages.length === 0) {
      return;
    }
    blocks.push({
      kind: 'trace-group',
      key: pendingGroupKey || `trace-${pendingTraceMessages[0]?.messageId ?? blocks.length}`,
      messages: pendingTraceMessages,
    });
    pendingTraceMessages = [];
    pendingGroupKey = null;
  };

  for (const message of messages) {
    if (!message.trace) {
      flushTrace();
      blocks.push({
        kind: 'message',
        key: message.messageId,
        message,
      });
      continue;
    }

    const groupKey = message.runId || message.trace.groupId || 'trace-unknown';
    if (pendingTraceMessages.length > 0 && pendingGroupKey !== groupKey) {
      flushTrace();
    }
    pendingGroupKey = groupKey;
    pendingTraceMessages.push(message);
  }
  flushTrace();
  return blocks;
}

function traceDetailRows(trace: TaskChatTrace): Array<{ key: string; value: string }> {
  const rows: Array<{ key: string; value: string }> = [];
  if (trace.detail && trace.detail.trim()) {
    rows.push({ key: 'detail', value: trace.detail.trim() });
  }
  if (trace.toolArgs && trace.toolArgs.trim()) {
    rows.push({ key: 'toolArgs', value: trace.toolArgs.trim() });
  }
  if (trace.toolMeta && trace.toolMeta.trim()) {
    rows.push({ key: 'toolMeta', value: trace.toolMeta.trim() });
  }
  return rows;
}

function collectSourceRows(messages: TaskChatMessage[]): SourceRow[] {
  const map = new Map<string, SourceRow>();
  for (const message of messages) {
    const trace = message.trace;
    if (!trace || trace.kind !== 'source_fetch') {
      continue;
    }
    const url = (trace.sourceUrl || trace.detail || '').trim();
    if (!url || map.has(url)) {
      continue;
    }
    map.set(url, {
      key: `${message.messageId}-${url}`,
      domain: (trace.domain || 'source').trim(),
      url,
    });
  }
  return [...map.values()];
}

function traceRowSymbol(trace: TaskChatTrace): string {
  if (trace.kind === 'thought') {
    return '•';
  }
  if (trace.kind === 'phase') {
    return '◉';
  }
  if (trace.kind === 'source_fetch') {
    return '◌';
  }
  if (trace.kind === 'tool_result' && trace.isError) {
    return '×';
  }
  return '○';
}

function RunTraceGroup({
  messages,
  expandedRows,
  onToggleRow,
}: {
  messages: TaskChatMessage[];
  expandedRows: Set<string>;
  onToggleRow: (messageId: string) => void;
}) {
  const thoughtRows = messages.filter((item) => item.trace?.kind === 'thought');
  const actionRows = messages.filter((item) => {
    const kind = item.trace?.kind;
    return kind === 'phase' || kind === 'tool_start' || kind === 'tool_result';
  });
  const sourceRows = collectSourceRows(messages);

  const renderRows = (rows: TaskChatMessage[]) =>
    rows.map((message) => {
      const trace = message.trace;
      if (!trace) {
        return null;
      }
      const details = traceDetailRows(trace);
      const isExpanded = expandedRows.has(message.messageId);
      const showToggle = details.length > 0;
      return (
        <div key={message.messageId} className={cx('run-trace__row', trace.isError && 'is-error')}>
          <span className="run-trace__icon" aria-hidden="true">
            {traceRowSymbol(trace)}
          </span>
          <div>
            <div className="run-trace__title">
              <span>{trace.title}</span>
              <span>{formatClock(message.createdAt)}</span>
            </div>
            {showToggle ? (
              <button
                type="button"
                className="run-trace__toggle"
                onClick={() => {
                  onToggleRow(message.messageId);
                }}
              >
                {isExpanded ? 'Hide details' : 'Show details'}
              </button>
            ) : null}
            {showToggle && isExpanded ? (
              <div className="run-trace__details">
                {details.map((detail) => (
                  <pre key={`${message.messageId}-${detail.key}`}>{detail.value}</pre>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      );
    });

  return (
    <article className="run-trace">
      <div className="run-trace__rail" aria-hidden="true" />
      <div>
        {thoughtRows.length > 0 ? (
          <section className="run-trace__section">
            <h3>Thought</h3>
            {renderRows(thoughtRows)}
          </section>
        ) : null}

        {actionRows.length > 0 ? (
          <section className="run-trace__section">
            <h3>Actions</h3>
            {renderRows(actionRows)}
          </section>
        ) : null}

        {sourceRows.length > 0 ? (
          <section className="run-trace__section">
            <h3>Sources</h3>
            <div className="run-sources-card">
              <p>Fetched {sourceRows.length} source{sourceRows.length === 1 ? '' : 's'}</p>
              {sourceRows.map((source) => (
                <div key={source.key} className="run-sources-card__row">
                  <span className="run-sources-card__domain">{source.domain}</span>
                  <a className="run-sources-card__url" href={source.url} target="_blank" rel="noreferrer">
                    {source.url}
                  </a>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}

function ChatBubble({ message }: { message: TaskChatMessage }) {
  const roleLabel =
    message.role === 'assistant' ? 'Assistant' : message.role === 'user' ? 'You' : message.role === 'status' ? 'Status' : 'System';

  if (message.role === 'assistant' && !message.streaming) {
    return (
      <article className="run-final-answer">
        <header>
          <span>Final result</span>
          <span>{formatClock(message.createdAt)}</span>
        </header>
        <MarkdownMessage content={message.content || '...'} />
      </article>
    );
  }

  return (
    <article className={cx('copilot-chat-bubble', `is-${message.role}`, message.streaming && 'is-streaming')}>
      <header className="copilot-chat-bubble__header">
        <span>{roleLabel}</span>
        <span>{formatClock(message.createdAt)}</span>
      </header>
      <div className="copilot-chat-bubble__content">
        {message.role === 'assistant' || message.role === 'system' ? (
          <MarkdownMessage content={message.content || '...'} />
        ) : (
          <p>{message.content || '...'}</p>
        )}
      </div>
    </article>
  );
}

function TaskListRow({
  task,
  selected,
  onSelect,
  onOpenChat,
  onStart,
  isStarting,
}: {
  task: TaskItemPublic;
  selected: boolean;
  onSelect: () => void;
  onOpenChat: () => void;
  onStart: () => void;
  isStarting: boolean;
}) {
  const title = task.title.trim() || task.description.trim() || task.meetingTitle || 'Untitled task';
  const subtitle = task.meetingTitle || task.description || 'No context';
  const running = task.runState === 'running' || task.runQueueState === 'running';

  return (
    <article className={cx('copilot-task-row', selected && 'is-selected')}>
      <div
        className="copilot-task-row__main"
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect();
          }
        }}
      >
        <div className="copilot-task-row__copy">
          <p className="copilot-task-row__title">{title}</p>
          <p className="copilot-task-row__subtitle">{subtitle}</p>
        </div>
        <div className="copilot-task-row__meta">
          <span className={cx('copilot-chip', `is-status-${task.status}`)}>{statusLabel(task.status)}</span>
          <span className={cx('copilot-chip', `is-queue-${task.runQueueState}`)}>{runQueueLabel(task)}</span>
          <span className="copilot-chip">{priorityLabel(task.priority)}</span>
        </div>
      </div>
      <div className="copilot-task-row__actions">
        <button type="button" className="copilot-secondary-button" onClick={onOpenChat}>
          Open Chat
        </button>
        <button
          type="button"
          className="copilot-primary-button"
          onClick={onStart}
          disabled={isStarting || running}
        >
          {isStarting || running ? 'Running...' : 'Start Task'}
        </button>
      </div>
    </article>
  );
}

type CopilotWarningProps = {
  summary: string;
  details: string[];
  listKeyPrefix: string;
  onHide: () => void;
};

function CopilotWarning({ summary, details, listKeyPrefix, onHide }: CopilotWarningProps) {
  return (
    <div className="copilot-warning">
      <div className="copilot-warning__top">
        <p>{summary}</p>
        <button type="button" className="copilot-warning__hide" onClick={onHide}>
          Hide
        </button>
      </div>
      {details.length > 0 ? (
        <ul>
          {details.slice(0, 3).map((item, index) => (
            <li key={`${listKeyPrefix}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function GranolaHomeScreen() {
  const [activeTab, setActiveTab] = useState<MainTab>('tasks');
  const [tasksViewMode, setTasksViewMode] = useState<TasksViewMode>('list');
  const [tasksFeed, setTasksFeed] = useState<TasksFeed | null>(null);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReconnectingExecutor, setIsReconnectingExecutor] = useState(false);
  const [startingTodoId, setStartingTodoId] = useState<string | null>(null);
  const [openingRunTodoId, setOpeningRunTodoId] = useState<string | null>(null);

  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<TaskChatMessage[]>([]);
  const [threadNextCursor, setThreadNextCursor] = useState<string | null>(null);
  const [threadHasMore, setThreadHasMore] = useState(false);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadLoadingOlder, setThreadLoadingOlder] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [expandedTraceRows, setExpandedTraceRows] = useState<Set<string>>(() => new Set());
  const [dismissedWarningKeys, setDismissedWarningKeys] = useState<Set<string>>(() => new Set(readDismissedWarningKeys()));

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);

  const isElectronRuntime = typeof window !== 'undefined' && Boolean(window.granola);
  const tasks = useMemo(() => (tasksFeed?.todos ?? []).map(normalizeTask), [tasksFeed]);
  const selectedTask = useMemo(() => tasks.find((item) => item.todoId === selectedTodoId) ?? null, [tasks, selectedTodoId]);
  const activeRunTodoId = tasksFeed?.activeRunTodoId ?? null;
  const selectedRunActive = Boolean(selectedTodoId && activeRunTodoId === selectedTodoId);
  const chatRenderBlocks = useMemo(() => buildChatRenderBlocks(threadMessages), [threadMessages]);
  const showWorkingIndicator =
    selectedRunActive || threadMessages.some((message) => message.role === 'assistant' && message.streaming);
  const activeWarningKey = useMemo(
    () => (tasksFeed?.warning ? createWarningKey(tasksFeed.warning, tasksFeed.warningDetails) : null),
    [tasksFeed?.warning, tasksFeed?.warningDetails],
  );
  const showCopilotWarning = Boolean(tasksFeed?.warning && activeWarningKey && !dismissedWarningKeys.has(activeWarningKey));

  const keepTasksAsPrimaryTab = useCallback(() => {
    setActiveTab('tasks');
  }, []);

  const toggleTraceRow = useCallback((messageId: string) => {
    setExpandedTraceRows((current) => {
      const next = new Set(current);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  }, []);

  const handleHideWarning = useCallback(() => {
    if (!activeWarningKey) {
      return;
    }
    setDismissedWarningKeys((current) => {
      if (current.has(activeWarningKey)) {
        return current;
      }
      const next = new Set(current);
      next.add(activeWarningKey);
      return next;
    });
  }, [activeWarningKey]);

  useEffect(() => {
    writeDismissedWarningKeys(dismissedWarningKeys);
  }, [dismissedWarningKeys]);

  useEffect(() => {
    setExpandedTraceRows(new Set());
  }, [selectedTodoId]);

  const scrollMessagesToBottom = useCallback((smooth = false) => {
    const element = messagesViewportRef.current;
    if (!element) {
      return;
    }
    if (typeof element.scrollTo === 'function') {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
      return;
    }
    element.scrollTop = element.scrollHeight;
  }, []);

  const fetchTasksFeed = useCallback(async (): Promise<TasksFeed | null> => {
    try {
      const next = await granolaClient.tasksGetFeed();
      setTasksFeed(next);
      setTasksError(null);

      setSelectedTodoId((current) => {
        if (current && next.todos.some((todo) => todo.todoId === current)) {
          return current;
        }
        if (next.selectedTodoIdHint && next.todos.some((todo) => todo.todoId === next.selectedTodoIdHint)) {
          return next.selectedTodoIdHint;
        }
        return next.todos[0]?.todoId ?? null;
      });
      return next;
    } catch (error) {
      setTasksError(error instanceof Error ? error.message : 'Unable to load tasks feed.');
      return null;
    }
  }, []);

  const fetchThread = useCallback(
    async (todoId: string, cursor: string | null, appendOlder: boolean): Promise<void> => {
      if (!todoId) {
        return;
      }

      if (appendOlder) {
        setThreadLoadingOlder(true);
      } else {
        setThreadLoading(true);
      }

      try {
        const page = await granolaClient.tasksGetThread(todoId, cursor, 40);
        setThreadNextCursor(page.nextCursor);
        setThreadHasMore(page.hasMore);
        setThreadMessages((current) => (appendOlder ? mergeMessageList(page.messages, current) : page.messages));
      } catch (error) {
        setTasksError(error instanceof Error ? error.message : 'Unable to load task thread.');
      } finally {
        if (appendOlder) {
          setThreadLoadingOlder(false);
        } else {
          setThreadLoading(false);
        }
      }
    },
    [],
  );

  const openTaskChat = useCallback(
    async (todoId: string) => {
      setSelectedTodoId(todoId);
      setTasksViewMode('chat');
      setLiveStatus(null);
      await fetchThread(todoId, null, false);
      scrollMessagesToBottom(false);
    },
    [fetchThread, scrollMessagesToBottom],
  );

  const scheduleFeedRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      return;
    }
    refreshTimerRef.current = setTimeout(() => {
      refreshTimerRef.current = null;
      void fetchTasksFeed();
    }, 200);
  }, [fetchTasksFeed]);

  useEffect(() => {
    void fetchTasksFeed();
  }, [fetchTasksFeed]);

  useEffect(() => {
    if (!selectedTodoId || tasksViewMode !== 'chat') {
      return;
    }
    void fetchThread(selectedTodoId, null, false);
  }, [fetchThread, selectedTodoId, tasksViewMode]);

  useEffect(() => {
    const unsubscribe = granolaClient.tasksSubscribe((event) => {
      if (event.type === 'task-chat-status' && event.todoId === selectedTodoId) {
        setLiveStatus(event.message);
      }
      if (event.type === 'task-run' && event.phase === 'failed') {
        setTasksError(event.message);
      }
      if (
        selectedTodoId &&
        (event.type === 'task-chat-message' || event.type === 'task-chat-delta') &&
        event.todoId === selectedTodoId
      ) {
        setThreadMessages((current) => applyRealtimeEventToMessages(current, event));
      }
      scheduleFeedRefresh();
    });

    return () => {
      unsubscribe();
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [scheduleFeedRefresh, selectedTodoId]);

  useEffect(() => {
    if (activeTab !== 'tasks') {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      const next = await fetchTasksFeed();
      const waitMs = next?.uiRefreshMs ?? 5000;
      if (!cancelled) {
        timer = setTimeout(() => {
          void tick();
        }, waitMs);
      }
    };

    void tick();
    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [activeTab, fetchTasksFeed]);

  useEffect(() => {
    if (tasksViewMode !== 'chat') {
      return;
    }
    scrollMessagesToBottom(false);
  }, [threadMessages, scrollMessagesToBottom, tasksViewMode]);

  const handleSidebarGranolaAction = useCallback(async () => {
    if (isConnecting || isSyncing) {
      return;
    }

    const feed = tasksFeed ?? (await fetchTasksFeed());
    if (!feed) {
      return;
    }

    const hasFreshPendingAuthorization = isPendingAuthorizationFresh(feed);

    if (!feed.auth.authenticated && hasFreshPendingAuthorization) {
      const result = await granolaClient.tasksOpenPendingAuthorization();
      if (!result.ok && result.message) {
        setTasksError(result.message);
      }
      await fetchTasksFeed();
      return;
    }

    if (feed.auth.authenticated) {
      setIsSyncing(true);
      try {
        const result = await granolaClient.tasksSyncNow();
        if (!result.ok && result.warning) {
          setTasksError(result.warning);
        } else {
          setTasksError(null);
        }
      } catch (error) {
        setTasksError(error instanceof Error ? error.message : 'Unable to sync meetings.');
      } finally {
        setIsSyncing(false);
        await fetchTasksFeed();
      }
      return;
    }

    setIsConnecting(true);
    try {
      const result = await granolaClient.tasksConnect();
      if (!result.ok && result.message) {
        setTasksError(result.message);
      } else {
        setTasksError(null);
      }
    } catch (error) {
      setTasksError(error instanceof Error ? error.message : 'Unable to connect Granola.');
    } finally {
      setIsConnecting(false);
      await fetchTasksFeed();
    }
  }, [fetchTasksFeed, isConnecting, isSyncing, tasksFeed]);

  const handleStartTodo = useCallback(
    async (todoId: string) => {
      if (startingTodoId) {
        return;
      }
      setSelectedTodoId(todoId);
      setTasksViewMode('chat');
      setStartingTodoId(todoId);
      setLiveStatus('Starting task execution...');
      try {
        const result = await granolaClient.tasksStart(todoId);
        if (!result.ok && result.message) {
          setTasksError(result.message);
        } else {
          setTasksError(null);
        }
      } catch (error) {
        setTasksError(error instanceof Error ? error.message : 'Unable to start task.');
      } finally {
        setStartingTodoId(null);
        await fetchTasksFeed();
        await fetchThread(todoId, null, false);
      }
    },
    [fetchTasksFeed, fetchThread, startingTodoId],
  );

  const handleSendMessage = useCallback(async () => {
    if (!selectedTodoId || isSendingMessage) {
      return;
    }
    const trimmed = composerText.trim();
    if (!trimmed) {
      return;
    }
    setIsSendingMessage(true);
    setComposerText('');
    try {
      const result = await granolaClient.tasksSendMessage(selectedTodoId, trimmed);
      if (!result.ok && result.message) {
        setTasksError(result.message);
      } else {
        setTasksError(null);
      }
    } catch (error) {
      setTasksError(error instanceof Error ? error.message : 'Unable to send message.');
    } finally {
      setIsSendingMessage(false);
      await fetchTasksFeed();
    }
  }, [composerText, fetchTasksFeed, isSendingMessage, selectedTodoId]);

  const handleCancelRun = useCallback(async () => {
    if (!selectedTodoId) {
      return;
    }
    try {
      const result = await granolaClient.tasksCancelActiveRun(selectedTodoId);
      if (!result.ok && result.message) {
        setTasksError(result.message);
      } else {
        setTasksError(null);
      }
    } catch (error) {
      setTasksError(error instanceof Error ? error.message : 'Unable to cancel run.');
    } finally {
      await fetchTasksFeed();
    }
  }, [fetchTasksFeed, selectedTodoId]);

  const handleClearThread = useCallback(async () => {
    if (!selectedTodoId) {
      return;
    }
    try {
      const result = await granolaClient.tasksClearThread(selectedTodoId);
      if (!result.ok && result.message) {
        setTasksError(result.message);
      } else {
        setTasksError(null);
      }
      await fetchThread(selectedTodoId, null, false);
    } catch (error) {
      setTasksError(error instanceof Error ? error.message : 'Unable to clear thread.');
    }
  }, [fetchThread, selectedTodoId]);

  const handleOpenTodoRun = useCallback(
    async (todoId: string) => {
      if (openingRunTodoId) {
        return;
      }
      setOpeningRunTodoId(todoId);
      try {
        const result = await granolaClient.tasksOpenRun(todoId);
        if (!result.ok && result.message) {
          setTasksError(result.message);
        } else {
          setTasksError(null);
        }
      } catch (error) {
        setTasksError(error instanceof Error ? error.message : 'Unable to open run.');
      } finally {
        setOpeningRunTodoId(null);
      }
    },
    [openingRunTodoId],
  );

  const handleReconnectExecutor = useCallback(async () => {
    if (isReconnectingExecutor) {
      return;
    }
    setIsReconnectingExecutor(true);
    try {
      const result = await granolaClient.tasksExecutorReconnect();
      if (!result.ok && result.message) {
        setTasksError(result.message);
      } else {
        setTasksError(null);
      }
    } catch (error) {
      setTasksError(error instanceof Error ? error.message : 'Unable to reconnect IronClaw.');
    } finally {
      setIsReconnectingExecutor(false);
      await fetchTasksFeed();
    }
  }, [fetchTasksFeed, isReconnectingExecutor]);

  const sidebarActionLabel = isConnecting
    ? 'Connecting...'
    : isSyncing
      ? 'Syncing...'
      : tasksFeed?.connectionState === 'authorizing' && isPendingAuthorizationFresh(tasksFeed)
        ? 'Resume Authorization'
        : tasksFeed?.auth.authenticated
          ? 'Sync Granola'
          : 'Connect Granola';

  const activityLabel = liveStatus ?? (showWorkingIndicator ? 'Working on it...' : null);

  return (
    <div className="granola-frame" data-name="Granola" data-node-id="13:2">
      <aside className="granola-sidebar">
        <div className="sidebar-top" />

        <div className="sidebar-search-stack">
          <div className="sidebar-search-pill" role="search">
            <SearchIcon className="glyph-14" />
            <span className="sidebar-search-pill__label">Search</span>
            <kbd>CMD+K</kbd>
          </div>
          <IconButton ariaLabel="Create note" outline>
            <PencilIcon className="glyph-16" />
          </IconButton>
        </div>

        <nav className="sidebar-primary" aria-label="Primary">
          <SidebarItem icon={<HomeIcon className="glyph-16" />} label="Home" active={activeTab === 'home'} onClick={keepTasksAsPrimaryTab} />
          <SidebarItem icon={<SharedIcon className="glyph-16" />} label="Shared with me" onClick={keepTasksAsPrimaryTab} />
          <SidebarItem icon={<ChatIcon className="glyph-16" />} label="Chat" onClick={keepTasksAsPrimaryTab} />
          <SidebarItem icon={<FileIcon className="glyph-16" />} label="Tasks" active={activeTab === 'tasks'} onClick={keepTasksAsPrimaryTab} />
        </nav>

        <section className="sidebar-spaces" aria-label="Spaces">
          <p className="sidebar-spaces__title">Spaces</p>
          <div className="sidebar-space-group">
            <button type="button" className="sidebar-space-root is-root-active">
              <span className="sidebar-space-root__icon">
                <LockIcon className="glyph-16" />
              </span>
              <span>My notes</span>
            </button>
            <button type="button" className="sidebar-space-add">
              <span className="sidebar-space-list__icon">
                <FolderIcon className="glyph-16" />
              </span>
              <span>Add folder</span>
            </button>
          </div>
          <div className="sidebar-space-group">
            <button type="button" className="sidebar-space-root">
              <span className="sidebar-space-root__icon is-initial">M</span>
              <span>Motasim HQ</span>
            </button>
            <button type="button" className="sidebar-space-add">
              <span className="sidebar-space-list__icon">
                <FolderIcon className="glyph-16" />
              </span>
              <span>Add folder</span>
            </button>
          </div>
        </section>

        <div className="sidebar-footer-tools">
          <div className="sidebar-footer-icons">
            <IconButton ariaLabel="Recipes">
              <RecipesIcon className="glyph-16" />
            </IconButton>
            <IconButton ariaLabel="People">
              <PeopleIcon className="glyph-16" />
            </IconButton>
            <IconButton ariaLabel="Buildings">
              <BuildingsIcon className="glyph-16" />
            </IconButton>
            <IconButton ariaLabel="Trash">
              <TrashIcon className="glyph-16" />
            </IconButton>
          </div>
          <div className="sidebar-plan-pill">
            <span className="sidebar-plan-pill__copy">
              <strong>Free Trial</strong>
              <small>5 Days Left</small>
            </span>
            <PlanPlusIcon className="glyph-20" />
          </div>
        </div>

        <div className="sidebar-connect-dock">
          <button
            type="button"
            className="sidebar-connect-dock__button"
            onClick={() => {
              void handleSidebarGranolaAction();
            }}
            disabled={isConnecting || isSyncing}
          >
            <SparkleIcon className="glyph-16" />
            <span>{sidebarActionLabel}</span>
          </button>
        </div>

        <div className="sidebar-user">
          <span className="sidebar-user__avatar">M</span>
          <span className="sidebar-user__name">Motasim Rahmar</span>
          <GrabberIcon className="glyph-12 sidebar-user__grabber" />
        </div>
      </aside>

      <main className="granola-main">
        <section className="copilot-shell" aria-label="Tasks Copilot">
          <header className="copilot-header">
            <h1>Tasks</h1>
            <div className="copilot-header__meta">
              <span className={cx('copilot-chip', `is-${tasksFeed?.executor.state ?? 'unknown'}`)}>
                IronClaw: {tasksFeed?.executor.state ?? 'unknown'}
              </span>
              <button type="button" className="copilot-secondary-button" onClick={() => void handleReconnectExecutor()} disabled={isReconnectingExecutor}>
                {isReconnectingExecutor ? 'Reconnecting...' : 'Reconnect'}
              </button>
              <span className={cx('copilot-chip', `is-health-${tasksFeed?.syncHealth ?? 'healthy'}`)}>{syncHealthLabel(tasksFeed)}</span>
              {!isElectronRuntime ? <span className="copilot-chip is-warning">Electron runtime required for connect/sync/execution.</span> : null}
            </div>
          </header>

          {tasksError ? <p className="copilot-error">{tasksError}</p> : null}

          {tasksViewMode === 'list' ? (
            <section className="copilot-list-view" aria-label="Task list">
              <div className="copilot-list-stats">
                <span>Last sync: {formatDate(tasksFeed?.lastSyncAt ?? null)}</span>
                <span>Next auto-sync: {formatDate(tasksFeed?.nextAutoSyncAt ?? null)}</span>
                <span>Discovered: {tasksFeed?.counts.discovered ?? 0}</span>
                <span>Submitted: {tasksFeed?.counts.submitted ?? 0}</span>
                <span>Queued runs: {tasksFeed?.queuedRunCount ?? 0}</span>
              </div>

              {showCopilotWarning && tasksFeed?.warning ? (
                <CopilotWarning
                  summary={tasksFeed.warning}
                  details={tasksFeed.warningDetails}
                  listKeyPrefix="warning-list"
                  onHide={handleHideWarning}
                />
              ) : null}

              <div className="copilot-task-list">
                {tasks.length === 0 ? (
                  <p className="copilot-empty">
                    {tasksFeed?.auth.authenticated
                      ? 'No tasks extracted yet. Sync Granola to pull meetings.'
                      : 'Connect Granola to start extracting tasks.'}
                  </p>
                ) : null}
                {tasks.map((task) => (
                  <TaskListRow
                    key={task.todoId}
                    task={task}
                    selected={task.todoId === selectedTodoId}
                    onSelect={() => {
                      setSelectedTodoId(task.todoId);
                    }}
                    onOpenChat={() => {
                      void openTaskChat(task.todoId);
                    }}
                    onStart={() => {
                      void handleStartTodo(task.todoId);
                    }}
                    isStarting={startingTodoId === task.todoId}
                  />
                ))}
              </div>
            </section>
          ) : (
            <section className="copilot-chat-view" aria-label="Task chat">
              <header className="copilot-chat-topbar">
                <button
                  type="button"
                  className="copilot-secondary-button"
                  onClick={() => {
                    setTasksViewMode('list');
                    setLiveStatus(null);
                  }}
                >
                  Back to tasks
                </button>
                <div className="copilot-chat-topbar__copy">
                  <h2>{selectedTask?.title ?? 'Select a task'}</h2>
                  <p>{selectedTask?.meetingTitle ?? 'Task chat is ready.'}</p>
                </div>
                <div className="copilot-chat-topbar__actions">
                  <button
                    type="button"
                    className="copilot-primary-button"
                    onClick={() => {
                      if (selectedTodoId) {
                        void handleStartTodo(selectedTodoId);
                      }
                    }}
                    disabled={!selectedTodoId || Boolean(startingTodoId)}
                  >
                    {startingTodoId && selectedTodoId === startingTodoId ? 'Starting...' : 'Start Task'}
                  </button>
                  <button
                    type="button"
                    className="copilot-secondary-button"
                    onClick={() => {
                      if (selectedTodoId) {
                        void handleCancelRun();
                      }
                    }}
                    disabled={!selectedTodoId || activeRunTodoId !== selectedTodoId}
                  >
                    Stop
                  </button>
                  <button
                    type="button"
                    className="copilot-secondary-button"
                    onClick={() => {
                      if (selectedTodoId) {
                        void handleOpenTodoRun(selectedTodoId);
                      }
                    }}
                    disabled={!selectedTodoId || openingRunTodoId === selectedTodoId}
                  >
                    {openingRunTodoId === selectedTodoId ? 'Opening...' : 'Open in IronClaw'}
                  </button>
                  <button
                    type="button"
                    className="copilot-secondary-button"
                    onClick={() => {
                      void handleClearThread();
                    }}
                    disabled={!selectedTodoId}
                  >
                    Clear
                  </button>
                </div>
              </header>

              <details className="copilot-runtime-drawer">
                <summary>Runtime details</summary>
                <div className="copilot-runtime-drawer__grid">
                  <span>Profile: {tasksFeed?.runtime.ironclawProfile ?? 'ironclaw'}</span>
                  <span>Version: {tasksFeed?.runtime.ironclawVersion ?? 'unknown'}</span>
                  <span>Last sync: {formatDate(tasksFeed?.lastSyncAt ?? null)}</span>
                  <span>Next auto-sync: {formatDate(tasksFeed?.nextAutoSyncAt ?? null)}</span>
                  <span>Discovered: {tasksFeed?.counts.discovered ?? 0}</span>
                  <span>Submitted: {tasksFeed?.counts.submitted ?? 0}</span>
                </div>
              </details>

              {activityLabel ? (
                <div className="copilot-live-status">
                  <span className={cx('copilot-live-status__spinner', showWorkingIndicator && 'is-active')} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span>{activityLabel}</span>
                </div>
              ) : null}

              {showCopilotWarning && tasksFeed?.warning ? (
                <CopilotWarning
                  summary={tasksFeed.warning}
                  details={tasksFeed.warningDetails}
                  listKeyPrefix="warning-chat"
                  onHide={handleHideWarning}
                />
              ) : null}

              <div ref={messagesViewportRef} className="copilot-chat-messages">
                {threadHasMore ? (
                  <button
                    type="button"
                    className="copilot-load-older"
                    onClick={() => {
                      if (selectedTodoId && threadNextCursor) {
                        void fetchThread(selectedTodoId, threadNextCursor, true);
                      }
                    }}
                    disabled={threadLoadingOlder}
                  >
                    {threadLoadingOlder ? 'Loading...' : 'Load older messages'}
                  </button>
                ) : null}

                {threadLoading ? <p className="copilot-empty">Loading chat...</p> : null}
                {!threadLoading && threadMessages.length === 0 ? (
                  <p className="copilot-empty">No messages yet. Click Start Task or send a message to begin.</p>
                ) : null}
                {chatRenderBlocks.map((block) => {
                  if (block.kind === 'trace-group') {
                    return (
                      <RunTraceGroup
                        key={block.key}
                        messages={block.messages}
                        expandedRows={expandedTraceRows}
                        onToggleRow={toggleTraceRow}
                      />
                    );
                  }
                  const message = block.message;
                  if (message.role === 'assistant' && message.streaming && selectedRunActive) {
                    return null;
                  }
                  return <ChatBubble key={block.key} message={message} />;
                })}
              </div>

              <div className="copilot-composer">
                <textarea
                  value={composerText}
                  onChange={(event) => {
                    setComposerText(event.target.value);
                  }}
                  placeholder="Message task copilot..."
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void handleSendMessage();
                    }
                  }}
                  disabled={!selectedTodoId || isSendingMessage}
                />
                <button
                  type="button"
                  className="copilot-primary-button"
                  onClick={() => {
                    void handleSendMessage();
                  }}
                  disabled={!selectedTodoId || isSendingMessage || composerText.trim().length === 0}
                >
                  {isSendingMessage ? 'Sending...' : 'Send'}
                </button>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
