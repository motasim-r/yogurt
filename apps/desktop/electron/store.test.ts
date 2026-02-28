// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { InMemoryGranolaService } from './store.js';

describe('InMemoryGranolaService', () => {
  it('lists notes in descending update order', () => {
    const service = new InMemoryGranolaService();
    const notes = service.listNotes();

    expect(notes.length).toBeGreaterThan(0);
    expect(notes[0].updatedAt >= notes[1].updatedAt).toBe(true);
  });

  it('updates a note and returns refreshed values', () => {
    const service = new InMemoryGranolaService();
    const first = service.listNotes()[0];

    const updated = service.updateNote(first.id, {
      title: 'Updated title',
      body: 'Updated body',
      tags: ['Updated', 'Internal'],
      status: 'draft',
    });

    expect(updated.title).toBe('Updated title');
    expect(updated.body).toBe('Updated body');
    expect(updated.tags).toEqual(['Updated', 'Internal']);
    expect(updated.status).toBe('draft');
  });

  it('rejects invalid note patch payloads', () => {
    const service = new InMemoryGranolaService();
    const first = service.listNotes()[0];

    expect(() => service.updateNote(first.id, { title: '' })).toThrowError(
      /non-empty string/i,
    );
    expect(() => service.updateNote(first.id, { unknown: true })).toThrowError(
      /unsupported note patch key/i,
    );
  });

  it('rejects invalid settings patch payloads', () => {
    const service = new InMemoryGranolaService();

    expect(() => service.updateSettings({ theme: 'dark' })).toThrowError(/theme/i);
    expect(() => service.updateSettings({ autoStart: 'yes' })).toThrowError(/boolean/i);
  });
});
