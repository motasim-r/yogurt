// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { parseIronclawEventLine } from './ironclaw-runtime.js';

describe('parseIronclawEventLine', () => {
  it('prefers assistant delta while keeping snapshot when both are present', () => {
    const line = JSON.stringify({
      event: 'agent',
      stream: 'assistant',
      runId: 'run-1',
      data: {
        delta: ' world',
        text: 'hello world',
      },
    });

    const parsed = parseIronclawEventLine(line, null);
    expect(parsed.runId).toBe('run-1');
    expect(parsed.events).toHaveLength(1);
    expect(parsed.events[0]).toMatchObject({
      kind: 'delta',
      message: ' world',
      delta: ' world',
      snapshot: 'hello world',
    });
  });

  it('maps thinking stream events to thinking kind', () => {
    const line = JSON.stringify({
      event: 'agent',
      stream: 'thinking',
      runId: 'run-2',
      data: {
        delta: 'Planning the next step',
      },
    });

    const parsed = parseIronclawEventLine(line, null);
    expect(parsed.events).toHaveLength(1);
    expect(parsed.events[0]).toMatchObject({
      kind: 'thinking',
      message: 'Planning the next step',
      delta: 'Planning the next step',
    });
  });

  it('maps tool stream events with structured tool payload', () => {
    const line = JSON.stringify({
      event: 'agent',
      stream: 'tool',
      runId: 'run-3',
      data: {
        phase: 'result',
        name: 'web_fetch',
        toolCallId: 'tool-1',
        args: { targetUrl: 'https://example.com' },
        meta: { status: 200 },
        isError: false,
      },
    });

    const parsed = parseIronclawEventLine(line, null);
    expect(parsed.events).toHaveLength(1);
    expect(parsed.events[0]?.kind).toBe('tool');
    expect(parsed.events[0]?.tool).toMatchObject({
      phase: 'result',
      name: 'web_fetch',
      toolCallId: 'tool-1',
      isError: false,
    });
  });

  it('maps result events to completion result and terminal event', () => {
    const line = JSON.stringify({
      event: 'result',
      runId: 'run-4',
      status: 'ok',
      summary: 'completed',
      result: {
        payloads: [{ text: 'final answer' }],
      },
    });

    const parsed = parseIronclawEventLine(line, 'run-4');
    expect(parsed.finalResult).toMatchObject({
      ok: true,
      runId: 'run-4',
      summary: 'completed',
      finalText: 'final answer',
    });
    expect(parsed.events[0]).toMatchObject({
      kind: 'completed',
      finalText: 'final answer',
    });
  });

  it('maps chat delta events to assistant snapshot deltas', () => {
    const line = JSON.stringify({
      event: 'chat',
      state: 'delta',
      runId: 'run-5',
      message: {
        role: 'assistant',
        content: [{ type: 'text', text: 'hello there' }],
      },
    });

    const parsed = parseIronclawEventLine(line, null);
    expect(parsed.events).toHaveLength(1);
    expect(parsed.events[0]).toMatchObject({
      kind: 'delta',
      message: 'hello there',
      snapshot: 'hello there',
    });
  });

  it('maps chat final events and surfaces final text', () => {
    const line = JSON.stringify({
      event: 'chat',
      state: 'final',
      runId: 'run-6',
      message: {
        role: 'assistant',
        content: [{ type: 'text', text: 'final from chat' }],
      },
    });

    const parsed = parseIronclawEventLine(line, null);
    expect(parsed.events).toHaveLength(1);
    expect(parsed.events[0]).toMatchObject({
      kind: 'delta',
      snapshot: 'final from chat',
      finalText: 'final from chat',
    });
  });

  it('extracts final text from top-level payloads and content-array fallback', () => {
    const line = JSON.stringify({
      event: 'result',
      runId: 'run-7',
      status: 'ok',
      summary: 'completed',
      payloads: [
        {
          content: [{ type: 'text', text: 'final via payload content' }],
        },
      ],
    });

    const parsed = parseIronclawEventLine(line, 'run-7');
    expect(parsed.finalResult).toMatchObject({
      ok: true,
      runId: 'run-7',
      finalText: 'final via payload content',
    });
  });
});
