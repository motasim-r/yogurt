import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { GranolaChatMessage, GranolaChatScope, GranolaChatSource, GranolaChatThread } from '../../src/shared/types.js';

export interface PersistedGranolaChatThread extends GranolaChatThread {
  createdAt: string;
}

export interface GranolaChatStoreDocument {
  version: 1;
  savedAt: string | null;
  threads: Record<string, PersistedGranolaChatThread>;
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

function defaultDocument(): GranolaChatStoreDocument {
  return {
    version: 1,
    savedAt: null,
    threads: {},
  };
}

function normalizeScope(value: unknown): GranolaChatScope {
  return value === 'all_meetings' ? 'all_meetings' : 'all_meetings';
}

function normalizeSource(raw: unknown, index: number): GranolaChatSource | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : `source-${index + 1}`;
  const label = typeof raw.label === 'string' ? raw.label.trim() : '';
  const url = typeof raw.url === 'string' ? raw.url.trim() : '';
  if (!label || !url) {
    return null;
  }
  return {
    id,
    label,
    url,
  };
}

function normalizeMessage(raw: unknown): GranolaChatMessage | null {
  if (!isRecord(raw)) {
    return null;
  }

  const messageId = typeof raw.messageId === 'string' ? raw.messageId.trim() : '';
  const threadId = typeof raw.threadId === 'string' ? raw.threadId.trim() : '';
  const role = raw.role;
  const content = typeof raw.content === 'string' ? raw.content : '';
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
  const status = raw.status;
  const thoughtDurationSeconds =
    typeof raw.thoughtDurationSeconds === 'number' && Number.isFinite(raw.thoughtDurationSeconds)
      ? Math.max(1, Math.round(raw.thoughtDurationSeconds))
      : null;
  const sourcesRaw = Array.isArray(raw.sources) ? raw.sources : [];
  const sources = sourcesRaw
    .map((item, index) => normalizeSource(item, index))
    .filter((item): item is GranolaChatSource => item !== null);

  if (!messageId || !threadId || !createdAt || (role !== 'user' && role !== 'assistant')) {
    return null;
  }
  if (status !== 'completed' && status !== 'error') {
    return null;
  }

  return {
    messageId,
    threadId,
    role,
    content,
    createdAt,
    status,
    sources: sources.length > 0 ? sources : undefined,
    thoughtDurationSeconds,
  };
}

function normalizeThread(raw: unknown): PersistedGranolaChatThread | null {
  if (!isRecord(raw)) {
    return null;
  }

  const threadId = typeof raw.threadId === 'string' ? raw.threadId.trim() : '';
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const scope = normalizeScope(raw.scope);
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : '';
  const messagesRaw = Array.isArray(raw.messages) ? raw.messages : [];
  const messages = messagesRaw
    .map((item) => normalizeMessage(item))
    .filter((item): item is GranolaChatMessage => item !== null)
    .sort((a, b) => {
      const left = Date.parse(a.createdAt);
      const right = Date.parse(b.createdAt);
      if (Number.isFinite(left) && Number.isFinite(right) && left !== right) {
        return left - right;
      }
      return a.messageId.localeCompare(b.messageId);
    });

  if (!threadId || !title || !createdAt || !updatedAt) {
    return null;
  }

  return {
    threadId,
    title,
    scope,
    createdAt,
    updatedAt,
    messages,
  };
}

export class GranolaChatStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<GranolaChatStoreDocument> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) {
        return defaultDocument();
      }

      const threadsRaw = isRecord(parsed.threads) ? parsed.threads : {};
      const threads: Record<string, PersistedGranolaChatThread> = {};
      for (const [threadId, value] of Object.entries(threadsRaw)) {
        const normalized = normalizeThread(value);
        if (normalized) {
          threads[threadId] = normalized;
        }
      }

      return {
        version: 1,
        savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : null,
        threads,
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return defaultDocument();
      }
      throw error;
    }
  }

  async save(document: Partial<GranolaChatStoreDocument>): Promise<GranolaChatStoreDocument> {
    const fallback = defaultDocument();
    const threadsRaw = isRecord(document.threads) ? document.threads : {};
    const threads: Record<string, PersistedGranolaChatThread> = {};

    for (const [threadId, value] of Object.entries(threadsRaw)) {
      const normalized = normalizeThread(value);
      if (normalized) {
        threads[threadId] = normalized;
      }
    }

    const payload: GranolaChatStoreDocument = {
      ...fallback,
      ...document,
      version: 1,
      savedAt: new Date().toISOString(),
      threads,
    };

    await writeAtomic(this.filePath, `${JSON.stringify(payload, null, 2)}\n`);
    return payload;
  }
}
