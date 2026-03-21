import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { GranolaDocsStore, type DocsWorkspaceState } from './granola-docs-store.js';
import type {
  DocsBlock,
  DocsCreateInput,
  DocsDisplayMode,
  DocsDocument,
  DocsDocumentSummary,
  DocsHome,
  DocsIconTone,
  DocsQuickAction,
  DocsSection,
  DocsSidebarSection,
  DocsTemplate,
  DocsUpdatePatch,
} from '../../src/shared/types.js';

interface DocsRuntimeState {
  loaded: boolean;
  saveChain: Promise<void>;
  workspace: DocsWorkspaceState;
  documents: Record<string, DocsDocument>;
}

interface SeedDocumentInput {
  title: string;
  section: DocsSection;
  iconTone: DocsIconTone;
  favorite?: boolean;
  shared?: boolean;
  pinned?: boolean;
  ownerLabel?: string;
  createdAt: string;
  updatedAt: string;
  blocks: DocsBlock[];
}

const DOCS_OWNER = 'Motasim Rahmar';

const DOCS_QUICK_ACTIONS: DocsQuickAction[] = [
  {
    id: 'new',
    label: 'New',
    description: 'Create a new document',
    enabled: true,
  },
  {
    id: 'upload',
    label: 'Upload',
    description: 'Upload local files',
    enabled: false,
  },
  {
    id: 'templates',
    label: 'Templates',
    description: 'Go to template gallery',
    enabled: true,
  },
];

function createBlock(type: DocsBlock['type'], text = ''): DocsBlock {
  if (type === 'divider') {
    return {
      id: randomUUID(),
      type: 'divider',
    };
  }
  if (type === 'checklist') {
    return {
      id: randomUUID(),
      type: 'checklist',
      text,
      checked: false,
    };
  }
  return {
    id: randomUUID(),
    type,
    text,
  };
}

const DOCS_TEMPLATES: DocsTemplate[] = [
  {
    templateId: 'template-campaign-plan',
    label: 'Campaign Plan',
    description: 'A launch-ready plan with goals, narrative, and workback.',
    section: 'home',
    iconTone: 'blue',
    blocks: [
      createBlock('heading', 'Campaign objective'),
      createBlock('paragraph', 'Define the single business outcome this launch should move.'),
      createBlock('heading', 'Narrative'),
      createBlock('bullet', 'What changed in the market'),
      createBlock('bullet', 'Why our angle is different'),
      createBlock('heading', 'Workback'),
      createBlock('checklist', 'Lock hero message'),
      createBlock('checklist', 'Approve deck'),
    ],
  },
  {
    templateId: 'template-weekly-brief',
    label: 'Weekly Brief',
    description: 'Summarize the week, risks, and the next decisions.',
    section: 'drive',
    iconTone: 'amber',
    blocks: [
      createBlock('heading', 'Wins'),
      createBlock('bullet', 'Top outcome this week'),
      createBlock('heading', 'Risks'),
      createBlock('callout', 'What needs attention before next week'),
      createBlock('heading', 'Next actions'),
      createBlock('checklist', 'Assign owners'),
      createBlock('checklist', 'Share recap'),
    ],
  },
  {
    templateId: 'template-wiki-spec',
    label: 'Wiki Spec',
    description: 'A compact wiki page with context, decisions, and open questions.',
    section: 'wiki',
    iconTone: 'violet',
    blocks: [
      createBlock('heading', 'Context'),
      createBlock('paragraph', 'Explain why this page exists and who it helps.'),
      createBlock('heading', 'Decisions'),
      createBlock('bullet', 'Decision one'),
      createBlock('bullet', 'Decision two'),
      createBlock('heading', 'Open questions'),
      createBlock('paragraph', 'Capture the unresolved edge cases here.'),
    ],
  },
];

function previewFromBlocks(blocks: DocsBlock[]): string {
  for (const block of blocks) {
    if ('text' in block) {
      const normalized = block.text.replace(/\s+/g, ' ').trim();
      if (normalized) {
        return normalized.slice(0, 120);
      }
    }
  }
  return 'Empty document';
}

function locationLabelForSection(section: DocsSection): string {
  switch (section) {
    case 'drive':
      return 'Drive / Operating Docs';
    case 'wiki':
      return 'Pinned Wiki';
    default:
      return 'My Document Library';
  }
}

function breadcrumbsForSection(section: DocsSection): string[] {
  switch (section) {
    case 'drive':
      return ['Docs', 'Drive'];
    case 'wiki':
      return ['Docs', 'Wiki'];
    default:
      return ['Docs', 'Home'];
  }
}

function sectionLabel(section: DocsSection): string {
  switch (section) {
    case 'drive':
      return 'Drive';
    case 'wiki':
      return 'Wiki';
    default:
      return 'Home';
  }
}

function formatRecentLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return value;
  }

  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();
  const sameMonth = date.getMonth() === now.getMonth();
  const sameDay = sameYear && sameMonth && date.getDate() === now.getDate();

  if (sameDay) {
    return `${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} Today`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();
  if (isYesterday) {
    return 'Yesterday';
  }

  return sameYear
    ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function cloneBlocks(blocks: DocsBlock[]): DocsBlock[] {
  return blocks.map((block) => {
    if (block.type === 'divider') {
      return { ...block };
    }
    if (block.type === 'checklist') {
      return { ...block };
    }
    return { ...block };
  });
}

function summarizeDocument(document: DocsDocument): DocsDocumentSummary {
  return {
    docId: document.docId,
    title: document.title,
    section: document.section,
    locationLabel: document.locationLabel,
    ownerLabel: document.ownerLabel,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    recentLabel: document.recentLabel,
    preview: document.preview,
    favorite: document.favorite,
    shared: document.shared,
    pinned: document.pinned,
    iconTone: document.iconTone,
  };
}

function normalizeDocumentShape(document: DocsDocument): DocsDocument {
  return {
    ...document,
    locationLabel: locationLabelForSection(document.section),
    breadcrumbs: breadcrumbsForSection(document.section),
    recentLabel: formatRecentLabel(document.updatedAt),
    preview: previewFromBlocks(document.blocks),
    blocks: cloneBlocks(document.blocks),
  };
}

function normalizeBlockArray(blocks: DocsBlock[]): DocsBlock[] {
  return blocks.map((block) => {
    if (block.type === 'divider') {
      return {
        id: typeof block.id === 'string' && block.id.trim() ? block.id : randomUUID(),
        type: 'divider',
      };
    }
    if (block.type === 'checklist') {
      return {
        id: typeof block.id === 'string' && block.id.trim() ? block.id : randomUUID(),
        type: 'checklist',
        text: typeof block.text === 'string' ? block.text : '',
        checked: block.checked === true,
      };
    }
    return {
      id: typeof block.id === 'string' && block.id.trim() ? block.id : randomUUID(),
      type: block.type,
      text: typeof block.text === 'string' ? block.text : '',
    };
  });
}

function createSeedDocument(input: SeedDocumentInput): DocsDocument {
  return normalizeDocumentShape({
    docId: randomUUID(),
    title: input.title,
    section: input.section,
    locationLabel: locationLabelForSection(input.section),
    ownerLabel: input.ownerLabel ?? DOCS_OWNER,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    recentLabel: formatRecentLabel(input.updatedAt),
    preview: previewFromBlocks(input.blocks),
    favorite: input.favorite ?? false,
    shared: input.shared ?? false,
    pinned: input.pinned ?? false,
    iconTone: input.iconTone,
    breadcrumbs: breadcrumbsForSection(input.section),
    blocks: cloneBlocks(input.blocks),
  });
}

function buildSeedDocuments(): Record<string, DocsDocument> {
  const seeds = [
    createSeedDocument({
      title: 'Campaign Plan',
      section: 'home',
      iconTone: 'blue',
      favorite: true,
      createdAt: '2026-03-21T16:58:00.000Z',
      updatedAt: '2026-03-21T17:08:00.000Z',
      blocks: [
        createBlock('heading', 'Launch target'),
        createBlock('paragraph', 'Land a sharper launch story that ties creator traction to trial conversion.'),
        createBlock('heading', 'Core narrative'),
        createBlock('bullet', 'Lead with the conversion lift'),
        createBlock('bullet', 'Keep creator examples as proof, not the headline'),
      ],
    }),
    createSeedDocument({
      title: 'VectorHaul Launch Narrative',
      section: 'wiki',
      iconTone: 'violet',
      pinned: true,
      shared: true,
      ownerLabel: 'Laura Bennett',
      createdAt: '2026-03-20T10:05:00.000Z',
      updatedAt: '2026-03-21T13:42:00.000Z',
      blocks: [
        createBlock('heading', 'What the room cares about'),
        createBlock('bullet', 'Shrink no-show anxiety with clearer proof'),
        createBlock('bullet', 'Show pipeline recovery, not just raw top-of-funnel'),
        createBlock('callout', 'Keep the deck anchored to what changed after onboarding refresh.'),
      ],
    }),
    createSeedDocument({
      title: 'Creator Ops Handbook',
      section: 'wiki',
      iconTone: 'green',
      pinned: true,
      favorite: true,
      createdAt: '2026-03-17T09:12:00.000Z',
      updatedAt: '2026-03-20T08:20:00.000Z',
      blocks: [
        createBlock('heading', 'Escalation loop'),
        createBlock('paragraph', 'Document how creator issues move from ops triage to launch review.'),
        createBlock('checklist', 'Weekly creator risk scan'),
        createBlock('checklist', 'Share blockers in launch room'),
      ],
    }),
    createSeedDocument({
      title: 'Weekly Brief March 21',
      section: 'drive',
      iconTone: 'amber',
      shared: true,
      createdAt: '2026-03-19T08:40:00.000Z',
      updatedAt: '2026-03-21T12:11:00.000Z',
      blocks: [
        createBlock('heading', 'Wins'),
        createBlock('bullet', 'Trial conversion lift held through week'),
        createBlock('bullet', 'Demo flow tightened for launch review'),
        createBlock('heading', 'Risks'),
        createBlock('callout', 'Calendar load is still compressing review time on Thursday.'),
      ],
    }),
    createSeedDocument({
      title: 'Demo Cut Checklist',
      section: 'drive',
      iconTone: 'rose',
      createdAt: '2026-03-18T14:12:00.000Z',
      updatedAt: '2026-03-20T19:24:00.000Z',
      blocks: [
        createBlock('heading', 'Before export'),
        createBlock('checklist', 'Lock hero message'),
        createBlock('checklist', 'Confirm proof slide ordering'),
        createBlock('checklist', 'Share cut with Joshim'),
      ],
    }),
    createSeedDocument({
      title: 'Hiring Research Notes',
      section: 'home',
      iconTone: 'slate',
      shared: true,
      ownerLabel: 'Mia Chen',
      createdAt: '2026-03-16T11:24:00.000Z',
      updatedAt: '2026-03-18T15:16:00.000Z',
      blocks: [
        createBlock('heading', 'Candidate signal'),
        createBlock('paragraph', 'Collect the strongest evidence from trial operations and pipeline storytelling work.'),
      ],
    }),
  ];

  return Object.fromEntries(seeds.map((document) => [document.docId, document]));
}

function cloneDocument(document: DocsDocument): DocsDocument {
  return {
    ...document,
    breadcrumbs: [...document.breadcrumbs],
    blocks: cloneBlocks(document.blocks),
  };
}

function validateSection(value: unknown): DocsSection | null {
  return value === 'home' || value === 'drive' || value === 'wiki' ? value : null;
}

function validateIconTone(value: unknown): DocsIconTone | null {
  return value === 'blue' ||
    value === 'green' ||
    value === 'amber' ||
    value === 'violet' ||
    value === 'rose' ||
    value === 'slate'
    ? value
    : null;
}

export class GranolaDocsService {
  private readonly store: GranolaDocsStore;

  private readonly templates = DOCS_TEMPLATES.map((template) => ({
    ...template,
    blocks: cloneBlocks(template.blocks),
  }));

  private state: DocsRuntimeState = {
    loaded: false,
    saveChain: Promise.resolve(),
    workspace: {
      displayMode: 'list',
    },
    documents: {},
  };

  constructor(dataDir: string) {
    this.store = new GranolaDocsStore(path.join(dataDir, 'granola-docs-store.json'));
  }

  async init(): Promise<void> {
    const persisted = await this.store.load();
    this.state.loaded = true;
    this.state.workspace = persisted.workspace;
    this.state.documents = Object.keys(persisted.documents).length > 0 ? persisted.documents : buildSeedDocuments();

    if (Object.keys(persisted.documents).length === 0) {
      await this.persist();
    }
  }

  private async persist(): Promise<void> {
    if (!this.state.loaded) {
      return;
    }

    await this.store.save({
      version: 1,
      workspace: this.state.workspace,
      documents: this.state.documents,
    });
  }

  private async withWrite<T>(mutator: () => Promise<T> | T): Promise<T> {
    const run = async (): Promise<T> => {
      const result = await mutator();
      await this.persist();
      return result;
    };

    const next = this.state.saveChain.then(run, run);
    this.state.saveChain = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  private currentDocuments(): DocsDocument[] {
    return Object.values(this.state.documents)
      .map((document) => normalizeDocumentShape(document))
      .sort((left, right) => {
        const leftTime = Date.parse(left.updatedAt);
        const rightTime = Date.parse(right.updatedAt);
        if (Number.isFinite(leftTime) && Number.isFinite(rightTime) && leftTime !== rightTime) {
          return rightTime - leftTime;
        }
        return left.title.localeCompare(right.title);
      });
  }

  private sidebarSections(documents: DocsDocument[]): DocsSidebarSection[] {
    return [
      {
        id: 'home',
        label: 'Home',
        description: 'Your recent and owned docs',
        itemCount: documents.length,
      },
      {
        id: 'drive',
        label: 'Drive',
        description: 'Structured operating docs',
        itemCount: documents.filter((document) => document.section === 'drive').length,
      },
      {
        id: 'wiki',
        label: 'Wiki',
        description: 'Pinned references and spaces',
        itemCount: documents.filter((document) => document.section === 'wiki').length,
      },
    ];
  }

  async docsGetHome(): Promise<DocsHome> {
    const documents = this.currentDocuments();
    return {
      workspaceTitle: 'Docs',
      sections: this.sidebarSections(documents),
      quickActions: DOCS_QUICK_ACTIONS.map((action) => ({ ...action })),
      templates: this.templates.map((template) => ({
        ...template,
        blocks: cloneBlocks(template.blocks),
      })),
      displayMode: this.state.workspace.displayMode,
      documents: documents.map((document) => summarizeDocument(document)),
    };
  }

  async docsGetDocument(docId: string): Promise<DocsDocument> {
    const document = this.state.documents[docId];
    if (!document) {
      throw new Error(`Document not found: ${docId}`);
    }
    return cloneDocument(normalizeDocumentShape(document));
  }

  async docsCreate(input?: DocsCreateInput): Promise<DocsDocument> {
    const template = input?.templateId ? this.templates.find((item) => item.templateId === input.templateId) ?? null : null;
    const section = validateSection(input?.section ?? null) ?? template?.section ?? 'home';
    const now = new Date().toISOString();

    const nextDocument = normalizeDocumentShape({
      docId: randomUUID(),
      title: template?.label ?? 'Untitled document',
      section,
      locationLabel: locationLabelForSection(section),
      ownerLabel: DOCS_OWNER,
      createdAt: now,
      updatedAt: now,
      recentLabel: formatRecentLabel(now),
      preview: template ? previewFromBlocks(template.blocks) : 'Empty document',
      favorite: false,
      shared: false,
      pinned: false,
      iconTone: template?.iconTone ?? 'blue',
      breadcrumbs: breadcrumbsForSection(section),
      blocks: template ? cloneBlocks(template.blocks) : [createBlock('paragraph', '')],
    });

    await this.withWrite(async () => {
      this.state.documents[nextDocument.docId] = nextDocument;
    });

    return cloneDocument(nextDocument);
  }

  async docsUpdate(docId: string, patch: DocsUpdatePatch): Promise<DocsDocument> {
    const current = this.state.documents[docId];
    if (!current) {
      throw new Error(`Document not found: ${docId}`);
    }

    const nextSection = validateSection(patch.section) ?? current.section;
    const nextIconTone = validateIconTone(patch.iconTone) ?? current.iconTone;
    const nextTitle =
      typeof patch.title === 'string' && patch.title.trim().length > 0 ? patch.title.trim() : current.title;
    const nextBlocks = Array.isArray(patch.blocks) ? normalizeBlockArray(patch.blocks) : current.blocks;
    const nextUpdatedAt = new Date().toISOString();

    const nextDocument = normalizeDocumentShape({
      ...current,
      title: nextTitle,
      section: nextSection,
      favorite: typeof patch.favorite === 'boolean' ? patch.favorite : current.favorite,
      shared: typeof patch.shared === 'boolean' ? patch.shared : current.shared,
      pinned: typeof patch.pinned === 'boolean' ? patch.pinned : current.pinned,
      iconTone: nextIconTone,
      blocks: nextBlocks,
      updatedAt: nextUpdatedAt,
    });

    await this.withWrite(async () => {
      this.state.documents[docId] = nextDocument;
    });

    return cloneDocument(nextDocument);
  }
}
