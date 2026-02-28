import crypto from 'node:crypto';
import type { ExtractedTodoCandidate, GranolaMeeting } from './types.js';

function normalizeWhitespace(value: unknown): string {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function clampText(value: unknown, limit: number): string {
  const text = String(value ?? '').trim();
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit)}...`;
}

function parseJsonStrict(text: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function extractJsonFromCodeFence(text: string): Record<string, unknown> | null {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (!match) {
    return null;
  }
  return parseJsonStrict(match[1]);
}

function extractFirstJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  return parseJsonStrict(text.slice(start, end + 1));
}

function normalizePriority(value: unknown): ExtractedTodoCandidate['priority'] {
  const normalized = normalizeWhitespace(value).toLowerCase();
  if (normalized.includes('urgent') || normalized.includes('critical')) {
    return 'urgent';
  }
  if (normalized.includes('high')) {
    return 'high';
  }
  if (normalized.includes('low')) {
    return 'low';
  }
  return 'medium';
}

function normalizeDueDate(value: unknown): string | null {
  const trimmed = normalizeWhitespace(value);
  if (!trimmed) {
    return null;
  }
  return trimmed;
}

function normalizeOwner(value: unknown): string | null {
  const trimmed = normalizeWhitespace(value);
  return trimmed || null;
}

function normalizeEvidence(value: unknown): string | null {
  const trimmed = normalizeWhitespace(value);
  return trimmed || null;
}

function normalizeTodoCandidate(candidate: unknown): ExtractedTodoCandidate | null {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return null;
  }

  const row = candidate as Record<string, unknown>;
  const title = normalizeWhitespace(row.title ?? row.task ?? row.todo ?? '');
  if (!title) {
    return null;
  }

  const description = normalizeWhitespace(row.description ?? row.details ?? row.context ?? '');

  return {
    title: clampText(title, 220),
    description: description ? clampText(description, 800) : '',
    owner: normalizeOwner(row.owner ?? row.assignee ?? row.assigned_to),
    dueDate: normalizeDueDate(row.due_date ?? row.dueDate ?? row.deadline),
    priority: normalizePriority(row.priority),
    evidence: normalizeEvidence(row.evidence ?? row.source_excerpt ?? row.reasoning),
  };
}

export function createMeetingSourceHash(meeting: GranolaMeeting): string {
  const joined = [
    meeting.id,
    meeting.title,
    meeting.date,
    meeting.notes,
    meeting.enhancedNotes,
    meeting.privateNotes,
    meeting.transcript,
  ]
    .map((value) => String(value ?? ''))
    .join('\n@@\n');

  return crypto.createHash('sha256').update(joined, 'utf8').digest('hex');
}

export function createTodoFingerprint(payload: {
  meetingId: string;
  title: string;
  description: string;
  dueDate: string | null;
  owner: string | null;
}): string {
  const joined = [
    payload.meetingId,
    normalizeWhitespace(payload.title).toLowerCase(),
    normalizeWhitespace(payload.description).toLowerCase(),
    normalizeWhitespace(payload.dueDate).toLowerCase(),
    normalizeWhitespace(payload.owner).toLowerCase(),
  ].join('||');

  return crypto.createHash('sha256').update(joined, 'utf8').digest('hex');
}

export function buildTodoExtractionPrompt(meeting: GranolaMeeting): string {
  const sections = [
    `Meeting ID: ${meeting.id ?? 'unknown'}`,
    `Title: ${meeting.title ?? 'Untitled'}`,
    `Date: ${meeting.date ?? 'Unknown'}`,
    '',
    'Extract actionable todos. Return JSON only, no prose.',
    'Schema:',
    '{"todos":[{"title":"string","description":"string","owner":"string|null","due_date":"string|null","priority":"low|medium|high|urgent","evidence":"string|null"}]}',
    'Rules:',
    '- Include only concrete, actionable work.',
    '- Do not invent tasks absent from notes.',
    '- Keep titles concise and imperative.',
    '- If no todos exist, return {"todos":[]}.',
    '',
    'Meeting notes/context:',
    `Enhanced notes:\n${clampText(meeting.enhancedNotes, 5000)}`,
    `Written notes:\n${clampText(meeting.notes, 5000)}`,
    `Private notes:\n${clampText(meeting.privateNotes, 3000)}`,
    `Transcript excerpt:\n${clampText(meeting.transcript, 7000)}`,
  ];

  return sections.join('\n');
}

export function parseExtractedTodos(answerText: string): ExtractedTodoCandidate[] {
  const raw = String(answerText ?? '').trim();
  if (!raw) {
    return [];
  }

  const parsed = parseJsonStrict(raw) ?? extractJsonFromCodeFence(raw) ?? extractFirstJsonObject(raw);
  const todosRaw = parsed?.todos;

  if (!Array.isArray(todosRaw)) {
    return [];
  }

  const normalized: ExtractedTodoCandidate[] = [];
  for (const candidate of todosRaw) {
    const todo = normalizeTodoCandidate(candidate);
    if (todo) {
      normalized.push(todo);
    }
  }

  const seen = new Set<string>();
  const deduped: ExtractedTodoCandidate[] = [];
  for (const item of normalized) {
    const key = `${item.title.toLowerCase()}|${item.description.toLowerCase()}|${item.owner ?? ''}|${item.dueDate ?? ''}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(item);
  }

  return deduped.slice(0, 25);
}
