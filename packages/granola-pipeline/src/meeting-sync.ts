import { XMLParser } from 'fast-xml-parser';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type {
  GranolaMeeting,
  MeetingSyncDiagnostics,
  MeetingSyncOptions,
  MeetingsLoadResult,
  QueryMeetingResult,
} from './types.js';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: '_text',
  trimValues: true,
  parseTagValue: false,
  parseAttributeValue: false,
});

interface ToolShape {
  name: string;
  inputSchema?: unknown;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function safeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return String(error ?? 'Unknown error');
}

function isRateLimitMessage(message: string): boolean {
  const lowered = message.toLowerCase();
  return lowered.includes('rate limit') || lowered.includes('too many requests') || lowered.includes('429');
}

function isTranscriptUnavailableMessage(message: string): boolean {
  const lowered = message.toLowerCase();
  return (
    lowered.includes('paid') ||
    lowered.includes('upgrade') ||
    lowered.includes('tier') ||
    lowered.includes('not available') ||
    lowered.includes('forbidden') ||
    lowered.includes('permission')
  );
}

function parseIsoMillis(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function defaultMeetingSyncOptions(): MeetingSyncOptions {
  return {
    listTimeRange: 'last_30_days',
    maxGetMeetingsPerSync: 10,
    maxTranscriptFetchPerSync: 1,
    transcriptPolicy: 'hybrid',
    globalTranscriptCooldownUntil: null,
    transcriptCooldownUntilByMeetingId: {},
  };
}

function compactWarnings(input: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of input) {
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (!normalized) {
      continue;
    }
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    output.push(normalized);
  }
  return output.slice(0, 3);
}

function stringifySafe(value: unknown): string | undefined {
  if (value == null) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return undefined;
  }
}

function extractTextContents(result: unknown): string {
  if (!isRecord(result) || !Array.isArray(result.content)) {
    return '';
  }

  return result.content
    .filter((item) => isRecord(item) && item.type === 'text' && typeof item.text === 'string')
    .map((item) => String(item.text))
    .join('\n')
    .trim();
}

function isRateLimitResult(result: unknown): boolean {
  const text = extractTextContents(result).toLowerCase();
  return text.includes('rate limit') || text.includes('too many requests');
}

async function callToolWithRetry(
  client: Client,
  params: { name: string; arguments?: Record<string, unknown> },
  options: { maxAttempts?: number; initialDelayMs?: number } = {},
): Promise<unknown> {
  const maxAttempts = options.maxAttempts ?? 3;
  let delayMs = options.initialDelayMs ?? 400;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await client.callTool(params);
      if (isRateLimitResult(result)) {
        if (attempt < maxAttempts) {
          await sleep(delayMs);
          delayMs *= 2;
          continue;
        }
        throw new Error(`Granola rate limit while calling ${params.name}.`);
      }
      return result;
    } catch (error) {
      const message = safeErrorMessage(error);
      if (attempt < maxAttempts && isRateLimitMessage(message)) {
        await sleep(delayMs);
        delayMs *= 2;
        continue;
      }
      throw error;
    }
  }

  throw new Error(`Failed to call ${params.name} after retries.`);
}

function parseJsonSafe(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function tryParseXml(text: string): unknown {
  try {
    return xmlParser.parse(text);
  } catch {
    return undefined;
  }
}

function gatherPayloadCandidates(result: unknown): unknown[] {
  const candidates: unknown[] = [];

  if (isRecord(result) && result.structuredContent != null) {
    candidates.push(result.structuredContent);
  }

  if (isRecord(result) && Array.isArray(result.content)) {
    for (const item of result.content) {
      if (!isRecord(item)) {
        continue;
      }

      if (item.type === 'text' && typeof item.text === 'string') {
        const parsedJson = parseJsonSafe(item.text);
        if (parsedJson !== undefined) {
          candidates.push(parsedJson);
        }

        const parsedXml = tryParseXml(item.text);
        if (parsedXml !== undefined) {
          candidates.push(parsedXml);
        }
      }

      if (item.type === 'resource' && isRecord(item.resource) && typeof item.resource.text === 'string') {
        const parsedJson = parseJsonSafe(item.resource.text);
        if (parsedJson !== undefined) {
          candidates.push(parsedJson);
        }

        const parsedXml = tryParseXml(item.resource.text);
        if (parsedXml !== undefined) {
          candidates.push(parsedXml);
        }
      }
    }
  }

  return candidates;
}

function allEntries(obj: Record<string, unknown>): Array<{ key: string; normalized: string; value: unknown }> {
  return Object.entries(obj).map(([key, value]) => ({
    key,
    normalized: key.toLowerCase().replace(/[^a-z0-9]/g, ''),
    value,
  }));
}

function pickFirstValue(obj: Record<string, unknown>, patterns: RegExp[]): unknown {
  const entries = allEntries(obj);
  for (const pattern of patterns) {
    const entry = entries.find((item) => pattern.test(item.normalized));
    if (entry) {
      return entry.value;
    }
  }
  return undefined;
}

function deepPickFirstValue(value: unknown, patterns: RegExp[], depth = 0): unknown {
  if (depth > 5 || value == null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = deepPickFirstValue(item, patterns, depth + 1);
      if (found !== undefined) {
        return found;
      }
    }
    return undefined;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const direct = pickFirstValue(value, patterns);
  if (direct !== undefined) {
    return direct;
  }

  for (const nested of Object.values(value)) {
    const found = deepPickFirstValue(nested, patterns, depth + 1);
    if (found !== undefined) {
      return found;
    }
  }

  return undefined;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }
        return stringifySafe(item);
      })
      .filter((item): item is string => Boolean(item));
  }

  if (typeof value === 'string') {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function parseMeetingObject(obj: Record<string, unknown>): GranolaMeeting | null {
  const idValue =
    pickFirstValue(obj, [/^meetingid$/, /^meetinguuid$/, /^uuid$/, /^id$/]) ??
    pickFirstValue(obj, [/meeting.*id/, /meeting.*identifier/, /meeting.*uuid/]);

  const id = stringifySafe(idValue);
  if (!id) {
    return null;
  }

  const title =
    stringifySafe(
      deepPickFirstValue(obj, [/^title$/, /^name$/, /^meetingtitle$/, /^meetingname$/, /^subject$/, /title/, /name/]),
    ) ?? 'Untitled Meeting';

  const date =
    stringifySafe(
      deepPickFirstValue(obj, [
        /^date$/,
        /^starttime$/,
        /^meetingdate$/,
        /^createdat$/,
        /^start$/,
        /^startedat$/,
        /timestamp/,
        /date/,
        /time/,
      ]),
    ) ?? null;

  const attendees = toStringArray(
    deepPickFirstValue(obj, [/^attendees$/, /^participants$/, /^people$/, /attendees/, /participants/]),
  );

  const notes =
    stringifySafe(
      deepPickFirstValue(obj, [
        /^notes$/,
        /^meetingnotes$/,
        /^writtennotes$/,
        /^meetingwrittennotes$/,
        /^summary$/,
        /^meetingsummary$/,
        /written.*notes/,
        /meeting.*summary/,
      ]),
    ) ?? null;

  const enhancedNotes =
    stringifySafe(
      deepPickFirstValue(obj, [/^enhancednotes$/, /^enhancedmeetingnotes$/, /^enhancedsummary$/, /enhancednotes/, /enhanced/]),
    ) ?? null;

  const privateNotes =
    stringifySafe(deepPickFirstValue(obj, [/^privatenotes$/, /^internalnotes$/, /private/, /internal.*notes/])) ?? null;

  const transcript =
    stringifySafe(deepPickFirstValue(obj, [/^transcript$/, /^meetingtranscript$/, /^rawtranscript$/, /transcript/])) ??
    null;

  return {
    id,
    title,
    date,
    attendees,
    notes,
    enhancedNotes,
    privateNotes,
    transcript,
    raw: obj,
  };
}

function collectMeetingCandidates(value: unknown, output: Record<string, unknown>[], depth = 0): void {
  if (depth > 7 || value == null) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectMeetingCandidates(item, output, depth + 1);
    }
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  const normalizedKeys = Object.keys(value).map((key) => key.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const looksLikeMeeting =
    normalizedKeys.some((key) => key === 'meetingid' || key === 'id') &&
    normalizedKeys.some((key) => key.includes('title') || key.includes('name') || key.includes('notes'));

  if (looksLikeMeeting) {
    output.push(value);
  }

  for (const nested of Object.values(value)) {
    collectMeetingCandidates(nested, output, depth + 1);
  }
}

function extractMeetings(result: unknown): GranolaMeeting[] {
  const candidates = gatherPayloadCandidates(result);
  const meetingObjects: Record<string, unknown>[] = [];

  for (const candidate of candidates) {
    collectMeetingCandidates(candidate, meetingObjects);
  }

  const dedupe = new Map<string, GranolaMeeting>();
  for (const item of meetingObjects) {
    const parsed = parseMeetingObject(item);
    if (!parsed) {
      continue;
    }

    const existing = dedupe.get(parsed.id);
    dedupe.set(parsed.id, mergeMeeting(existing, parsed));
  }

  return [...dedupe.values()];
}

function mergeMeeting(existing: GranolaMeeting | undefined, incoming: GranolaMeeting): GranolaMeeting {
  if (!existing) {
    return incoming;
  }

  return {
    id: incoming.id || existing.id,
    title: incoming.title || existing.title,
    date: incoming.date || existing.date,
    attendees: incoming.attendees.length > 0 ? incoming.attendees : existing.attendees,
    notes: incoming.notes || existing.notes,
    enhancedNotes: incoming.enhancedNotes || existing.enhancedNotes,
    privateNotes: incoming.privateNotes || existing.privateNotes,
    transcript: incoming.transcript || existing.transcript,
    raw: incoming.raw ?? existing.raw,
  };
}

function parseDateForSort(value: string | null): number {
  if (!value) {
    return 0;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeToolName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findTool(tools: ToolShape[], names: string[]): ToolShape | undefined {
  const normalized = new Set(names.map((name) => normalizeToolName(name)));
  return tools.find((tool) => normalized.has(normalizeToolName(tool.name)));
}

function schemaObject(tool: ToolShape): Record<string, unknown> {
  return isRecord(tool.inputSchema) ? tool.inputSchema : {};
}

function schemaProperties(tool: ToolShape): Record<string, Record<string, unknown>> {
  const schema = schemaObject(tool);
  return isRecord(schema.properties) ? (schema.properties as Record<string, Record<string, unknown>>) : {};
}

function schemaRequired(tool: ToolShape): string[] {
  const schema = schemaObject(tool);
  return Array.isArray(schema.required)
    ? schema.required.filter((item): item is string => typeof item === 'string')
    : [];
}

function inferFieldByPattern(properties: Record<string, unknown>, pattern: RegExp): string | null {
  const entries = Object.keys(properties).map((key) => ({
    key,
    normalized: key.toLowerCase().replace(/[^a-z0-9]/g, ''),
  }));

  const match = entries.find((entry) => pattern.test(entry.normalized));
  return match ? match.key : null;
}

function defaultValueForSchema(schema: unknown): unknown {
  if (!isRecord(schema)) {
    return '';
  }

  const kind = typeof schema.type === 'string' ? schema.type : '';
  if (kind === 'boolean') {
    return false;
  }
  if (kind === 'number' || kind === 'integer') {
    return 0;
  }
  if (kind === 'array') {
    return [];
  }
  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum[0];
  }
  return '';
}

function prepareListMeetingsRequest(
  tool: ToolShape,
  context: { cursor: string | null; pageNumber: number },
  options: Pick<MeetingSyncOptions, 'listTimeRange'>,
): { args: Record<string, unknown>; supportsCursor: boolean; supportsPage: boolean } {
  const props = schemaProperties(tool);
  const required = schemaRequired(tool);
  const args: Record<string, unknown> = {};

  const cursorField =
    inferFieldByPattern(props, /^cursor$/) ?? inferFieldByPattern(props, /nextcursor|cursor/);
  const pageField = inferFieldByPattern(props, /^page$/) ?? inferFieldByPattern(props, /pagenumber/);
  const pageSizeField =
    inferFieldByPattern(props, /^pagesize$/) ?? inferFieldByPattern(props, /^limit$/) ?? inferFieldByPattern(props, /page.*size|limit/);
  const timeRangeField =
    inferFieldByPattern(props, /^timerange$/) ??
    inferFieldByPattern(props, /^time_range$/) ??
    inferFieldByPattern(props, /timerange|time.*range/);

  if (cursorField && context.cursor) {
    args[cursorField] = context.cursor;
  }

  if (pageField) {
    args[pageField] = context.pageNumber;
  }

  if (pageSizeField) {
    args[pageSizeField] = 50;
  }
  if (timeRangeField) {
    args[timeRangeField] = options.listTimeRange;
  }

  for (const field of required) {
    if (args[field] !== undefined) {
      continue;
    }

    const normalized = field.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalized.includes('timerange')) {
      args[field] = options.listTimeRange;
      continue;
    }
    args[field] = defaultValueForSchema(props[field]);
  }

  return {
    args,
    supportsCursor: Boolean(cursorField),
    supportsPage: Boolean(pageField),
  };
}

function extractPaginationCursor(result: unknown): string | null {
  const cursor = deepPickFirstValue(result, [/^nextcursor$/, /^cursor$/, /next.*cursor/, /cursor/]);
  return typeof cursor === 'string' && cursor.trim() ? cursor.trim() : null;
}

function extractHasMore(result: unknown): boolean {
  const value = deepPickFirstValue(result, [/^hasmore$/, /^hasnext$/, /has.*more/, /has.*next/]);
  return value === true;
}

function buildGetMeetingsArguments(tool: ToolShape, ids: string[]): Record<string, unknown> {
  const props = schemaProperties(tool);
  const required = schemaRequired(tool);
  const args: Record<string, unknown> = {};

  const idsField =
    inferFieldByPattern(props, /^meetingids$/) ??
    inferFieldByPattern(props, /^ids$/) ??
    inferFieldByPattern(props, /meeting.*ids/) ??
    inferFieldByPattern(props, /^meetingid$/);

  if (idsField) {
    const schema = props[idsField];
    if (isRecord(schema) && schema.type === 'array') {
      args[idsField] = ids;
    } else if (isRecord(schema) && schema.type === 'string') {
      args[idsField] = ids.join(',');
    } else {
      args[idsField] = ids;
    }
  } else {
    args.meeting_ids = ids;
  }

  for (const field of required) {
    if (args[field] !== undefined) {
      continue;
    }
    args[field] = defaultValueForSchema(props[field]);
  }

  return args;
}

function buildGetMeetingTranscriptArguments(tool: ToolShape, id: string): Record<string, unknown> {
  const props = schemaProperties(tool);
  const required = schemaRequired(tool);
  const args: Record<string, unknown> = {};

  const idField =
    inferFieldByPattern(props, /^meetingid$/) ??
    inferFieldByPattern(props, /^id$/) ??
    inferFieldByPattern(props, /meeting.*id/);

  if (idField) {
    args[idField] = id;
  } else {
    args.meeting_id = id;
  }

  for (const field of required) {
    if (args[field] !== undefined) {
      continue;
    }
    args[field] = defaultValueForSchema(props[field]);
  }

  return args;
}

function buildQueryArguments(tool: ToolShape, message: string, meetingIds?: string[]): Record<string, unknown> {
  const props = schemaProperties(tool);
  const required = schemaRequired(tool);
  const args: Record<string, unknown> = {};

  const messageField =
    inferFieldByPattern(props, /^query$/) ??
    inferFieldByPattern(props, /^question$/) ??
    inferFieldByPattern(props, /^prompt$/) ??
    inferFieldByPattern(props, /^message$/) ??
    inferFieldByPattern(props, /query|question|prompt|message|text/);

  if (messageField) {
    args[messageField] = message;
  } else {
    args.query = message;
  }

  if (meetingIds?.length) {
    const idsField =
      inferFieldByPattern(props, /^documentids$/) ??
      inferFieldByPattern(props, /^documentid$/) ??
      inferFieldByPattern(props, /document.*ids/) ??
      inferFieldByPattern(props, /^meetingids$/) ??
      inferFieldByPattern(props, /^meetingid$/) ??
      inferFieldByPattern(props, /meeting.*ids/) ??
      inferFieldByPattern(props, /^ids$/);

    if (idsField) {
      const schema = props[idsField];
      if (isRecord(schema) && schema.type === 'array') {
        args[idsField] = meetingIds;
      } else if (isRecord(schema) && schema.type === 'string') {
        args[idsField] = meetingIds.join(',');
      } else {
        args[idsField] = meetingIds;
      }
    } else {
      args.meeting_ids = meetingIds;
    }
  }

  for (const field of required) {
    if (args[field] !== undefined) {
      continue;
    }
    if (field === messageField) {
      args[field] = message;
      continue;
    }
    args[field] = defaultValueForSchema(props[field]);
  }

  return args;
}

function extractAnswerText(result: unknown): string {
  if (isRecord(result) && Array.isArray(result.content)) {
    const parts = result.content
      .filter((item) => isRecord(item) && item.type === 'text' && typeof item.text === 'string')
      .map((item) => String(item.text).trim())
      .filter(Boolean);

    if (parts.length > 0) {
      return parts.join('\n\n');
    }
  }

  if (isRecord(result) && result.structuredContent != null) {
    return stringifySafe(result.structuredContent) ?? 'No response text was returned by Granola.';
  }

  return 'No response text was returned by Granola.';
}

function extractTranscriptFromResult(result: unknown): string | null {
  const parsedMeetings = extractMeetings(result);
  for (const meeting of parsedMeetings) {
    if (meeting.transcript) {
      return meeting.transcript;
    }
  }

  const text = extractTextContents(result);
  return text || null;
}

export async function loadMeetingsWithClient(
  client: Client,
  inputOptions: Partial<MeetingSyncOptions> = {},
): Promise<MeetingsLoadResult> {
  const options: MeetingSyncOptions = {
    ...defaultMeetingSyncOptions(),
    ...inputOptions,
    transcriptCooldownUntilByMeetingId: {
      ...defaultMeetingSyncOptions().transcriptCooldownUntilByMeetingId,
      ...(inputOptions.transcriptCooldownUntilByMeetingId ?? {}),
    },
  };

  const toolsResponse = (await client.listTools()) as { tools?: unknown[] };
  const tools = Array.isArray(toolsResponse.tools)
    ? toolsResponse.tools.filter((tool): tool is ToolShape => isRecord(tool) && typeof tool.name === 'string')
    : [];

  const listMeetingsTool = findTool(tools, ['list_meetings', 'listMeetings']);
  if (!listMeetingsTool) {
    throw new Error('Granola MCP server did not expose list_meetings.');
  }

  const meetingsById = new Map<string, GranolaMeeting>();
  const warnings: string[] = [];
  const diagnostics: MeetingSyncDiagnostics = {
    requestCountsByTool: {},
    rateLimitedTools: [],
    degradedSteps: [],
    transcriptSkippedCount: 0,
    transcriptRateLimited: false,
    transcriptCapabilityUnavailable: false,
    transcriptCooldownUntilByMeetingId: { ...options.transcriptCooldownUntilByMeetingId },
    globalTranscriptCooldownUntil: options.globalTranscriptCooldownUntil,
    warningsSummary: [],
  };

  const markToolCall = (toolName: string): void => {
    diagnostics.requestCountsByTool[toolName] = (diagnostics.requestCountsByTool[toolName] ?? 0) + 1;
  };

  const markRateLimit = (toolName: string): void => {
    if (!diagnostics.rateLimitedTools.includes(toolName)) {
      diagnostics.rateLimitedTools.push(toolName);
    }
  };

  const markDegradedStep = (step: string): void => {
    if (!diagnostics.degradedSteps.includes(step)) {
      diagnostics.degradedSteps.push(step);
    }
  };

  const addWarning = (message: string): void => {
    warnings.push(message);
  };

  const maxPages = 12;
  let cursor: string | null = null;
  let pageNumber = 1;

  for (let page = 0; page < maxPages; page += 1) {
    const request = prepareListMeetingsRequest(listMeetingsTool, { cursor, pageNumber }, { listTimeRange: options.listTimeRange });
    markToolCall(listMeetingsTool.name);
    const result = await callToolWithRetry(
      client,
      {
        name: listMeetingsTool.name,
        arguments: request.args,
      },
      {
        maxAttempts: 3,
        initialDelayMs: 350,
      },
    );

    const listed = extractMeetings(result);
    for (const meeting of listed) {
      const existing = meetingsById.get(meeting.id);
      meetingsById.set(meeting.id, mergeMeeting(existing, meeting));
    }

    const nextCursor = extractPaginationCursor(result);
    const hasMore = extractHasMore(result);

    if (request.supportsCursor && nextCursor && nextCursor !== cursor) {
      cursor = nextCursor;
      pageNumber += 1;
      continue;
    }

    if (!request.supportsCursor && request.supportsPage && hasMore) {
      pageNumber += 1;
      continue;
    }

    break;
  }

  const getMeetingsTool = findTool(tools, ['get_meetings', 'getMeetings']);
  if (getMeetingsTool && meetingsById.size > 0 && options.maxGetMeetingsPerSync > 0) {
    const ids = [...meetingsById.values()]
      .sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date))
      .slice(0, Math.max(1, options.maxGetMeetingsPerSync))
      .map((meeting) => meeting.id)
      .slice(0, 10);

    if (ids.length > 0) {
      try {
        markToolCall(getMeetingsTool.name);
        const details = await callToolWithRetry(
          client,
          {
            name: getMeetingsTool.name,
            arguments: buildGetMeetingsArguments(getMeetingsTool, ids),
          },
          {
            maxAttempts: 3,
            initialDelayMs: 600,
          },
        );

        const enriched = extractMeetings(details);
        for (const meeting of enriched) {
          const existing = meetingsById.get(meeting.id);
          meetingsById.set(meeting.id, mergeMeeting(existing, meeting));
        }
      } catch (error) {
        const message = safeErrorMessage(error);
        markDegradedStep('get_meetings');
        if (isRateLimitMessage(message)) {
          markRateLimit(getMeetingsTool.name);
          addWarning('Granola detail sync is temporarily rate-limited. Using cached/partial detail.');
        } else {
          addWarning(`Granola detail sync degraded: ${message}`);
        }
      }
    }
  }

  const transcriptTool = findTool(tools, ['get_meeting_transcript', 'getMeetingTranscript']);
  if (transcriptTool && meetingsById.size > 0 && options.transcriptPolicy === 'hybrid' && options.maxTranscriptFetchPerSync > 0) {
    const now = Date.now();
    const globalCooldownUntilMs = parseIsoMillis(options.globalTranscriptCooldownUntil);
    if (globalCooldownUntilMs != null && globalCooldownUntilMs > now) {
      diagnostics.transcriptSkippedCount += [...meetingsById.values()].filter((meeting) => !meeting.transcript).length;
      diagnostics.globalTranscriptCooldownUntil = options.globalTranscriptCooldownUntil;
      addWarning(`Transcript sync cooling down until ${new Date(globalCooldownUntilMs).toLocaleTimeString()}.`);
    } else {
      const transcriptCandidates = [...meetingsById.values()]
        .filter((meeting) => {
          const hasContext = Boolean(meeting.notes || meeting.enhancedNotes || meeting.privateNotes || meeting.transcript);
          if (hasContext) {
            diagnostics.transcriptSkippedCount += 1;
            return false;
          }

          const cooldownUntil = options.transcriptCooldownUntilByMeetingId[meeting.id] ?? null;
          const cooldownUntilMs = parseIsoMillis(cooldownUntil);
          if (cooldownUntilMs != null && cooldownUntilMs > now) {
            diagnostics.transcriptSkippedCount += 1;
            return false;
          }

          return true;
        })
        .sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date));

      if (transcriptCandidates.length > options.maxTranscriptFetchPerSync) {
        diagnostics.transcriptSkippedCount += transcriptCandidates.length - options.maxTranscriptFetchPerSync;
      }

      const transcriptTargets = transcriptCandidates.slice(0, Math.max(0, options.maxTranscriptFetchPerSync));
      for (const meeting of transcriptTargets) {
        try {
          markToolCall(transcriptTool.name);
          const transcriptResult = await callToolWithRetry(
            client,
            {
              name: transcriptTool.name,
              arguments: buildGetMeetingTranscriptArguments(transcriptTool, meeting.id),
            },
            {
              maxAttempts: 2,
              initialDelayMs: 700,
            },
          );

          const transcriptText = extractTranscriptFromResult(transcriptResult);
          if (transcriptText) {
            meetingsById.set(meeting.id, {
              ...meeting,
              transcript: transcriptText,
            });
          }
        } catch (error) {
          const message = safeErrorMessage(error);
          markDegradedStep('get_meeting_transcript');
          if (isRateLimitMessage(message)) {
            markRateLimit(transcriptTool.name);
            diagnostics.transcriptRateLimited = true;
            const globalCooldownUntil = new Date(Date.now() + 30 * 60_000).toISOString();
            diagnostics.globalTranscriptCooldownUntil = globalCooldownUntil;
            diagnostics.transcriptCooldownUntilByMeetingId[meeting.id] = new Date(Date.now() + 6 * 60 * 60_000).toISOString();
            addWarning('Transcript sync hit a rate limit and is cooling down.');
          } else if (isTranscriptUnavailableMessage(message)) {
            diagnostics.transcriptCapabilityUnavailable = true;
            addWarning('Transcript tool is unavailable for this Granola account. Continuing with notes only.');
            break;
          } else {
            addWarning(`Transcript sync degraded: ${message}`);
          }
        }

        await sleep(140);
      }
    }
  }

  const meetings = [...meetingsById.values()].sort((a, b) => parseDateForSort(b.date) - parseDateForSort(a.date));
  diagnostics.warningsSummary = compactWarnings(warnings);

  return {
    meetings,
    availableTools: tools.map((tool) => tool.name),
    warnings: diagnostics.warningsSummary,
    diagnostics,
  };
}

export async function queryGranolaMeetings(
  client: Client,
  message: string,
  meetingIds?: string[],
): Promise<QueryMeetingResult> {
  const toolsResponse = (await client.listTools()) as { tools?: unknown[] };
  const tools = Array.isArray(toolsResponse.tools)
    ? toolsResponse.tools.filter((tool): tool is ToolShape => isRecord(tool) && typeof tool.name === 'string')
    : [];

  const queryTool = findTool(tools, ['query_granola_meetings', 'queryGranolaMeetings']);
  if (!queryTool) {
    throw new Error('Granola MCP server did not expose query_granola_meetings.');
  }

  const args = buildQueryArguments(queryTool, message, meetingIds);
  const result = await callToolWithRetry(
    client,
    {
      name: queryTool.name,
      arguments: args,
    },
    {
      maxAttempts: 2,
      initialDelayMs: 450,
    },
  );

  return {
    answer: extractAnswerText(result),
    raw: isRecord(result) ? (result.structuredContent ?? null) : null,
    usedArgs: args,
  };
}
