import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type {
  TaskAIBrief,
  TaskMetadataPatch,
  TaskWorkspaceGroupBy,
  TaskWorkspacePrefs,
  TaskWorkspaceSortBy,
  TaskWorkspaceViewMode,
} from '../../src/shared/types.js';

export interface TaskWorkspaceMetadataRecord {
  assigneeId: string | null;
  listId: string | null;
  boardColumnId: string | null;
  following: boolean;
  latestBrief: TaskAIBrief | null;
}

export interface TaskWorkspaceStoreDocument {
  version: 1;
  savedAt: string | null;
  prefs: TaskWorkspacePrefs;
  metadataByTodoId: Record<string, TaskWorkspaceMetadataRecord>;
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

function isViewMode(value: unknown): value is TaskWorkspaceViewMode {
  return value === 'list' || value === 'kanban';
}

function isGroupBy(value: unknown): value is TaskWorkspaceGroupBy {
  return value === 'board' || value === 'meeting' || value === 'assignee' || value === 'priority' || value === 'status';
}

function isSortBy(value: unknown): value is TaskWorkspaceSortBy {
  return value === 'updated' || value === 'created' || value === 'priority' || value === 'title' || value === 'due';
}

function normalizeBrief(raw: unknown): TaskAIBrief | null {
  if (!isRecord(raw)) {
    return null;
  }
  const content = typeof raw.content === 'string' ? raw.content.trim() : '';
  const generatedAt = typeof raw.generatedAt === 'string' ? raw.generatedAt : '';
  const modelLabel = typeof raw.modelLabel === 'string' ? raw.modelLabel.trim() : '';
  if (!content || !generatedAt || !modelLabel) {
    return null;
  }
  return {
    content,
    generatedAt,
    modelLabel,
  };
}

function defaultPrefs(): TaskWorkspacePrefs {
  return {
    viewMode: 'list',
    groupBy: 'board',
    sortBy: 'updated',
  };
}

function defaultMetadataRecord(): TaskWorkspaceMetadataRecord {
  return {
    assigneeId: null,
    listId: null,
    boardColumnId: null,
    following: false,
    latestBrief: null,
  };
}

function normalizeMetadata(raw: unknown): TaskWorkspaceMetadataRecord | null {
  if (!isRecord(raw)) {
    return null;
  }
  return {
    assigneeId: typeof raw.assigneeId === 'string' && raw.assigneeId.trim() ? raw.assigneeId.trim() : null,
    listId: typeof raw.listId === 'string' && raw.listId.trim() ? raw.listId.trim() : null,
    boardColumnId: typeof raw.boardColumnId === 'string' && raw.boardColumnId.trim() ? raw.boardColumnId.trim() : null,
    following: raw.following === true,
    latestBrief: normalizeBrief(raw.latestBrief),
  };
}

function defaultDocument(): TaskWorkspaceStoreDocument {
  return {
    version: 1,
    savedAt: null,
    prefs: defaultPrefs(),
    metadataByTodoId: {},
  };
}

export class TaskWorkspaceStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<TaskWorkspaceStoreDocument> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) {
        return defaultDocument();
      }

      const prefsRaw = isRecord(parsed.prefs) ? parsed.prefs : {};
      const metadataRaw = isRecord(parsed.metadataByTodoId) ? parsed.metadataByTodoId : {};
      const metadataByTodoId: Record<string, TaskWorkspaceMetadataRecord> = {};

      for (const [todoId, value] of Object.entries(metadataRaw)) {
        const normalized = normalizeMetadata(value);
        if (normalized) {
          metadataByTodoId[todoId] = normalized;
        }
      }

      return {
        version: 1,
        savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : null,
        prefs: {
          viewMode: isViewMode(prefsRaw.viewMode) ? prefsRaw.viewMode : 'list',
          groupBy: isGroupBy(prefsRaw.groupBy) ? prefsRaw.groupBy : 'board',
          sortBy: isSortBy(prefsRaw.sortBy) ? prefsRaw.sortBy : 'updated',
        },
        metadataByTodoId,
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return defaultDocument();
      }
      throw error;
    }
  }

  async save(document: Partial<TaskWorkspaceStoreDocument>): Promise<TaskWorkspaceStoreDocument> {
    const fallback = defaultDocument();
    const prefsRaw: Record<string, unknown> = isRecord(document.prefs) ? document.prefs : {};
    const metadataRaw: Record<string, unknown> = isRecord(document.metadataByTodoId) ? document.metadataByTodoId : {};
    const metadataByTodoId: Record<string, TaskWorkspaceMetadataRecord> = {};

    for (const [todoId, value] of Object.entries(metadataRaw)) {
      const normalized = normalizeMetadata(value);
      if (normalized) {
        metadataByTodoId[todoId] = normalized;
      }
    }

    const payload: TaskWorkspaceStoreDocument = {
      ...fallback,
      ...document,
      version: 1,
      savedAt: new Date().toISOString(),
      prefs: {
        viewMode: isViewMode(prefsRaw.viewMode) ? prefsRaw.viewMode : 'list',
        groupBy: isGroupBy(prefsRaw.groupBy) ? prefsRaw.groupBy : 'board',
        sortBy: isSortBy(prefsRaw.sortBy) ? prefsRaw.sortBy : 'updated',
      },
      metadataByTodoId,
    };

    await writeAtomic(this.filePath, `${JSON.stringify(payload, null, 2)}\n`);
    return payload;
  }

  mergeMetadata(current: TaskWorkspaceMetadataRecord | null | undefined, patch: TaskMetadataPatch): TaskWorkspaceMetadataRecord {
    const next = {
      ...(current ?? defaultMetadataRecord()),
    };

    if (Object.prototype.hasOwnProperty.call(patch, 'assigneeId')) {
      next.assigneeId = typeof patch.assigneeId === 'string' && patch.assigneeId.trim() ? patch.assigneeId.trim() : null;
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'listId')) {
      next.listId = typeof patch.listId === 'string' && patch.listId.trim() ? patch.listId.trim() : null;
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'boardColumnId')) {
      next.boardColumnId = typeof patch.boardColumnId === 'string' && patch.boardColumnId.trim() ? patch.boardColumnId.trim() : null;
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'following') && typeof patch.following === 'boolean') {
      next.following = patch.following;
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'latestBrief')) {
      next.latestBrief = patch.latestBrief ?? null;
    }

    return next;
  }
}
