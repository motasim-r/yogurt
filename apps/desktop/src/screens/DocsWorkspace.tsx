import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  FileIcon,
  FolderIcon,
  GridIcon,
  HomeIcon,
  MoreIcon,
  PlusIcon,
  RowsIcon,
  SearchIcon,
  SharedIcon,
  SlidersIcon,
  SparkleIcon,
  StarIcon,
  UploadIcon,
} from '../design-system/icons';
import { granolaClient } from '../lib/granolaClient';
import type {
  DocsBlock,
  DocsCreateInput,
  DocsDocument,
  DocsDocumentSummary,
  DocsHome,
  DocsHomeFilter,
  DocsSection,
} from '../shared/types';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

type SlashMenuState = {
  blockId: string;
  query: string;
};

type InsertMenuState = {
  blockId: string;
};

const DOCS_OWNER = 'Motasim Rahmar';

const DOC_FILTERS: Array<{ id: DocsHomeFilter; label: string }> = [
  { id: 'recent', label: 'Recent' },
  { id: 'owned', label: 'Owned by Me' },
  { id: 'shared', label: 'Shared With Me' },
  { id: 'favorites', label: 'Favorites' },
];

const BLOCK_INSERT_OPTIONS: Array<{ type: DocsBlock['type']; label: string; description: string }> = [
  { type: 'paragraph', label: 'Paragraph', description: 'Start writing normally' },
  { type: 'heading', label: 'Heading', description: 'Create a section heading' },
  { type: 'bullet', label: 'Bullet list', description: 'Capture concise points' },
  { type: 'checklist', label: 'Checklist', description: 'Track items to complete' },
  { type: 'callout', label: 'Callout', description: 'Highlight a key point' },
  { type: 'divider', label: 'Divider', description: 'Separate sections visually' },
];

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function createClientSideId(prefix: string): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createDocsBlock(type: DocsBlock['type']): DocsBlock {
  const id = createClientSideId('docs-block');
  if (type === 'divider') {
    return { id, type: 'divider' };
  }
  if (type === 'checklist') {
    return { id, type: 'checklist', text: '', checked: false };
  }
  return { id, type, text: '' };
}

function cloneDoc(doc: DocsDocument): DocsDocument {
  return JSON.parse(JSON.stringify(doc)) as DocsDocument;
}

function serializeEditableDoc(doc: DocsDocument): string {
  return JSON.stringify({
    title: doc.title,
    section: doc.section,
    favorite: doc.favorite,
    shared: doc.shared,
    pinned: doc.pinned,
    iconTone: doc.iconTone,
    blocks: doc.blocks,
  });
}

function documentMatchesQuery(document: DocsDocumentSummary, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  return [document.title, document.preview, document.locationLabel, document.ownerLabel].some((value) =>
    value.toLowerCase().includes(normalized),
  );
}

function applyFilter(documents: DocsDocumentSummary[], filter: DocsHomeFilter): DocsDocumentSummary[] {
  switch (filter) {
    case 'owned':
      return documents.filter((document) => document.ownerLabel === DOCS_OWNER);
    case 'shared':
      return documents.filter((document) => document.shared);
    case 'favorites':
      return documents.filter((document) => document.favorite);
    default:
      return documents;
  }
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

function upsertHomeDocument(home: DocsHome | null, document: DocsDocument): DocsHome | null {
  if (!home) {
    return home;
  }
  const summary = summarizeDocument(document);
  const documents = [
    summary,
    ...home.documents.filter((candidate) => candidate.docId !== document.docId),
  ].sort((left, right) => (left.updatedAt < right.updatedAt ? 1 : -1));

  return {
    ...home,
    documents,
    sections: home.sections.map((section) => ({
      ...section,
      itemCount:
        section.id === 'home'
          ? documents.length
          : documents.filter((candidate) => candidate.section === section.id).length,
    })),
  };
}

function blockTypeLabel(type: DocsBlock['type']): string {
  switch (type) {
    case 'heading':
      return 'Heading';
    case 'bullet':
      return 'Bullet';
    case 'checklist':
      return 'Checklist';
    case 'callout':
      return 'Callout';
    case 'divider':
      return 'Divider';
    default:
      return 'Paragraph';
  }
}

function EditorBlockRow({
  block,
  focused,
  showSlashMenu,
  slashQuery,
  showInsertMenu,
  onFocus,
  onTextChange,
  onKeyDown,
  onToggleChecklist,
  onOpenInsertMenu,
  onSelectInsertType,
}: {
  block: DocsBlock;
  focused: boolean;
  showSlashMenu: boolean;
  slashQuery: string;
  showInsertMenu: boolean;
  onFocus: () => void;
  onTextChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onToggleChecklist: () => void;
  onOpenInsertMenu: () => void;
  onSelectInsertType: (type: DocsBlock['type']) => void;
}) {
  return (
    <div className={cx('docs-editor-block', `is-${block.type}`, focused && 'is-focused')}>
      <button
        type="button"
        className="docs-editor-block__adder"
        aria-label={`Insert block after ${blockTypeLabel(block.type)}`}
        onClick={onOpenInsertMenu}
      >
        <PlusIcon className="glyph-14" />
      </button>

      <div className="docs-editor-block__body">
        {block.type === 'divider' ? (
          <button type="button" className="docs-editor-divider" onClick={onFocus}>
            <span />
          </button>
        ) : block.type === 'heading' ? (
          <input
            className="docs-editor-input docs-editor-input--heading"
            value={block.text}
            onFocus={onFocus}
            onChange={(event) => {
              onTextChange(event.target.value);
            }}
            onKeyDown={onKeyDown}
            placeholder="Heading"
          />
        ) : (
          <div className={cx('docs-editor-textarea-shell', block.type === 'callout' && 'is-callout')}>
            {block.type === 'bullet' ? <span className="docs-editor-bullet" /> : null}
            {block.type === 'checklist' ? (
              <button
                type="button"
                className={cx('docs-editor-checklist-toggle', block.checked && 'is-checked')}
                onClick={onToggleChecklist}
                aria-label={block.checked ? 'Mark checklist item incomplete' : 'Mark checklist item complete'}
              />
            ) : null}
            <textarea
              className={cx(
                'docs-editor-input',
                block.type === 'paragraph' && 'docs-editor-input--paragraph',
                block.type === 'bullet' && 'docs-editor-input--bullet',
                block.type === 'checklist' && 'docs-editor-input--checklist',
                block.type === 'callout' && 'docs-editor-input--callout',
              )}
              value={block.text}
              onFocus={onFocus}
              onChange={(event) => {
                onTextChange(event.target.value);
              }}
              onKeyDown={onKeyDown}
              placeholder={block.type === 'callout' ? 'Call out something important' : 'Type / for commands'}
              rows={1}
            />
          </div>
        )}

        {showSlashMenu ? (
          <div className="docs-editor-command-menu" role="menu">
            {BLOCK_INSERT_OPTIONS.filter((option) =>
              option.label.toLowerCase().includes(slashQuery.toLowerCase()),
            ).map((option) => (
              <button
                key={`${block.id}-${option.type}`}
                type="button"
                className="docs-editor-command-menu__item"
                onClick={() => {
                  onSelectInsertType(option.type);
                }}
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        ) : null}

        {showInsertMenu ? (
          <div className="docs-editor-command-menu docs-editor-command-menu--insert" role="menu">
            {BLOCK_INSERT_OPTIONS.map((option) => (
              <button
                key={`${block.id}-insert-${option.type}`}
                type="button"
                className="docs-editor-command-menu__item"
                onClick={() => {
                  onSelectInsertType(option.type);
                }}
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DocsEditor({
  document,
  saveState,
  onBack,
  onDocumentChange,
}: {
  document: DocsDocument;
  saveState: SaveState;
  onBack: () => void;
  onDocumentChange: (next: DocsDocument) => void;
}) {
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [slashMenu, setSlashMenu] = useState<SlashMenuState | null>(null);
  const [insertMenu, setInsertMenu] = useState<InsertMenuState | null>(null);

  useEffect(() => {
    setFocusedBlockId(document.blocks[0]?.id ?? null);
    setSlashMenu(null);
    setInsertMenu(null);
  }, [document.docId]);

  const updateBlock = useCallback(
    (blockId: string, updater: (current: DocsBlock) => DocsBlock) => {
      const next = cloneDoc(document);
      next.blocks = next.blocks.map((block) => (block.id === blockId ? updater(block) : block));
      onDocumentChange(next);
    },
    [document, onDocumentChange],
  );

  const insertBlockAfter = useCallback(
    (blockId: string, type: DocsBlock['type']) => {
      const next = cloneDoc(document);
      const index = next.blocks.findIndex((block) => block.id === blockId);
      const insertionIndex = index >= 0 ? index + 1 : next.blocks.length;
      const newBlock = createDocsBlock(type);
      next.blocks.splice(insertionIndex, 0, newBlock);
      onDocumentChange(next);
      setFocusedBlockId(newBlock.id);
      setSlashMenu(null);
      setInsertMenu(null);
    },
    [document, onDocumentChange],
  );

  const transformBlock = useCallback(
    (blockId: string, type: DocsBlock['type']) => {
      updateBlock(blockId, (block) => {
        const id = block.id;
        const existingText = 'text' in block ? block.text : '';
        const nextText = existingText.trimStart().startsWith('/') ? '' : existingText;
        if (type === 'divider') {
          return { id, type: 'divider' };
        }
        if (type === 'checklist') {
          return {
            id,
            type: 'checklist',
            text: nextText,
            checked: block.type === 'checklist' ? block.checked : false,
          };
        }
        return {
          id,
          type,
          text: nextText,
        };
      });
      setSlashMenu(null);
      setInsertMenu(null);
    },
    [updateBlock],
  );

  return (
    <section className="docs-editor" aria-label="Docs editor">
      <header className="docs-editor__topbar">
        <div className="docs-editor__topbar-left">
          <button type="button" className="docs-editor__back" onClick={onBack} aria-label="Back to Docs">
            <ChevronLeftIcon className="glyph-16" />
          </button>
          <span className={cx('docs-doc-icon', `is-${document.iconTone}`)}>
            <FileIcon className="glyph-16" />
          </span>
          <div className="docs-editor__crumbs">
            <span>{document.breadcrumbs.join(' / ')}</span>
            <small>{saveState === 'saving' ? 'Saving locally...' : saveState === 'error' ? 'Save failed' : 'Saved locally'}</small>
          </div>
        </div>

        <div className="docs-editor__actions">
          <button
            type="button"
            className={cx('docs-editor__action', document.favorite && 'is-active')}
            onClick={() => {
              onDocumentChange({
                ...document,
                favorite: !document.favorite,
              });
            }}
          >
            <StarIcon className="glyph-14" />
            <span>{document.favorite ? 'Favorited' : 'Favorite'}</span>
          </button>
          <button type="button" className="docs-editor__action" disabled>
            <SharedIcon className="glyph-14" />
            <span>Share</span>
          </button>
          <button type="button" className="docs-editor__icon" disabled aria-label="More document actions">
            <MoreIcon className="glyph-14" />
          </button>
        </div>
      </header>

      <div className="docs-editor__canvas">
        <input
          className="docs-editor__title"
          value={document.title}
          onChange={(event) => {
            onDocumentChange({
              ...document,
              title: event.target.value,
            });
          }}
          placeholder="Untitled document"
        />

        <div className="docs-editor__meta">
          <span>{document.locationLabel}</span>
          <span>{document.ownerLabel}</span>
          <span>{document.recentLabel}</span>
        </div>

        <div className="docs-editor__blocks">
          {document.blocks.map((block) => (
            <EditorBlockRow
              key={block.id}
              block={block}
              focused={focusedBlockId === block.id}
              showSlashMenu={slashMenu?.blockId === block.id}
              slashQuery={slashMenu?.blockId === block.id ? slashMenu.query : ''}
              showInsertMenu={insertMenu?.blockId === block.id}
              onFocus={() => {
                setFocusedBlockId(block.id);
                setInsertMenu(null);
              }}
              onTextChange={(value) => {
                updateBlock(block.id, (current) => {
                  if (current.type === 'divider') {
                    return current;
                  }
                  if (current.type === 'checklist') {
                    return { ...current, text: value };
                  }
                  return { ...current, text: value };
                });
                const trimmed = value.trimStart();
                if (trimmed.startsWith('/')) {
                  setSlashMenu({
                    blockId: block.id,
                    query: trimmed.slice(1),
                  });
                } else if (slashMenu?.blockId === block.id) {
                  setSlashMenu(null);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  insertBlockAfter(block.id, 'paragraph');
                  return;
                }
                if (event.key === 'Escape') {
                  setSlashMenu(null);
                  setInsertMenu(null);
                }
              }}
              onToggleChecklist={() => {
                updateBlock(block.id, (current) =>
                  current.type === 'checklist' ? { ...current, checked: !current.checked } : current,
                );
              }}
              onOpenInsertMenu={() => {
                setInsertMenu((current) => (current?.blockId === block.id ? null : { blockId: block.id }));
                setSlashMenu(null);
              }}
              onSelectInsertType={(type) => {
                if (slashMenu?.blockId === block.id) {
                  transformBlock(block.id, type);
                  return;
                }
                insertBlockAfter(block.id, type);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DocsWorkspace({ sidebar }: { sidebar: ReactNode }) {
  const [home, setHome] = useState<DocsHome | null>(null);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<DocsSection>('home');
  const [activeFilter, setActiveFilter] = useState<DocsHomeFilter>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayMode, setDisplayMode] = useState<'list' | 'grid'>('list');
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeDocument, setActiveDocument] = useState<DocsDocument | null>(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const lastSavedEditableRef = useRef<string>('');
  const saveStatusResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchHome = useCallback(async () => {
    setHomeLoading(true);
    try {
      const next = await granolaClient.docsGetHome();
      setHome(next);
      setDisplayMode(next.displayMode);
      setHomeError(null);
    } catch (error) {
      setHomeError(error instanceof Error ? error.message : 'Unable to load docs.');
    } finally {
      setHomeLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHome();
  }, [fetchHome]);

  useEffect(() => {
    return () => {
      if (saveStatusResetTimerRef.current) {
        clearTimeout(saveStatusResetTimerRef.current);
      }
    };
  }, []);

  const openDocument = useCallback(async (docId: string) => {
    setDocumentLoading(true);
    try {
      const next = await granolaClient.docsGetDocument(docId);
      setActiveDocument(next);
      setDocumentError(null);
      setSaveState('idle');
      lastSavedEditableRef.current = serializeEditableDoc(next);
    } catch (error) {
      setDocumentError(error instanceof Error ? error.message : 'Unable to open document.');
      setActiveDocument(null);
    } finally {
      setDocumentLoading(false);
    }
  }, []);

  const handleCreateDocument = useCallback(
    async (input?: DocsCreateInput) => {
      setDocumentLoading(true);
      try {
        const created = await granolaClient.docsCreate(input);
        setActiveDocument(created);
        setDocumentError(null);
        setShowTemplates(false);
        setSaveState('idle');
        lastSavedEditableRef.current = serializeEditableDoc(created);
        setHome((current) => upsertHomeDocument(current, created));
      } catch (error) {
        setDocumentError(error instanceof Error ? error.message : 'Unable to create document.');
      } finally {
        setDocumentLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!activeDocument) {
      return;
    }

    const editableSnapshot = serializeEditableDoc(activeDocument);
    if (editableSnapshot === lastSavedEditableRef.current) {
      return;
    }

    setSaveState('saving');
    const timer = setTimeout(() => {
      void granolaClient
        .docsUpdate(activeDocument.docId, {
          title: activeDocument.title,
          section: activeDocument.section,
          favorite: activeDocument.favorite,
          shared: activeDocument.shared,
          pinned: activeDocument.pinned,
          iconTone: activeDocument.iconTone,
          blocks: activeDocument.blocks,
        })
        .then((saved) => {
          lastSavedEditableRef.current = editableSnapshot;
          setActiveDocument((current) =>
            current && current.docId === saved.docId
              ? {
                  ...current,
                  updatedAt: saved.updatedAt,
                  recentLabel: saved.recentLabel,
                  preview: saved.preview,
                  locationLabel: saved.locationLabel,
                  breadcrumbs: saved.breadcrumbs,
                }
              : current,
          );
          setHome((current) => upsertHomeDocument(current, saved));
          setSaveState('saved');
          if (saveStatusResetTimerRef.current) {
            clearTimeout(saveStatusResetTimerRef.current);
          }
          saveStatusResetTimerRef.current = setTimeout(() => {
            setSaveState('idle');
          }, 1200);
        })
        .catch(() => {
          setSaveState('error');
        });
    }, 160);

    return () => {
      clearTimeout(timer);
    };
  }, [activeDocument]);

  const filteredDocuments = useMemo(() => {
    const documents = home?.documents ?? [];
    const sectionScoped =
      activeSection === 'home' ? documents : documents.filter((document) => document.section === activeSection);
    const queryScoped = sectionScoped.filter((document) => documentMatchesQuery(document, searchQuery));
    return applyFilter(queryScoped, activeFilter);
  }, [activeFilter, activeSection, home?.documents, searchQuery]);

  const sidebarLibrary = useMemo(
    () =>
      (home?.documents ?? [])
        .filter((document) => !(document.section === 'wiki' && document.pinned))
        .filter((document) => documentMatchesQuery(document, searchQuery))
        .slice(0, 8),
    [home?.documents, searchQuery],
  );

  const pinnedWiki = useMemo(
    () =>
      (home?.documents ?? [])
        .filter((document) => document.section === 'wiki' && document.pinned)
        .filter((document) => documentMatchesQuery(document, searchQuery)),
    [home?.documents, searchQuery],
  );

  return (
    <div className="granola-frame granola-frame--docs">
      {sidebar}

      <main className="granola-main granola-main--docs">
        <div className="docs-shell">
          <aside className="docs-sidebar workspace-sidebar" aria-label="Docs navigator">
            <div className="docs-sidebar__header workspace-sidebar__header">
              <h1 className="workspace-sidebar__title">{home?.workspaceTitle ?? 'Docs'}</h1>
              <button
                type="button"
                className="docs-sidebar__icon workspace-sidebar__action"
                aria-label="Create document"
                onClick={() => void handleCreateDocument()}
              >
                <PlusIcon className="glyph-14" />
              </button>
            </div>

            <label className="docs-sidebar__search workspace-sidebar__search">
              <SearchIcon className="glyph-14" />
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
              />
            </label>

            <div className="docs-sidebar__scroll workspace-sidebar__scroll">
              <div className="docs-sidebar__sections workspace-sidebar__stack">
                {(home?.sections ?? []).map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className={cx('docs-sidebar__section workspace-sidebar__item', activeSection === section.id && 'is-active')}
                    aria-label={section.label}
                    onClick={() => {
                      setActiveSection(section.id);
                      setActiveDocument(null);
                      setDocumentError(null);
                    }}
                  >
                    <span className="docs-sidebar__section-icon">
                      {section.id === 'home' ? <HomeIcon className="glyph-14" /> : section.id === 'drive' ? <FolderIcon className="glyph-14" /> : <FileIcon className="glyph-14" />}
                    </span>
                    <span className="docs-sidebar__section-copy workspace-sidebar__item-copy">
                      <strong>{section.label}</strong>
                      <small>{section.description}</small>
                    </span>
                  </button>
                ))}
              </div>

              <div className="docs-sidebar__group workspace-sidebar__stack">
                <div className="docs-sidebar__group-label workspace-sidebar__label">Pinned Wiki</div>
                {pinnedWiki.length === 0 ? <p className="docs-sidebar__empty workspace-sidebar__empty">Create or pin a wiki space</p> : null}
                {pinnedWiki.map((document) => (
                  <button
                    key={document.docId}
                    type="button"
                    className={cx('docs-sidebar__library-item workspace-sidebar__item', activeDocument?.docId === document.docId && 'is-active')}
                    onClick={() => {
                      void openDocument(document.docId);
                    }}
                  >
                    <span className={cx('docs-doc-icon', `is-${document.iconTone}`)}>
                      <FileIcon className="glyph-14" />
                    </span>
                    <span className="docs-sidebar__library-copy workspace-sidebar__item-copy">
                      <strong>{document.title}</strong>
                    </span>
                  </button>
                ))}
              </div>

              <div className="docs-sidebar__group workspace-sidebar__stack">
                <div className="docs-sidebar__group-label workspace-sidebar__label">My Document Library</div>
                {sidebarLibrary.map((document) => (
                  <button
                    key={document.docId}
                    type="button"
                    className={cx('docs-sidebar__library-item workspace-sidebar__item', activeDocument?.docId === document.docId && 'is-active')}
                    onClick={() => {
                      void openDocument(document.docId);
                    }}
                  >
                    <span className={cx('docs-doc-icon', `is-${document.iconTone}`)}>
                      <FileIcon className="glyph-14" />
                    </span>
                    <span className="docs-sidebar__library-copy workspace-sidebar__item-copy">
                      <strong>{document.title}</strong>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="docs-main workspace-body">
            {documentLoading ? <p className="docs-state">Loading document...</p> : null}
            {documentError && !activeDocument ? <p className="docs-state is-error">{documentError}</p> : null}

            {activeDocument ? (
              <DocsEditor
                document={activeDocument}
                saveState={saveState}
                onBack={() => {
                  setActiveDocument(null);
                  setDocumentError(null);
                }}
                onDocumentChange={setActiveDocument}
              />
            ) : (
              <section className="docs-home" aria-label="Docs home">
                {activeSection === 'home' ? null : (
                  <header className="docs-home__header">
                    <div>
                      <h2>{activeSection === 'drive' ? 'Drive' : 'Wiki'}</h2>
                    </div>
                    <button type="button" className="docs-home__gear" disabled aria-label="Docs settings">
                      <SlidersIcon className="glyph-14" />
                    </button>
                  </header>
                )}

                <div className="docs-home__quick-actions">
                  <button type="button" className="docs-quick-card" aria-label="New" onClick={() => void handleCreateDocument({ section: activeSection })}>
                    <span className="docs-quick-card__icon is-blue">
                      <PlusIcon className="glyph-16" />
                    </span>
                    <span className="docs-quick-card__copy">
                      <strong>New</strong>
                      <small>Create a new document</small>
                    </span>
                    <ChevronDownIcon className="glyph-12" />
                  </button>
                  <button type="button" className="docs-quick-card" aria-label="Upload" disabled>
                    <span className="docs-quick-card__icon is-amber">
                      <UploadIcon className="glyph-16" />
                    </span>
                    <span className="docs-quick-card__copy">
                      <strong>Upload</strong>
                      <small>Upload local files</small>
                    </span>
                    <ChevronDownIcon className="glyph-12" />
                  </button>
                  <button type="button" className="docs-quick-card" aria-label="Templates" onClick={() => setShowTemplates((current) => !current)}>
                    <span className="docs-quick-card__icon is-violet">
                      <SparkleIcon className="glyph-16" />
                    </span>
                    <span className="docs-quick-card__copy">
                      <strong>Templates</strong>
                      <small>Go to template gallery</small>
                    </span>
                    <ChevronDownIcon className="glyph-12" />
                  </button>
                </div>

                {showTemplates ? (
                  <div className="docs-template-panel" aria-label="Docs templates">
                    {(home?.templates ?? []).map((template) => (
                      <button
                        key={template.templateId}
                        type="button"
                        className="docs-template-panel__item"
                        aria-label={template.label}
                        onClick={() => {
                          void handleCreateDocument({ templateId: template.templateId, section: template.section });
                        }}
                      >
                        <span className={cx('docs-doc-icon', `is-${template.iconTone}`)}>
                          <FileIcon className="glyph-14" />
                        </span>
                        <span className="docs-template-panel__copy">
                          <strong>{template.label}</strong>
                          <small>{template.description}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="docs-home__toolbar">
                  <div className="docs-home__filters">
                    {DOC_FILTERS.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        className={cx('docs-home__filter', activeFilter === filter.id && 'is-active')}
                        onClick={() => {
                          setActiveFilter(filter.id);
                        }}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  <div className="docs-home__toolbar-actions">
                    <button type="button" className="docs-home__toolbar-button" disabled>
                      <SlidersIcon className="glyph-14" />
                      <span>Filter</span>
                    </button>
                    <button type="button" className="docs-home__toolbar-button" disabled>
                      <RowsIcon className="glyph-14" />
                      <span>Display Settings</span>
                    </button>
                    <div className="docs-home__display-toggle" role="group" aria-label="Display mode">
                      <button
                        type="button"
                        className={cx(displayMode === 'list' && 'is-active')}
                        aria-label="List view"
                        onClick={() => {
                          setDisplayMode('list');
                        }}
                      >
                        <RowsIcon className="glyph-14" />
                      </button>
                      <button
                        type="button"
                        className={cx(displayMode === 'grid' && 'is-active')}
                        aria-label="Grid view"
                        onClick={() => {
                          setDisplayMode('grid');
                        }}
                      >
                        <GridIcon className="glyph-14" />
                      </button>
                    </div>
                  </div>
                </div>

                {homeLoading ? <p className="docs-state">Loading docs...</p> : null}
                {homeError ? <p className="docs-state is-error">{homeError}</p> : null}
                {!homeLoading && !homeError && filteredDocuments.length === 0 ? (
                  <p className="docs-state">No documents match this view.</p>
                ) : null}

                {displayMode === 'list' ? (
                  <div className="docs-table" role="table" aria-label="Documents table">
                    <div className="docs-table__header" role="row">
                      <span>Name</span>
                      <span>Location</span>
                      <span>Owner</span>
                      <span>Created</span>
                      <span>Recent</span>
                    </div>
                    <div className="docs-table__rows">
                      {filteredDocuments.map((document) => (
                        <button
                          key={document.docId}
                          type="button"
                          className="docs-table__row"
                          aria-label={`Open ${document.title}`}
                          onClick={() => {
                            void openDocument(document.docId);
                          }}
                        >
                          <span className="docs-table__name">
                            <span className={cx('docs-doc-icon', `is-${document.iconTone}`)}>
                              <FileIcon className="glyph-14" />
                            </span>
                            <span>{document.title}</span>
                          </span>
                          <span>{document.locationLabel}</span>
                          <span>{document.ownerLabel}</span>
                          <span>{new Date(document.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>{document.recentLabel}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="docs-grid" aria-label="Documents grid">
                    {filteredDocuments.map((document) => (
                      <button
                        key={document.docId}
                        type="button"
                        className="docs-grid__card"
                        aria-label={`Open ${document.title}`}
                        onClick={() => {
                          void openDocument(document.docId);
                        }}
                      >
                        <div className="docs-grid__card-top">
                          <span className={cx('docs-doc-icon', `is-${document.iconTone}`)}>
                            <FileIcon className="glyph-14" />
                          </span>
                          {document.favorite ? <StarIcon className="glyph-14 docs-grid__favorite" /> : null}
                        </div>
                        <strong>{document.title}</strong>
                        <p>{document.preview}</p>
                        <div className="docs-grid__meta">
                          <span>{document.locationLabel}</span>
                          <span>{document.recentLabel}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
