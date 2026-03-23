import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type {
  DocVersionSummary,
  DocsBlock,
  DocsDisplayMode,
  DocsDocument,
  DocsIconTone,
  DocsSection,
} from '../../src/shared/types.js';

export interface DocsWorkspaceState {
  displayMode: DocsDisplayMode;
}

export interface DocsVersionRecord extends DocVersionSummary {
  snapshot: DocsDocument;
}

export interface GranolaDocsStoreDocument {
  version: 2;
  savedAt: string | null;
  workspace: DocsWorkspaceState;
  documents: Record<string, DocsDocument>;
  versionsByDocId: Record<string, DocsVersionRecord[]>;
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

function isDocsSection(value: unknown): value is DocsSection {
  return value === 'home' || value === 'drive' || value === 'wiki';
}

function isDisplayMode(value: unknown): value is DocsDisplayMode {
  return value === 'list' || value === 'grid';
}

function isIconTone(value: unknown): value is DocsIconTone {
  return value === 'blue' || value === 'green' || value === 'amber' || value === 'violet' || value === 'rose' || value === 'slate';
}

function normalizeBlock(raw: unknown): DocsBlock | null {
  if (!isRecord(raw)) {
    return null;
  }
  const id = typeof raw.id === 'string' ? raw.id.trim() : '';
  const type = raw.type;
  if (!id) {
    return null;
  }

  if (type === 'divider') {
    return { id, type: 'divider' };
  }

  const text = typeof raw.text === 'string' ? raw.text : '';
  if (type === 'paragraph' || type === 'heading' || type === 'bullet' || type === 'callout') {
    return { id, type, text };
  }
  if (type === 'checklist') {
    return {
      id,
      type: 'checklist',
      text,
      checked: raw.checked === true,
    };
  }
  return null;
}

function normalizeDocument(raw: unknown): DocsDocument | null {
  if (!isRecord(raw)) {
    return null;
  }

  const docId = typeof raw.docId === 'string' ? raw.docId.trim() : '';
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const section = raw.section;
  const locationLabel = typeof raw.locationLabel === 'string' ? raw.locationLabel : '';
  const ownerLabel = typeof raw.ownerLabel === 'string' ? raw.ownerLabel : '';
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
  const updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : '';
  const recentLabel = typeof raw.recentLabel === 'string' ? raw.recentLabel : '';
  const preview = typeof raw.preview === 'string' ? raw.preview : '';
  const favorite = raw.favorite === true;
  const shared = raw.shared === true;
  const pinned = raw.pinned === true;
  const iconTone = raw.iconTone;
  const breadcrumbs = Array.isArray(raw.breadcrumbs) ? raw.breadcrumbs.filter((item): item is string => typeof item === 'string') : [];
  const blocks = Array.isArray(raw.blocks) ? raw.blocks.map((item) => normalizeBlock(item)).filter((item): item is DocsBlock => item !== null) : [];

  if (!docId || !title || !createdAt || !updatedAt || !isDocsSection(section) || !isIconTone(iconTone)) {
    return null;
  }

  return {
    docId,
    title,
    section,
    locationLabel,
    ownerLabel,
    createdAt,
    updatedAt,
    recentLabel,
    preview,
    favorite,
    shared,
    pinned,
    iconTone,
    breadcrumbs,
    blocks,
  };
}

function defaultDocument(): GranolaDocsStoreDocument {
  return {
    version: 2,
    savedAt: null,
    workspace: {
      displayMode: 'list',
    },
    documents: {},
    versionsByDocId: {},
  };
}

function normalizeVersion(raw: unknown): DocsVersionRecord | null {
  if (!isRecord(raw)) {
    return null;
  }
  const versionId = typeof raw.versionId === 'string' ? raw.versionId.trim() : '';
  const docId = typeof raw.docId === 'string' ? raw.docId.trim() : '';
  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : '';
  const label = typeof raw.label === 'string' ? raw.label.trim() : '';
  const preview = typeof raw.preview === 'string' ? raw.preview : '';
  const snapshot = normalizeDocument(raw.snapshot);
  if (!versionId || !docId || !createdAt || !label || !snapshot) {
    return null;
  }
  return {
    versionId,
    docId,
    createdAt,
    label,
    preview,
    sourceTaskId: typeof raw.sourceTaskId === 'string' && raw.sourceTaskId.trim() ? raw.sourceTaskId.trim() : null,
    sourcePacketId:
      typeof raw.sourcePacketId === 'string' && raw.sourcePacketId.trim() ? raw.sourcePacketId.trim() : null,
    restoredFromVersionId:
      typeof raw.restoredFromVersionId === 'string' && raw.restoredFromVersionId.trim()
        ? raw.restoredFromVersionId.trim()
        : null,
    snapshot,
  };
}

export class GranolaDocsStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<GranolaDocsStoreDocument> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) {
        return defaultDocument();
      }

      const documentsRaw = isRecord(parsed.documents) ? parsed.documents : {};
      const documents: Record<string, DocsDocument> = {};
      for (const [docId, value] of Object.entries(documentsRaw)) {
        const normalized = normalizeDocument(value);
        if (normalized) {
          documents[docId] = normalized;
        }
      }

      const versionsRaw = isRecord(parsed.versionsByDocId) ? parsed.versionsByDocId : {};
      const versionsByDocId: Record<string, DocsVersionRecord[]> = {};
      for (const [docId, value] of Object.entries(versionsRaw)) {
        const versions = Array.isArray(value)
          ? value.map((item) => normalizeVersion(item)).filter((item): item is DocsVersionRecord => item !== null)
          : [];
        versionsByDocId[docId] = versions;
      }

      const workspaceRaw = isRecord(parsed.workspace) ? parsed.workspace : {};

      return {
        version: 2,
        savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : null,
        workspace: {
          displayMode: isDisplayMode(workspaceRaw.displayMode) ? workspaceRaw.displayMode : 'list',
        },
        documents,
        versionsByDocId,
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return defaultDocument();
      }
      throw error;
    }
  }

  async save(document: Partial<GranolaDocsStoreDocument>): Promise<GranolaDocsStoreDocument> {
    const fallback = defaultDocument();
    const documentsRaw = isRecord(document.documents) ? document.documents : {};
    const documents: Record<string, DocsDocument> = {};
    const versionsRaw = isRecord(document.versionsByDocId) ? document.versionsByDocId : {};
    const versionsByDocId: Record<string, DocsVersionRecord[]> = {};

    for (const [docId, value] of Object.entries(documentsRaw)) {
      const normalized = normalizeDocument(value);
      if (normalized) {
        documents[docId] = normalized;
      }
    }

    for (const [docId, value] of Object.entries(versionsRaw)) {
      versionsByDocId[docId] = Array.isArray(value)
        ? value.map((item) => normalizeVersion(item)).filter((item): item is DocsVersionRecord => item !== null)
        : [];
    }

    const payload: GranolaDocsStoreDocument = {
      ...fallback,
      ...document,
      version: 2,
      savedAt: new Date().toISOString(),
      workspace: {
        displayMode: isDisplayMode(document.workspace?.displayMode) ? document.workspace.displayMode : 'list',
      },
      documents,
      versionsByDocId,
    };

    await writeAtomic(this.filePath, `${JSON.stringify(payload, null, 2)}\n`);
    return payload;
  }
}
