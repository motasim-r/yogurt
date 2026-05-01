// @vitest-environment node

import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { GranolaDocsService } from './granola-docs-service.js';

const tempDirs: string[] = [];

async function makeTempDir(): Promise<string> {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'granola-docs-service-'));
  tempDirs.push(temp);
  return temp;
}

afterEach(async () => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      await rm(dir, { recursive: true, force: true });
    }
  }
});

describe('GranolaDocsService', () => {
  it('seeds the docs workspace on first load', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaDocsService(dataDir);

    await service.init();
    const home = await service.docsGetHome();

    expect(home.workspaceTitle).toBe('Docs');
    expect(home.documents.length).toBeGreaterThanOrEqual(5);
    expect(home.sections.find((section) => section.id === 'wiki')?.itemCount).toBeGreaterThan(0);
    expect(home.quickActions.map((item) => item.label)).toEqual(['New', 'Upload', 'Templates']);
  });

  it('creates blank docs and template docs', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaDocsService(dataDir);

    await service.init();
    const blank = await service.docsCreate();
    const fromTemplate = await service.docsCreate({ templateId: 'template-weekly-brief' });

    expect(blank.title).toBe('Untitled document');
    expect(blank.blocks).toHaveLength(1);
    expect(fromTemplate.title).toBe('Weekly Brief');
    expect(fromTemplate.section).toBe('drive');
    expect(fromTemplate.blocks.length).toBeGreaterThan(1);

    const home = await service.docsGetHome();
    expect(home.documents.some((document) => document.docId === blank.docId)).toBe(true);
    expect(home.documents.some((document) => document.docId === fromTemplate.docId)).toBe(true);
  });

  it('updates documents and persists changes across restarts', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaDocsService(dataDir);

    await service.init();
    const created = await service.docsCreate({ section: 'wiki' });
    const updated = await service.docsUpdate(created.docId, {
      title: 'Launch wiki page',
      favorite: true,
      pinned: true,
      blocks: [
        {
          id: 'heading-1',
          type: 'heading',
          text: 'Launch narrative',
          level: 2,
        },
        {
          id: 'check-1',
          type: 'checklist',
          text: 'Share the revised story',
          checked: true,
        },
      ],
    });

    expect(updated.title).toBe('Launch wiki page');
    expect(updated.favorite).toBe(true);
    expect(updated.pinned).toBe(true);
    expect(updated.preview).toContain('Launch narrative');
    expect(updated.blocks).toHaveLength(2);

    const secondService = new GranolaDocsService(dataDir);
    await secondService.init();
    const reloaded = await secondService.docsGetDocument(created.docId);

    expect(reloaded.title).toBe('Launch wiki page');
    expect(reloaded.favorite).toBe(true);
    expect(reloaded.pinned).toBe(true);
    expect(reloaded.blocks[1]).toMatchObject({
      type: 'checklist',
      text: 'Share the revised story',
      checked: true,
    });
  });

  it('converts markdown task write-back into clean docs blocks', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaDocsService(dataDir);

    await service.init();
    const result = await service.docsApplyTaskWriteback({
      taskTitle: 'Charity outreach',
      content: [
        '## Outreach summary',
        '',
        'I used the finalized **Partnership Inquiry** draft and sent it to `info@brac.net`.',
        '',
        '- **Sent to BRAC:** `info@brac.net`',
        '- **Sent to CARE Bangladesh:** `bgd.info@care.org`',
        '',
        '**Suggested next steps**',
        '1. Send the donation wave',
        '2. Add follow-up reminders',
        '',
        'Context sources:',
        '- Meeting · New note',
      ].join('\n'),
      sourceTaskId: 'todo-1',
      sourcePacketId: 'packet-1',
    });

    expect(result.document.blocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'heading', text: 'Outreach summary' }),
        expect.objectContaining({
          type: 'paragraph',
          text: 'I used the finalized Partnership Inquiry draft and sent it to info@brac.net.',
        }),
        expect.objectContaining({ type: 'bullet', text: 'Sent to BRAC: info@brac.net' }),
        expect.objectContaining({ type: 'bullet', text: 'Sent to CARE Bangladesh: bgd.info@care.org' }),
        expect.objectContaining({ type: 'heading', text: 'Suggested next steps' }),
        expect.objectContaining({ type: 'numbered', text: 'Send the donation wave' }),
        expect.objectContaining({ type: 'numbered', text: 'Add follow-up reminders' }),
        expect.objectContaining({ type: 'callout', text: 'Context sources:' }),
      ]),
    );
    const textBlocks = result.document.blocks.filter((block) => 'text' in block);
    expect(textBlocks.every((block) => !block.text.includes('**') && !block.text.includes('`'))).toBe(true);
  });

  it('cleans previously written markdown paragraphs when appending another task update', async () => {
    const dataDir = await makeTempDir();
    const service = new GranolaDocsService(dataDir);

    await service.init();
    const doc = await service.docsCreate({ section: 'drive' });
    await service.docsUpdate(doc.docId, {
      blocks: [
        {
          id: 'legacy-heading',
          type: 'heading',
          text: 'Task update',
          level: 2,
        },
        {
          id: 'legacy-paragraph',
          type: 'paragraph',
          text: '**Suggested next steps** 1. Send outreach 2. Add reminders',
        },
      ],
    });

    const result = await service.docsApplyTaskWriteback({
      taskTitle: 'Charity outreach',
      docId: doc.docId,
      content: 'Done — outreach sent.',
      sourceTaskId: 'todo-2',
      sourcePacketId: 'packet-2',
    });

    expect(result.document.blocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'heading', text: 'Suggested next steps' }),
        expect.objectContaining({ type: 'numbered', text: 'Send outreach' }),
        expect.objectContaining({ type: 'numbered', text: 'Add reminders' }),
      ]),
    );
    const textBlocks = result.document.blocks.filter((block) => 'text' in block);
    expect(textBlocks.every((block) => !block.text.includes('**'))).toBe(true);
  });
});
