import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { TaskChatMessage } from '../../src/shared/types.js';

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
