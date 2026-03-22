import { type KeyboardEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarIcon,
  ChatIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  FileIcon,
  FolderIcon,
  GridIcon,
  PeopleIcon,
  SearchIcon,
  SlidersIcon,
} from '../design-system/icons';
import { MarkdownMessage } from '../components/MarkdownMessage';
import type {
  CodexAIStatus,
  TaskChatMessage,
  TaskPlanDraft,
  TaskPlanningContext,
  TaskStartOptions,
  TaskWorkspaceGroupBy,
  TaskWorkspaceItem,
  TaskWorkspacePrefs,
  TaskWorkspaceSortBy,
  TasksFeed,
  TasksWorkspace,
} from '../shared/types';

type TaskFilterMode = 'all' | 'due_soon' | 'unassigned' | 'following';
type TaskDetailTab = 'plan' | 'activity' | 'overview' | 'brief';
type TaskQuickActionKind = 'planner' | 'message';

type TaskQuickAction = {
  id: string;
  kind: TaskQuickActionKind;
  label: string;
  description: string;
  prompt: string;
  recommended?: boolean;
};

type TasksWorkspaceScreenProps = {
  sidebar: ReactNode;
  feed: TasksFeed | null;
  workspace: TasksWorkspace | null;
  error: string | null;
  isElectronRuntime: boolean;
  selectedTodoId: string | null;
  selectedTask: TaskWorkspaceItem | null;
  planningContext: TaskPlanningContext | null;
  planningContextLoading: boolean;
  planningDraft: TaskPlanDraft | null;
  planningInput: string;
  onPlanningInputChange: (value: string) => void;
  isPlanning: boolean;
  selectedPlanMode: 'preset' | 'custom' | null;
  selectedPlanOptionId: string | null;
  customPlanInstruction: string;
  onCustomPlanInstructionChange: (value: string) => void;
  onSelectPlanOption: (mode: 'preset' | 'custom', optionId?: string | null) => void;
  onGeneratePlan: () => void;
  selectedStartOptions?: TaskStartOptions;
  plannerSelectionValid: boolean;
  threadMessages: TaskChatMessage[];
  threadLoading: boolean;
  threadLoadingOlder: boolean;
  threadHasMore: boolean;
  onLoadOlderThread: () => void;
  composerText: string;
  onComposerTextChange: (value: string) => void;
  onSendMessage: () => void;
  isSendingMessage: boolean;
  isTaskPreStart: boolean;
  startingTodoId: string | null;
  openingRunTodoId: string | null;
  activeRunTodoId: string | null;
  showWorkingIndicator: boolean;
  activityLabel: string | null;
  showWarning: boolean;
  warningSummary: string | null;
  warningDetails: string[];
  onHideWarning: () => void;
  onSelectTodo: (todoId: string) => void;
  onStartTodo: (todoId: string, options?: TaskStartOptions) => void;
  onCancelRun: () => void;
  onOpenRun: (todoId: string) => void;
  onClearThread: () => void;
  onReconnectExecutor: () => void;
  isReconnectingExecutor: boolean;
  onUpdateWorkspacePrefs: (patch: Partial<TaskWorkspacePrefs>) => void;
  onUpdateTaskMetadata: (
    todoId: string,
    patch: {
      assigneeId?: string | null;
      listId?: string;
      boardColumnId?: string;
      following?: boolean;
    },
  ) => void;
  aiStatus: CodexAIStatus | null;
  onOpenAISettings: () => void;
  onSummarizeTask: () => void;
  isSummarizingTask: boolean;
  onRunQuickAction: (input: { kind: TaskQuickActionKind; text: string }) => void;
};

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function formatDateLabel(value: string | null): string {
  if (!value) {
    return 'None';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return value;
  }
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateTimeLabel(value: string | null): string {
  if (!value) {
    return 'Never';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return value;
  }
  return parsed.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function formatClock(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return '--:--';
  }
  return parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
}

function syncHealthLabel(feed: TasksFeed | null): string {
  if (!feed) {
    return 'Healthy';
  }
  if (feed.syncHealth === 'cooldown') {
    return `Cooling down until ${formatDateTimeLabel(feed.cooldownUntil)}`;
  }
  if (feed.syncHealth === 'degraded') {
    return 'Degraded';
  }
  return 'Healthy';
}

function runQueueLabel(task: TaskWorkspaceItem): string {
  if (task.runQueueState === 'running' || task.runState === 'running') {
    return 'Running';
  }
  if (task.runQueueState === 'queued') {
    return 'Queued';
  }
  if (task.runState === 'done') {
    return 'Done';
  }
  if (task.runState === 'blocked') {
    return 'Blocked';
  }
  return 'Idle';
}

function priorityLabel(priority: TaskWorkspaceItem['priority']): string {
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

function statusLabel(status: TaskWorkspaceItem['status']): string {
  return status.replace(/_/g, ' ');
}

function latestPlanDraftFromMessages(messages: TaskChatMessage[]): TaskPlanDraft | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.messageType === 'planning_draft' && message.planDraft) {
      return message.planDraft;
    }
  }
  return null;
}

function selectSectionItems(items: TaskWorkspaceItem[], sectionId: TasksWorkspace['sections'][number]['id']): TaskWorkspaceItem[] {
  switch (sectionId) {
    case 'assigned':
      return items.filter((item) => Boolean(item.assignee));
    case 'running':
      return items.filter((item) => item.runQueueState === 'running' || item.runQueueState === 'queued');
    case 'completed':
      return items.filter((item) => item.boardColumnId === 'done');
    case 'activity': {
      const cutoff = Date.now() - 72 * 60 * 60 * 1000;
      return items.filter((item) => Date.parse(item.lastUpdatedAt) >= cutoff || item.attempts > 0);
    }
    default:
      return items;
  }
}

function selectFilterItems(items: TaskWorkspaceItem[], filterMode: TaskFilterMode): TaskWorkspaceItem[] {
  switch (filterMode) {
    case 'due_soon':
      return items.filter((item) => {
        if (!item.dueDate) {
          return false;
        }
        const dueMs = Date.parse(item.dueDate);
        return Number.isFinite(dueMs) && dueMs <= Date.now() + 7 * 24 * 60 * 60 * 1000;
      });
    case 'unassigned':
      return items.filter((item) => !item.assignee);
    case 'following':
      return items.filter((item) => item.following);
    default:
      return items;
  }
}

function filterSearchItems(items: TaskWorkspaceItem[], query: string): TaskWorkspaceItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return items;
  }
  return items.filter((item) => {
    const haystack = [
      item.title,
      item.description,
      item.meetingTitle,
      item.assignee?.label ?? '',
      item.publicSummary,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

function buildListGroups(items: TaskWorkspaceItem[], groupBy: TaskWorkspaceGroupBy): Array<{ id: string; label: string; items: TaskWorkspaceItem[] }> {
  const groups = new Map<string, { id: string; label: string; items: TaskWorkspaceItem[] }>();
  for (const item of items) {
    let id = 'all';
    let label = 'All tasks';
    switch (groupBy) {
      case 'meeting':
        id = `meeting:${item.meetingId}`;
        label = item.meetingTitle || 'Unknown meeting';
        break;
      case 'assignee':
        id = item.assignee?.id ?? 'unassigned';
        label = item.assignee?.label ?? 'Unassigned';
        break;
      case 'priority':
        id = item.priority;
        label = priorityLabel(item.priority);
        break;
      case 'status':
        id = item.status;
        label = statusLabel(item.status);
        break;
      default:
        id = item.boardColumnId;
        label = item.boardColumnId.charAt(0).toUpperCase() + item.boardColumnId.slice(1);
        break;
    }
    const current = groups.get(id) ?? { id, label, items: [] };
    current.items.push(item);
    groups.set(id, current);
  }
  return [...groups.values()];
}

function buildKanbanColumns(workspace: TasksWorkspace | null, items: TaskWorkspaceItem[], groupBy: TaskWorkspaceGroupBy) {
  if (!workspace) {
    return [];
  }
  if (groupBy === 'board') {
    return workspace.boardColumns.map((column) => ({
      id: column.id,
      label: column.label,
      items: items.filter((item) => item.boardColumnId === column.id),
      draggable: true,
    }));
  }

  const map = new Map<string, { id: string; label: string; items: TaskWorkspaceItem[]; draggable: boolean }>();
  for (const item of items) {
    let id = 'all';
    let label = 'All tasks';
    switch (groupBy) {
      case 'meeting':
        id = `meeting:${item.meetingId}`;
        label = item.meetingTitle || 'Unknown meeting';
        break;
      case 'assignee':
        id = item.assignee?.id ?? 'unassigned';
        label = item.assignee?.label ?? 'Unassigned';
        break;
      case 'priority':
        id = item.priority;
        label = priorityLabel(item.priority);
        break;
      case 'status':
        id = item.status;
        label = statusLabel(item.status);
        break;
      default:
        break;
    }
    const current = map.get(id) ?? { id, label, items: [], draggable: false };
    current.items.push(item);
    map.set(id, current);
  }
  return [...map.values()];
}

function defaultDetailTabForTask(task: TaskWorkspaceItem | null, hasThread: boolean): TaskDetailTab {
  if (!task) {
    return 'overview';
  }
  if (hasThread || task.attempts > 0 || Boolean(task.runId) || task.runState !== 'idle' || task.runQueueState !== 'idle') {
    return 'activity';
  }
  return 'plan';
}

function formatSentenceList(items: string[]): string {
  if (items.length === 0) {
    return '';
  }
  if (items.length === 1) {
    return items[0] as string;
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function taskContextText(task: TaskWorkspaceItem): string {
  return [task.title, task.description, task.publicSummary, task.meetingTitle].filter(Boolean).join(' ');
}

function mentionedDemoProducts(task: TaskWorkspaceItem): string[] {
  const haystack = taskContextText(task).toLowerCase();
  return ['Granola', 'Lark', 'Sentra', 'Micro'].filter((name) => haystack.includes(name.toLowerCase()));
}

function meetingAudienceLabel(task: TaskWorkspaceItem): string {
  const haystack = taskContextText(task).toLowerCase();
  if (haystack.includes('granola')) {
    return 'the Granola product engineer';
  }
  if (haystack.includes('customer') || haystack.includes('prospect')) {
    return 'the customer or prospect';
  }
  return 'the person I am meeting';
}

function taskFocusSentence(task: TaskWorkspaceItem): string {
  const products = mentionedDemoProducts(task);
  if (products.length > 0) {
    return `Focus especially on ${formatSentenceList(products)}.`;
  }
  return 'Focus on the products and organizations already mentioned in the task context.';
}

function buildPlannerQuickActions(task: TaskWorkspaceItem): TaskQuickAction[] {
  const focus = taskFocusSentence(task);
  return [
    {
      id: 'research-operator',
      kind: 'planner',
      label: 'Research operator',
      description: 'Generate a web-first plan with a concise final artifact.',
      prompt:
        `Plan this as a research operator. Use public web sources, synthesize the strongest product patterns and tradeoffs, and end with a concise follow-up draft. ${focus} Keep the output sharp enough for a live product conversation.`,
      recommended: true,
    },
    {
      id: 'product-angle',
      kind: 'planner',
      label: 'Product angle',
      description: 'Bias the work toward what to borrow, avoid, and say live.',
      prompt:
        `Bias this plan toward product recommendations: what to borrow, what to avoid, and the clearest narrative to say live. ${focus}`,
    },
    {
      id: 'demo-ready-output',
      kind: 'planner',
      label: 'Demo-ready output',
      description: 'Ask for a crisp memo plus a ready follow-up note.',
      prompt:
        'Structure the final output as 3 things to borrow, 2 things to avoid, 1 narrative to say live, and a short follow-up note ready for human approval.',
    },
  ];
}

function buildExecutionQuickActions(task: TaskWorkspaceItem): TaskQuickAction[] {
  const audience = meetingAudienceLabel(task);
  const focus = taskFocusSentence(task);
  return [
    {
      id: 'refine-recommendations',
      kind: 'message',
      label: 'Refine recommendations',
      description: 'Tighten the ideas, tradeoffs, and live narrative.',
      prompt:
        `Refine the findings into 3 specific product ideas to borrow, 2 anti-patterns to avoid, and 1 crisp narrative for ${audience}. ${focus} Keep it concise and concrete.`,
      recommended: true,
    },
    {
      id: 'draft-follow-up',
      kind: 'message',
      label: 'Draft follow-up',
      description: 'Turn the findings into a concise message.',
      prompt:
        `Turn the findings into a concise follow-up message for ${audience}. Keep it warm, product-smart, and specific. ${focus} Return draft text only. Do not send it, do not open any compose flow, and do not use any external messaging, email, browser, or relay tools.`,
    },
    {
      id: 'prepare-send-ready',
      kind: 'message',
      label: 'Prepare send-ready version',
      description: 'Make the message ready for human approval.',
      prompt:
        `Prepare a send-ready version of the follow-up for ${audience}. Keep it short, natural, and ready for human approval. Return the final draft in plain text only. Do not send anything, do not open any compose window, and do not use messaging, email, browser, or relay tools. If sending would normally be next, say that explicitly as a recommendation only.`,
    },
  ];
}

function TaskPlanningSurface({
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
  onSelectOption: (mode: 'preset' | 'custom', optionId?: string | null) => void;
  customInstruction: string;
  onCustomInstructionChange: (value: string) => void;
}) {
  return (
    <section className="tasks-detail-card">
      <header className="tasks-detail-card__header">
        <div>
          <h3>Planner</h3>
          <p>Shape the execution approach before you start the task.</p>
        </div>
        <button type="button" className="tasks-soft-button" onClick={onGenerate} disabled={isPlanning}>
          {isPlanning ? 'Planning...' : draft ? 'Replan' : 'Plan task'}
        </button>
      </header>

      <div className="tasks-planning-context-grid">
        {contextLoading ? <p className="tasks-empty-copy">Loading context...</p> : null}
        {!contextLoading && !context ? <p className="tasks-empty-copy">Planning context unavailable.</p> : null}
        {context?.sections.map((section) => (
          <article key={section.id} className="tasks-planning-card">
            <h4>{section.title}</h4>
            <ul>
              {section.bullets.map((bullet, index) => (
                <li key={`${section.id}-${index}`}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <label className="tasks-field">
        <span>Planner guidance</span>
        <textarea
          value={planningInput}
          onChange={(event) => {
            onPlanningInputChange(event.target.value);
          }}
          placeholder="Anything special about how this should be planned?"
          disabled={isPlanning}
        />
      </label>

      {draft ? (
        <div className="tasks-plan-options-grid">
          {draft.options.map((option, index) => {
            const selected = selectedMode === 'preset' && selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={cx('tasks-plan-option', selected && 'is-selected')}
                onClick={() => {
                  onSelectOption('preset', option.id);
                }}
              >
                <div className="tasks-plan-option__top">
                  <strong>
                    {index + 1}. {option.title}
                  </strong>
                  {option.recommended ? <span className="tasks-plan-option__badge">Recommended</span> : null}
                </div>
                <p>{option.summary}</p>
                <small>{option.why}</small>
                <ul>
                  {option.steps.map((step, stepIndex) => (
                    <li key={`${option.id}-${stepIndex}`}>{step}</li>
                  ))}
                </ul>
              </button>
            );
          })}

          <div className={cx('tasks-plan-option', 'is-custom', selectedMode === 'custom' && 'is-selected')}>
            <button
              type="button"
              className="tasks-plan-option__custom-trigger"
              onClick={() => {
                onSelectOption('custom');
              }}
            >
              Custom plan
            </button>
            <textarea
              value={customInstruction}
              onFocus={() => {
                onSelectOption('custom');
              }}
              onChange={(event) => {
                onCustomInstructionChange(event.target.value);
              }}
              placeholder="Type custom planning instructions..."
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function TaskMessageCard({ message }: { message: TaskChatMessage }) {
  const [expanded, setExpanded] = useState(false);
  const detailRows = [
    message.trace?.detail?.trim() || '',
    message.trace?.toolArgs?.trim() || '',
    message.trace?.toolMeta?.trim() || '',
  ].filter((value) => value.length > 0);
  const title = message.trace?.title || message.content || 'Update';

  if (message.trace?.kind === 'source_fetch' && message.trace.sourceUrl) {
    detailRows.push(message.trace.sourceUrl);
  }

  return (
    <article className={cx('tasks-message', `is-${message.role}`, message.streaming && 'is-streaming')}>
      <header className="tasks-message__header">
        <span>{message.role === 'assistant' ? 'Assistant' : message.role === 'user' ? 'You' : 'Status'}</span>
        <span>{formatClock(message.createdAt)}</span>
      </header>
      <div className="tasks-message__content">
        {message.role === 'assistant' || message.role === 'system' ? (
          <MarkdownMessage content={message.content || '...'} />
        ) : (
          <p>{title}</p>
        )}
      </div>
      {detailRows.length > 0 ? (
        <div className="tasks-message__trace">
          <button
            type="button"
            className="tasks-message__trace-toggle"
            onClick={() => {
              setExpanded((current) => !current);
            }}
          >
            {expanded ? 'Hide details' : 'Show details'}
          </button>
          {expanded ? (
            <div className="tasks-message__trace-body">
              {detailRows.map((detail, index) =>
                detail.startsWith('http') ? (
                  <a key={`${message.messageId}-${index}`} href={detail} target="_blank" rel="noreferrer">
                    {detail}
                  </a>
                ) : (
                  <pre key={`${message.messageId}-${index}`}>{detail}</pre>
                ),
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function TaskMessageTimeline({
  messages,
  hideStreamingAssistant,
}: {
  messages: TaskChatMessage[];
  hideStreamingAssistant: boolean;
}) {
  return (
    <div className="tasks-timeline">
      {messages.map((message) => {
        if (hideStreamingAssistant && message.role === 'assistant' && message.streaming) {
          return null;
        }
        return <TaskMessageCard key={message.messageId} message={message} />;
      })}
    </div>
  );
}

function TaskQuickActionsPanel({
  title,
  description,
  actions,
  disabled,
  onRun,
}: {
  title: string;
  description: string;
  actions: TaskQuickAction[];
  disabled: boolean;
  onRun: (input: { kind: TaskQuickActionKind; text: string }) => void;
}) {
  return (
    <section className="tasks-detail-card tasks-detail-card--quick-actions">
      <header className="tasks-detail-card__header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </header>

      <div className="tasks-quick-actions">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={cx('tasks-quick-action', action.recommended && 'is-recommended')}
            disabled={disabled}
            onClick={() => {
              onRun({ kind: action.kind, text: action.prompt });
            }}
          >
            <span className="tasks-quick-action__top">
              <strong>{action.label}</strong>
              {action.recommended ? <span className="tasks-quick-action__badge">Recommended</span> : null}
            </span>
            <small>{action.description}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function TasksWorkspaceScreen({
  sidebar,
  feed,
  workspace,
  error,
  isElectronRuntime,
  selectedTodoId,
  selectedTask,
  planningContext,
  planningContextLoading,
  planningDraft,
  planningInput,
  onPlanningInputChange,
  isPlanning,
  selectedPlanMode,
  selectedPlanOptionId,
  customPlanInstruction,
  onCustomPlanInstructionChange,
  onSelectPlanOption,
  onGeneratePlan,
  selectedStartOptions,
  plannerSelectionValid,
  threadMessages,
  threadLoading,
  threadLoadingOlder,
  threadHasMore,
  onLoadOlderThread,
  composerText,
  onComposerTextChange,
  onSendMessage,
  isSendingMessage,
  isTaskPreStart,
  startingTodoId,
  openingRunTodoId,
  activeRunTodoId,
  showWorkingIndicator,
  activityLabel,
  showWarning,
  warningSummary,
  warningDetails,
  onHideWarning,
  onSelectTodo,
  onStartTodo,
  onCancelRun,
  onOpenRun,
  onClearThread,
  onReconnectExecutor,
  isReconnectingExecutor,
  onUpdateWorkspacePrefs,
  onUpdateTaskMetadata,
  aiStatus,
  onOpenAISettings,
  onSummarizeTask,
  isSummarizingTask,
  onRunQuickAction,
}: TasksWorkspaceScreenProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<TasksWorkspace['sections'][number]['id']>('all');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<TaskFilterMode>('all');
  const [showCompactCustomize, setShowCompactCustomize] = useState(false);
  const [draggingTodoId, setDraggingTodoId] = useState<string | null>(null);
  const [detailTodoId, setDetailTodoId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<TaskDetailTab>('overview');
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = messagesViewportRef.current;
    if (!element) {
      return;
    }
    element.scrollTop = element.scrollHeight;
  }, [threadMessages, selectedTodoId]);

  useEffect(() => {
    if (!workspace) {
      return;
    }
    if (selectedListId && !workspace.lists.some((list) => list.id === selectedListId)) {
      setSelectedListId(null);
    }
  }, [selectedListId, workspace]);

  useEffect(() => {
    if (!detailTodoId || !workspace) {
      return;
    }
    if (!workspace.items.some((item) => item.todoId === detailTodoId)) {
      setDetailTodoId(null);
    }
  }, [detailTodoId, workspace]);

  useEffect(() => {
    if (!detailTodoId) {
      return;
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDetailTodoId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [detailTodoId]);

  const effectiveDraft = useMemo(
    () => planningDraft ?? latestPlanDraftFromMessages(threadMessages),
    [planningDraft, threadMessages],
  );

  const filteredItems = useMemo(() => {
    const base = workspace?.items ?? [];
    const bySection = selectSectionItems(base, selectedSectionId);
    const byList = selectedListId ? bySection.filter((item) => item.listId === selectedListId) : bySection;
    const byFilter = selectFilterItems(byList, filterMode);
    return filterSearchItems(byFilter, searchQuery);
  }, [filterMode, searchQuery, selectedListId, selectedSectionId, workspace?.items]);

  const listGroups = useMemo(
    () => buildListGroups(filteredItems, workspace?.prefs.groupBy ?? 'board'),
    [filteredItems, workspace?.prefs.groupBy],
  );

  const kanbanColumns = useMemo(
    () => buildKanbanColumns(workspace, filteredItems, workspace?.prefs.groupBy ?? 'board'),
    [filteredItems, workspace, workspace?.prefs.groupBy],
  );

  const detailTask = useMemo(() => {
    if (!detailTodoId) {
      return null;
    }
    if (selectedTask?.todoId === detailTodoId) {
      return selectedTask;
    }
    return workspace?.items.find((item) => item.todoId === detailTodoId) ?? null;
  }, [detailTodoId, selectedTask, workspace]);

  const detailOpen = Boolean(detailTodoId && detailTask);
  const selectedRunning = Boolean(detailTask && activeRunTodoId === detailTask.todoId);
  const currentViewMode = workspace?.prefs.viewMode ?? 'list';
  const currentSortBy = workspace?.prefs.sortBy ?? 'updated';
  const currentGroupBy = workspace?.prefs.groupBy ?? 'board';
  const selectedAssigneeValue = detailTask?.assignee?.id ?? '__unassigned__';
  const primaryTab = isTaskPreStart ? 'plan' : 'activity';
  const hasThread = threadMessages.length > 0;
  const plannerQuickActions = useMemo(() => (detailTask ? buildPlannerQuickActions(detailTask) : []), [detailTask]);
  const executionQuickActions = useMemo(() => (detailTask ? buildExecutionQuickActions(detailTask) : []), [detailTask]);

  const openTaskDetail = (item: TaskWorkspaceItem) => {
    const nextHasThread = selectedTodoId === item.todoId && hasThread;
    setDetailTodoId(item.todoId);
    setDetailTab(defaultDetailTabForTask(item, nextHasThread));
    onSelectTodo(item.todoId);
  };

  return (
    <div className="granola-frame" data-name="Granola" data-node-id="13:2">
      {sidebar}

      <main className="granola-main granola-main--tasks">
        <section className="tasks-shell" aria-label="Tasks workspace">
          <aside className="tasks-nav workspace-sidebar" aria-label="Tasks navigation">
            <header className="tasks-nav__header workspace-sidebar__header">
              <h1 className="workspace-sidebar__title">Tasks</h1>
            </header>

            <label className="tasks-nav__search workspace-sidebar__search" aria-label="Search tasks">
              <SearchIcon className="glyph-14" />
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
                placeholder="Search tasks"
              />
            </label>

            <div className="tasks-nav__scroll workspace-sidebar__scroll">
              <div className="tasks-nav__section workspace-sidebar__stack">
                <p className="tasks-nav__label workspace-sidebar__label">Views</p>
                {workspace?.sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className={cx('tasks-nav__item workspace-sidebar__item', selectedSectionId === section.id && 'is-active')}
                    onClick={() => {
                      setSelectedSectionId(section.id);
                    }}
                  >
                    <span className="tasks-nav__item-copy workspace-sidebar__item-copy">
                      <strong>{section.label}</strong>
                      <small>{section.description}</small>
                    </span>
                    <span className="workspace-sidebar__count">{section.itemCount}</span>
                  </button>
                ))}
              </div>

              <div className="tasks-nav__section workspace-sidebar__stack">
                <div className="tasks-nav__label-row">
                  <p className="tasks-nav__label workspace-sidebar__label">Lists</p>
                  <FolderIcon className="glyph-14" />
                </div>
                <button
                  type="button"
                  className={cx('tasks-nav__item workspace-sidebar__item', !selectedListId && 'is-active')}
                  onClick={() => {
                    setSelectedListId(null);
                  }}
                >
                  <span className="tasks-nav__item-copy workspace-sidebar__item-copy">
                    <strong>All lists</strong>
                    <small>Every extracted task</small>
                  </span>
                  <span className="workspace-sidebar__count">{workspace?.items.length ?? 0}</span>
                </button>
                {workspace?.lists.map((list) => (
                  <button
                    key={list.id}
                    type="button"
                    className={cx('tasks-nav__item workspace-sidebar__item', selectedListId === list.id && 'is-active')}
                    onClick={() => {
                      setSelectedListId(list.id);
                    }}
                  >
                    <span className="tasks-nav__item-copy workspace-sidebar__item-copy">
                      <strong>{list.label}</strong>
                      <small>{list.kind === 'meeting' ? 'Meeting-backed list' : 'Task list'}</small>
                    </span>
                    <span className="workspace-sidebar__count">{list.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className={cx('tasks-board', detailOpen && 'has-drawer', 'workspace-body')}>
            <header className="tasks-board__header">
              <div>
                <p className="tasks-board__eyebrow">Task workspace</p>
                <h2>{selectedListId ? workspace?.lists.find((list) => list.id === selectedListId)?.label ?? 'Tasks' : 'All tasks'}</h2>
                <p className="tasks-board__subtitle">Keep the board visible while execution, planning, and AI context stay one click away.</p>
              </div>
              <div className="tasks-board__header-meta">
                <span className={cx('tasks-chip', `is-${feed?.executor.state ?? 'unknown'}`)}>IronClaw: {feed?.executor.state ?? 'unknown'}</span>
                <span className={cx('tasks-chip', aiStatus?.connected ? 'is-connected' : 'is-warning')}>
                  Codex: {aiStatus?.connected ? 'connected' : 'disconnected'}
                </span>
                <button type="button" className="tasks-soft-button" onClick={onOpenAISettings}>
                  AI Settings
                </button>
                <button type="button" className="tasks-soft-button" onClick={onReconnectExecutor} disabled={isReconnectingExecutor}>
                  {isReconnectingExecutor ? 'Reconnecting...' : 'Reconnect'}
                </button>
              </div>
            </header>

            <div className="tasks-toolbar">
              <div className="tasks-view-toggle" role="tablist" aria-label="Task view">
                <button
                  type="button"
                  className={cx(currentViewMode === 'list' && 'is-active')}
                  onClick={() => {
                    onUpdateWorkspacePrefs({ viewMode: 'list' });
                  }}
                >
                  <FileIcon className="glyph-14" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  className={cx(currentViewMode === 'kanban' && 'is-active')}
                  onClick={() => {
                    onUpdateWorkspacePrefs({ viewMode: 'kanban' });
                  }}
                >
                  <GridIcon className="glyph-14" />
                  <span>Kanban</span>
                </button>
              </div>

              <div className="tasks-toolbar__controls">
                <label className="tasks-toolbar__select">
                  <SlidersIcon className="glyph-14" />
                  <span>Filter</span>
                  <select
                    value={filterMode}
                    onChange={(event) => {
                      setFilterMode(event.target.value as TaskFilterMode);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="due_soon">Due soon</option>
                    <option value="unassigned">Unassigned</option>
                    <option value="following">Following</option>
                  </select>
                  <ChevronDownIcon className="glyph-12" />
                </label>

                <label className="tasks-toolbar__select">
                  <span>Sort</span>
                  <select
                    value={currentSortBy}
                    onChange={(event) => {
                      onUpdateWorkspacePrefs({ sortBy: event.target.value as TaskWorkspaceSortBy });
                    }}
                  >
                    <option value="updated">Updated</option>
                    <option value="created">Created</option>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                    <option value="due">Due date</option>
                  </select>
                  <ChevronDownIcon className="glyph-12" />
                </label>

                <label className="tasks-toolbar__select">
                  <span>Group</span>
                  <select
                    value={currentGroupBy}
                    onChange={(event) => {
                      onUpdateWorkspacePrefs({ groupBy: event.target.value as TaskWorkspaceGroupBy });
                    }}
                  >
                    <option value="board">Board</option>
                    <option value="meeting">Meeting</option>
                    <option value="assignee">Assignee</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                  </select>
                  <ChevronDownIcon className="glyph-12" />
                </label>

                <button
                  type="button"
                  className="tasks-soft-button"
                  onClick={() => {
                    setShowCompactCustomize((current) => !current);
                  }}
                >
                  {showCompactCustomize ? 'Comfortable' : 'Dense'}
                </button>
              </div>
            </div>

            <div className="tasks-board__status-row">
              <span>Last sync: {formatDateTimeLabel(feed?.lastSyncAt ?? null)}</span>
              <span>Next auto-sync: {formatDateTimeLabel(feed?.nextAutoSyncAt ?? null)}</span>
              <span>{syncHealthLabel(feed)}</span>
              <span>Discovered: {feed?.counts.discovered ?? 0}</span>
              <span>Queued runs: {feed?.queuedRunCount ?? 0}</span>
            </div>

            {error ? <p className="tasks-error">{error}</p> : null}
            {showWarning && warningSummary ? (
              <div className="tasks-warning">
                <div className="tasks-warning__top">
                  <p>{warningSummary}</p>
                  <button type="button" onClick={onHideWarning}>
                    Hide
                  </button>
                </div>
                {warningDetails.length > 0 ? (
                  <ul>
                    {warningDetails.slice(0, 3).map((detail, index) => (
                      <li key={`${detail}-${index}`}>{detail}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {!isElectronRuntime ? <p className="tasks-empty-copy">Electron runtime is required for live task execution and sync.</p> : null}

            <div className="tasks-board__body">
              {currentViewMode === 'list' ? (
                <div className="tasks-list-view">
                  {filteredItems.length === 0 ? <p className="tasks-empty-copy">No tasks match the current filters.</p> : null}
                  {listGroups.map((group) => (
                    <section key={group.id} className="tasks-list-group">
                      <header className="tasks-list-group__header">
                        <h3>{group.label}</h3>
                        <span>{group.items.length}</span>
                      </header>
                      <div className={cx('tasks-table', showCompactCustomize && 'is-compact')}>
                        <div className="tasks-table__header">
                          <span>Task</span>
                          <span>Assignee</span>
                          <span>Due</span>
                          <span>Updated</span>
                          <span>State</span>
                        </div>
                        {group.items.map((item) => (
                          <button
                            key={item.todoId}
                            type="button"
                            className={cx('tasks-table__row', detailTodoId === item.todoId && 'is-selected')}
                            onClick={() => {
                              openTaskDetail(item);
                            }}
                          >
                            <span className="tasks-table__title">
                              <strong>{item.title || item.description || 'Untitled task'}</strong>
                              <small>{item.publicSummary || item.description || 'No summary yet'}</small>
                              <span className="tasks-table__inline-meta">
                                <span>{item.meetingTitle || 'Unknown meeting'}</span>
                                <span>{priorityLabel(item.priority)}</span>
                                {!showCompactCustomize ? <span>{item.creatorLabel}</span> : null}
                              </span>
                            </span>
                            <span className="tasks-table__cell">{item.assignee?.label ?? 'Unassigned'}</span>
                            <span className="tasks-table__cell">{formatDateLabel(item.dueDate)}</span>
                            <span className="tasks-table__cell">{formatDateLabel(item.lastUpdatedAt)}</span>
                            <span className="tasks-table__state">
                              <span className={cx('tasks-status-pill', `is-${runQueueLabel(item).toLowerCase()}`)}>{runQueueLabel(item)}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="tasks-kanban">
                  {kanbanColumns.map((column) => (
                    <section
                      key={column.id}
                      className={cx('tasks-kanban__column', column.draggable && draggingTodoId && 'is-drop-ready')}
                      onDragOver={(event) => {
                        if (!column.draggable) {
                          return;
                        }
                        event.preventDefault();
                      }}
                      onDrop={(event) => {
                        if (!column.draggable || !draggingTodoId) {
                          return;
                        }
                        event.preventDefault();
                        onUpdateTaskMetadata(draggingTodoId, { boardColumnId: column.id });
                        setDraggingTodoId(null);
                      }}
                    >
                      <header className="tasks-kanban__column-header">
                        <h3>{column.label}</h3>
                        <span>{column.items.length}</span>
                      </header>
                      <div className="tasks-kanban__cards">
                        {column.items.map((item) => (
                          <article
                            key={item.todoId}
                            className={cx('tasks-kanban-card', detailTodoId === item.todoId && 'is-selected')}
                            draggable={column.draggable}
                            onDragStart={() => {
                              setDraggingTodoId(item.todoId);
                            }}
                            onDragEnd={() => {
                              setDraggingTodoId(null);
                            }}
                            onClick={() => {
                              openTaskDetail(item);
                            }}
                          >
                            <div className="tasks-kanban-card__top">
                              <strong>{item.title || item.description || 'Untitled task'}</strong>
                              <span>{priorityLabel(item.priority)}</span>
                            </div>
                            <p>{item.publicSummary || item.description || 'No summary yet'}</p>
                            <div className="tasks-kanban-card__meta">
                              <span>{item.assignee?.label ?? 'Unassigned'}</span>
                              <span>{formatDateLabel(item.dueDate)}</span>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
            {detailOpen && detailTask ? (
              <>
                <button
                  type="button"
                  className="tasks-drawer__scrim"
                  aria-label="Dismiss task drawer overlay"
                  onClick={() => {
                    setDetailTodoId(null);
                  }}
                />
                <aside className="tasks-detail tasks-detail--drawer workspace-body" aria-label="Task detail">
                <header className="tasks-detail__header">
                  <div>
                    <button
                      type="button"
                      className="tasks-detail__back tasks-soft-button"
                      onClick={() => {
                        setDetailTodoId(null);
                      }}
                    >
                      <ChevronLeftIcon className="glyph-14" />
                      <span>Back to all tasks</span>
                    </button>
                    <p className="tasks-detail__eyebrow">{detailTask.meetingTitle || 'Granola task'}</p>
                    <h2>{detailTask.title || detailTask.description || 'Untitled task'}</h2>
                    <div className="tasks-detail__chips">
                      <span className="tasks-chip">
                        <PeopleIcon className="glyph-12" />
                        <span>{detailTask.assignee?.label ?? 'Unassigned'}</span>
                      </span>
                      <span className="tasks-chip">
                        <CalendarIcon className="glyph-12" />
                        <span>{formatDateLabel(detailTask.dueDate)}</span>
                      </span>
                      <span className="tasks-chip">
                        <ChatIcon className="glyph-12" />
                        <span>{runQueueLabel(detailTask)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="tasks-detail__actions">
                    <button
                      type="button"
                      className="tasks-primary-button"
                      onClick={() => {
                        onStartTodo(detailTask.todoId, selectedStartOptions);
                      }}
                      disabled={Boolean(startingTodoId) || !plannerSelectionValid}
                    >
                      {startingTodoId === detailTask.todoId ? 'Starting...' : 'Start Task'}
                    </button>
                    <button type="button" className="tasks-soft-button" onClick={onCancelRun} disabled={!selectedRunning}>
                      Stop
                    </button>
                    <button
                      type="button"
                      className="tasks-soft-button"
                      onClick={() => {
                        onOpenRun(detailTask.todoId);
                      }}
                      disabled={openingRunTodoId === detailTask.todoId}
                    >
                      {openingRunTodoId === detailTask.todoId ? 'Opening...' : 'Open in IronClaw'}
                    </button>
                    <button type="button" className="tasks-soft-button" onClick={onClearThread}>
                      Clear
                    </button>
                  </div>
                </header>

                <div className="tasks-detail__tablist" role="tablist" aria-label="Task detail tabs">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={detailTab === primaryTab}
                    className={cx('tasks-detail__tab', detailTab === primaryTab && 'is-active')}
                    onClick={() => {
                      setDetailTab(primaryTab);
                    }}
                  >
                    {isTaskPreStart ? 'Plan' : 'Activity'}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={detailTab === 'overview'}
                    className={cx('tasks-detail__tab', detailTab === 'overview' && 'is-active')}
                    onClick={() => {
                      setDetailTab('overview');
                    }}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={detailTab === 'brief'}
                    className={cx('tasks-detail__tab', detailTab === 'brief' && 'is-active')}
                    onClick={() => {
                      setDetailTab('brief');
                    }}
                  >
                    AI Brief
                  </button>
                </div>

                {activityLabel ? (
                  <div className={cx('tasks-live-status', showWorkingIndicator && 'is-active')}>
                    <span className="tasks-live-status__dot" />
                    <span>{activityLabel}</span>
                  </div>
                ) : null}

                <div className={cx('tasks-detail__body', detailTab === 'activity' && 'is-timeline')}>
                  {detailTab === 'brief' ? (
                    <section className="tasks-detail-card tasks-detail-card--brief">
                      <header className="tasks-detail-card__header">
                        <div>
                          <h3>AI brief</h3>
                          <p>Codex-backed task synthesis on top of the task, planning context, and execution thread.</p>
                        </div>
                        <button
                          type="button"
                          className="tasks-soft-button"
                          onClick={onSummarizeTask}
                          disabled={isSummarizingTask || !aiStatus?.connected}
                        >
                          {isSummarizingTask ? 'Summarizing...' : detailTask.latestBrief ? 'Refresh brief' : 'Create brief'}
                        </button>
                      </header>
                      {!aiStatus?.connected ? (
                        <p className="tasks-empty-copy">
                          Codex is disconnected. Open AI Settings to reconnect your `openai-codex` login.
                        </p>
                      ) : null}
                      {detailTask.latestBrief ? (
                        <div className="tasks-brief-markdown">
                          <MarkdownMessage content={detailTask.latestBrief.content} />
                          <small>
                            {detailTask.latestBrief.modelLabel} · {formatDateTimeLabel(detailTask.latestBrief.generatedAt)}
                          </small>
                        </div>
                      ) : (
                        <p className="tasks-empty-copy">No AI brief generated yet.</p>
                      )}
                    </section>
                  ) : null}

                  {detailTab === 'overview' ? (
                    <div className="tasks-detail__stack">
                      <section className="tasks-detail-card">
                        <header className="tasks-detail-card__header">
                          <div>
                            <h3>Metadata</h3>
                            <p>Organize extracted tasks without changing the execution source of truth.</p>
                          </div>
                        </header>

                        <div className="tasks-detail-form">
                          <label className="tasks-field">
                            <span>Assignee</span>
                            <select
                              value={selectedAssigneeValue}
                              onChange={(event) => {
                                onUpdateTaskMetadata(detailTask.todoId, {
                                  assigneeId: event.target.value === '__unassigned__' ? null : event.target.value,
                                });
                              }}
                            >
                              <option value="__unassigned__">Unassigned</option>
                              {workspace?.assignees.map((assignee) => (
                                <option key={assignee.id} value={assignee.id}>
                                  {assignee.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="tasks-field">
                            <span>List</span>
                            <select
                              value={detailTask.listId}
                              onChange={(event) => {
                                onUpdateTaskMetadata(detailTask.todoId, {
                                  listId: event.target.value,
                                });
                              }}
                            >
                              {workspace?.lists.map((list) => (
                                <option key={list.id} value={list.id}>
                                  {list.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="tasks-field">
                            <span>Column</span>
                            <select
                              value={detailTask.boardColumnId}
                              onChange={(event) => {
                                onUpdateTaskMetadata(detailTask.todoId, {
                                  boardColumnId: event.target.value,
                                });
                              }}
                            >
                              {workspace?.boardColumns.map((column) => (
                                <option key={column.id} value={column.id}>
                                  {column.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="tasks-field tasks-field--checkbox">
                            <input
                              type="checkbox"
                              checked={detailTask.following}
                              onChange={(event) => {
                                onUpdateTaskMetadata(detailTask.todoId, {
                                  following: event.target.checked,
                                });
                              }}
                            />
                            <span>Follow updates on this task</span>
                          </label>
                        </div>
                      </section>

                      <section className="tasks-detail-card">
                        <header className="tasks-detail-card__header">
                          <div>
                            <h3>Source context</h3>
                            <p>Meeting-backed context that keeps execution grounded.</p>
                          </div>
                        </header>
                        <div className="tasks-detail__overview-grid">
                          <div className="tasks-overview-stat">
                            <span>Meeting</span>
                            <strong>{detailTask.meetingTitle || 'Unknown meeting'}</strong>
                          </div>
                          <div className="tasks-overview-stat">
                            <span>Creator</span>
                            <strong>{detailTask.creatorLabel}</strong>
                          </div>
                          <div className="tasks-overview-stat">
                            <span>Updated</span>
                            <strong>{formatDateTimeLabel(detailTask.lastUpdatedAt)}</strong>
                          </div>
                          <div className="tasks-overview-stat">
                            <span>Status</span>
                            <strong>{statusLabel(detailTask.status)}</strong>
                          </div>
                        </div>
                        <p className="tasks-detail__overview-copy">{detailTask.publicSummary || detailTask.description || 'No summary yet.'}</p>
                      </section>
                    </div>
                  ) : null}

                  {detailTab === 'plan' ? (
                    <div className="tasks-detail__stack">
                      <TaskQuickActionsPanel
                        title="Planner shortcuts"
                        description="Generate a stronger research plan without typing the guidance from scratch."
                        actions={plannerQuickActions}
                        disabled={isPlanning}
                        onRun={onRunQuickAction}
                      />
                      <TaskPlanningSurface
                        context={planningContext}
                        contextLoading={planningContextLoading}
                        draft={effectiveDraft}
                        isPlanning={isPlanning}
                        planningInput={planningInput}
                        onPlanningInputChange={onPlanningInputChange}
                        onGenerate={onGeneratePlan}
                        selectedMode={selectedPlanMode}
                        selectedOptionId={selectedPlanOptionId}
                        onSelectOption={onSelectPlanOption}
                        customInstruction={customPlanInstruction}
                        onCustomInstructionChange={onCustomPlanInstructionChange}
                      />
                    </div>
                  ) : null}

                  {detailTab === 'activity' ? (
                    <div className="tasks-detail__stack">
                      <TaskQuickActionsPanel
                        title="Next moves"
                        description="Keep the run human-in-the-loop while steering the final output toward a send-ready result."
                        actions={executionQuickActions}
                        disabled={isSendingMessage}
                        onRun={onRunQuickAction}
                      />
                      <section className="tasks-detail-card tasks-detail-card--timeline">
                        <header className="tasks-detail-card__header">
                          <div>
                            <h3>Execution timeline</h3>
                            <p>Chat with the task while the board stays visible.</p>
                          </div>
                        </header>

                        {threadHasMore ? (
                          <button type="button" className="tasks-soft-button tasks-load-older" onClick={onLoadOlderThread} disabled={threadLoadingOlder}>
                            {threadLoadingOlder ? 'Loading...' : 'Load older'}
                          </button>
                        ) : null}
                        {threadLoading ? <p className="tasks-empty-copy">Loading thread...</p> : null}
                        {!threadLoading && threadMessages.length === 0 ? (
                          <p className="tasks-empty-copy">No task messages yet. Start execution or send a follow-up.</p>
                        ) : null}
                        <div ref={messagesViewportRef} className="tasks-detail__timeline-scroll">
                          <TaskMessageTimeline messages={threadMessages} hideStreamingAssistant={selectedRunning} />
                        </div>
                      </section>
                    </div>
                  ) : null}
                </div>

                <footer className="tasks-detail__composer">
                  <textarea
                    value={composerText}
                    onChange={(event) => {
                      onComposerTextChange(event.target.value);
                    }}
                    placeholder={isTaskPreStart ? 'Tell the planner how this task should be planned...' : 'Message task copilot...'}
                    onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        onSendMessage();
                      }
                    }}
                    disabled={!selectedTodoId || isSendingMessage}
                  />
                  <button
                    type="button"
                    className="tasks-primary-button"
                    onClick={onSendMessage}
                    disabled={!selectedTodoId || isSendingMessage || composerText.trim().length === 0}
                  >
                    {isSendingMessage ? (isTaskPreStart ? 'Planning...' : 'Sending...') : isTaskPreStart ? 'Plan' : 'Send'}
                  </button>
                </footer>
                </aside>
              </>
            ) : null}
          </section>
        </section>
      </main>
    </div>
  );
}
