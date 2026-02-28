// @vitest-environment node

import { describe, expect, it } from 'vitest';
import {
  buildTodoExtractionPrompt,
  createMeetingSourceHash,
  createTodoFingerprint,
  parseExtractedTodos,
} from '../../../../packages/granola-pipeline/src/todo-extractor.js';

describe('todo extractor', () => {
  it('parses strict JSON payloads', () => {
    const todos = parseExtractedTodos(
      JSON.stringify({
        todos: [
          {
            title: 'Send proposal',
            description: 'Draft and send proposal email',
            owner: 'Motasim',
            due_date: 'Tomorrow',
            priority: 'high',
          },
        ],
      }),
    );

    expect(todos).toHaveLength(1);
    expect(todos[0]?.title).toBe('Send proposal');
    expect(todos[0]?.priority).toBe('high');
  });

  it('parses JSON wrapped in code fences and normalizes values', () => {
    const todos = parseExtractedTodos(`\n\`\`\`json\n{"todos":[{"task":"Review notes","priority":"critical","owner":"","deadline":"Friday"}]}\n\`\`\``);

    expect(todos).toHaveLength(1);
    expect(todos[0]?.title).toBe('Review notes');
    expect(todos[0]?.priority).toBe('urgent');
    expect(todos[0]?.owner).toBeNull();
    expect(todos[0]?.dueDate).toBe('Friday');
  });

  it('returns empty array when payload is invalid', () => {
    const todos = parseExtractedTodos('no json in this answer');
    expect(todos).toEqual([]);
  });

  it('dedupes duplicated todos', () => {
    const todos = parseExtractedTodos(
      JSON.stringify({
        todos: [
          { title: 'Prepare report', description: 'Compile report', owner: 'Me', due_date: 'Mon' },
          { title: 'Prepare report', description: 'Compile report', owner: 'Me', due_date: 'Mon' },
        ],
      }),
    );

    expect(todos).toHaveLength(1);
  });

  it('builds deterministic prompt/hash/fingerprint helpers', () => {
    const meeting = {
      id: 'meeting-1',
      title: 'Weekly Sync',
      date: '2026-02-27',
      attendees: [],
      notes: 'Notes',
      enhancedNotes: 'Enhanced',
      privateNotes: null,
      transcript: null,
      raw: null,
    };

    const prompt = buildTodoExtractionPrompt(meeting);
    const hashA = createMeetingSourceHash(meeting);
    const hashB = createMeetingSourceHash(meeting);

    const fingerprintA = createTodoFingerprint({
      meetingId: meeting.id,
      title: 'Task',
      description: 'Description',
      owner: 'Me',
      dueDate: 'Tomorrow',
    });
    const fingerprintB = createTodoFingerprint({
      meetingId: meeting.id,
      title: 'Task',
      description: 'Description',
      owner: 'Me',
      dueDate: 'Tomorrow',
    });

    expect(prompt).toContain('Meeting ID: meeting-1');
    expect(hashA).toBe(hashB);
    expect(fingerprintA).toBe(fingerprintB);
  });
});
