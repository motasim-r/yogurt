import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { CachedMeetingsDocument, SyncMetadata } from './types.js';

async function writeAtomic(filePath: string, content: string): Promise<void> {
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });

  const tempPath = `${filePath}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tempPath, content, 'utf8');
  await fs.rename(tempPath, filePath);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function defaultSyncMetadata(): SyncMetadata {
  return {
    detailHydratedAtByMeetingId: {},
    transcriptCooldownUntilByMeetingId: {},
    globalTranscriptCooldownUntil: null,
    globalSyncCooldownUntil: null,
    syncRateLimitStreak: 0,
  };
}

function normalizeSyncMetadata(raw: unknown): SyncMetadata {
  if (!isRecord(raw)) {
    return defaultSyncMetadata();
  }

  const detailHydratedAtByMeetingId = isRecord(raw.detailHydratedAtByMeetingId)
    ? Object.fromEntries(
        Object.entries(raw.detailHydratedAtByMeetingId).filter(
          (entry): entry is [string, string] => typeof entry[0] === 'string' && typeof entry[1] === 'string',
        ),
      )
    : {};

  const transcriptCooldownUntilByMeetingId = isRecord(raw.transcriptCooldownUntilByMeetingId)
    ? Object.fromEntries(
        Object.entries(raw.transcriptCooldownUntilByMeetingId).filter(
          (entry): entry is [string, string] => typeof entry[0] === 'string' && typeof entry[1] === 'string',
        ),
      )
    : {};

  return {
    detailHydratedAtByMeetingId,
    transcriptCooldownUntilByMeetingId,
    globalTranscriptCooldownUntil:
      typeof raw.globalTranscriptCooldownUntil === 'string' ? raw.globalTranscriptCooldownUntil : null,
    globalSyncCooldownUntil: typeof raw.globalSyncCooldownUntil === 'string' ? raw.globalSyncCooldownUntil : null,
    syncRateLimitStreak:
      typeof raw.syncRateLimitStreak === 'number' && Number.isFinite(raw.syncRateLimitStreak)
        ? Math.max(0, Math.floor(raw.syncRateLimitStreak))
        : 0,
  };
}

export class MeetingsCacheStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<CachedMeetingsDocument | null> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) {
        return null;
      }

      if (
        parsed.version !== 1 ||
        typeof parsed.savedAt !== 'string' ||
        typeof parsed.fetchedAt !== 'string' ||
        !Array.isArray(parsed.meetings) ||
        !Array.isArray(parsed.availableTools) ||
        !Array.isArray(parsed.warnings)
      ) {
        return null;
      }

      return {
        version: 1,
        savedAt: parsed.savedAt,
        fetchedAt: parsed.fetchedAt,
        meetings: parsed.meetings as CachedMeetingsDocument['meetings'],
        availableTools: parsed.availableTools.filter((item): item is string => typeof item === 'string'),
        warnings: parsed.warnings.filter((item): item is string => typeof item === 'string'),
        syncMetadata: normalizeSyncMetadata(parsed.syncMetadata),
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async save(payload: Omit<CachedMeetingsDocument, 'version' | 'savedAt'>): Promise<CachedMeetingsDocument> {
    const document: CachedMeetingsDocument = {
      version: 1,
      savedAt: new Date().toISOString(),
      ...payload,
      syncMetadata: normalizeSyncMetadata(payload.syncMetadata),
    };

    await writeAtomic(this.filePath, `${JSON.stringify(document, null, 2)}\n`);
    return document;
  }
}
