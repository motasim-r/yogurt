import type { DocsBlock, DocsHeadingLevel } from './types.js';

export type DocsBlockSeed =
  | {
      type: 'heading';
      text: string;
      level: DocsHeadingLevel;
    }
  | {
      type: 'paragraph' | 'bullet' | 'numbered' | 'quote' | 'callout';
      text: string;
    }
  | {
      type: 'checklist';
      text: string;
      checked: boolean;
    }
  | {
      type: 'divider';
    };

function collapseWhitespace(value: string): string {
  return value.replace(/[ \t]+/g, ' ').trim();
}

function splitTrailingContext(value: string): { body: string; context: string | null } {
  const match = value.match(/^(.*?)(?:\s+Context sources:\s+(.+))$/i);
  if (!match) {
    return {
      body: value.trim(),
      context: null,
    };
  }
  return {
    body: match[1].trim(),
    context: `Context sources: ${match[2].trim()}`,
  };
}

function splitInlineBulletItems(value: string): string[] {
  const content = value.replace(/^\s*[-*+]\s+/, '').trim();
  if (!content) {
    return [];
  }
  const parts = content
    .split(/\s+-\s+(?=(?:\*\*|__|`|[A-Z0-9]))/g)
    .map((item) => item.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [content];
}

function splitInlineNumberedItems(value: string): string[] {
  const content = value.trim();
  if (!content) {
    return [];
  }
  const parts = content
    .split(/\s+(?=\d+\.\s+)/g)
    .map((item) => item.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [content];
}

function makeHeading(text: string, level: DocsHeadingLevel = 2): DocsBlockSeed {
  return {
    type: 'heading',
    text: stripInlineMarkdown(text),
    level,
  };
}

function makeParagraph(text: string): DocsBlockSeed {
  return {
    type: 'paragraph',
    text: stripInlineMarkdown(text),
  };
}

function makeCallout(text: string): DocsBlockSeed {
  return {
    type: 'callout',
    text: stripInlineMarkdown(text),
  };
}

function parseStructuredParagraph(value: string): DocsBlockSeed[] | null {
  const trimmed = collapseWhitespace(value);
  if (!trimmed) {
    return null;
  }

  const boldHeadingOnly = trimmed.match(/^(?:\*\*|__)(.+?)(?:\*\*|__)$/);
  if (boldHeadingOnly) {
    return [makeHeading(boldHeadingOnly[1], 2)];
  }

  const boldHeadingWithBody = trimmed.match(/^(?:\*\*|__)(.+?)(?:\*\*|__)\s+(.+)$/);
  if (!boldHeadingWithBody) {
    return null;
  }

  const [, title, rawBody] = boldHeadingWithBody;
  const { body, context } = splitTrailingContext(rawBody);
  const blocks: DocsBlockSeed[] = [makeHeading(title, 2)];

  if (/^\d+\.\s+/.test(body)) {
    const items = splitInlineNumberedItems(body);
    for (const item of items) {
      blocks.push({
        type: 'numbered',
        text: stripInlineMarkdown(item.replace(/^\d+\.\s+/, '')),
      });
    }
  } else if (/^[-*+]\s+/.test(body)) {
    const items = splitInlineBulletItems(body);
    for (const item of items) {
      blocks.push({
        type: 'bullet',
        text: stripInlineMarkdown(item),
      });
    }
  } else if (body) {
    blocks.push(makeParagraph(body));
  }

  if (context) {
    blocks.push(makeCallout(context));
  }
  return blocks;
}

export function looksMarkdownish(value: string): boolean {
  return /(^\s{0,3}(?:#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+|(?:[-*+]\s+)?\[[ xX]\]\s+)|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)]+\)|^\s*(?:---|\*\*\*|___)\s*$)/m.test(
    value,
  );
}

export function stripInlineMarkdown(value: string): string {
  let output = value;
  output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt: string) => alt || '');
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  output = output.replace(/`([^`]+)`/g, '$1');

  for (let pass = 0; pass < 4; pass += 1) {
    const before = output;
    output = output
      .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
      .replace(/___([^_]+)___/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*\n]+)\*/g, '$1')
      .replace(/_([^_\n]+)_/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1');
    if (output === before) {
      break;
    }
  }

  output = output.replace(/\\([\\`*_{}\[\]()#+\-.!>])/g, '$1');
  return output.replace(/\s+/g, ' ').trim();
}

export function markdownToDocsBlockSeeds(markdown: string): DocsBlockSeed[] {
  const normalized = markdown.replace(/\r\n?/g, '\n').trim();
  if (!normalized) {
    return [];
  }

  const blocks: DocsBlockSeed[] = [];
  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }
    const text = collapseWhitespace(paragraphLines.join(' '));
    paragraphLines = [];
    if (!text) {
      return;
    }
    const structured = parseStructuredParagraph(text);
    if (structured) {
      blocks.push(...structured);
      return;
    }
    if (/^context sources:/i.test(stripInlineMarkdown(text))) {
      blocks.push(makeCallout(text));
      return;
    }
    blocks.push(makeParagraph(text));
  };

  for (const rawLine of normalized.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }

    if (/^([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      flushParagraph();
      blocks.push({ type: 'divider' });
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      const [, hashes, text] = headingMatch;
      const level = Math.min(hashes.length, 3) as DocsHeadingLevel;
      blocks.push(makeHeading(text, level));
      continue;
    }

    const quoteMatch = line.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      blocks.push({
        type: 'quote',
        text: stripInlineMarkdown(quoteMatch[1]),
      });
      continue;
    }

    const checklistMatch = line.match(/^(?:[-*+]\s+)?\[( |x|X)\]\s+(.+)$/);
    if (checklistMatch) {
      flushParagraph();
      blocks.push({
        type: 'checklist',
        checked: checklistMatch[1].toLowerCase() === 'x',
        text: stripInlineMarkdown(checklistMatch[2]),
      });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      const { body, context } = splitTrailingContext(line);
      for (const item of splitInlineNumberedItems(body)) {
        blocks.push({
          type: 'numbered',
          text: stripInlineMarkdown(item.replace(/^\d+\.\s+/, '')),
        });
      }
      if (context) {
        blocks.push(makeCallout(context));
      }
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      flushParagraph();
      const { body, context } = splitTrailingContext(line);
      for (const item of splitInlineBulletItems(body)) {
        blocks.push({
          type: 'bullet',
          text: stripInlineMarkdown(item),
        });
      }
      if (context) {
        blocks.push(makeCallout(context));
      }
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  return blocks.length > 0 ? blocks : [makeParagraph(normalized)];
}

export function blockSeedFromExistingBlock(block: DocsBlock): DocsBlockSeed[] {
  if (block.type === 'divider') {
    return [{ type: 'divider' }];
  }
  if (block.type === 'heading') {
    return [makeHeading(block.text, block.level)];
  }
  if (block.type === 'checklist') {
    return [
      {
        type: 'checklist',
        text: stripInlineMarkdown(block.text),
        checked: block.checked,
      },
    ];
  }
  if (block.type === 'paragraph' && looksMarkdownish(block.text)) {
    return markdownToDocsBlockSeeds(block.text);
  }
  return [
    {
      type: block.type,
      text: stripInlineMarkdown(block.text),
    },
  ];
}
