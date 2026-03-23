import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type {
  ContextPacket,
  ContextPacketOrigin,
  ContextPacketPreview,
  ContextPacketSource,
  TaskWritebackTarget,
} from '../../src/shared/types.js';

export interface ContextPacketStoreDocument {
  version: 1;
  savedAt: string | null;
  packetsById: Record<string, ContextPacket>;
  todoToPacketId: Record<string, string>;
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

function normalizeOrigin(value: unknown): ContextPacketOrigin | null {
  return value === 'meeting_extraction' ||
    value === 'chat_selection' ||
    value === 'doc_selection' ||
    value === 'mixed'
    ? value
    : null;
}

function normalizePreview(raw: unknown): ContextPacketPreview | null {
  if (!isRecord(raw)) {
    return null;
  }
  return {
    summary: typeof raw.summary === 'string' ? raw.summary : '',
    stats: Array.isArray(raw.stats) ? raw.stats.filter((value): value is string => typeof value === 'string') : [],
    excerpt: typeof raw.excerpt === 'string' ? raw.excerpt : '',
  };
}

function normalizeWriteback(raw: unknown): TaskWritebackTarget {
  if (!isRecord(raw)) {
    return {
      chatThreadId: null,
      docId: null,
      docTitle: null,
      docSectionHeading: null,
    };
  }
  return {
    chatThreadId: typeof raw.chatThreadId === 'string' && raw.chatThreadId.trim() ? raw.chatThreadId.trim() : null,
    docId: typeof raw.docId === 'string' && raw.docId.trim() ? raw.docId.trim() : null,
    docTitle: typeof raw.docTitle === 'string' && raw.docTitle.trim() ? raw.docTitle.trim() : null,
    docSectionHeading:
      typeof raw.docSectionHeading === 'string' && raw.docSectionHeading.trim() ? raw.docSectionHeading.trim() : null,
  };
}

function normalizeSource(raw: unknown): ContextPacketSource | null {
  if (!isRecord(raw)) {
    return null;
  }
  const kind = raw.kind;
  const label = typeof raw.label === 'string' ? raw.label : '';
  const excerpt = typeof raw.excerpt === 'string' ? raw.excerpt : '';
  const citation = typeof raw.citation === 'string' ? raw.citation : '';
  if (!label || !citation || !excerpt) {
    return null;
  }
  if (kind === 'meeting') {
    const meetingId = typeof raw.meetingId === 'string' ? raw.meetingId.trim() : '';
    const meetingTitle = typeof raw.meetingTitle === 'string' ? raw.meetingTitle.trim() : '';
    if (!meetingId || !meetingTitle) {
      return null;
    }
    return {
      kind,
      label,
      excerpt,
      citation,
      meetingId,
      meetingTitle,
      noteUrl: typeof raw.noteUrl === 'string' && raw.noteUrl.trim() ? raw.noteUrl.trim() : null,
    };
  }
  if (kind === 'chat') {
    const threadId = typeof raw.threadId === 'string' ? raw.threadId.trim() : '';
    const threadTitle = typeof raw.threadTitle === 'string' ? raw.threadTitle.trim() : '';
    const mode = raw.mode === 'thread' ? 'thread' : raw.mode === 'message' ? 'message' : null;
    if (!threadId || !threadTitle || !mode) {
      return null;
    }
    return {
      kind,
      label,
      excerpt,
      citation,
      threadId,
      threadTitle,
      anchorMessageId:
        typeof raw.anchorMessageId === 'string' && raw.anchorMessageId.trim() ? raw.anchorMessageId.trim() : null,
      messageIds: Array.isArray(raw.messageIds) ? raw.messageIds.filter((value): value is string => typeof value === 'string') : [],
      mode,
    };
  }
  if (kind === 'doc') {
    const docId = typeof raw.docId === 'string' ? raw.docId.trim() : '';
    const docTitle = typeof raw.docTitle === 'string' ? raw.docTitle.trim() : '';
    const mode =
      raw.mode === 'block' || raw.mode === 'section' || raw.mode === 'checklist' ? raw.mode : null;
    if (!docId || !docTitle || !mode) {
      return null;
    }
    return {
      kind,
      label,
      excerpt,
      citation,
      docId,
      docTitle,
      blockIds: Array.isArray(raw.blockIds) ? raw.blockIds.filter((value): value is string => typeof value === 'string') : [],
      sectionTitle:
        typeof raw.sectionTitle === 'string' && raw.sectionTitle.trim() ? raw.sectionTitle.trim() : null,
      versionId: typeof raw.versionId === 'string' && raw.versionId.trim() ? raw.versionId.trim() : null,
      mode,
    };
  }
  return null;
}

function normalizePacket(raw: unknown): ContextPacket | null {
  if (!isRecord(raw)) {
    return null;
  }
  const packetId = typeof raw.packetId === 'string' ? raw.packetId.trim() : '';
  const linkedTodoId = typeof raw.linkedTodoId === 'string' ? raw.linkedTodoId.trim() : '';
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const objective = typeof raw.objective === 'string' ? raw.objective.trim() : '';
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
  const origin = normalizeOrigin(raw.origin);
  const preview = normalizePreview(raw.preview);
  if (!packetId || !linkedTodoId || !title || !objective || !createdAt || !origin || !preview) {
    return null;
  }
  return {
    packetId,
    linkedTodoId,
    title,
    objective,
    createdAt,
    origin,
    sources: Array.isArray(raw.sources) ? raw.sources.map((value) => normalizeSource(value)).filter((value): value is ContextPacketSource => value !== null) : [],
    people: Array.isArray(raw.people) ? raw.people.filter((value): value is string => typeof value === 'string') : [],
    entities: Array.isArray(raw.entities) ? raw.entities.filter((value): value is string => typeof value === 'string') : [],
    citations: Array.isArray(raw.citations) ? raw.citations.filter((value): value is string => typeof value === 'string') : [],
    preview,
    writeback: normalizeWriteback(raw.writeback),
  };
}

function defaultDocument(): ContextPacketStoreDocument {
  return {
    version: 1,
    savedAt: null,
    packetsById: {},
    todoToPacketId: {},
  };
}

export class ContextPacketStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<ContextPacketStoreDocument> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) {
        return defaultDocument();
      }

      const packetsRaw = isRecord(parsed.packetsById) ? parsed.packetsById : {};
      const packetsById: Record<string, ContextPacket> = {};
      for (const [packetId, value] of Object.entries(packetsRaw)) {
        const normalized = normalizePacket(value);
        if (normalized) {
          packetsById[packetId] = normalized;
        }
      }

      const todoToPacketIdRaw = isRecord(parsed.todoToPacketId) ? parsed.todoToPacketId : {};
      const todoToPacketId: Record<string, string> = {};
      for (const [todoId, value] of Object.entries(todoToPacketIdRaw)) {
        if (typeof value === 'string' && value.trim()) {
          todoToPacketId[todoId] = value.trim();
        }
      }

      return {
        version: 1,
        savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : null,
        packetsById,
        todoToPacketId,
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return defaultDocument();
      }
      throw error;
    }
  }

  async save(document: Partial<ContextPacketStoreDocument>): Promise<ContextPacketStoreDocument> {
    const fallback = defaultDocument();
    const packetsRaw = isRecord(document.packetsById) ? document.packetsById : {};
    const packetsById: Record<string, ContextPacket> = {};
    for (const [packetId, value] of Object.entries(packetsRaw)) {
      const normalized = normalizePacket(value);
      if (normalized) {
        packetsById[packetId] = normalized;
      }
    }

    const todoToPacketIdRaw = isRecord(document.todoToPacketId) ? document.todoToPacketId : {};
    const todoToPacketId: Record<string, string> = {};
    for (const [todoId, value] of Object.entries(todoToPacketIdRaw)) {
      if (typeof value === 'string' && value.trim()) {
        todoToPacketId[todoId] = value.trim();
      }
    }

    const payload: ContextPacketStoreDocument = {
      ...fallback,
      ...document,
      version: 1,
      savedAt: new Date().toISOString(),
      packetsById,
      todoToPacketId,
    };

    await writeAtomic(this.filePath, `${JSON.stringify(payload, null, 2)}\n`);
    return payload;
  }
}
