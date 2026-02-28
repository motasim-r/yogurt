import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { IPC_CHANNELS } from '../src/shared/channels.js';
import { InMemoryGranolaService } from './store.js';
import { GranolaTaskService } from './granolaTasks/task-service.js';
const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const rendererDistDir = path.resolve(currentDir, '../../dist');
const preloadPath = path.join(currentDir, 'preload.js');
const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
let mainWindow = null;
const service = new InMemoryGranolaService();
let taskService = null;
let taskEventUnsubscribe = null;
function withMainWindow() {
    if (!mainWindow) {
        throw new Error('main window is not ready');
    }
    return mainWindow;
}
function withTaskService() {
    if (!taskService) {
        throw new Error('task service is not ready');
    }
    return taskService;
}
function handleWindowCommand(rawCommand) {
    if (typeof rawCommand !== 'string') {
        throw new Error('window command must be a string');
    }
    const command = rawCommand;
    const window = withMainWindow();
    switch (command) {
        case 'minimize':
            window.minimize();
            return;
        case 'maximize':
            if (window.isMaximized()) {
                window.unmaximize();
            }
            else {
                window.maximize();
            }
            return;
        case 'close':
            window.close();
            return;
        default:
            throw new Error(`unsupported window command: ${String(rawCommand)}`);
    }
}
function registerIpcHandlers() {
    ipcMain.handle(IPC_CHANNELS.appInfo, () => ({
        version: app.getVersion(),
        platform: process.platform,
    }));
    ipcMain.handle(IPC_CHANNELS.windowCommand, (_event, command) => {
        handleWindowCommand(command);
    });
    ipcMain.handle(IPC_CHANNELS.notesList, () => service.listNotes());
    ipcMain.handle(IPC_CHANNELS.noteGet, (_event, id) => service.getNote(id));
    ipcMain.handle(IPC_CHANNELS.noteUpdate, (_event, id, patch) => service.updateNote(id, patch));
    ipcMain.handle(IPC_CHANNELS.settingsGet, () => service.getSettings());
    ipcMain.handle(IPC_CHANNELS.settingsUpdate, (_event, patch) => service.updateSettings(patch));
    ipcMain.handle(IPC_CHANNELS.tasksGetFeed, () => withTaskService().getFeed());
    ipcMain.handle(IPC_CHANNELS.tasksConnect, () => withTaskService().connect());
    ipcMain.handle(IPC_CHANNELS.tasksOpenPendingAuth, () => withTaskService().openPendingAuthorization());
    ipcMain.handle(IPC_CHANNELS.tasksSyncNow, () => withTaskService().syncNow());
    ipcMain.handle(IPC_CHANNELS.tasksStart, (_event, todoId) => {
        if (typeof todoId !== 'string') {
            throw new Error('todoId must be a string');
        }
        return withTaskService().tasksStart(todoId);
    });
    ipcMain.handle(IPC_CHANNELS.tasksExecutorReconnect, () => withTaskService().tasksExecutorReconnect());
    ipcMain.handle(IPC_CHANNELS.tasksOpenRun, (_event, todoId) => {
        if (typeof todoId !== 'string') {
            throw new Error('todoId must be a string');
        }
        return withTaskService().tasksOpenRun(todoId);
    });
    ipcMain.handle(IPC_CHANNELS.tasksExtractNow, () => withTaskService().tasksRefreshExtraction());
}
async function createMainWindow() {
    mainWindow = new BrowserWindow({
        x: 120,
        y: 52,
        width: 1100,
        height: 760,
        minWidth: 920,
        minHeight: 620,
        title: 'Granola',
        backgroundColor: '#1f2022',
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });
    if (isDev && process.env.VITE_DEV_SERVER_URL) {
        await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
    else {
        await mainWindow.loadFile(path.join(rendererDistDir, 'index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
app.on('ready', async () => {
    app.setName('Granola');
    taskService = new GranolaTaskService({
        dataDir: path.join(app.getPath('userData'), 'granola'),
        tokenEncryptionKey: process.env.TOKEN_ENCRYPTION_KEY,
        openExternal: async (url) => {
            await shell.openExternal(url);
        },
        mcpUrl: process.env.GRANOLA_MCP_URL,
    });
    await taskService.init();
    taskEventUnsubscribe = taskService.onRealtimeEvent((event) => {
        if (!mainWindow || mainWindow.isDestroyed()) {
            return;
        }
        mainWindow.webContents.send(IPC_CHANNELS.tasksEvent, event);
    });
    registerIpcHandlers();
    await createMainWindow();
});
app.on('before-quit', async () => {
    if (taskEventUnsubscribe) {
        taskEventUnsubscribe();
        taskEventUnsubscribe = null;
    }
    if (taskService) {
        await taskService.dispose();
    }
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        await createMainWindow();
    }
});
