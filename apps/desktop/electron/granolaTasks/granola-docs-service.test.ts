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
});
