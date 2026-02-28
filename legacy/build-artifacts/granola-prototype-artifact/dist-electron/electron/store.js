import { mockNotes, mockSettings } from '../src/shared/mockData.js';
const VALID_NOTE_STATUSES = new Set(['draft', 'final']);
const VALID_SETTINGS_KEYS = new Set([
    'autoStart',
    'theme',
    'transcriptLanguage',
    'showMeetingOverlay',
]);
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function cloneNote(note) {
    return {
        ...note,
        tags: [...note.tags],
        attendees: [...note.attendees],
    };
}
function cloneSettings(settings) {
    return { ...settings };
}
function assertId(id) {
    if (typeof id !== 'string' || id.trim().length === 0) {
        throw new Error('note id must be a non-empty string');
    }
}
function assertNotePatch(patch) {
    if (!isRecord(patch)) {
        throw new Error('note patch must be an object');
    }
    for (const key of Object.keys(patch)) {
        if (!['title', 'body', 'tags', 'status'].includes(key)) {
            throw new Error(`unsupported note patch key: ${key}`);
        }
    }
    if ('title' in patch && typeof patch.title !== 'undefined') {
        if (typeof patch.title !== 'string' || patch.title.trim().length === 0) {
            throw new Error('note title must be a non-empty string');
        }
    }
    if ('body' in patch && typeof patch.body !== 'undefined') {
        if (typeof patch.body !== 'string' || patch.body.trim().length === 0) {
            throw new Error('note body must be a non-empty string');
        }
    }
    if ('tags' in patch && typeof patch.tags !== 'undefined') {
        if (!Array.isArray(patch.tags) || patch.tags.some((tag) => typeof tag !== 'string')) {
            throw new Error('note tags must be an array of strings');
        }
    }
    if ('status' in patch && typeof patch.status !== 'undefined') {
        if (typeof patch.status !== 'string' || !VALID_NOTE_STATUSES.has(patch.status)) {
            throw new Error('note status must be one of draft|final');
        }
    }
}
function assertSettingsPatch(patch) {
    if (!isRecord(patch)) {
        throw new Error('settings patch must be an object');
    }
    for (const key of Object.keys(patch)) {
        if (!VALID_SETTINGS_KEYS.has(key)) {
            throw new Error(`unsupported settings patch key: ${key}`);
        }
    }
    if ('autoStart' in patch && typeof patch.autoStart !== 'undefined' && typeof patch.autoStart !== 'boolean') {
        throw new Error('autoStart must be boolean');
    }
    if ('showMeetingOverlay' in patch && typeof patch.showMeetingOverlay !== 'undefined' && typeof patch.showMeetingOverlay !== 'boolean') {
        throw new Error('showMeetingOverlay must be boolean');
    }
    if ('theme' in patch && typeof patch.theme !== 'undefined' && !['light', 'system'].includes(String(patch.theme))) {
        throw new Error('theme must be light|system');
    }
    if ('transcriptLanguage' in patch &&
        typeof patch.transcriptLanguage !== 'undefined' &&
        (typeof patch.transcriptLanguage !== 'string' || patch.transcriptLanguage.trim().length === 0)) {
        throw new Error('transcriptLanguage must be a non-empty string');
    }
}
export class InMemoryGranolaService {
    notes;
    settings;
    constructor() {
        this.notes = mockNotes.map(cloneNote);
        this.settings = cloneSettings(mockSettings);
    }
    listNotes() {
        return this.notes
            .map((note) => ({
            id: note.id,
            title: note.title,
            updatedAt: note.updatedAt,
            timeLabel: note.timeLabel,
            groupLabel: note.groupLabel,
            ownerLabel: note.ownerLabel,
            visibility: note.visibility,
            attendeeCount: note.attendeeCount,
            tags: [...note.tags],
        }))
            .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    }
    getNote(id) {
        assertId(id);
        const note = this.notes.find((item) => item.id === id);
        if (!note) {
            throw new Error(`note not found: ${id}`);
        }
        return cloneNote(note);
    }
    updateNote(id, patch) {
        assertId(id);
        assertNotePatch(patch);
        const note = this.notes.find((item) => item.id === id);
        if (!note) {
            throw new Error(`note not found: ${id}`);
        }
        if (typeof patch.title !== 'undefined') {
            note.title = patch.title.trim();
        }
        if (typeof patch.body !== 'undefined') {
            note.body = patch.body.trim();
        }
        if (typeof patch.tags !== 'undefined') {
            note.tags = patch.tags.map((tag) => tag.trim()).filter(Boolean);
        }
        if (typeof patch.status !== 'undefined') {
            note.status = patch.status;
        }
        note.updatedAt = new Date().toISOString();
        return cloneNote(note);
    }
    getSettings() {
        return cloneSettings(this.settings);
    }
    updateSettings(patch) {
        assertSettingsPatch(patch);
        this.settings = {
            ...this.settings,
            ...patch,
        };
        return cloneSettings(this.settings);
    }
}
