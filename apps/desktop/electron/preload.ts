import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../src/shared/channels.js';
import type {
  GranolaAPI,
  NoteUpdatePatch,
  AppSettingsPatch,
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
  tasksGetFeed: () => ipcRenderer.invoke(IPC_CHANNELS.tasksGetFeed),
  tasksConnect: () => ipcRenderer.invoke(IPC_CHANNELS.tasksConnect),
  tasksOpenPendingAuthorization: () => ipcRenderer.invoke(IPC_CHANNELS.tasksOpenPendingAuth),
  tasksSyncNow: () => ipcRenderer.invoke(IPC_CHANNELS.tasksSyncNow),
  tasksGetPlanningContext: (todoId: string) => ipcRenderer.invoke(IPC_CHANNELS.tasksGetPlanningContext, todoId),
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
