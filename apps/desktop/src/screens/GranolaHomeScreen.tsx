import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActionPill, IconButton, SidebarItem, TimelineRow } from '../design-system/primitives';
import {
  BuildingsIcon,
  CalendarIcon,
  ChatIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ComposeIcon,
  CopyIcon,
  FileIcon,
  FolderIcon,
  GridIcon,
  GrabberIcon,
  HomeIcon,
  LinkIcon,
  LockIcon,
  MicrophoneIcon,
  MoreIcon,
  PaperclipIcon,
  PencilIcon,
  PeopleIcon,
  PlusIcon,
  PlanPlusIcon,
  RecipesIcon,
  SearchIcon,
  SharedIcon,
  SlidersIcon,
  SparkleIcon,
  TrashIcon,
} from '../design-system/icons';
import { granolaClient } from '../lib/granolaClient';
import DocsWorkspace from './DocsWorkspace';
import type {
  GranolaChatHome,
  GranolaChatRecipe,
  GranolaChatThread,
  HomeFeed,
  HomeNoteDetail,
  HomeRecentNote,
  HomeUpcomingMeeting,
  TaskChatMessage,
  TaskChatTrace,
  TaskItemPublic,
  TaskPlanDraft,
  TaskPlanningContext,
  TaskStartOptions,
  TasksFeed,
  TasksRealtimeEvent,
} from '../shared/types';
import { MarkdownMessage } from '../components/MarkdownMessage';

type MainTab = 'home' | 'shared' | 'chat' | 'docs' | 'tasks';
type TasksViewMode = 'list' | 'chat';
const DISMISSED_WARNING_STORAGE_KEY = 'granola:copilot:dismissed-warnings:v1';

const HOME_UPCOMING_FALLBACK: HomeUpcomingMeeting = {
  id: 'static-upcoming',
  dayLabel: '21',
  monthLabel: 'March',
  weekdayLabel: 'Sat',
  title: 'mo/joshim - demo',
  timeLabel: '5:30 - 6:30 PM',
  startsAt: null,
};

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function createClientSideId(prefix: string): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
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

function groupHomeRecentNotes(notes: HomeRecentNote[]): Array<{ label: string; items: HomeRecentNote[] }> {
  const groups = new Map<string, HomeRecentNote[]>();
  for (const note of notes) {
    const bucket = groups.get(note.groupLabel) ?? [];
    bucket.push(note);
    groups.set(note.groupLabel, bucket);
  }
  return [...groups.entries()].map(([label, items]) => ({ label, items }));
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

  if (message.role === 'assistant' && !message.streaming && message.messageType !== 'planning_draft') {
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

function latestPlanDraftFromMessages(messages: TaskChatMessage[]): TaskPlanDraft | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.planDraft) {
      return message.planDraft;
    }
  }
  return null;
}

function TaskPlanningPanel({
  context,
  contextLoading,
  draft,
  isPlanning,
  planningInput,
  onPlanningInputChange,
  onGenerate,
  selectedMode,
  selectedOptionId,
  onSelectOption,
  customInstruction,
  onCustomInstructionChange,
}: {
  context: TaskPlanningContext | null;
  contextLoading: boolean;
  draft: TaskPlanDraft | null;
  isPlanning: boolean;
  planningInput: string;
  onPlanningInputChange: (value: string) => void;
  onGenerate: () => void;
  selectedMode: 'preset' | 'custom' | null;
  selectedOptionId: string | null;
  onSelectOption: (mode: 'preset' | 'custom', optionId?: string) => void;
  customInstruction: string;
  onCustomInstructionChange: (value: string) => void;
}) {
  return (
    <section className="task-planning-panel" aria-label="Task planning panel">
      <header className="task-planning-panel__header">
        <h3>Plan before launch</h3>
        <p>Choose one AI plan, or use Custom, then start execution.</p>
      </header>

      <div className="task-planning-context">
        {contextLoading ? <p className="copilot-empty">Loading planning context...</p> : null}
        {!contextLoading && !context ? <p className="copilot-empty">Planning context unavailable.</p> : null}
        {context?.sections.map((section) => (
          <article key={section.id} className="task-planning-context__card">
            <h4>{section.title}</h4>
            <ul>
              {section.bullets.map((bullet, index) => (
                <li key={`${section.id}-${index}`}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="task-planning-controls">
        <textarea
          value={planningInput}
          onChange={(event) => {
            onPlanningInputChange(event.target.value);
          }}
          placeholder="Anything specific about how this should be planned?"
          disabled={isPlanning}
        />
        <button type="button" className="copilot-secondary-button" onClick={onGenerate} disabled={isPlanning}>
          {isPlanning ? 'Planning...' : draft ? 'Regenerate options' : 'Plan task'}
        </button>
      </div>

      <div className="task-plan-options">
        {draft?.options.map((option, index) => {
          const selected = selectedMode === 'preset' && selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={cx('task-plan-option', selected && 'is-selected', option.recommended && 'is-recommended')}
              onClick={() => {
                onSelectOption('preset', option.id);
              }}
            >
              <div className="task-plan-option__title-row">
                <strong>
                  {index + 1}. {option.title}
                </strong>
                {option.recommended ? <span className="task-plan-option__badge">Recommended</span> : null}
              </div>
              <p>{option.summary}</p>
              <small>{option.why}</small>
              <ul>
                {option.steps.map((step, stepIndex) => (
                  <li key={`${option.id}-step-${stepIndex}`}>{step}</li>
                ))}
              </ul>
            </button>
          );
        })}

        <div className={cx('task-plan-option', 'is-custom', selectedMode === 'custom' && 'is-selected')}>
          <button
            type="button"
            className="task-plan-option__select"
            onClick={() => {
              onSelectOption('custom');
            }}
          >
            Custom
          </button>
          <p>Anything else on how we should plan this?</p>
          <textarea
            value={customInstruction}
            onFocus={() => {
              onSelectOption('custom');
            }}
            onChange={(event) => {
              onCustomInstructionChange(event.target.value);
            }}
            placeholder="Type extra planning instructions..."
          />
        </div>
      </div>
    </section>
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

function HomePlaceholder({ title, copy }: { title: string; copy: string }) {
  return (
    <main className="granola-main">
      <div className="home-placeholder">
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </main>
  );
}

function GlobalSidebar({
  activeTab,
  onSelectTab,
  sidebarActionLabel,
  sidebarActionDisabled,
  onSidebarAction,
}: {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  sidebarActionLabel: string;
  sidebarActionDisabled: boolean;
  onSidebarAction: () => void;
}) {
  return (
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
        <SidebarItem icon={<HomeIcon className="glyph-16" />} label="Home" active={activeTab === 'home'} onClick={() => onSelectTab('home')} />
        <SidebarItem icon={<SharedIcon className="glyph-16" />} label="Shared with me" active={activeTab === 'shared'} onClick={() => onSelectTab('shared')} />
        <SidebarItem icon={<ChatIcon className="glyph-16" />} label="Chat" active={activeTab === 'chat'} onClick={() => onSelectTab('chat')} />
        <SidebarItem icon={<FolderIcon className="glyph-16" />} label="Docs" active={activeTab === 'docs'} onClick={() => onSelectTab('docs')} />
        <SidebarItem icon={<FileIcon className="glyph-16" />} label="Tasks" active={activeTab === 'tasks'} onClick={() => onSelectTab('tasks')} />
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
        <button type="button" className="sidebar-connect-dock__button" onClick={onSidebarAction} disabled={sidebarActionDisabled}>
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
  );
}

function GranolaNoteDetail({
  detail,
  loading,
  error,
  onBack,
}: {
  detail: HomeNoteDetail | null;
  loading: boolean;
  error: string | null;
  onBack: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    setCopyStatus('idle');
  }, [detail?.id]);

  const handleCopyLink = useCallback(async () => {
    if (!detail?.shareUrl) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(detail.shareUrl);
      }
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }, [detail?.shareUrl]);

  const handleOpenShare = useCallback(() => {
    if (!detail?.shareUrl) {
      return;
    }
    window.open(detail.shareUrl, '_blank', 'noopener,noreferrer');
  }, [detail?.shareUrl]);

  return (
    <main className="granola-main granola-main--detail">
      <section className="home-note-detail" aria-label="Note detail">
        <header className="home-note-detail__topbar">
          <button type="button" className="home-note-detail__back" onClick={onBack} aria-label="Back to Home">
            <ChevronLeftIcon className="glyph-16" />
          </button>
          <div className="home-note-detail__actions">
            <button type="button" className="home-note-detail__action" disabled={!detail}>
              <SparkleIcon className="glyph-12" />
              <span>Enhanced</span>
              <ChevronDownIcon className="glyph-12" />
            </button>
            <button type="button" className="home-note-detail__action home-note-detail__action--solid" onClick={handleOpenShare} disabled={!detail?.shareUrl}>
              <LockIcon className="glyph-12" />
              <span>Share</span>
            </button>
            <button type="button" className="home-note-detail__icon-action" onClick={() => void handleCopyLink()} disabled={!detail?.shareUrl} aria-label="Copy link">
              <LinkIcon className="glyph-16" />
            </button>
            <button type="button" className="home-note-detail__icon-action" disabled aria-label="More note actions">
              <MoreIcon className="glyph-16" />
            </button>
          </div>
        </header>

        {loading ? <p className="home-note-detail__status">Loading note…</p> : null}
        {error ? <p className="home-note-detail__status is-error">{error}</p> : null}

        {detail ? (
          <>
            <div className="home-note-detail__content">
              <h1>{detail.title}</h1>
              <div className="home-note-detail__chips">
                <span className="home-note-detail__chip">
                  <CalendarIcon className="glyph-12" />
                  <span>{detail.dateLabel}</span>
                </span>
                <span className="home-note-detail__chip">
                  <PeopleIcon className="glyph-12" />
                  <span>{detail.ownerLabel}</span>
                </span>
                <span className="home-note-detail__chip">
                  <PlusIcon className="glyph-12" />
                  <span>Add to folder</span>
                </span>
              </div>

              <div className="home-note-detail__body">
                <MarkdownMessage content={detail.body} />
              </div>

              {detail.shareUrl ? (
                <div className="home-note-detail__transcript">
                  <p>
                    Chat with meeting transcript:{' '}
                    <a href={detail.shareUrl} target="_blank" rel="noreferrer">
                      {detail.shareUrl}
                    </a>
                  </p>
                </div>
              ) : null}
            </div>

            <footer className="home-note-detail__composer">
              <button type="button" className="home-note-detail__voice" disabled aria-label="Meeting voice controls">
                <SparkleIcon className="glyph-16" />
                <ChevronDownIcon className="glyph-12 home-note-detail__voice-caret" />
              </button>
              <button type="button" className="home-note-detail__ask" disabled>
                Ask anything
              </button>
              <button type="button" className="home-note-detail__follow-up" disabled>
                <SparkleIcon className="glyph-12" />
                <span>Write follow up email</span>
              </button>
            </footer>

            {copyStatus === 'copied' ? <p className="home-note-detail__copy-status">Link copied.</p> : null}
            {copyStatus === 'failed' ? <p className="home-note-detail__copy-status is-error">Unable to copy link.</p> : null}
          </>
        ) : null}
      </section>
    </main>
  );
}

function GranolaReplicaHome({
  activeTab,
  sidebar,
  homeFeed,
  homeLoading,
  homeError,
  homeDetail,
  homeDetailLoading,
  homeDetailError,
  onSelectNote,
  onBackToHome,
  onOpenChat,
  onOpenTasks,
}: {
  activeTab: Extract<MainTab, 'home' | 'shared'>;
  sidebar: ReactNode;
  homeFeed: HomeFeed | null;
  homeLoading: boolean;
  homeError: string | null;
  homeDetail: HomeNoteDetail | null;
  homeDetailLoading: boolean;
  homeDetailError: string | null;
  onSelectNote: (noteId: string) => void;
  onBackToHome: () => void;
  onOpenChat: () => void;
  onOpenTasks: () => void;
}) {
  if (activeTab !== 'home') {
    return (
      <div className="granola-frame granola-frame--home">
        {sidebar}
        <HomePlaceholder
          title="Shared with me"
          copy="Shared notes will be rebuilt next."
        />
      </div>
    );
  }

  if (homeDetail || homeDetailLoading || homeDetailError) {
    return (
      <div className="granola-frame granola-frame--home">
        {sidebar}
        <GranolaNoteDetail detail={homeDetail} loading={homeDetailLoading} error={homeDetailError} onBack={onBackToHome} />
      </div>
    );
  }

  const upcomingMeeting = homeFeed?.upcomingMeeting ?? HOME_UPCOMING_FALLBACK;
  const timelineGroups = groupHomeRecentNotes(homeFeed?.recentNotes ?? []);

  return (
    <div className="granola-frame granola-frame--home">
      {sidebar}

      <main className="granola-main">
        <div className="main-top-actions">
          <button type="button" className="main-quick-note">
            <PlusIcon className="glyph-14" />
            <span>Quick note</span>
          </button>
        </div>

        <section className="coming-up" aria-label="Coming up">
          <div className="coming-up__header">
            <h1>Coming up</h1>
            <div className="coming-up__controls" aria-label="Upcoming meeting controls">
              <button type="button" className="coming-up__control" aria-label="Previous day">
                <ChevronLeftIcon className="glyph-14" />
              </button>
              <button type="button" className="coming-up__control" aria-label="Next day">
                <ChevronRightIcon className="glyph-14" />
              </button>
              <button type="button" className="coming-up__control" aria-label="Calendar settings">
                <SlidersIcon className="glyph-14" />
              </button>
            </div>
          </div>
          <div className="coming-up-card">
            <div className="coming-up-card__date">
              <strong>{upcomingMeeting.dayLabel}</strong>
              <div>
                <span>{upcomingMeeting.monthLabel}</span>
                <span>{upcomingMeeting.weekdayLabel}</span>
              </div>
            </div>
            <div className="coming-up-card__accent" />
            <div className="coming-up-card__copy">
              <strong>{upcomingMeeting.title}</strong>
              <span>{upcomingMeeting.timeLabel}</span>
            </div>
            <button type="button" className="coming-up-card__menu" aria-label="Meeting actions">
              <MoreIcon className="glyph-16" />
            </button>
          </div>
        </section>

        <section className="timeline" aria-label="Recent notes">
          {homeLoading ? <p className="timeline__status">Loading recent notes…</p> : null}
          {homeError ? <p className="timeline__status is-error">{homeError}</p> : null}
          {!homeLoading && !homeError && timelineGroups.length === 0 ? (
            <p className="timeline__status">No synced notes yet. Use Sync Granola to refresh Home.</p>
          ) : null}
          {timelineGroups.map((group) => (
            <section key={group.label} className="timeline-group">
              <h2>{group.label}</h2>
              <div className="timeline-group__rows">
                {group.items.map((item) => (
                  <TimelineRow
                    key={item.id}
                    title={item.title}
                    owner={item.ownerLabel}
                    time={item.timeLabel}
                    onClick={() => {
                      onSelectNote(item.id);
                    }}
                    leading={
                      <span className="timeline-leading-file">
                        <FileIcon className="glyph-16" />
                      </span>
                    }
                    trailing={item.visibility === 'private' ? <LockIcon className="glyph-12" /> : <SharedIcon className="glyph-12" />}
                  />
                ))}
              </div>
            </section>
          ))}
        </section>

        <div className="main-bottom-fade" />

        <div className="chat-dock">
          <button type="button" className="chat-dock__field" onClick={onOpenChat}>
            Continue chat
          </button>
          <ActionPill className="chat-dock__todos" icon={<SparkleIcon className="glyph-16" />} label="List recent todos" onClick={onOpenTasks} />
        </div>
      </main>
    </div>
  );
}

function ChatScopeCard() {
  return (
    <div className="granola-chat-scope-card">
      <span className="granola-chat-scope-card__icon">
        <HomeIcon className="glyph-14" />
      </span>
      <span className="granola-chat-scope-card__copy">
        <strong>My notes</strong>
        <small>All meetings</small>
      </span>
    </div>
  );
}

type ChatSurfaceSelection = { kind: 'ai' } | { kind: 'team'; threadId: string };
type TeamChatThreadKind = 'channel' | 'dm';
type TeamChatPresence = 'online' | 'away' | 'offline';

interface TeamChatAttachment {
  id: string;
  title: string;
  meta: string;
}

interface TeamChatMessage {
  id: string;
  author: string;
  sentAtLabel: string;
  content: string;
  isOwn?: boolean;
  attachments?: TeamChatAttachment[];
}

interface TeamChatThread {
  id: string;
  kind: TeamChatThreadKind;
  title: string;
  subtitle: string;
  detailLabel: string;
  preview: string;
  timestampLabel: string;
  unreadCount: number;
  badge?: string;
  presence?: TeamChatPresence;
  messages: TeamChatMessage[];
}

const TEAM_CHAT_SEED: TeamChatThread[] = [
  {
    id: 'team-channel-launch-war-room',
    kind: 'channel',
    title: '#launch-war-room',
    subtitle: 'Pinned launch sequence',
    detailLabel: '8 members · Narrative lock in progress',
    preview: 'Laura: Lock the narrative before 5pm so the deck can ship tonight.',
    timestampLabel: '1m',
    unreadCount: 4,
    badge: 'Pinned',
    messages: [
      {
        id: 'launch-1',
        author: 'Laura',
        sentAtLabel: '9:14 AM',
        content: 'Need the launch room crisp today. Please lock the hero narrative before 5pm so design can export the final deck.',
      },
      {
        id: 'launch-2',
        author: 'Joshim',
        sentAtLabel: '9:18 AM',
        content: 'I can cut the demo once we freeze the top-line message. Current options are still drifting between growth and conversion.',
      },
      {
        id: 'launch-3',
        author: 'Mia Chen',
        sentAtLabel: '9:21 AM',
        content: 'Sharing the latest proof points. Trial-to-paid is now up 14% week-over-week after the onboarding refresh.',
      },
      {
        id: 'launch-4',
        author: 'You',
        sentAtLabel: '9:25 AM',
        content: 'I will tighten the story around the conversion lift, keep the creator examples secondary, and drop the extra positioning slide.',
        isOwn: true,
      },
      {
        id: 'launch-5',
        author: 'Laura',
        sentAtLabel: '9:29 AM',
        content: 'Perfect. Once that is in, please post the final version here and I will record the voiceover tonight.',
      },
      {
        id: 'launch-6',
        author: 'Growth Ops',
        sentAtLabel: '9:33 AM',
        content: 'Calendar is clear from 4 to 6pm if we need a last review loop before sharing externally.',
      },
    ],
  },
  {
    id: 'team-channel-vectorhaul',
    kind: 'channel',
    title: '#vectorhaul',
    subtitle: 'Official account team',
    detailLabel: '12 members · Pipeline repair sprint',
    preview: 'Mia Chen shared VectorHaul pipeline review v3.',
    timestampLabel: '11m',
    unreadCount: 0,
    badge: 'Official',
    messages: [
      {
        id: 'vectorhaul-1',
        author: 'Mia Chen',
        sentAtLabel: '10:02 AM',
        content: 'Dropped the latest before/after story for the sales deck. The no-show section is much tighter now.',
        attachments: [
          {
            id: 'vectorhaul-file-1',
            title: 'VectorHaul pipeline review v3',
            meta: 'Deck · 18 slides',
          },
        ],
      },
      {
        id: 'vectorhaul-2',
        author: 'You',
        sentAtLabel: '10:07 AM',
        content: 'This is strong. I am going to mirror the same structure in the next call conversion write-up.',
        isOwn: true,
      },
      {
        id: 'vectorhaul-3',
        author: 'Joshim',
        sentAtLabel: '10:15 AM',
        content: 'Please keep the case-study card visible above the fold. That is the first thing the team reacted to on the call.',
      },
    ],
  },
  {
    id: 'team-channel-design-crit',
    kind: 'channel',
    title: '#design-crit',
    subtitle: 'Weekly critique loop',
    detailLabel: '6 members · Working session',
    preview: 'Joshim: Can we tighten the type scale on the home notes list?',
    timestampLabel: '47m',
    unreadCount: 2,
    messages: [
      {
        id: 'design-1',
        author: 'Joshim',
        sentAtLabel: '11:10 AM',
        content: 'Can we tighten the type scale on the home notes list? The hierarchy is close, but the metadata still feels too floaty.',
      },
      {
        id: 'design-2',
        author: 'You',
        sentAtLabel: '11:16 AM',
        content: 'Yes. I want to compress the rows a bit more and match the calendar card rhythm before the next pass.',
        isOwn: true,
      },
    ],
  },
  {
    id: 'team-dm-laura',
    kind: 'dm',
    title: 'Laura',
    subtitle: 'Online',
    detailLabel: 'Direct message · Product lead',
    preview: 'Left comments on the GTM outline. The structure is almost there.',
    timestampLabel: '8m',
    unreadCount: 0,
    presence: 'online',
    messages: [
      {
        id: 'laura-1',
        author: 'Laura',
        sentAtLabel: '11:42 AM',
        content: 'Left comments on the GTM outline. The structure is almost there, but slide three still buries the product proof too late.',
      },
      {
        id: 'laura-2',
        author: 'You',
        sentAtLabel: '11:45 AM',
        content: 'I saw that. I am moving the proof up and trimming the setup so the demo arrives faster.',
        isOwn: true,
      },
    ],
  },
  {
    id: 'team-dm-joshim',
    kind: 'dm',
    title: 'Joshim',
    subtitle: 'Away',
    detailLabel: 'Direct message · Demo owner',
    preview: 'Need the demo cut by tonight or the launch room will slip.',
    timestampLabel: '25m',
    unreadCount: 1,
    presence: 'away',
    messages: [
      {
        id: 'joshim-1',
        author: 'Joshim',
        sentAtLabel: '12:03 PM',
        content: 'Need the demo cut by tonight or the launch room will slip. Send me the final sequence as soon as you freeze it.',
      },
    ],
  },
  {
    id: 'team-dm-mia',
    kind: 'dm',
    title: 'Mia Chen',
    subtitle: 'Online',
    detailLabel: 'Direct message · Growth analytics',
    preview: 'Pulled the latest trial conversion cohort if you need the chart.',
    timestampLabel: '1h',
    unreadCount: 0,
    presence: 'online',
    messages: [
      {
        id: 'mia-1',
        author: 'Mia Chen',
        sentAtLabel: '1:08 PM',
        content: 'Pulled the latest trial conversion cohort if you need the chart. The onboarding refresh is the clearest win so far.',
      },
      {
        id: 'mia-2',
        author: 'You',
        sentAtLabel: '1:11 PM',
        content: 'Send it over. I want that chart ready for both the launch deck and the weekly recap.',
        isOwn: true,
      },
    ],
  },
  {
    id: 'team-dm-growth-ops',
    kind: 'dm',
    title: 'Growth Ops',
    subtitle: 'Offline',
    detailLabel: 'Direct message · Shared operating pod',
    preview: 'Sharing the calendar pressure points list before planning.',
    timestampLabel: 'Yesterday',
    unreadCount: 0,
    presence: 'offline',
    messages: [
      {
        id: 'ops-1',
        author: 'Growth Ops',
        sentAtLabel: 'Yesterday',
        content: 'Sharing the calendar pressure points list before planning tomorrow. Thursday afternoon is still overloaded with external calls.',
      },
    ],
  },
];

function initialsForLabel(value: string): string {
  const cleaned = value.replace(/^#/, '').trim();
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return '?';
  }
  if (tokens.length === 1) {
    return cleaned.slice(0, 2).toUpperCase();
  }
  return `${tokens[0]?.[0] ?? ''}${tokens[1]?.[0] ?? ''}`.toUpperCase();
}

function matchesTeamThreadQuery(thread: TeamChatThread, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }
  return [thread.title, thread.subtitle, thread.detailLabel, thread.preview].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

function previewForTeamMessage(content: string): string {
  const normalized = content.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 78) {
    return normalized;
  }
  return `${normalized.slice(0, 75)}...`;
}

function AiChatView({
  chatHome,
  chatHomeLoading,
  chatHomeError,
  selectedChatThreadId,
  chatThread,
  chatThreadLoading,
  chatThreadError,
  composerText,
  onComposerTextChange,
  onSend,
  onOpenThread,
  onNewChat,
  onBackToLanding,
  chatSending,
  chatSendElapsedSeconds,
  chatPendingActionLabel,
}: {
  chatHome: GranolaChatHome | null;
  chatHomeLoading: boolean;
  chatHomeError: string | null;
  selectedChatThreadId: string | null;
  chatThread: GranolaChatThread | null;
  chatThreadLoading: boolean;
  chatThreadError: string | null;
  composerText: string;
  onComposerTextChange: (value: string) => void;
  onSend: (input: { text: string; recipe?: GranolaChatRecipe | null }) => void;
  onOpenThread: (threadId: string) => void;
  onNewChat: () => void;
  onBackToLanding: () => void;
  chatSending: boolean;
  chatSendElapsedSeconds: number;
  chatPendingActionLabel: string | null;
}) {
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [showAllRecents, setShowAllRecents] = useState(false);

  const recipes = chatHome?.recipes ?? [];
  const featuredRecipes = recipes.slice(0, 5);
  const recentThreads = showAllRecents ? chatHome?.recentThreads ?? [] : (chatHome?.recentThreads ?? []).slice(0, 3);
  const threadMessages = chatThread?.messages ?? [];
  const showingThread = Boolean(selectedChatThreadId || chatThreadLoading || chatThreadError || chatThread);
  const latestAssistantMessage = [...threadMessages].reverse().find((message) => message.role === 'assistant') ?? null;
  const threadTitle = chatThread?.title || chatPendingActionLabel || 'New chat';
  const warningVisible = Boolean(chatHome?.warning);

  const submitComposer = useCallback(
    (recipe?: GranolaChatRecipe | null) => {
      if (chatSending) {
        return;
      }
      onSend({
        text: recipe?.label ?? composerText,
        recipe: recipe ?? null,
      });
    },
    [chatSending, composerText, onSend],
  );

  const handleComposerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        submitComposer();
      }
    },
    [submitComposer],
  );

  return (
    <div className="granola-chat-ai">
      {!showingThread ? (
        <section className="granola-chat-landing" aria-label="Granola chat landing">
          <h1>Ask anything</h1>

          {warningVisible ? (
            <div className="granola-chat-warning" role="status">
              <p>{chatHome?.warning}</p>
              {chatHome?.warningDetails?.length ? (
                <ul>
                  {chatHome.warningDetails.slice(0, 3).map((detail, index) => (
                    <li key={`chat-warning-${index}`}>{detail}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <div className="granola-chat-composer-card">
            <button type="button" className="granola-chat-composer-card__scope" disabled>
              <span>My notes</span>
              <span className="granola-chat-composer-card__scope-active">All meetings</span>
              <ChevronDownIcon className="glyph-12" />
            </button>

            <textarea
              value={composerText}
              onChange={(event) => {
                onComposerTextChange(event.target.value);
              }}
              onKeyDown={handleComposerKeyDown}
              placeholder="What action items do I have?"
              rows={3}
              disabled={chatSending}
            />

            <div className="granola-chat-composer-card__footer">
              <button type="button" className="granola-chat-composer-card__ghost" disabled>
                <PaperclipIcon className="glyph-14" />
              </button>
              <button type="button" className="granola-chat-composer-card__model" disabled>
                <span>{chatHome?.modelLabel ?? 'Auto'}</span>
                <ChevronDownIcon className="glyph-12" />
              </button>
              <button
                type="button"
                className="granola-chat-composer-card__send"
                aria-label={composerText.trim() ? 'Send message' : 'Start dictation'}
                disabled={chatSending || composerText.trim().length === 0}
                onClick={() => {
                  submitComposer();
                }}
              >
                <MicrophoneIcon className="glyph-14" />
              </button>
            </div>
          </div>

          <div className="granola-chat-section">
            <div className="granola-chat-section__header">
              <h2>Recipes</h2>
            </div>
            <div className="granola-chat-recipes">
              {featuredRecipes.map((recipe, index) => (
                <button
                  key={recipe.id}
                  type="button"
                  className={cx('granola-chat-recipe-chip', `is-tone-${index % 5}`)}
                  onClick={() => {
                    submitComposer(recipe);
                  }}
                >
                  <span className="granola-chat-recipe-chip__accent" />
                  <span>{recipe.label}</span>
                </button>
              ))}
              <button
                type="button"
                className="granola-chat-see-all"
                onClick={() => {
                  setShowAllRecipes((current) => !current);
                }}
              >
                <GridIcon className="glyph-14" />
                <span>See all</span>
                <ChevronRightIcon className="glyph-12" />
              </button>
            </div>

            {showAllRecipes ? (
              <div className="granola-chat-recipes-panel" aria-label="All recipes">
                {(chatHome?.recipes ?? []).map((recipe) => (
                  <button
                    key={recipe.id}
                    type="button"
                    className="granola-chat-recipes-panel__item"
                    onClick={() => {
                      setShowAllRecipes(false);
                      submitComposer(recipe);
                    }}
                  >
                    <div>
                      <strong>{recipe.label}</strong>
                      <p>{recipe.description}</p>
                    </div>
                    <span>{recipe.creatorLabel}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="granola-chat-section">
            <div className="granola-chat-section__header">
              <h2>Recents</h2>
              <button
                type="button"
                className="granola-chat-section__link"
                onClick={() => {
                  setShowAllRecents((current) => !current);
                }}
              >
                <span>See all</span>
                <span>+</span>
              </button>
            </div>

            {chatHomeLoading ? <p className="granola-chat-empty">Loading chat…</p> : null}
            {chatHomeError ? <p className="granola-chat-empty is-error">{chatHomeError}</p> : null}
            {!chatHomeLoading && !chatHomeError && recentThreads.length === 0 ? (
              <p className="granola-chat-empty">No chats yet. Start a new conversation.</p>
            ) : null}
            <div className="granola-chat-recents">
              {recentThreads.map((thread) => (
                <button
                  key={thread.threadId}
                  type="button"
                  className="granola-chat-recents__item"
                  onClick={() => {
                    onOpenThread(thread.threadId);
                  }}
                >
                  <span className="granola-chat-recents__icon">
                    <ChatIcon className="glyph-14" />
                  </span>
                  <span className="granola-chat-recents__title">{thread.title}</span>
                  <span className="granola-chat-recents__time">{thread.timeLabel}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="granola-chat-thread" aria-label="Granola chat thread">
          <header className="granola-chat-thread__topbar">
            <div className="granola-chat-thread__title-row">
              <button type="button" className="granola-chat-thread__back" onClick={onBackToLanding} aria-label="Back to chat landing">
                <ChevronLeftIcon className="glyph-16" />
              </button>
              <button type="button" className="granola-chat-thread__title" onClick={onBackToLanding}>
                <span>{threadTitle}</span>
                <ChevronDownIcon className="glyph-12" />
              </button>
            </div>

            <button type="button" className="granola-chat-thread__new" onClick={onNewChat}>
              <ComposeIcon className="glyph-14" />
              <span>New chat</span>
            </button>
          </header>

          <div className="granola-chat-thread__body">
            {warningVisible ? (
              <div className="granola-chat-warning granola-chat-warning--thread" role="status">
                <p>{chatHome?.warning}</p>
              </div>
            ) : null}
            {chatThreadLoading ? <p className="granola-chat-empty">Loading chat…</p> : null}
            {chatThreadError ? <p className="granola-chat-empty is-error">{chatThreadError}</p> : null}
            {!chatThreadLoading && !chatThreadError && threadMessages.length === 0 ? (
              <p className="granola-chat-empty">No messages yet. Start the conversation below.</p>
            ) : null}

            {threadMessages.map((message) => {
              if (message.role === 'user') {
                return (
                  <div key={message.messageId} className="granola-chat-thread__user-block">
                    <ChatScopeCard />
                    <div className="granola-chat-thread__user-bubble">{message.content}</div>
                  </div>
                );
              }

              return (
                <article key={message.messageId} className={cx('granola-chat-thread__assistant', message.status === 'error' && 'is-error')}>
                  {message.thoughtDurationSeconds ? (
                    <button type="button" className="granola-chat-thread__thought" disabled>
                      <span>Thought for {message.thoughtDurationSeconds}s</span>
                      <ChevronRightIcon className="glyph-12" />
                    </button>
                  ) : null}
                  <MarkdownMessage content={message.content} />
                  {message.sources && message.sources.length > 0 ? (
                    <div className="granola-chat-thread__sources">
                      {message.sources.map((source) => (
                        <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="granola-chat-thread__source-pill">
                          {source.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {latestAssistantMessage?.messageId === message.messageId ? (
                    <div className="granola-chat-thread__actions">
                      <button
                        type="button"
                        className="granola-chat-thread__say-more"
                        onClick={() => {
                          onSend({ text: 'Say more', recipe: null });
                        }}
                      >
                        Say more
                      </button>
                      <button
                        type="button"
                        className="granola-chat-thread__icon-button"
                        aria-label="Copy answer"
                        onClick={() => {
                          void navigator.clipboard?.writeText(message.content);
                        }}
                      >
                        <CopyIcon className="glyph-14" />
                      </button>
                      <button
                        type="button"
                        className="granola-chat-thread__icon-button"
                        aria-label="Open first source"
                        disabled={!message.sources || message.sources.length === 0}
                        onClick={() => {
                          const url = message.sources?.[0]?.url;
                          if (url) {
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <LinkIcon className="glyph-14" />
                      </button>
                      <button type="button" className="granola-chat-thread__icon-button" aria-label="More chat actions" disabled>
                        <MoreIcon className="glyph-14" />
                      </button>
                    </div>
                  ) : null}
                </article>
              );
            })}

            {chatSending ? (
              <button type="button" className="granola-chat-thread__thought is-live" disabled>
                <span>Thought for {chatSendElapsedSeconds}s</span>
                <ChevronRightIcon className="glyph-12" />
              </button>
            ) : null}
          </div>

          <div className="granola-chat-thread__banner">
            <span>Unlock chat with full history</span>
            <button type="button" disabled>
              View plans
            </button>
          </div>

          <footer className="granola-chat-thread__composer">
            <textarea
              value={composerText}
              onChange={(event) => {
                onComposerTextChange(event.target.value);
              }}
              onKeyDown={handleComposerKeyDown}
              placeholder="Ask anything"
              rows={1}
              disabled={chatSending}
            />
            <div className="granola-chat-thread__composer-actions">
              <button type="button" className="granola-chat-thread__model" disabled>
                <span>{chatHome?.modelLabel ?? 'Auto'}</span>
                <ChevronDownIcon className="glyph-12" />
              </button>
              <button type="button" className="granola-chat-thread__ghost" disabled>
                <PaperclipIcon className="glyph-14" />
              </button>
              <button
                type="button"
                className="granola-chat-thread__send"
                aria-label={composerText.trim() ? 'Send message' : 'Start dictation'}
                disabled={chatSending || composerText.trim().length === 0}
                onClick={() => {
                  submitComposer();
                }}
              >
                <MicrophoneIcon className="glyph-14" />
              </button>
            </div>
          </footer>
        </section>
      )}
    </div>
  );
}

function TeamThreadView({
  thread,
  composerText,
  onComposerTextChange,
  onSend,
}: {
  thread: TeamChatThread;
  composerText: string;
  onComposerTextChange: (value: string) => void;
  onSend: () => void;
}) {
  const handleComposerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onSend();
      }
    },
    [onSend],
  );

  return (
    <section className="granola-team-thread" aria-label={`Team thread ${thread.title}`}>
      <header className="granola-team-thread__topbar">
        <div className="granola-team-thread__identity">
          {thread.kind === 'channel' ? (
            <span className="granola-team-thread__avatar granola-team-thread__avatar--channel">#</span>
          ) : (
            <span className="granola-team-thread__avatar">
              {initialsForLabel(thread.title)}
              <span className={cx('granola-team-thread__presence', thread.presence && `is-${thread.presence}`)} />
            </span>
          )}
          <div className="granola-team-thread__identity-copy">
            <div className="granola-team-thread__titleline">
              <strong>{thread.title}</strong>
              {thread.badge ? <span className="granola-team-thread__badge">{thread.badge}</span> : null}
            </div>
            <span>{thread.detailLabel}</span>
          </div>
        </div>

        <div className="granola-team-thread__actions">
          <button type="button" className="granola-team-thread__icon" aria-label="Search conversation" disabled>
            <SearchIcon className="glyph-14" />
          </button>
          <button type="button" className="granola-team-thread__icon" aria-label="Schedule from conversation" disabled>
            <CalendarIcon className="glyph-14" />
          </button>
          <button type="button" className="granola-team-thread__icon" aria-label="Invite people" disabled>
            <PlusIcon className="glyph-14" />
          </button>
          <button type="button" className="granola-team-thread__icon" aria-label="More conversation actions" disabled>
            <MoreIcon className="glyph-14" />
          </button>
        </div>
      </header>

      <div className="granola-team-thread__body">
        <div className="granola-team-thread__intro">
          <span>{thread.subtitle}</span>
          {thread.unreadCount > 0 ? <strong>{thread.unreadCount} unread</strong> : <strong>Up to date</strong>}
        </div>

        <div className="granola-team-thread__messages">
          {thread.messages.map((message) => (
            <article key={message.id} className={cx('granola-team-thread__message', message.isOwn && 'is-own')}>
              {!message.isOwn ? (
                <span className="granola-team-thread__message-avatar">{initialsForLabel(message.author)}</span>
              ) : null}
              <div className="granola-team-thread__message-stack">
                <div className="granola-team-thread__message-meta">
                  <strong>{message.author}</strong>
                  <span>{message.sentAtLabel}</span>
                </div>
                <div className="granola-team-thread__bubble">
                  <p>{message.content}</p>
                  {message.attachments?.length ? (
                    <div className="granola-team-thread__attachments">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="granola-team-thread__attachment">
                          <span className="granola-team-thread__attachment-icon">
                            <FileIcon className="glyph-14" />
                          </span>
                          <div>
                            <strong>{attachment.title}</strong>
                            <span>{attachment.meta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className="granola-team-thread__composer">
        <textarea
          value={composerText}
          onChange={(event) => {
            onComposerTextChange(event.target.value);
          }}
          onKeyDown={handleComposerKeyDown}
          placeholder={thread.kind === 'channel' ? `Message ${thread.title}` : `Message ${thread.title}`}
          rows={1}
        />
        <div className="granola-team-thread__composer-actions">
          <button type="button" className="granola-team-thread__icon" aria-label="Attach files" disabled>
            <PaperclipIcon className="glyph-14" />
          </button>
          <button type="button" className="granola-team-thread__icon" aria-label="Insert emoji" disabled>
            <SparkleIcon className="glyph-14" />
          </button>
          <button
            type="button"
            className="granola-team-thread__send"
            aria-label="Send team message"
            disabled={composerText.trim().length === 0}
            onClick={onSend}
          >
            <ChevronRightIcon className="glyph-14" />
          </button>
        </div>
      </footer>
    </section>
  );
}

function GranolaChatPane({
  sidebar,
  chatHome,
  chatHomeLoading,
  chatHomeError,
  selectedChatThreadId,
  chatThread,
  chatThreadLoading,
  chatThreadError,
  composerText,
  onComposerTextChange,
  onSend,
  onOpenThread,
  onNewChat,
  onBackToLanding,
  chatSending,
  chatSendElapsedSeconds,
  chatPendingActionLabel,
}: {
  sidebar: ReactNode;
  chatHome: GranolaChatHome | null;
  chatHomeLoading: boolean;
  chatHomeError: string | null;
  selectedChatThreadId: string | null;
  chatThread: GranolaChatThread | null;
  chatThreadLoading: boolean;
  chatThreadError: string | null;
  composerText: string;
  onComposerTextChange: (value: string) => void;
  onSend: (input: { text: string; recipe?: GranolaChatRecipe | null }) => void;
  onOpenThread: (threadId: string) => void;
  onNewChat: () => void;
  onBackToLanding: () => void;
  chatSending: boolean;
  chatSendElapsedSeconds: number;
  chatPendingActionLabel: string | null;
}) {
  const [activeSurface, setActiveSurface] = useState<ChatSurfaceSelection>({ kind: 'ai' });
  const [chatNavigatorQuery, setChatNavigatorQuery] = useState('');
  const [teamThreads, setTeamThreads] = useState<TeamChatThread[]>(TEAM_CHAT_SEED);
  const [teamComposerDrafts, setTeamComposerDrafts] = useState<Record<string, string>>({});

  const filteredTeamThreads = useMemo(
    () => teamThreads.filter((thread) => matchesTeamThreadQuery(thread, chatNavigatorQuery)),
    [chatNavigatorQuery, teamThreads],
  );
  const selectedTeamThread = useMemo(
    () => (activeSurface.kind === 'team' ? teamThreads.find((thread) => thread.id === activeSurface.threadId) ?? null : null),
    [activeSurface, teamThreads],
  );

  const handleSelectAiChat = useCallback(() => {
    setActiveSurface({ kind: 'ai' });
  }, []);

  const handleCreateAiChat = useCallback(() => {
    setActiveSurface({ kind: 'ai' });
    onNewChat();
  }, [onNewChat]);

  const handleOpenAiThread = useCallback(
    (threadId: string) => {
      setActiveSurface({ kind: 'ai' });
      onOpenThread(threadId);
    },
    [onOpenThread],
  );

  const handleOpenTeamThread = useCallback((threadId: string) => {
    setActiveSurface({ kind: 'team', threadId });
    setTeamThreads((current) =>
      current.map((thread) => (thread.id === threadId ? { ...thread, unreadCount: 0 } : thread)),
    );
  }, []);

  const handleTeamDraftChange = useCallback((threadId: string, value: string) => {
    setTeamComposerDrafts((current) => ({
      ...current,
      [threadId]: value,
    }));
  }, []);

  const handleSendTeamMessage = useCallback(() => {
    if (!selectedTeamThread) {
      return;
    }
    const text = (teamComposerDrafts[selectedTeamThread.id] ?? '').trim();
    if (!text) {
      return;
    }
    const now = new Date().toISOString();
    const nextMessage: TeamChatMessage = {
      id: createClientSideId('team-chat-message'),
      author: 'You',
      sentAtLabel: formatClock(now),
      content: text,
      isOwn: true,
    };
    setTeamThreads((current) =>
      current.map((thread) =>
        thread.id === selectedTeamThread.id
          ? {
              ...thread,
              preview: previewForTeamMessage(text),
              timestampLabel: 'Now',
              unreadCount: 0,
              messages: [...thread.messages, nextMessage],
            }
          : thread,
      ),
    );
    setTeamComposerDrafts((current) => ({
      ...current,
      [selectedTeamThread.id]: '',
    }));
  }, [selectedTeamThread, teamComposerDrafts]);

  return (
    <div className="granola-frame granola-frame--chat">
      {sidebar}

      <main className="granola-main granola-main--chat">
        <div className="granola-chat-shell">
          <aside className="granola-chat-nav" aria-label="Chat navigator">
            <div className="granola-chat-nav__header">
              <h1>Chats</h1>
              <button type="button" className="granola-chat-nav__new" aria-label="Start new AI chat" onClick={handleCreateAiChat}>
                <PlusIcon className="glyph-14" />
              </button>
            </div>

            <label className="granola-chat-nav__search">
              <SearchIcon className="glyph-14" />
              <input
                type="search"
                placeholder="Search chats"
                value={chatNavigatorQuery}
                onChange={(event) => {
                  setChatNavigatorQuery(event.target.value);
                }}
              />
            </label>

            <div className="granola-chat-nav__label">Assistant</div>
            <button
              type="button"
              className={cx('granola-chat-nav__row granola-chat-nav__row--ai', activeSurface.kind === 'ai' && 'is-active')}
              onClick={handleSelectAiChat}
            >
              <span className="granola-chat-nav__row-icon granola-chat-nav__row-icon--ai">
                <SparkleIcon className="glyph-14" />
              </span>
              <span className="granola-chat-nav__row-copy">
                <strong>AI Chat</strong>
                <small>Ask across meetings</small>
              </span>
              <span className="granola-chat-nav__row-badge">Auto</span>
            </button>

            <div className="granola-chat-nav__label">Conversations</div>
            <div className="granola-chat-nav__list">
              {filteredTeamThreads.length === 0 ? (
                <p className="granola-chat-nav__empty">No chats match your search.</p>
              ) : null}
              {filteredTeamThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  className={cx(
                    'granola-chat-nav__row',
                    activeSurface.kind === 'team' && activeSurface.threadId === thread.id && 'is-active',
                  )}
                  onClick={() => {
                    handleOpenTeamThread(thread.id);
                  }}
                >
                  {thread.kind === 'channel' ? (
                    <span className="granola-chat-nav__row-icon granola-chat-nav__row-icon--channel">#</span>
                  ) : (
                    <span className="granola-chat-nav__row-avatar">
                      {initialsForLabel(thread.title)}
                      <span className={cx('granola-chat-nav__presence', thread.presence && `is-${thread.presence}`)} />
                    </span>
                  )}
                  <span className="granola-chat-nav__row-copy">
                    <strong>
                      {thread.title}
                      {thread.badge ? <span className="granola-chat-nav__chip">{thread.badge}</span> : null}
                    </strong>
                    <small>{thread.preview}</small>
                  </span>
                  <span className="granola-chat-nav__row-meta">
                    <span>{thread.timestampLabel}</span>
                    {thread.unreadCount > 0 ? <strong>{thread.unreadCount}</strong> : null}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="granola-chat-shell__content">
            {activeSurface.kind === 'ai' ? (
              <AiChatView
                chatHome={chatHome}
                chatHomeLoading={chatHomeLoading}
                chatHomeError={chatHomeError}
                selectedChatThreadId={selectedChatThreadId}
                chatThread={chatThread}
                chatThreadLoading={chatThreadLoading}
                chatThreadError={chatThreadError}
                composerText={composerText}
                onComposerTextChange={onComposerTextChange}
                onSend={onSend}
                onOpenThread={handleOpenAiThread}
                onNewChat={handleCreateAiChat}
                onBackToLanding={onBackToLanding}
                chatSending={chatSending}
                chatSendElapsedSeconds={chatSendElapsedSeconds}
                chatPendingActionLabel={chatPendingActionLabel}
              />
            ) : selectedTeamThread ? (
              <TeamThreadView
                thread={selectedTeamThread}
                composerText={teamComposerDrafts[selectedTeamThread.id] ?? ''}
                onComposerTextChange={(value) => {
                  handleTeamDraftChange(selectedTeamThread.id, value);
                }}
                onSend={handleSendTeamMessage}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function GranolaHomeScreen() {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [tasksViewMode, setTasksViewMode] = useState<TasksViewMode>('list');
  const [tasksFeed, setTasksFeed] = useState<TasksFeed | null>(null);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [homeFeed, setHomeFeed] = useState<HomeFeed | null>(null);
  const [homeError, setHomeError] = useState<string | null>(null);
  const [homeLoading, setHomeLoading] = useState(true);
  const [selectedHomeNoteId, setSelectedHomeNoteId] = useState<string | null>(null);
  const [homeDetail, setHomeDetail] = useState<HomeNoteDetail | null>(null);
  const [homeDetailLoading, setHomeDetailLoading] = useState(false);
  const [homeDetailError, setHomeDetailError] = useState<string | null>(null);
  const [chatHome, setChatHome] = useState<GranolaChatHome | null>(null);
  const [chatHomeError, setChatHomeError] = useState<string | null>(null);
  const [chatHomeLoading, setChatHomeLoading] = useState(true);
  const [selectedChatThreadId, setSelectedChatThreadId] = useState<string | null>(null);
  const [chatThread, setChatThread] = useState<GranolaChatThread | null>(null);
  const [chatThreadLoading, setChatThreadLoading] = useState(false);
  const [chatThreadError, setChatThreadError] = useState<string | null>(null);
  const [chatComposerText, setChatComposerText] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [chatSendStartedAt, setChatSendStartedAt] = useState<number | null>(null);
  const [chatSendElapsedSeconds, setChatSendElapsedSeconds] = useState(0);
  const [chatPendingActionLabel, setChatPendingActionLabel] = useState<string | null>(null);
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
  const [planningContext, setPlanningContext] = useState<TaskPlanningContext | null>(null);
  const [planningContextLoading, setPlanningContextLoading] = useState(false);
  const [planningDraft, setPlanningDraft] = useState<TaskPlanDraft | null>(null);
  const [planningInput, setPlanningInput] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [selectedPlanMode, setSelectedPlanMode] = useState<'preset' | 'custom' | null>(null);
  const [selectedPlanOptionId, setSelectedPlanOptionId] = useState<string | null>(null);
  const [customPlanInstruction, setCustomPlanInstruction] = useState('');
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
  const latestPlanDraft = useMemo(() => latestPlanDraftFromMessages(threadMessages), [threadMessages]);
  const hasNonPlanningThreadMessages = useMemo(
    () => threadMessages.some((message) => (message.messageType ?? 'default') === 'default'),
    [threadMessages],
  );
  const isTaskPreStart = Boolean(
    selectedTask &&
      selectedTask.attempts === 0 &&
      !selectedTask.runId &&
      selectedTask.runState === 'idle' &&
      selectedTask.runQueueState === 'idle' &&
      !hasNonPlanningThreadMessages,
  );
  const plannerSelectionValid = Boolean(
    !isTaskPreStart ||
      (selectedPlanMode === 'preset' && selectedPlanOptionId) ||
      (selectedPlanMode === 'custom' && customPlanInstruction.trim().length > 0),
  );
  const showWorkingIndicator =
    selectedRunActive || threadMessages.some((message) => message.role === 'assistant' && message.streaming);
  const selectedStartOptions = useMemo<TaskStartOptions | undefined>(() => {
    if (!isTaskPreStart) {
      return undefined;
    }
    if (selectedPlanMode === 'preset' && selectedPlanOptionId) {
      return {
        approvedPlan: {
          draftId: planningDraft?.draftId,
          selection: {
            mode: 'preset',
            optionId: selectedPlanOptionId,
          },
        },
      };
    }
    if (selectedPlanMode === 'custom' && customPlanInstruction.trim()) {
      return {
        approvedPlan: {
          draftId: planningDraft?.draftId,
          selection: {
            mode: 'custom',
            customInstruction: customPlanInstruction.trim(),
          },
        },
      };
    }
    return undefined;
  }, [customPlanInstruction, isTaskPreStart, planningDraft?.draftId, selectedPlanMode, selectedPlanOptionId]);
  const activeWarningKey = useMemo(
    () => (tasksFeed?.warning ? createWarningKey(tasksFeed.warning, tasksFeed.warningDetails) : null),
    [tasksFeed?.warning, tasksFeed?.warningDetails],
  );
  const showCopilotWarning = Boolean(tasksFeed?.warning && activeWarningKey && !dismissedWarningKeys.has(activeWarningKey));

  const showHomeTab = useCallback(() => {
    setActiveTab('home');
  }, []);

  const showSharedTab = useCallback(() => {
    setActiveTab('shared');
  }, []);

  const showChatTab = useCallback(() => {
    setActiveTab('chat');
  }, []);

  const showDocsTab = useCallback(() => {
    setActiveTab('docs');
  }, []);

  const showTasksTab = useCallback(() => {
    setActiveTab('tasks');
    setTasksViewMode('list');
  }, []);

  const showPrimaryTab = useCallback(
    (tab: MainTab) => {
      switch (tab) {
        case 'home':
          showHomeTab();
          break;
        case 'shared':
          showSharedTab();
          break;
        case 'chat':
          showChatTab();
          break;
        case 'docs':
          showDocsTab();
          break;
        case 'tasks':
          showTasksTab();
          break;
      }
    },
    [showChatTab, showDocsTab, showHomeTab, showSharedTab, showTasksTab],
  );

  const closeHomeNote = useCallback(() => {
    setSelectedHomeNoteId(null);
    setHomeDetail(null);
    setHomeDetailError(null);
    setHomeDetailLoading(false);
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
      writeDismissedWarningKeys(next);
      return next;
    });
  }, [activeWarningKey]);

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

  const fetchHomeFeed = useCallback(async (): Promise<HomeFeed | null> => {
    setHomeLoading(true);
    try {
      const next = await granolaClient.homeGetFeed();
      setHomeFeed(next);
      setHomeError(null);
      return next;
    } catch (error) {
      setHomeError(error instanceof Error ? error.message : 'Unable to load Granola Home.');
      return null;
    } finally {
      setHomeLoading(false);
    }
  }, []);

  const fetchHomeNoteDetail = useCallback(async (noteId: string): Promise<HomeNoteDetail | null> => {
    setHomeDetailLoading(true);
    try {
      const next = await granolaClient.homeGetNoteDetail(noteId);
      setSelectedHomeNoteId(noteId);
      setHomeDetail(next);
      setHomeDetailError(null);
      return next;
    } catch (error) {
      setSelectedHomeNoteId(noteId);
      setHomeDetail(null);
      setHomeDetailError(error instanceof Error ? error.message : 'Unable to load note detail.');
      return null;
    } finally {
      setHomeDetailLoading(false);
    }
  }, []);

  const fetchChatHome = useCallback(async (): Promise<GranolaChatHome | null> => {
    setChatHomeLoading(true);
    try {
      const next = await granolaClient.chatGetHome();
      setChatHome(next);
      setChatHomeError(null);
      return next;
    } catch (error) {
      setChatHomeError(error instanceof Error ? error.message : 'Unable to load Granola chat.');
      return null;
    } finally {
      setChatHomeLoading(false);
    }
  }, []);

  const fetchChatThread = useCallback(async (threadId: string): Promise<GranolaChatThread | null> => {
    if (!threadId) {
      return null;
    }
    setChatThreadLoading(true);
    try {
      const next = await granolaClient.chatGetThread(threadId);
      setSelectedChatThreadId(threadId);
      setChatThread(next);
      setChatThreadError(null);
      return next;
    } catch (error) {
      setSelectedChatThreadId(threadId);
      setChatThread(null);
      setChatThreadError(error instanceof Error ? error.message : 'Unable to load chat thread.');
      return null;
    } finally {
      setChatThreadLoading(false);
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

  const fetchPlanningContext = useCallback(async (todoId: string): Promise<void> => {
    if (!todoId) {
      return;
    }
    setPlanningContextLoading(true);
    try {
      const context = await granolaClient.tasksGetPlanningContext(todoId);
      setPlanningContext(context);
      setTasksError(null);
    } catch (error) {
      setTasksError(error instanceof Error ? error.message : 'Unable to load planning context.');
      setPlanningContext(null);
    } finally {
      setPlanningContextLoading(false);
    }
  }, []);

  const openTaskChat = useCallback(
    async (todoId: string) => {
      setSelectedTodoId(todoId);
      setTasksViewMode('chat');
      setLiveStatus(null);
      setPlanningInput('');
      setCustomPlanInstruction('');
      setSelectedPlanMode(null);
      setSelectedPlanOptionId(null);
      await fetchThread(todoId, null, false);
      await fetchPlanningContext(todoId);
      scrollMessagesToBottom(false);
    },
    [fetchPlanningContext, fetchThread, scrollMessagesToBottom],
  );

  const scheduleFeedRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      return;
    }
    refreshTimerRef.current = setTimeout(() => {
      refreshTimerRef.current = null;
      void fetchTasksFeed();
      void fetchHomeFeed();
      void fetchChatHome();
      if (selectedHomeNoteId) {
        void fetchHomeNoteDetail(selectedHomeNoteId);
      }
      if (selectedChatThreadId) {
        void fetchChatThread(selectedChatThreadId);
      }
    }, 200);
  }, [fetchChatHome, fetchChatThread, fetchHomeFeed, fetchHomeNoteDetail, fetchTasksFeed, selectedChatThreadId, selectedHomeNoteId]);

  useEffect(() => {
    void fetchTasksFeed();
    void fetchHomeFeed();
    void fetchChatHome();
  }, [fetchChatHome, fetchHomeFeed, fetchTasksFeed]);

  useEffect(() => {
    if (!selectedTodoId || tasksViewMode !== 'chat') {
      return;
    }
    void fetchThread(selectedTodoId, null, false);
    void fetchPlanningContext(selectedTodoId);
  }, [fetchPlanningContext, fetchThread, selectedTodoId, tasksViewMode]);

  useEffect(() => {
    if (latestPlanDraft) {
      setPlanningDraft(latestPlanDraft);
      return;
    }
    setPlanningDraft(null);
  }, [latestPlanDraft]);

  useEffect(() => {
    if (!chatSendStartedAt) {
      setChatSendElapsedSeconds(0);
      return;
    }

    const updateElapsed = () => {
      setChatSendElapsedSeconds(Math.max(1, Math.round((Date.now() - chatSendStartedAt) / 1000)));
    };

    updateElapsed();
    const interval = window.setInterval(updateElapsed, 1000);
    return () => {
      window.clearInterval(interval);
    };
  }, [chatSendStartedAt]);

  useEffect(() => {
    if (!planningDraft) {
      return;
    }
    if (selectedPlanMode === 'custom') {
      return;
    }
    const hasSelectedOption = Boolean(
      selectedPlanMode === 'preset' &&
        selectedPlanOptionId &&
        planningDraft.options.some((option) => option.id === selectedPlanOptionId),
    );
    if (hasSelectedOption) {
      return;
    }
    setSelectedPlanMode('preset');
    setSelectedPlanOptionId(planningDraft.recommendedOptionId);
  }, [planningDraft, selectedPlanMode, selectedPlanOptionId]);

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
      await fetchHomeFeed();
      await fetchChatHome();
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
        await fetchHomeFeed();
        await fetchChatHome();
        if (selectedHomeNoteId) {
          await fetchHomeNoteDetail(selectedHomeNoteId);
        }
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
      await fetchHomeFeed();
      await fetchChatHome();
      if (selectedHomeNoteId) {
        await fetchHomeNoteDetail(selectedHomeNoteId);
      }
    }
  }, [fetchChatHome, fetchHomeFeed, fetchHomeNoteDetail, fetchTasksFeed, isConnecting, isSyncing, selectedHomeNoteId, tasksFeed]);

  const resetChatLanding = useCallback(() => {
    setSelectedChatThreadId(null);
    setChatThread(null);
    setChatThreadError(null);
    setChatThreadLoading(false);
    setChatComposerText('');
    setChatPendingActionLabel(null);
    setChatSendStartedAt(null);
    setChatSendElapsedSeconds(0);
  }, []);

  const handleOpenChatThread = useCallback(
    async (threadId: string) => {
      setActiveTab('chat');
      setChatPendingActionLabel(null);
      setChatComposerText('');
      await fetchChatThread(threadId);
    },
    [fetchChatThread],
  );

  const handleSendChatMessage = useCallback(
    async ({ text, recipe }: { text: string; recipe?: GranolaChatRecipe | null }) => {
      if (chatSending) {
        return;
      }

      const displayText = text.trim();
      if (!displayText) {
        return;
      }

      const threadId = selectedChatThreadId || createClientSideId('granola-chat');
      const startedAtMs = Date.now();
      const now = new Date().toISOString();
      const optimisticUserMessage = {
        messageId: createClientSideId('granola-chat-user'),
        threadId,
        role: 'user' as const,
        content: displayText,
        createdAt: now,
        status: 'completed' as const,
        thoughtDurationSeconds: null,
      };
      const optimisticTitle = (recipe?.label || displayText).trim().slice(0, 86) || 'New chat';

      setActiveTab('chat');
      setSelectedChatThreadId(threadId);
      setChatThreadLoading(false);
      setChatThreadError(null);
      setChatThread((current) => {
        if (!current || current.threadId !== threadId) {
          return {
            threadId,
            title: optimisticTitle,
            scope: 'all_meetings',
            messages: [optimisticUserMessage],
            updatedAt: now,
          };
        }
        return {
          ...current,
          title: current.title || optimisticTitle,
          updatedAt: now,
          messages: [...current.messages, optimisticUserMessage],
        };
      });
      setChatComposerText('');
      setChatSending(true);
      setChatSendStartedAt(startedAtMs);
      setChatPendingActionLabel(recipe?.label || displayText);

      try {
        const result = await granolaClient.chatSendMessage({
          threadId,
          text: displayText,
          scope: 'all_meetings',
          recipeId: recipe?.id ?? null,
        });
        if (!result.ok && result.message) {
          setChatThreadError(result.message);
        }
        await fetchChatHome();
        await fetchChatThread(result.threadId);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to send chat message.';
        setChatThreadError(message);
        setChatThread((current) => {
          if (!current || current.threadId !== threadId) {
            return current;
          }
          return {
            ...current,
            updatedAt: new Date().toISOString(),
            messages: [
              ...current.messages,
              {
                messageId: createClientSideId('granola-chat-error'),
                threadId,
                role: 'assistant',
                content: message,
                createdAt: new Date().toISOString(),
                status: 'error',
                thoughtDurationSeconds: Math.max(1, Math.round((Date.now() - startedAtMs) / 1000)),
              },
            ],
          };
        });
      } finally {
        setChatSending(false);
        setChatSendStartedAt(null);
        setChatPendingActionLabel(null);
      }
    },
    [chatSending, fetchChatHome, fetchChatThread, selectedChatThreadId],
  );

  const handleStartTodo = useCallback(
    async (todoId: string, options?: TaskStartOptions) => {
      if (startingTodoId) {
        return;
      }
      setSelectedTodoId(todoId);
      setTasksViewMode('chat');
      setStartingTodoId(todoId);
      setLiveStatus('Starting task execution...');
      try {
        const result = options ? await granolaClient.tasksStart(todoId, options) : await granolaClient.tasksStart(todoId);
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

  const handleGeneratePlan = useCallback(async () => {
    if (!selectedTodoId || isPlanning) {
      return;
    }
    const instruction = planningInput.trim() || 'Generate 2-3 concise plan options with one recommended option.';
    setIsPlanning(true);
    try {
      const result = await granolaClient.tasksPlanMessage(selectedTodoId, instruction);
      if (!result.ok && result.message) {
        setTasksError(result.message);
      } else {
        setTasksError(null);
      }
      if (result.plan) {
        setPlanningDraft(result.plan);
        setSelectedPlanMode('preset');
        setSelectedPlanOptionId(result.plan.recommendedOptionId);
      }
      setPlanningInput('');
    } catch (error) {
      setTasksError(error instanceof Error ? error.message : 'Unable to generate a plan.');
    } finally {
      setIsPlanning(false);
      await fetchTasksFeed();
    }
  }, [fetchTasksFeed, isPlanning, planningInput, selectedTodoId]);

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
      if (isTaskPreStart) {
        const result = await granolaClient.tasksPlanMessage(selectedTodoId, trimmed);
        if (!result.ok && result.message) {
          setTasksError(result.message);
        } else {
          setTasksError(null);
        }
        if (result.plan) {
          setPlanningDraft(result.plan);
          setSelectedPlanMode('preset');
          setSelectedPlanOptionId(result.plan.recommendedOptionId);
        }
        return;
      }
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
  }, [composerText, fetchTasksFeed, isSendingMessage, isTaskPreStart, selectedTodoId]);

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
  const sidebar = (
    <GlobalSidebar
      activeTab={activeTab}
      onSelectTab={showPrimaryTab}
      sidebarActionLabel={sidebarActionLabel}
      sidebarActionDisabled={isConnecting || isSyncing}
      onSidebarAction={() => {
        void handleSidebarGranolaAction();
      }}
    />
  );

  if (activeTab === 'chat') {
    return (
      <GranolaChatPane
        sidebar={sidebar}
        chatHome={chatHome}
        chatHomeLoading={chatHomeLoading}
        chatHomeError={chatHomeError}
        selectedChatThreadId={selectedChatThreadId}
        chatThread={chatThread}
        chatThreadLoading={chatThreadLoading}
        chatThreadError={chatThreadError}
        composerText={chatComposerText}
        onComposerTextChange={setChatComposerText}
        onSend={(input) => {
          void handleSendChatMessage(input);
        }}
        onOpenThread={(threadId) => {
          void handleOpenChatThread(threadId);
        }}
        onNewChat={resetChatLanding}
        onBackToLanding={resetChatLanding}
        chatSending={chatSending}
        chatSendElapsedSeconds={chatSendElapsedSeconds}
        chatPendingActionLabel={chatPendingActionLabel}
      />
    );
  }

  if (activeTab === 'docs') {
    return <DocsWorkspace sidebar={sidebar} />;
  }

  if (activeTab !== 'tasks') {
    return (
      <GranolaReplicaHome
        activeTab={activeTab}
        sidebar={sidebar}
        homeFeed={homeFeed}
        homeLoading={homeLoading}
        homeError={homeError}
        homeDetail={homeDetail}
        homeDetailLoading={homeDetailLoading}
        homeDetailError={homeDetailError}
        onSelectNote={(noteId) => {
          void fetchHomeNoteDetail(noteId);
        }}
        onBackToHome={closeHomeNote}
        onOpenChat={showChatTab}
        onOpenTasks={showTasksTab}
      />
    );
  }

  return (
    <div className="granola-frame" data-name="Granola" data-node-id="13:2">
      {sidebar}

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
                        void handleStartTodo(selectedTodoId, selectedStartOptions);
                      }
                    }}
                    disabled={!selectedTodoId || Boolean(startingTodoId) || !plannerSelectionValid}
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
                {isTaskPreStart ? (
                  <TaskPlanningPanel
                    context={planningContext}
                    contextLoading={planningContextLoading}
                    draft={planningDraft}
                    isPlanning={isPlanning}
                    planningInput={planningInput}
                    onPlanningInputChange={setPlanningInput}
                    onGenerate={() => {
                      void handleGeneratePlan();
                    }}
                    selectedMode={selectedPlanMode}
                    selectedOptionId={selectedPlanOptionId}
                    onSelectOption={(mode, optionId) => {
                      setSelectedPlanMode(mode);
                      if (mode === 'preset') {
                        setSelectedPlanOptionId(optionId ?? null);
                        return;
                      }
                      setSelectedPlanOptionId(null);
                    }}
                    customInstruction={customPlanInstruction}
                    onCustomInstructionChange={setCustomPlanInstruction}
                  />
                ) : null}

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
                {!threadLoading && threadMessages.length === 0 && !isTaskPreStart ? (
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
                  placeholder={isTaskPreStart ? 'Tell planner how this task should be planned...' : 'Message task copilot...'}
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
                  {isSendingMessage ? (isTaskPreStart ? 'Planning...' : 'Sending...') : isTaskPreStart ? 'Plan' : 'Send'}
                </button>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
