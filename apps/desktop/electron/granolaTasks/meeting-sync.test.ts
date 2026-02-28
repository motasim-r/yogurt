// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import {
  loadMeetingsWithClient,
  queryGranolaMeetings,
} from '../../../../packages/granola-pipeline/src/meeting-sync.js';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

interface ToolCall {
  name: string;
  arguments?: Record<string, unknown>;
}

function makeMeeting(id: string, data: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    meeting_id: id,
    title: `Meeting ${id}`,
    notes: null,
    ...data,
  };
}

function textResult(payload: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(payload),
      },
    ],
  };
}

describe('meeting-sync', () => {
  it('uses document_ids in query args when tool schema supports it', async () => {
    const callTool = vi.fn(async ({ name }: ToolCall) => {
      if (name === 'query_granola_meetings') {
        return textResult({ answer: 'ok' });
      }
      throw new Error(`unexpected tool: ${name}`);
    });

    const client = {
      listTools: vi.fn(async () => ({
        tools: [
          {
            name: 'query_granola_meetings',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                document_ids: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        ],
      })),
      callTool,
    } as unknown as Client;

    await queryGranolaMeetings(client, 'Find todos', ['m-1', 'm-2']);

    expect(callTool).toHaveBeenCalledTimes(1);
    expect((callTool.mock.calls[0]?.[0] as ToolCall | undefined)?.arguments?.document_ids).toEqual(['m-1', 'm-2']);
  });

  it('caps get_meetings batch size at 10 ids per sync', async () => {
    const meetings = Array.from({ length: 14 }, (_, index) => makeMeeting(`m-${index + 1}`));

    const callTool = vi.fn(async ({ name }: ToolCall) => {
      if (name === 'list_meetings') {
        return textResult({ meetings });
      }
      if (name === 'get_meetings') {
        return textResult({ meetings: [] });
      }
      throw new Error(`unexpected tool: ${name}`);
    });

    const client = {
      listTools: vi.fn(async () => ({
        tools: [
          {
            name: 'list_meetings',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_meetings',
            inputSchema: {
              type: 'object',
              properties: {
                meeting_ids: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        ],
      })),
      callTool,
    } as unknown as Client;

    await loadMeetingsWithClient(client, {
      maxGetMeetingsPerSync: 10,
    });

    const getMeetingsCall = callTool.mock.calls.find((call) => call?.[0]?.name === 'get_meetings');
    expect(getMeetingsCall).toBeTruthy();
    const getMeetingsArgs = (getMeetingsCall?.[0] as ToolCall | undefined)?.arguments as
      | { meeting_ids?: string[] }
      | undefined;
    expect(getMeetingsArgs?.meeting_ids).toHaveLength(10);
  });

  it('applies hybrid transcript policy only to sparse meetings and max one per run', async () => {
    const callTool = vi.fn(async ({ name }: ToolCall) => {
      if (name === 'list_meetings') {
        return textResult({
          meetings: [
            makeMeeting('m-rich', { notes: 'has notes' }),
            makeMeeting('m-sparse-1', { notes: null }),
            makeMeeting('m-sparse-2', { notes: null }),
          ],
        });
      }
      if (name === 'get_meetings') {
        return textResult({ meetings: [] });
      }
      if (name === 'get_meeting_transcript') {
        return textResult({ transcript: 'captured transcript' });
      }
      throw new Error(`unexpected tool: ${name}`);
    });

    const client = {
      listTools: vi.fn(async () => ({
        tools: [
          { name: 'list_meetings', inputSchema: { type: 'object', properties: {} } },
          {
            name: 'get_meetings',
            inputSchema: {
              type: 'object',
              properties: { meeting_ids: { type: 'array', items: { type: 'string' } } },
            },
          },
          {
            name: 'get_meeting_transcript',
            inputSchema: {
              type: 'object',
              properties: { meeting_id: { type: 'string' } },
            },
          },
        ],
      })),
      callTool,
    } as unknown as Client;

    await loadMeetingsWithClient(client, {
      transcriptPolicy: 'hybrid',
      maxTranscriptFetchPerSync: 1,
    });

    const transcriptCalls = callTool.mock.calls.filter((call) => call?.[0]?.name === 'get_meeting_transcript');
    expect(transcriptCalls).toHaveLength(1);
    const transcriptArg = (transcriptCalls[0]?.[0] as ToolCall | undefined)?.arguments?.meeting_id;
    expect(transcriptArg).toMatch(/^m-sparse-/);
  });

  it('returns compact deduped warnings instead of per-meeting warning flood', async () => {
    const callTool = vi.fn(async ({ name }: ToolCall) => {
      if (name === 'list_meetings') {
        return textResult({
          meetings: [
            makeMeeting('m-1', { notes: null }),
            makeMeeting('m-2', { notes: null }),
          ],
        });
      }
      if (name === 'get_meetings') {
        throw new Error('Granola rate limit while calling get_meetings.');
      }
      if (name === 'get_meeting_transcript') {
        throw new Error('Granola rate limit while calling get_meeting_transcript.');
      }
      throw new Error(`unexpected tool: ${name}`);
    });

    const client = {
      listTools: vi.fn(async () => ({
        tools: [
          { name: 'list_meetings', inputSchema: { type: 'object', properties: {} } },
          { name: 'get_meetings', inputSchema: { type: 'object', properties: { meeting_ids: { type: 'array' } } } },
          {
            name: 'get_meeting_transcript',
            inputSchema: { type: 'object', properties: { meeting_id: { type: 'string' } } },
          },
        ],
      })),
      callTool,
    } as unknown as Client;

    const result = await loadMeetingsWithClient(client, {
      transcriptPolicy: 'hybrid',
      maxTranscriptFetchPerSync: 1,
    });

    expect(result.warnings.length).toBeLessThanOrEqual(3);
    expect(new Set(result.warnings).size).toBe(result.warnings.length);
  });
});
