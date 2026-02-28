import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { TodoStoreDocument } from './types.js';

async function writeAtomic(filePath: string, content: string): Promise<void> {
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });

  const tempPath = `${filePath}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tempPath, content, 'utf8');
  await fs.rename(tempPath, filePath);
}

function defaultTodoDocument(): TodoStoreDocument {
  return {
    version: 1,
    savedAt: null,
    todos: [],
    events: [],
    metadata: {
      meetingSourceHashes: {},
    },
    lastExtractionAt: null,
    lastExtractionError: null,
    lastSubmissionAt: null,
    lastSubmissionError: null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export class TodoStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<TodoStoreDocument> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) {
        return defaultTodoDocument();
      }

      const fallback = defaultTodoDocument();
      const parsedMetadata = isRecord(parsed.metadata) ? parsed.metadata : {};

      return {
        ...fallback,
        ...parsed,
        todos: Array.isArray(parsed.todos) ? (parsed.todos as TodoStoreDocument['todos']) : [],
        events: Array.isArray(parsed.events) ? (parsed.events as TodoStoreDocument['events']) : [],
        metadata: {
          ...fallback.metadata,
          ...parsedMetadata,
          meetingSourceHashes: isRecord(parsedMetadata.meetingSourceHashes)
            ? (parsedMetadata.meetingSourceHashes as Record<string, string>)
            : {},
        },
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return defaultTodoDocument();
      }
      throw error;
    }
  }

  async save(document: Partial<TodoStoreDocument>): Promise<TodoStoreDocument> {
    const fallback = defaultTodoDocument();
    const metadata: Record<string, unknown> = isRecord(document.metadata) ? document.metadata : {};

    const payload: TodoStoreDocument = {
      ...fallback,
      ...document,
      version: 1,
      savedAt: new Date().toISOString(),
      todos: Array.isArray(document.todos) ? document.todos : [],
      events: Array.isArray(document.events) ? document.events : [],
      metadata: {
        ...fallback.metadata,
        ...metadata,
        meetingSourceHashes: isRecord(metadata.meetingSourceHashes)
          ? (metadata.meetingSourceHashes as Record<string, string>)
          : {},
      },
      lastExtractionAt:
        typeof document.lastExtractionAt === 'string' ? document.lastExtractionAt : fallback.lastExtractionAt,
      lastExtractionError:
        typeof document.lastExtractionError === 'string' ? document.lastExtractionError : fallback.lastExtractionError,
      lastSubmissionAt:
        typeof document.lastSubmissionAt === 'string' ? document.lastSubmissionAt : fallback.lastSubmissionAt,
      lastSubmissionError:
        typeof document.lastSubmissionError === 'string'
          ? document.lastSubmissionError
          : fallback.lastSubmissionError,
    };

    await writeAtomic(this.filePath, `${JSON.stringify(payload, null, 2)}\n`);
    return payload;
  }
}
