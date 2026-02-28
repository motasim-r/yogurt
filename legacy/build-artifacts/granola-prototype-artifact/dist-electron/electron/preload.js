import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../src/shared/channels.js';
const api = {
    getAppInfo: () => ipcRenderer.invoke(IPC_CHANNELS.appInfo),
    windowCommand: (cmd) => ipcRenderer.invoke(IPC_CHANNELS.windowCommand, cmd),
    notesList: () => ipcRenderer.invoke(IPC_CHANNELS.notesList),
    noteGet: (id) => ipcRenderer.invoke(IPC_CHANNELS.noteGet, id),
    noteUpdate: (id, patch) => ipcRenderer.invoke(IPC_CHANNELS.noteUpdate, id, patch),
    settingsGet: () => ipcRenderer.invoke(IPC_CHANNELS.settingsGet),
    settingsUpdate: (patch) => ipcRenderer.invoke(IPC_CHANNELS.settingsUpdate, patch),
    tasksGetFeed: () => ipcRenderer.invoke(IPC_CHANNELS.tasksGetFeed),
    tasksConnect: () => ipcRenderer.invoke(IPC_CHANNELS.tasksConnect),
    tasksOpenPendingAuthorization: () => ipcRenderer.invoke(IPC_CHANNELS.tasksOpenPendingAuth),
    tasksSyncNow: () => ipcRenderer.invoke(IPC_CHANNELS.tasksSyncNow),
    tasksStart: (todoId) => ipcRenderer.invoke(IPC_CHANNELS.tasksStart, todoId),
    tasksExecutorReconnect: () => ipcRenderer.invoke(IPC_CHANNELS.tasksExecutorReconnect),
    tasksOpenRun: (todoId) => ipcRenderer.invoke(IPC_CHANNELS.tasksOpenRun, todoId),
    tasksSubscribe: (listener) => {
        const wrapped = (_event, payload) => {
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
