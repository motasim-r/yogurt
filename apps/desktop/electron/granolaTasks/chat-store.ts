import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { TaskChatMessage, TaskChatTrace, TaskPlanDraft, TaskPlanOption } from '../../src/shared/types.js';

export interface TaskChatStoreDocument {
  version: 1;
  savedAt: string | null;
  migratedStepEventsAt: string | null;
  threads: Record<string, TaskChatMessage[]>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

async function writeAtomic(filePath: string, content: string): Promise<void> {
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });

  const tempPath = `${filePath}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tempPath, content, 'utf8');
  await fs.rename(tempPath, filePath);
}

function defaultDocument(): TaskChatStoreDocument {
  return {
    version: 1,
    savedAt: null,
    migratedStepEventsAt: null,
    threads: {},
  };
}

function normalizeOptionalString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function normalizePlanOption(raw: unknown, index: number): TaskPlanOption | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : `option-${index + 1}`;
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const summary = typeof raw.summary === 'string' ? raw.summary.trim() : '';
  const why = typeof raw.why === 'string' ? raw.why.trim() : '';
  const steps = Array.isArray(raw.steps)
    ? raw.steps
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  if (!title || !summary || !why || steps.length === 0) {
    return null;
  }
  return {
    id,
    title,
    summary,
    steps,
    why,
    recommended: raw.recommended === true,
  };
}

function normalizePlanDraft(raw: unknown): TaskPlanDraft | null {
  if (!isRecord(raw)) {
    return null;
  }
  const draftId = typeof raw.draftId === 'string' ? raw.draftId.trim() : '';
  const todoId = typeof raw.todoId === 'string' ? raw.todoId.trim() : '';
  const generatedAt = typeof raw.generatedAt === 'string' ? raw.generatedAt.trim() : '';
  const guidanceUsed = typeof raw.guidanceUsed === 'string' ? raw.guidanceUsed.trim() : '';
  const optionsRaw = Array.isArray(raw.options) ? raw.options : [];
  const options = optionsRaw
    .map((item, index) => normalizePlanOption(item, index))
    .filter((item): item is TaskPlanOption => item !== null)
    .slice(0, 3);
  if (!draftId || !todoId || !generatedAt || !guidanceUsed || options.length === 0) {
    return null;
  }

  const recommendedRaw = typeof raw.recommendedOptionId === 'string' ? raw.recommendedOptionId.trim() : '';
  const recommendedOptionId = options.some((option) => option.id === recommendedRaw) ? recommendedRaw : options[0]?.id ?? '';
  if (!recommendedOptionId) {
    return null;
  }

  let assignedRecommended = false;
  const normalizedOptions = options.map((option) => {
    if (option.id !== recommendedOptionId) {
      return {
        ...option,
        recommended: false,
      };
    }
    if (assignedRecommended) {
      return {
        ...option,
        recommended: false,
      };
    }
    assignedRecommended = true;
    return {
      ...option,
      recommended: true,
    };
  });

  return {
    draftId,
    todoId,
    generatedAt,
    options: normalizedOptions,
    recommendedOptionId,
    guidanceUsed,
  };
}

function normalizeTrace(raw: unknown): TaskChatTrace | null {
  if (!isRecord(raw)) {
    return null;
  }

  const kind = raw.kind;
  if (
    kind !== 'thought' &&
    kind !== 'tool_start' &&
    kind !== 'tool_result' &&
    kind !== 'source_fetch' &&
    kind !== 'phase'
  ) {
    return null;
  }

  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!title) {
    return null;
  }

  const phase = typeof raw.phase === 'string' ? raw.phase : null;
  const isValidPhase =
    phase === 'queued' ||
    phase === 'started' ||
    phase === 'thinking' ||
    phase === 'working' ||
    phase === 'streaming' ||
    phase === 'completed' ||
    phase === 'failed' ||
    phase === 'cancelled' ||
    phase === null;

  return {
    kind,
    title,
    detail: normalizeOptionalString(raw.detail),
    toolName: normalizeOptionalString(raw.toolName),
    toolArgs: normalizeOptionalString(raw.toolArgs),
    toolMeta: normalizeOptionalString(raw.toolMeta),
    isError: typeof raw.isError === 'boolean' ? raw.isError : null,
    sourceUrl: normalizeOptionalString(raw.sourceUrl),
    domain: normalizeOptionalString(raw.domain),
    phase: isValidPhase ? phase : null,
    groupId: normalizeOptionalString(raw.groupId),
  };
}

function normalizeMessage(raw: unknown): TaskChatMessage | null {
  if (!isRecord(raw)) {
    return null;
  }

  const messageId = typeof raw.messageId === 'string' ? raw.messageId : '';
  const todoId = typeof raw.todoId === 'string' ? raw.todoId : '';
  const runId = typeof raw.runId === 'string' ? raw.runId : null;
  const role = raw.role;
  const content = typeof raw.content === 'string' ? raw.content : '';
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
  const streaming = raw.streaming === true;
  const statusTag = typeof raw.statusTag === 'string' ? raw.statusTag : null;
  const trace = normalizeTrace(raw.trace);
  const messageTypeRaw = typeof raw.messageType === 'string' ? raw.messageType : null;
  const messageType =
    messageTypeRaw === 'default' ||
    messageTypeRaw === 'planning_context' ||
    messageTypeRaw === 'planning_user' ||
    messageTypeRaw === 'planning_draft' ||
    messageTypeRaw === 'planning_approved'
      ? messageTypeRaw
      : undefined;
  const planDraft = normalizePlanDraft(raw.planDraft);

  if (!messageId || !todoId || !createdAt) {
    return null;
  }

  if (role !== 'user' && role !== 'assistant' && role !== 'system' && role !== 'status') {
    return null;
  }

  return {
    messageId,
    todoId,
    runId,
    role,
    content,
    createdAt,
    streaming,
    statusTag:
      statusTag === 'queued' ||
      statusTag === 'started' ||
      statusTag === 'thinking' ||
      statusTag === 'working' ||
      statusTag === 'streaming' ||
      statusTag === 'completed' ||
      statusTag === 'failed' ||
      statusTag === 'cancelled'
        ? statusTag
        : null,
    trace,
    messageType,
    planDraft,
  };
}

export class TaskChatStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<TaskChatStoreDocument> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) {
        return defaultDocument();
      }

      const threadsRaw = isRecord(parsed.threads) ? parsed.threads : {};
      const threads: Record<string, TaskChatMessage[]> = {};
      for (const [todoId, values] of Object.entries(threadsRaw)) {
        if (!Array.isArray(values)) {
          continue;
        }
        const normalized = values
          .map((value) => normalizeMessage(value))
          .filter((value): value is TaskChatMessage => value !== null);
        if (normalized.length > 0) {
          threads[todoId] = normalized.sort((a, b) => {
            const left = Date.parse(a.createdAt);
            const right = Date.parse(b.createdAt);
            if (Number.isFinite(left) && Number.isFinite(right) && left !== right) {
              return left - right;
            }
            return a.messageId.localeCompare(b.messageId);
          });
        }
      }

      return {
        version: 1,
        savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : null,
        migratedStepEventsAt: typeof parsed.migratedStepEventsAt === 'string' ? parsed.migratedStepEventsAt : null,
        threads,
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return defaultDocument();
      }
      throw error;
    }
  }

  async save(document: Partial<TaskChatStoreDocument>): Promise<TaskChatStoreDocument> {
    const fallback = defaultDocument();
    const threadsRaw = isRecord(document.threads) ? document.threads : {};
    const threads: Record<string, TaskChatMessage[]> = {};

    for (const [todoId, values] of Object.entries(threadsRaw)) {
      if (!Array.isArray(values)) {
        continue;
      }
      const normalized = values
        .map((value) => normalizeMessage(value))
        .filter((value): value is TaskChatMessage => value !== null);
      threads[todoId] = normalized;
    }

    const payload: TaskChatStoreDocument = {
      ...fallback,
      ...document,
      version: 1,
      savedAt: new Date().toISOString(),
      migratedStepEventsAt:
        typeof document.migratedStepEventsAt === 'string'
          ? document.migratedStepEventsAt
          : fallback.migratedStepEventsAt,
      threads,
    };

    await writeAtomic(this.filePath, `${JSON.stringify(payload, null, 2)}\n`);
    return payload;
  }
}
