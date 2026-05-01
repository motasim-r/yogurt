import {
  type ClipboardEvent,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  FileIcon,
  FolderIcon,
  GridIcon,
  HomeIcon,
  MoreIcon,
  PlanPlusIcon,
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
  DocVersionSummary,
  DocsBlock,
  DocsCreateInput,
  DocsDocument,
  DocsDocumentSummary,
  DocsHeadingLevel,
  DocsHome,
  DocsHomeFilter,
  DocsSection,
  TaskCreateFromContextInput,
} from '../shared/types';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

type SlashMenuState = {
  blockId: string;
  query: string;
};

type InsertMenuState = {
  blockId: string;
};

type BlockInsertTarget = {
  type: DocsBlock['type'];
  level?: DocsHeadingLevel;
};

type TaskContextModalState = {
  anchorBlockId: string | null;
  blockIds: string[];
  title: string;
  objective: string;
  excerpt: string;
  sectionHeading: string;
  mode: 'block' | 'section' | 'checklist';
  stats: string[];
};

const DOCS_OWNER = 'Motasim Rahmar';

const DOC_FILTERS: Array<{ id: DocsHomeFilter; label: string }> = [
  { id: 'recent', label: 'Recent' },
  { id: 'owned', label: 'Owned by Me' },
  { id: 'shared', label: 'Shared With Me' },
  { id: 'favorites', label: 'Favorites' },
];

const BLOCK_INSERT_OPTIONS: Array<BlockInsertTarget & { label: string; description: string }> = [
  { type: 'paragraph', label: 'Text', description: 'Start writing normally' },
  { type: 'heading', level: 1, label: 'Heading 1', description: 'Large section title' },
  { type: 'heading', level: 2, label: 'Heading 2', description: 'Medium section heading' },
  { type: 'heading', level: 3, label: 'Heading 3', description: 'Tight subheading' },
  { type: 'bullet', label: 'Bulleted list', description: 'Capture concise points' },
  { type: 'numbered', label: 'Numbered list', description: 'Create ordered steps' },
  { type: 'checklist', label: 'Checklist', description: 'Track items to complete' },
  { type: 'quote', label: 'Quote', description: 'Offset referenced text' },
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

function createDocsBlock(target: BlockInsertTarget): DocsBlock {
  const id = createClientSideId('docs-block');
  if (target.type === 'divider') {
    return { id, type: 'divider' };
  }
  if (target.type === 'checklist') {
    return { id, type: 'checklist', text: '', checked: false };
  }
  if (target.type === 'heading') {
    return {
      id,
      type: 'heading',
      text: '',
      level: target.level ?? 2,
    };
  }
  return { id, type: target.type, text: '' };
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
    case 'numbered':
      return 'Numbered list';
    case 'quote':
      return 'Quote';
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

function blockPlaceholder(block: DocsBlock): string {
  switch (block.type) {
    case 'heading':
      return block.level === 1 ? 'Heading 1' : block.level === 2 ? 'Heading 2' : 'Heading 3';
    case 'quote':
      return 'Quote';
    case 'callout':
      return 'Call out something important';
    case 'checklist':
      return 'To-do';
    default:
      return 'Type / for commands';
  }
}

function blockInsertLabel(target: BlockInsertTarget): string {
  if (target.type === 'heading') {
    return target.level === 1 ? 'Heading 1' : target.level === 2 ? 'Heading 2' : 'Heading 3';
  }
  return blockTypeLabel(target.type);
}

function markdownShortcutTarget(value: string): (BlockInsertTarget & { text: string; checked?: boolean; insertParagraphAfter?: boolean }) | null {
  if (/^---$/.test(value.trim())) {
    return {
      type: 'divider',
      text: '',
      insertParagraphAfter: true,
    };
  }
  const heading3 = value.match(/^###\s+(.*)$/);
  if (heading3) {
    return { type: 'heading', level: 3, text: heading3[1] };
  }
  const heading2 = value.match(/^##\s+(.*)$/);
  if (heading2) {
    return { type: 'heading', level: 2, text: heading2[1] };
  }
  const heading1 = value.match(/^#\s+(.*)$/);
  if (heading1) {
    return { type: 'heading', level: 1, text: heading1[1] };
  }
  const checklist = value.match(/^(?:\[\s\]|\-\s\[\s\])\s+(.*)$/);
  if (checklist) {
    return { type: 'checklist', text: checklist[1], checked: false };
  }
  const quote = value.match(/^>\s+(.*)$/);
  if (quote) {
    return { type: 'quote', text: quote[1] };
  }
  const numbered = value.match(/^\d+\.\s+(.*)$/);
  if (numbered) {
    return { type: 'numbered', text: numbered[1] };
  }
  const bullet = value.match(/^(?:-|\*|\+)\s+(.*)$/);
  if (bullet) {
    return { type: 'bullet', text: bullet[1] };
  }
  return null;
}

function blockText(block: DocsBlock): string {
  return 'text' in block ? block.text : '';
}

function numberedMarkerForBlock(blocks: DocsBlock[], index: number): string | null {
  const block = blocks[index];
  if (!block || block.type !== 'numbered') {
    return null;
  }
  let marker = 1;
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (blocks[cursor]?.type !== 'numbered') {
      break;
    }
    marker += 1;
  }
  return `${marker}.`;
}

function getSectionRange(blocks: DocsBlock[], blockId?: string | null): { startIndex: number; endIndex: number } {
  const blockIndex = blockId ? blocks.findIndex((block) => block.id === blockId) : -1;
  let startIndex = blockIndex >= 0 ? blockIndex : 0;
  while (startIndex > 0 && blocks[startIndex - 1]?.type !== 'heading') {
    startIndex -= 1;
  }
  let endIndex = Math.min(blocks.length, startIndex + 12);
  for (let index = startIndex + 1; index < blocks.length; index += 1) {
    if (blocks[index]?.type === 'heading') {
      endIndex = index;
      break;
    }
  }
  return { startIndex, endIndex };
}

function buildTaskContextModalState(
  document: DocsDocument,
  blocks: DocsBlock[],
  options: {
    anchorBlockId?: string | null;
    mode: 'block' | 'section' | 'checklist';
    titleOverride?: string | null;
  },
): TaskContextModalState {
  const selectionBlocks = blocks.length > 0 ? blocks : document.blocks.slice(0, 12);
  const sectionHeading =
    selectionBlocks
      .map((block) => (block.type === 'heading' ? block.text.trim() : ''))
      .find((value) => value.length > 0) || document.title;
  const excerpt = selectionBlocks.map((block) => (block.type === 'divider' ? '---' : blockText(block))).join('\n');
  const objective = excerpt.replace(/\s+/g, ' ').trim().slice(0, 280) || sectionHeading;
  const leadText =
    options.titleOverride?.trim() ||
    selectionBlocks
      .map((block) => blockText(block).trim())
      .find((value) => value.length > 0) ||
    sectionHeading;

  return {
    anchorBlockId: options.anchorBlockId ?? selectionBlocks[0]?.id ?? null,
    blockIds: selectionBlocks.map((block) => block.id),
    title: leadText,
    objective,
    excerpt,
    sectionHeading,
    mode: options.mode,
    stats: [
      `Using ${selectionBlocks.length} block${selectionBlocks.length === 1 ? '' : 's'}`,
      document.breadcrumbs.join(' / '),
    ],
  };
}

type AutoGrowTextareaProps = Omit<ComponentPropsWithoutRef<'textarea'>, 'ref'> & {
  textareaRef?: (node: HTMLTextAreaElement | null) => void;
};

function AutoGrowTextarea({ textareaRef, value, style, ...props }: AutoGrowTextareaProps) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      textareaRef?.(node);
    },
    [textareaRef],
  );

  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) {
      return;
    }
    node.style.height = '0px';
    node.style.height = `${Math.max(node.scrollHeight, 28)}px`;
  }, [value]);

  return (
    <textarea
      {...props}
      ref={setRefs}
      rows={1}
      value={value}
      style={{
        ...style,
        overflow: 'hidden',
      }}
    />
  );
}

function EditorBlockRow({
  block,
  focused,
  selected,
  showChrome,
  listMarker,
  showSlashMenu,
  slashQuery,
  showInsertMenu,
  onFocus,
  onSelectBlock,
  onHoverStart,
  onHoverEnd,
  onTextChange,
  onKeyDown,
  onPaste,
  onToggleChecklist,
  onOpenInsertMenu,
  onSelectInsertType,
  onRunAsTask,
  registerInputRef,
}: {
  block: DocsBlock;
  focused: boolean;
  selected: boolean;
  showChrome: boolean;
  listMarker: string | null;
  showSlashMenu: boolean;
  slashQuery: string;
  showInsertMenu: boolean;
  onFocus: () => void;
  onSelectBlock: (extend: boolean) => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onTextChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLTextAreaElement>) => void;
  onToggleChecklist: () => void;
  onOpenInsertMenu: () => void;
  onSelectInsertType: (target: BlockInsertTarget) => void;
  onRunAsTask: () => void;
  registerInputRef: (node: HTMLTextAreaElement | null) => void;
}) {
  return (
    <div
      className={cx('docs-editor-block', `is-${block.type}`, focused && 'is-focused', selected && 'is-selected')}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      aria-label={`Docs block ${blockTypeLabel(block.type)}`}
    >
      <div className="docs-editor-block__rail">
        {showChrome ? (
          <>
            <button
              type="button"
              className="docs-editor-block__handle"
              aria-label={`Select ${blockTypeLabel(block.type)} block`}
              onClick={(event) => {
                onSelectBlock(event.shiftKey);
              }}
            >
              <RowsIcon className="glyph-14" />
            </button>
            <button
              type="button"
              className="docs-editor-block__adder"
              aria-label={`Insert block after ${blockInsertLabel({ type: block.type, level: block.type === 'heading' ? block.level : undefined })}`}
              onClick={onOpenInsertMenu}
            >
              <PlusIcon className="glyph-14" />
            </button>
          </>
        ) : null}
      </div>
      <div className="docs-editor-block__body">
        {showChrome && block.type !== 'divider' ? (
          <button
            type="button"
            className="docs-editor-block__task"
            aria-label={`Run ${block.type} as task`}
            onClick={onRunAsTask}
          >
            <PlanPlusIcon className="glyph-14" />
          </button>
        ) : null}

        {block.type === 'divider' ? (
          <button type="button" className="docs-editor-divider" onClick={onFocus}>
            <span />
          </button>
        ) : block.type === 'heading' ? (
          <AutoGrowTextarea
            className={cx(
              'docs-editor-input docs-editor-input--heading',
              block.level === 1 && 'is-level-1',
              block.level === 2 && 'is-level-2',
              block.level === 3 && 'is-level-3',
            )}
            value={block.text}
            textareaRef={registerInputRef}
            onFocus={onFocus}
            onChange={(event) => {
              onTextChange(event.target.value);
            }}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            placeholder={blockPlaceholder(block)}
          />
        ) : (
          <div
            className={cx(
              'docs-editor-textarea-shell',
              block.type === 'callout' && 'is-callout',
              block.type === 'quote' && 'is-quote',
              block.type === 'numbered' && 'is-numbered',
            )}
          >
            {block.type === 'bullet' ? <span className="docs-editor-bullet" /> : null}
            {block.type === 'numbered' ? <span className="docs-editor-numbered">{listMarker}</span> : null}
            {block.type === 'checklist' ? (
              <button
                type="button"
                className={cx('docs-editor-checklist-toggle', block.checked && 'is-checked')}
                onClick={onToggleChecklist}
                aria-label={block.checked ? 'Mark checklist item incomplete' : 'Mark checklist item complete'}
              />
            ) : null}
            <AutoGrowTextarea
              className={cx(
                'docs-editor-input',
                block.type === 'paragraph' && 'docs-editor-input--paragraph',
                block.type === 'bullet' && 'docs-editor-input--bullet',
                block.type === 'numbered' && 'docs-editor-input--numbered',
                block.type === 'checklist' && 'docs-editor-input--checklist',
                block.type === 'quote' && 'docs-editor-input--quote',
                block.type === 'callout' && 'docs-editor-input--callout',
              )}
              value={block.text}
              textareaRef={registerInputRef}
              onFocus={onFocus}
              onChange={(event) => {
                onTextChange(event.target.value);
              }}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              placeholder={blockPlaceholder(block)}
            />
          </div>
        )}

        {showSlashMenu ? (
          <div className="docs-editor-command-menu" role="menu">
            {BLOCK_INSERT_OPTIONS.filter((option) =>
              option.label.toLowerCase().includes(slashQuery.toLowerCase()),
            ).map((option) => (
              <button
                key={`${block.id}-${option.type}-${option.level ?? 'base'}`}
                type="button"
                className="docs-editor-command-menu__item"
                onClick={() => {
                  onSelectInsertType({
                    type: option.type,
                    level: option.level,
                  });
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
                key={`${block.id}-insert-${option.type}-${option.level ?? 'base'}`}
                type="button"
                className="docs-editor-command-menu__item"
                onClick={() => {
                  onSelectInsertType({
                    type: option.type,
                    level: option.level,
                  });
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
  history,
  historyLoading,
  showHistory,
  onToggleHistory,
  onRestoreVersion,
  onOpenTaskContext,
}: {
  document: DocsDocument;
  saveState: SaveState;
  onBack: () => void;
  onDocumentChange: (next: DocsDocument) => void;
  history: DocVersionSummary[];
  historyLoading: boolean;
  showHistory: boolean;
  onToggleHistory: () => void;
  onRestoreVersion: (versionId: string) => void;
  onOpenTaskContext: (context: TaskContextModalState) => void;
}) {
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [selectionAnchorId, setSelectionAnchorId] = useState<string | null>(null);
  const [selectionFocusId, setSelectionFocusId] = useState<string | null>(null);
  const [slashMenu, setSlashMenu] = useState<SlashMenuState | null>(null);
  const [insertMenu, setInsertMenu] = useState<InsertMenuState | null>(null);
  const blockInputRefs = useRef<Map<string, HTMLTextAreaElement | null>>(new Map());

  useEffect(() => {
    setFocusedBlockId(null);
    setHoveredBlockId(null);
    setSelectionAnchorId(null);
    setSelectionFocusId(null);
    setSlashMenu(null);
    setInsertMenu(null);
  }, [document.docId]);

  const registerBlockInputRef = useCallback((blockId: string, node: HTMLTextAreaElement | null) => {
    if (node) {
      blockInputRefs.current.set(blockId, node);
      return;
    }
    blockInputRefs.current.delete(blockId);
  }, []);

  const focusBlock = useCallback((blockId: string | null) => {
    if (!blockId) {
      return;
    }
    requestAnimationFrame(() => {
      blockInputRefs.current.get(blockId)?.focus();
    });
  }, []);

  const selectedBlockIds = useMemo(() => {
    if (!selectionAnchorId || !selectionFocusId) {
      return [] as string[];
    }
    const startIndex = document.blocks.findIndex((block) => block.id === selectionAnchorId);
    const endIndex = document.blocks.findIndex((block) => block.id === selectionFocusId);
    if (startIndex < 0 || endIndex < 0) {
      return [] as string[];
    }
    const lower = Math.min(startIndex, endIndex);
    const upper = Math.max(startIndex, endIndex);
    return document.blocks.slice(lower, upper + 1).map((block) => block.id);
  }, [document.blocks, selectionAnchorId, selectionFocusId]);

  const selectedBlockIdSet = useMemo(() => new Set(selectedBlockIds), [selectedBlockIds]);

  const updateBlock = useCallback(
    (blockId: string, updater: (current: DocsBlock) => DocsBlock) => {
      const next = cloneDoc(document);
      next.blocks = next.blocks.map((block) => (block.id === blockId ? updater(block) : block));
      onDocumentChange(next);
    },
    [document, onDocumentChange],
  );

  const removeBlock = useCallback(
    (blockId: string) => {
      const next = cloneDoc(document);
      const index = next.blocks.findIndex((block) => block.id === blockId);
      if (index < 0) {
        return;
      }
      next.blocks.splice(index, 1);
      if (next.blocks.length === 0) {
        const replacement = createDocsBlock({ type: 'paragraph' });
        next.blocks.push(replacement);
        onDocumentChange(next);
        setFocusedBlockId(replacement.id);
        focusBlock(replacement.id);
      } else {
        const focusCandidate = next.blocks[Math.max(0, index - 1)]?.id ?? next.blocks[0]?.id ?? null;
        onDocumentChange(next);
        setFocusedBlockId(focusCandidate);
        focusBlock(focusCandidate);
      }
      setSlashMenu(null);
      setInsertMenu(null);
      setSelectionAnchorId(null);
      setSelectionFocusId(null);
    },
    [document, focusBlock, onDocumentChange],
  );

  const insertBlockAfter = useCallback(
    (blockId: string, target: BlockInsertTarget) => {
      const next = cloneDoc(document);
      const index = next.blocks.findIndex((block) => block.id === blockId);
      const insertionIndex = index >= 0 ? index + 1 : next.blocks.length;
      const newBlock = createDocsBlock(target);
      next.blocks.splice(insertionIndex, 0, newBlock);
      onDocumentChange(next);
      setFocusedBlockId(newBlock.id);
      setSelectionAnchorId(null);
      setSelectionFocusId(null);
      setSlashMenu(null);
      setInsertMenu(null);
      focusBlock(newBlock.id);
    },
    [document, focusBlock, onDocumentChange],
  );

  const transformBlock = useCallback(
    (blockId: string, target: BlockInsertTarget, nextTextOverride?: string, nextChecked = false) => {
      updateBlock(blockId, (block) => {
        const id = block.id;
        const existingText = 'text' in block ? block.text : '';
        const nextText = nextTextOverride ?? (existingText.trimStart().startsWith('/') ? '' : existingText);
        if (target.type === 'divider') {
          return { id, type: 'divider' };
        }
        if (target.type === 'checklist') {
          return {
            id,
            type: 'checklist',
            text: nextText,
            checked: block.type === 'checklist' ? block.checked : nextChecked,
          };
        }
        if (target.type === 'heading') {
          return {
            id,
            type: 'heading',
            text: nextText,
            level: target.level ?? (block.type === 'heading' ? block.level : 2),
          };
        }
        return {
          id,
          type: target.type,
          text: nextText,
        };
      });
      setSlashMenu(null);
      setInsertMenu(null);
    },
    [updateBlock],
  );

  const applyMarkdownShortcut = useCallback(
    (blockId: string, value: string) => {
      const shortcut = markdownShortcutTarget(value);
      if (!shortcut) {
        return false;
      }
      transformBlock(
        blockId,
        {
          type: shortcut.type,
          level: shortcut.level,
        },
        shortcut.text,
        shortcut.checked === true,
      );
      if (shortcut.insertParagraphAfter) {
        insertBlockAfter(blockId, { type: 'paragraph' });
      } else {
        focusBlock(blockId);
      }
      return true;
    },
    [focusBlock, insertBlockAfter, transformBlock],
  );

  const openTaskContextForBlocks = useCallback(
    (blockIds: string[], mode: 'block' | 'section' | 'checklist', titleOverride?: string | null) => {
      const blocks =
        blockIds.length > 0
          ? blockIds
              .map((blockId) => document.blocks.find((block) => block.id === blockId) ?? null)
              .filter((block): block is DocsBlock => Boolean(block))
          : document.blocks;
      onOpenTaskContext(
        buildTaskContextModalState(document, blocks, {
          anchorBlockId: blockIds[0] ?? null,
          mode,
          titleOverride,
        }),
      );
    },
    [document, onOpenTaskContext],
  );

  const handleRunCurrentContextAsTask = useCallback(() => {
    if (selectedBlockIds.length > 0) {
      const selectedBlocks = selectedBlockIds
        .map((blockId) => document.blocks.find((block) => block.id === blockId) ?? null)
        .filter((block): block is DocsBlock => Boolean(block));
      if (selectedBlocks.length > 0) {
        const mode =
          selectedBlocks.length === 1
            ? selectedBlocks[0]?.type === 'checklist'
              ? 'checklist'
              : 'block'
            : 'section';
        openTaskContextForBlocks(selectedBlockIds, mode);
        return;
      }
    }
    if (focusedBlockId) {
      const { startIndex, endIndex } = getSectionRange(document.blocks, focusedBlockId);
      openTaskContextForBlocks(
        document.blocks.slice(startIndex, endIndex).map((block) => block.id),
        'section',
      );
      return;
    }
    openTaskContextForBlocks(document.blocks.map((block) => block.id), 'section', document.title);
  }, [document.blocks, document.title, focusedBlockId, openTaskContextForBlocks, selectedBlockIds]);

  const handleBlockKeyDown = useCallback(
    (block: DocsBlock, event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (block.type === 'bullet' || block.type === 'numbered' || block.type === 'quote') {
          if (blockText(block).trim().length === 0) {
            transformBlock(block.id, { type: 'paragraph' });
            focusBlock(block.id);
            return;
          }
          insertBlockAfter(block.id, { type: block.type });
          return;
        }
        if (block.type === 'checklist') {
          if (block.text.trim().length === 0) {
            transformBlock(block.id, { type: 'paragraph' });
            focusBlock(block.id);
            return;
          }
          insertBlockAfter(block.id, { type: 'checklist' });
          return;
        }
        insertBlockAfter(block.id, { type: 'paragraph' });
        return;
      }
      if (event.key === 'Backspace' && !event.shiftKey && block.type !== 'divider' && blockText(block).length === 0) {
        event.preventDefault();
        if (block.type !== 'paragraph') {
          transformBlock(block.id, { type: 'paragraph' });
          focusBlock(block.id);
          return;
        }
        removeBlock(block.id);
        return;
      }
      if (event.key === 'Escape') {
        setSlashMenu(null);
        setInsertMenu(null);
      }
    },
    [focusBlock, insertBlockAfter, removeBlock, transformBlock],
  );

  const handleBlockPaste = useCallback(
    (blockId: string, event: ClipboardEvent<HTMLTextAreaElement>) => {
      const pastedText = event.clipboardData.getData('text/plain');
      if (!pastedText.includes('\n')) {
        return;
      }
      event.preventDefault();
      const lines = pastedText
        .split(/\r?\n/)
        .map((line) => line.trimEnd())
        .filter((line) => line.trim().length > 0);
      if (lines.length === 0) {
        return;
      }
      const next = cloneDoc(document);
      const blockIndex = next.blocks.findIndex((block) => block.id === blockId);
      if (blockIndex < 0) {
        return;
      }
      const replacementBlocks = lines.map((line, index) => {
        const shortcut = markdownShortcutTarget(line);
        const nextBlock = createDocsBlock(
          shortcut
            ? { type: shortcut.type, level: shortcut.level }
            : { type: 'paragraph' },
        );
        if (nextBlock.type === 'divider') {
          return nextBlock;
        }
        if (nextBlock.type === 'checklist') {
          return {
            ...nextBlock,
            text: shortcut?.text ?? line,
            checked: shortcut?.checked === true,
          };
        }
        if (nextBlock.type === 'heading') {
          return {
            ...nextBlock,
            text: shortcut?.text ?? line,
            level: shortcut?.level ?? nextBlock.level,
          };
        }
        return {
          ...nextBlock,
          text: shortcut?.text ?? line,
        };
      });
      next.blocks.splice(blockIndex, 1, ...replacementBlocks);
      onDocumentChange(next);
      const focusTarget = replacementBlocks[replacementBlocks.length - 1]?.id ?? null;
      setFocusedBlockId(focusTarget);
      setSelectionAnchorId(null);
      setSelectionFocusId(null);
      setSlashMenu(null);
      setInsertMenu(null);
      focusBlock(focusTarget);
    },
    [document, focusBlock, onDocumentChange],
  );

  const selectionLabel =
    selectedBlockIds.length > 0
      ? `${selectedBlockIds.length} block${selectedBlockIds.length === 1 ? '' : 's'} selected`
      : focusedBlockId
        ? 'Current section ready'
        : 'Whole page ready';
  const taskActionLabel =
    selectedBlockIds.length > 0 ? 'Run selection as task' : focusedBlockId ? 'Run section as task' : 'Run page as task';
  const saveStateLabel =
    saveState === 'saving' ? 'Saving…' : saveState === 'error' ? 'Save failed' : saveState === 'saved' ? 'Saved' : 'Saved';
  const privacyLabel = document.shared ? 'Shared' : 'Private';

  return (
    <section className="docs-editor" aria-label="Docs editor">
      <header className="docs-editor__topbar">
        <div className="docs-editor__topbar-leading">
          <button type="button" className="docs-editor__back" onClick={onBack} aria-label="Back to Docs">
            <ChevronLeftIcon className="glyph-16" />
          </button>
        </div>

        <div className="docs-editor__topbar-heading">
          <div className="docs-editor__crumbs">
            <span>{document.title || 'Untitled'}</span>
          </div>
          <div className="docs-editor__topbar-meta">
            <small>{privacyLabel}</small>
            <span className="docs-editor__status">{`Edited ${document.recentLabel}`}</span>
          </div>
        </div>

        <div className="docs-editor__actions">
          <button type="button" className="docs-editor__action" onClick={onToggleHistory}>
            <RowsIcon className="glyph-14" />
            <span>Version history</span>
          </button>
          <button type="button" className="docs-editor__action docs-editor__action--task" onClick={handleRunCurrentContextAsTask}>
            <PlanPlusIcon className="glyph-14" />
            <span>{taskActionLabel}</span>
          </button>
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

      <div className="docs-editor__viewport">
        <div className="docs-editor__scroller">
          <article className="docs-editor__canvas">
            <AutoGrowTextarea
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
              <span>{document.breadcrumbs.join(' / ')}</span>
              <span>{document.ownerLabel}</span>
              <span>{saveStateLabel}</span>
            </div>

            {selectedBlockIds.length > 0 ? (
              <div className="docs-editor__selection-banner" role="status" aria-live="polite">
                <span>{selectionLabel}</span>
                <button
                  type="button"
                  className="docs-editor__selection-clear"
                  onClick={() => {
                    setSelectionAnchorId(null);
                    setSelectionFocusId(null);
                  }}
                >
                  Clear selection
                </button>
              </div>
            ) : null}

            <div className="docs-editor__blocks">
              {document.blocks.map((block, index) => {
                const showChrome =
                  hoveredBlockId === block.id ||
                  focusedBlockId === block.id ||
                  selectedBlockIdSet.has(block.id) ||
                  slashMenu?.blockId === block.id ||
                  insertMenu?.blockId === block.id;
                const listMarker = numberedMarkerForBlock(document.blocks, index);

                return (
                  <EditorBlockRow
                    key={block.id}
                    block={block}
                    focused={focusedBlockId === block.id}
                    selected={selectedBlockIdSet.has(block.id)}
                    showChrome={showChrome}
                    listMarker={listMarker}
                    showSlashMenu={slashMenu?.blockId === block.id}
                    slashQuery={slashMenu?.blockId === block.id ? slashMenu.query : ''}
                    showInsertMenu={insertMenu?.blockId === block.id}
                    onFocus={() => {
                      setFocusedBlockId(block.id);
                      setSelectionAnchorId(null);
                      setSelectionFocusId(null);
                      setInsertMenu(null);
                    }}
                    onSelectBlock={(extend) => {
                      setFocusedBlockId(block.id);
                      setInsertMenu(null);
                      setSlashMenu(null);
                      if (extend && selectionAnchorId) {
                        setSelectionFocusId(block.id);
                        return;
                      }
                      setSelectionAnchorId(block.id);
                      setSelectionFocusId(block.id);
                    }}
                    onHoverStart={() => {
                      setHoveredBlockId(block.id);
                    }}
                    onHoverEnd={() => {
                      setHoveredBlockId((current) => (current === block.id ? null : current));
                    }}
                    onTextChange={(value) => {
                      if (applyMarkdownShortcut(block.id, value)) {
                        return;
                      }
                      updateBlock(block.id, (current) => ('text' in current ? { ...current, text: value } : current));
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
                      handleBlockKeyDown(block, event);
                    }}
                    onPaste={(event) => {
                      handleBlockPaste(block.id, event);
                    }}
                    onToggleChecklist={() => {
                      updateBlock(block.id, (current) =>
                        current.type === 'checklist' ? { ...current, checked: !current.checked } : current,
                      );
                    }}
                    onOpenInsertMenu={() => {
                      setFocusedBlockId(block.id);
                      setInsertMenu((current) => (current?.blockId === block.id ? null : { blockId: block.id }));
                      setSlashMenu(null);
                    }}
                    onSelectInsertType={(type) => {
                      if (slashMenu?.blockId === block.id) {
                        transformBlock(block.id, type);
                        focusBlock(block.id);
                        return;
                      }
                      insertBlockAfter(block.id, type);
                    }}
                    onRunAsTask={() => {
                      openTaskContextForBlocks([block.id], block.type === 'checklist' ? 'checklist' : 'block');
                    }}
                    registerInputRef={(node) => {
                      registerBlockInputRef(block.id, node);
                    }}
                  />
                );
              })}
            </div>
          </article>
        </div>

        {showHistory ? (
          <div className="docs-history-sheet" aria-label="Version history">
            <button type="button" className="docs-history-sheet__scrim" aria-label="Close version history" onClick={onToggleHistory} />
            <aside className="docs-history-panel">
              <header className="docs-history-panel__header">
                <div>
                  <p>History</p>
                  <h3>Versions</h3>
                </div>
                <button type="button" className="docs-editor__icon" aria-label="Close version history" onClick={onToggleHistory}>
                  <ChevronLeftIcon className="glyph-14" />
                </button>
              </header>
              {historyLoading ? <p className="docs-sidebar__empty workspace-sidebar__empty">Loading versions…</p> : null}
              {!historyLoading && history.length === 0 ? (
                <p className="docs-sidebar__empty workspace-sidebar__empty">No saved versions yet.</p>
              ) : null}
              <div className="docs-history-panel__list">
                {history.map((version) => (
                  <article key={version.versionId} className="docs-history-panel__item">
                    <div>
                      <strong>{version.label}</strong>
                      <small>{new Date(version.createdAt).toLocaleString()}</small>
                      <p>{version.preview || 'No preview available.'}</p>
                      {version.sourceTaskId ? <span className="docs-history-panel__badge">Task write-back</span> : null}
                    </div>
                    <button type="button" className="tasks-soft-button" onClick={() => onRestoreVersion(version.versionId)}>
                      Restore
                    </button>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function DocsWorkspace({
  sidebar,
  onCreateTaskFromContext,
  creatingContextTask,
  openDocumentRequest,
  onOpenDocumentRequestHandled,
}: {
  sidebar: ReactNode;
  onCreateTaskFromContext: (input: TaskCreateFromContextInput) => void;
  creatingContextTask: boolean;
  openDocumentRequest: { docId: string; token: number } | null;
  onOpenDocumentRequestHandled: () => void;
}) {
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
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<DocVersionSummary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [taskContextModal, setTaskContextModal] = useState<TaskContextModalState | null>(null);
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

  const fetchHistory = useCallback(async (docId: string) => {
    setHistoryLoading(true);
    try {
      const next = await granolaClient.docsGetHistory(docId);
      setHistory(next);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const openDocument = useCallback(async (docId: string) => {
    setDocumentLoading(true);
    try {
      const next = await granolaClient.docsGetDocument(docId);
      setActiveDocument(next);
      setDocumentError(null);
      setSaveState('idle');
      setShowHistory(false);
      setHistory([]);
      lastSavedEditableRef.current = serializeEditableDoc(next);
    } catch (error) {
      setDocumentError(error instanceof Error ? error.message : 'Unable to open document.');
      setActiveDocument(null);
    } finally {
      setDocumentLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!openDocumentRequest?.docId) {
      return;
    }
    void openDocument(openDocumentRequest.docId).finally(() => {
      onOpenDocumentRequestHandled();
    });
  }, [onOpenDocumentRequestHandled, openDocument, openDocumentRequest]);

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
                history={history}
                historyLoading={historyLoading}
                showHistory={showHistory}
                onToggleHistory={() => {
                  if (!activeDocument) {
                    return;
                  }
                  const next = !showHistory;
                  setShowHistory(next);
                  if (next) {
                    void fetchHistory(activeDocument.docId);
                  }
                }}
                onRestoreVersion={(versionId) => {
                  void granolaClient.docsRestoreVersion(activeDocument.docId, versionId).then((restored) => {
                    setActiveDocument(restored);
                    lastSavedEditableRef.current = serializeEditableDoc(restored);
                    setHome((current) => upsertHomeDocument(current, restored));
                    void fetchHistory(restored.docId);
                  });
                }}
                onOpenTaskContext={setTaskContextModal}
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
                            <span className="docs-table__title">{document.title}</span>
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
      {taskContextModal && activeDocument ? (
        <div className="context-task-modal__scrim" role="presentation">
          <div className="context-task-modal" role="dialog" aria-modal="true" aria-label="Run doc context as task">
            <header className="context-task-modal__header">
              <div>
                <p className="context-task-modal__eyebrow">Doc context</p>
                <h3>Run as task</h3>
              </div>
              <button
                type="button"
                className="docs-editor__icon"
                aria-label="Close run as task dialog"
                onClick={() => {
                  setTaskContextModal(null);
                }}
              >
                <ChevronLeftIcon className="glyph-14" />
              </button>
            </header>
            <label className="context-task-modal__field">
              <span>Task title</span>
              <input
                value={taskContextModal.title}
                onChange={(event) => {
                  setTaskContextModal((current) => (current ? { ...current, title: event.target.value } : current));
                }}
              />
            </label>
            <p className="context-task-modal__summary">{taskContextModal.objective}</p>
            <div className="context-task-modal__stats">
              {taskContextModal.stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
            <pre className="context-task-modal__excerpt">{taskContextModal.excerpt}</pre>
            <div className="context-task-modal__actions">
              <button
                type="button"
                className="tasks-soft-button"
                onClick={() => {
                  setTaskContextModal(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="tasks-primary-button"
                disabled={creatingContextTask || taskContextModal.title.trim().length === 0}
                onClick={() => {
                  onCreateTaskFromContext({
                    origin: 'doc_selection',
                    title: taskContextModal.title,
                    objective: taskContextModal.objective,
                    docSelection: {
                      docId: activeDocument.docId,
                      blockId: taskContextModal.anchorBlockId,
                      blockIds: taskContextModal.blockIds,
                      mode: taskContextModal.mode,
                    },
                    writeback: {
                      docId: activeDocument.docId,
                      docTitle: activeDocument.title,
                      docSectionHeading: taskContextModal.sectionHeading,
                    },
                  });
                  setTaskContextModal(null);
                }}
              >
                {creatingContextTask ? 'Creating…' : 'Create task'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
