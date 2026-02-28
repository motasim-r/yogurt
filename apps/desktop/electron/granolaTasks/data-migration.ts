import { promises as fs } from 'node:fs';
import path from 'node:path';

const MIGRATION_MARKER = '.legacy-openclaw-import.json';
const IMPORT_FILES = ['granola-token.enc', 'meetings-cache.json', 'todo-store.json'] as const;

type ImportFileName = (typeof IMPORT_FILES)[number];

export interface LegacyDataMigrationStatus {
  sourceDir: string;
  markerPath: string;
  imported: boolean;
  importedAt: string | null;
  skippedReason: string | null;
  backupDir: string | null;
  error: string | null;
  copiedFiles: ImportFileName[];
}

interface MigrationMarker {
  version: 1;
  sourceDir: string;
  imported: boolean;
  importedAt: string | null;
  skippedReason: string | null;
  backupDir: string | null;
  error: string | null;
  copiedFiles: ImportFileName[];
}

interface MigrationOptions {
  targetDir: string;
  sourceDir: string;
}

function toStatus(markerPath: string, marker: MigrationMarker): LegacyDataMigrationStatus {
  return {
    sourceDir: marker.sourceDir,
    markerPath,
    imported: marker.imported,
    importedAt: marker.importedAt,
    skippedReason: marker.skippedReason,
    backupDir: marker.backupDir,
    error: marker.error,
    copiedFiles: marker.copiedFiles,
  };
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeMarker(markerPath: string, marker: MigrationMarker): Promise<void> {
  await fs.mkdir(path.dirname(markerPath), { recursive: true });
  await fs.writeFile(markerPath, `${JSON.stringify(marker, null, 2)}\n`, 'utf8');
}

async function readMarker(markerPath: string): Promise<MigrationMarker | null> {
  if (!(await exists(markerPath))) {
    return null;
  }

  try {
    const raw = await fs.readFile(markerPath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<MigrationMarker>;
    if (
      parsed &&
      parsed.version === 1 &&
      typeof parsed.sourceDir === 'string' &&
      Array.isArray(parsed.copiedFiles)
    ) {
      return {
        version: 1,
        sourceDir: parsed.sourceDir,
        imported: parsed.imported === true,
        importedAt: typeof parsed.importedAt === 'string' ? parsed.importedAt : null,
        skippedReason: typeof parsed.skippedReason === 'string' ? parsed.skippedReason : null,
        backupDir: typeof parsed.backupDir === 'string' ? parsed.backupDir : null,
        error: typeof parsed.error === 'string' ? parsed.error : null,
        copiedFiles: parsed.copiedFiles.filter((item): item is ImportFileName =>
          IMPORT_FILES.includes(item as ImportFileName),
        ),
      };
    }
  } catch {
    // Invalid marker means migration should be attempted again.
  }

  return null;
}

async function validateCopiedFile(filePath: string): Promise<void> {
  if (filePath.endsWith('.json')) {
    const raw = await fs.readFile(filePath, 'utf8');
    JSON.parse(raw);
  }
}

async function rollbackFromBackup(targetDir: string, backupDir: string | null): Promise<void> {
  for (const fileName of IMPORT_FILES) {
    const targetPath = path.join(targetDir, fileName);
    try {
      await fs.rm(targetPath, { force: true });
    } catch {
      // ignore rollback cleanup failures
    }
  }

  if (!backupDir) {
    return;
  }

  for (const fileName of IMPORT_FILES) {
    const backupPath = path.join(backupDir, fileName);
    if (await exists(backupPath)) {
      await fs.copyFile(backupPath, path.join(targetDir, fileName));
    }
  }
}

export async function migrateLegacyOpenclawData(options: MigrationOptions): Promise<LegacyDataMigrationStatus> {
  const targetDir = path.resolve(options.targetDir);
  const sourceDir = path.resolve(options.sourceDir);
  const markerPath = path.join(targetDir, MIGRATION_MARKER);

  await fs.mkdir(targetDir, { recursive: true });

  const existingMarker = await readMarker(markerPath);
  if (existingMarker) {
    return toStatus(markerPath, existingMarker);
  }

  const existingTargetFiles: ImportFileName[] = [];
  for (const fileName of IMPORT_FILES) {
    if (await exists(path.join(targetDir, fileName))) {
      existingTargetFiles.push(fileName);
    }
  }

  if (existingTargetFiles.length > 0) {
    const marker: MigrationMarker = {
      version: 1,
      sourceDir,
      imported: false,
      importedAt: null,
      skippedReason: 'target-files-already-exist',
      backupDir: null,
      error: null,
      copiedFiles: [],
    };
    await writeMarker(markerPath, marker);
    return toStatus(markerPath, marker);
  }

  if (!(await exists(sourceDir))) {
    const marker: MigrationMarker = {
      version: 1,
      sourceDir,
      imported: false,
      importedAt: null,
      skippedReason: 'legacy-source-missing',
      backupDir: null,
      error: null,
      copiedFiles: [],
    };
    await writeMarker(markerPath, marker);
    return toStatus(markerPath, marker);
  }

  const sourceFiles: ImportFileName[] = [];
  for (const fileName of IMPORT_FILES) {
    if (await exists(path.join(sourceDir, fileName))) {
      sourceFiles.push(fileName);
    }
  }

  if (sourceFiles.length === 0) {
    const marker: MigrationMarker = {
      version: 1,
      sourceDir,
      imported: false,
      importedAt: null,
      skippedReason: 'legacy-source-empty',
      backupDir: null,
      error: null,
      copiedFiles: [],
    };
    await writeMarker(markerPath, marker);
    return toStatus(markerPath, marker);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(targetDir, `backup-before-legacy-import-${timestamp}`);
  await fs.mkdir(backupDir, { recursive: true });

  try {
    for (const fileName of IMPORT_FILES) {
      const existingTargetPath = path.join(targetDir, fileName);
      if (await exists(existingTargetPath)) {
        await fs.copyFile(existingTargetPath, path.join(backupDir, fileName));
      }
    }

    for (const fileName of sourceFiles) {
      const sourcePath = path.join(sourceDir, fileName);
      const targetPath = path.join(targetDir, fileName);
      await fs.copyFile(sourcePath, targetPath);
      await validateCopiedFile(targetPath);
    }

    const marker: MigrationMarker = {
      version: 1,
      sourceDir,
      imported: true,
      importedAt: new Date().toISOString(),
      skippedReason: null,
      backupDir,
      error: null,
      copiedFiles: sourceFiles,
    };
    await writeMarker(markerPath, marker);
    return toStatus(markerPath, marker);
  } catch (error) {
    await rollbackFromBackup(targetDir, backupDir);
    const message = error instanceof Error ? error.message : String(error);
    const marker: MigrationMarker = {
      version: 1,
      sourceDir,
      imported: false,
      importedAt: null,
      skippedReason: 'migration-failed',
      backupDir,
      error: message,
      copiedFiles: [],
    };
    await writeMarker(markerPath, marker);
    return toStatus(markerPath, marker);
  }
}

