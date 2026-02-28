import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { IPC_CHANNELS } from '../src/shared/channels.js';
import type { WindowCommand } from '../src/shared/types.js';
import { InMemoryGranolaService } from './store.js';
import { GranolaTaskService } from './granolaTasks/task-service.js';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const rendererDistCandidates = [
  path.resolve(currentDir, '../../dist'),
  path.resolve(currentDir, '../../../dist'),
  path.resolve(currentDir, '../../../../dist'),
];
const rendererDistDir = rendererDistCandidates.find((candidate) => existsSync(candidate)) ?? rendererDistCandidates[0];
const preloadPath = path.join(currentDir, 'preload.js');

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
const isMac = process.platform === 'darwin';

let mainWindow: BrowserWindow | null = null;
const service = new InMemoryGranolaService();
let taskService: GranolaTaskService | null = null;
let taskEventUnsubscribe: (() => void) | null = null;

function withMainWindow(): BrowserWindow {
  if (!mainWindow) {
    throw new Error('main window is not ready');
  }
  return mainWindow;
}

function withTaskService(): GranolaTaskService {
  if (!taskService) {
    throw new Error('task service is not ready');
  }
  return taskService;
}

function isAppNavigation(url: string): boolean {
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    return url.startsWith(process.env.VITE_DEV_SERVER_URL);
  }
  return url.startsWith('file://');
}

function handleWindowCommand(rawCommand: unknown): void {
  if (typeof rawCommand !== 'string') {
    throw new Error('window command must be a string');
  }

  const command = rawCommand as WindowCommand;
  const window = withMainWindow();

  switch (command) {
    case 'minimize':
      window.minimize();
      return;
    case 'maximize':
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
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

function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.appInfo, () => ({
    version: app.getVersion(),
    platform: process.platform,
  }));

  ipcMain.handle(IPC_CHANNELS.windowCommand, (_event, command: unknown) => {
    handleWindowCommand(command);
  });

  ipcMain.handle(IPC_CHANNELS.notesList, () => service.listNotes());
  ipcMain.handle(IPC_CHANNELS.noteGet, (_event, id: unknown) => service.getNote(id));
  ipcMain.handle(IPC_CHANNELS.noteUpdate, (_event, id: unknown, patch: unknown) =>
    service.updateNote(id, patch),
  );
  ipcMain.handle(IPC_CHANNELS.settingsGet, () => service.getSettings());
  ipcMain.handle(IPC_CHANNELS.settingsUpdate, (_event, patch: unknown) =>
    service.updateSettings(patch),
  );
  ipcMain.handle(IPC_CHANNELS.tasksGetFeed, () => withTaskService().getFeed());
  ipcMain.handle(IPC_CHANNELS.tasksConnect, () => withTaskService().connect());
  ipcMain.handle(IPC_CHANNELS.tasksOpenPendingAuth, () => withTaskService().openPendingAuthorization());
  ipcMain.handle(IPC_CHANNELS.tasksSyncNow, () => withTaskService().syncNow());
  ipcMain.handle(IPC_CHANNELS.tasksStart, (_event, todoId: unknown) => {
    if (typeof todoId !== 'string') {
      throw new Error('todoId must be a string');
    }
    return withTaskService().tasksStart(todoId);
  });
  ipcMain.handle(IPC_CHANNELS.tasksGetThread, (_event, todoId: unknown, cursor: unknown, limit: unknown) => {
    if (typeof todoId !== 'string') {
      throw new Error('todoId must be a string');
    }
    const safeCursor = typeof cursor === 'string' ? cursor : null;
    const safeLimit = typeof limit === 'number' && Number.isFinite(limit) ? limit : undefined;
    return withTaskService().tasksGetThread(todoId, safeCursor, safeLimit);
  });
  ipcMain.handle(IPC_CHANNELS.tasksSendMessage, (_event, todoId: unknown, text: unknown) => {
    if (typeof todoId !== 'string') {
      throw new Error('todoId must be a string');
    }
    if (typeof text !== 'string') {
      throw new Error('text must be a string');
    }
    return withTaskService().tasksSendMessage(todoId, text);
  });
  ipcMain.handle(IPC_CHANNELS.tasksCancelRun, (_event, todoId: unknown) => {
    if (typeof todoId !== 'string') {
      throw new Error('todoId must be a string');
    }
    return withTaskService().tasksCancelActiveRun(todoId);
  });
  ipcMain.handle(IPC_CHANNELS.tasksClearThread, (_event, todoId: unknown) => {
    if (typeof todoId !== 'string') {
      throw new Error('todoId must be a string');
    }
    return withTaskService().tasksClearThread(todoId);
  });
  ipcMain.handle(IPC_CHANNELS.tasksExecutorReconnect, () => withTaskService().tasksExecutorReconnect());
  ipcMain.handle(IPC_CHANNELS.tasksOpenRun, (_event, todoId: unknown) => {
    if (typeof todoId !== 'string') {
      throw new Error('todoId must be a string');
    }
    return withTaskService().tasksOpenRun(todoId);
  });
  ipcMain.handle(IPC_CHANNELS.tasksRuntimeCheck, () => withTaskService().tasksRuntimeCheck());
  ipcMain.handle(IPC_CHANNELS.tasksExtractNow, () => withTaskService().tasksRefreshExtraction());
}

async function createMainWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1280,
    minHeight: 820,
    title: 'Yogurt',
    backgroundColor: '#292929',
    titleBarStyle: isMac ? 'hidden' : 'default',
    autoHideMenuBar: true,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    await mainWindow.loadFile(path.join(rendererDistDir, 'index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAppNavigation(url)) {
      return { action: 'allow' };
    }
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isAppNavigation(url)) {
      return;
    }
    event.preventDefault();
    void shell.openExternal(url);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  app.setName('Yogurt');

  taskService = new GranolaTaskService({
    dataDir: path.join(app.getPath('userData'), 'granola'),
    tokenEncryptionKey: process.env.TOKEN_ENCRYPTION_KEY,
    legacyDataDir: process.env.GRANOLA_OPENCLAW_LEGACY_DATA_DIR ?? '/Users/motasimrahman/Desktop/granola-openclaw/data',
    canonicalProjectPath: path.resolve(app.getAppPath(), '../..'),
    openExternal: async (url: string) => {
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
