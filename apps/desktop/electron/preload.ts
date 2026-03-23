import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../src/shared/channels.js';
import type {
  CodexAIActionInput,
  DocsCreateInput,
  DocsUpdatePatch,
  GranolaAPI,
  NoteUpdatePatch,
  AppSettingsPatch,
  TaskCreateFromContextInput,
  TaskMetadataPatch,
  TaskWritebackTarget,
  TaskWorkspacePrefsPatch,
  TasksRealtimeEvent,
  WindowCommand,
} from '../src/shared/types.js';

const api: GranolaAPI = {
  getAppInfo: () => ipcRenderer.invoke(IPC_CHANNELS.appInfo),
  windowCommand: (cmd: WindowCommand) => ipcRenderer.invoke(IPC_CHANNELS.windowCommand, cmd),
  notesList: () => ipcRenderer.invoke(IPC_CHANNELS.notesList),
  noteGet: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.noteGet, id),
  noteUpdate: (id: string, patch: NoteUpdatePatch) =>
    ipcRenderer.invoke(IPC_CHANNELS.noteUpdate, id, patch),
  settingsGet: () => ipcRenderer.invoke(IPC_CHANNELS.settingsGet),
  settingsUpdate: (patch: AppSettingsPatch) => ipcRenderer.invoke(IPC_CHANNELS.settingsUpdate, patch),
  homeGetFeed: () => ipcRenderer.invoke(IPC_CHANNELS.homeGetFeed),
  homeGetNoteDetail: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.homeGetNoteDetail, id),
  chatGetHome: () => ipcRenderer.invoke(IPC_CHANNELS.chatGetHome),
  chatGetThread: (threadId: string) => ipcRenderer.invoke(IPC_CHANNELS.chatGetThread, threadId),
  chatSendMessage: (input) => ipcRenderer.invoke(IPC_CHANNELS.chatSendMessage, input),
  docsGetHome: () => ipcRenderer.invoke(IPC_CHANNELS.docsGetHome),
  docsGetDocument: (docId: string) => ipcRenderer.invoke(IPC_CHANNELS.docsGetDocument, docId),
  docsCreate: (input?: DocsCreateInput) => ipcRenderer.invoke(IPC_CHANNELS.docsCreate, input ?? null),
  docsUpdate: (docId: string, patch: DocsUpdatePatch) => ipcRenderer.invoke(IPC_CHANNELS.docsUpdate, docId, patch),
  docsGetHistory: (docId: string) => ipcRenderer.invoke(IPC_CHANNELS.docsGetHistory, docId),
  docsRestoreVersion: (docId: string, versionId: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.docsRestoreVersion, docId, versionId),
  aiGetStatus: () => ipcRenderer.invoke(IPC_CHANNELS.aiGetStatus),
  aiConnect: () => ipcRenderer.invoke(IPC_CHANNELS.aiConnect),
  aiDisconnect: () => ipcRenderer.invoke(IPC_CHANNELS.aiDisconnect),
  aiGenerate: (input: CodexAIActionInput) => ipcRenderer.invoke(IPC_CHANNELS.aiGenerate, input),
  tasksGetFeed: () => ipcRenderer.invoke(IPC_CHANNELS.tasksGetFeed),
  tasksGetWorkspace: () => ipcRenderer.invoke(IPC_CHANNELS.tasksGetWorkspace),
  tasksCreateFromContext: (input: TaskCreateFromContextInput) =>
    ipcRenderer.invoke(IPC_CHANNELS.tasksCreateFromContext, input),
  tasksGetContextPacket: (todoId: string) => ipcRenderer.invoke(IPC_CHANNELS.tasksGetContextPacket, todoId),
  tasksSetWriteback: (todoId: string, patch: Partial<TaskWritebackTarget>) =>
    ipcRenderer.invoke(IPC_CHANNELS.tasksSetWriteback, todoId, patch),
  tasksWriteBack: (todoId: string, target: 'chat' | 'doc' | 'followup') =>
    ipcRenderer.invoke(IPC_CHANNELS.tasksWriteBack, todoId, target),
  tasksUpdateMetadata: (todoId: string, patch: TaskMetadataPatch) => ipcRenderer.invoke(IPC_CHANNELS.tasksUpdateMetadata, todoId, patch),
  tasksUpdateWorkspacePrefs: (patch: TaskWorkspacePrefsPatch) => ipcRenderer.invoke(IPC_CHANNELS.tasksUpdateWorkspacePrefs, patch),
  tasksConnect: () => ipcRenderer.invoke(IPC_CHANNELS.tasksConnect),
  tasksOpenPendingAuthorization: () => ipcRenderer.invoke(IPC_CHANNELS.tasksOpenPendingAuth),
  tasksSyncNow: () => ipcRenderer.invoke(IPC_CHANNELS.tasksSyncNow),
  tasksGetPlanningContext: (todoId: string) => ipcRenderer.invoke(IPC_CHANNELS.tasksGetPlanningContext, todoId),
  tasksGetPlanSuggestions: (todoId: string) => ipcRenderer.invoke(IPC_CHANNELS.tasksGetPlanSuggestions, todoId),
  tasksGetNextMoveSuggestions: (todoId: string) => ipcRenderer.invoke(IPC_CHANNELS.tasksGetNextMoveSuggestions, todoId),
  tasksExecuteSuggestion: (todoId: string, input) => ipcRenderer.invoke(IPC_CHANNELS.tasksExecuteSuggestion, todoId, input),
  tasksPlanMessage: (todoId: string, instruction: string) => ipcRenderer.invoke(IPC_CHANNELS.tasksPlanMessage, todoId, instruction),
  tasksStart: (todoId: string, options) => ipcRenderer.invoke(IPC_CHANNELS.tasksStart, todoId, options ?? null),
  tasksGetThread: (todoId: string, cursor?: string | null, limit?: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.tasksGetThread, todoId, cursor ?? null, typeof limit === 'number' ? limit : null),
  tasksSendMessage: (todoId: string, text: string) => ipcRenderer.invoke(IPC_CHANNELS.tasksSendMessage, todoId, text),
  tasksCancelActiveRun: (todoId: string) => ipcRenderer.invoke(IPC_CHANNELS.tasksCancelRun, todoId),
  tasksClearThread: (todoId: string) => ipcRenderer.invoke(IPC_CHANNELS.tasksClearThread, todoId),
  tasksExecutorReconnect: () => ipcRenderer.invoke(IPC_CHANNELS.tasksExecutorReconnect),
  tasksOpenRun: (todoId: string) => ipcRenderer.invoke(IPC_CHANNELS.tasksOpenRun, todoId),
  tasksRuntimeCheck: () => ipcRenderer.invoke(IPC_CHANNELS.tasksRuntimeCheck),
  tasksSubscribe: (listener: (event: TasksRealtimeEvent) => void) => {
    const wrapped = (_event: Electron.IpcRendererEvent, payload: TasksRealtimeEvent) => {
      listener(payload);
    };
    ipcRenderer.on(IPC_CHANNELS.tasksEvent, wrapped);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.tasksEvent, wrapped);
    };
  },
  tasksRefreshExtraction: () => ipcRenderer.invoke(IPC_CHANNELS.tasksExtractNow),
};

contextBridge.exposeInMainWorld('granola', api);
