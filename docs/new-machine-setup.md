# Yogurt Setup Guide (New Machine)

Use this when someone new needs to run Yogurt locally (including in Codex).

## 1) What runs externally

Yogurt itself is a local Electron app, but it depends on two external systems:

1. **Granola MCP service** (cloud): `https://mcp.granola.ai/mcp`  
   Used for meeting/notes sync and task extraction.
2. **IronClaw runtime** (local CLI + local gateway): usually on `127.0.0.1:19789`  
   Used to execute multi-step task runs and stream progress back to Yogurt.

Also used during auth:

3. **Browser OAuth flow** for Granola, with local callback on `127.0.0.1:43110`.

## 2) Prerequisites

1. macOS (recommended for current desktop workflow)
2. Node.js `22+` and npm `10+`
3. `ironclaw` installed and available in `PATH`

Helpful links:

- [Node.js download](https://nodejs.org/en/download)
- [Monorepo README](../README.md)
- [Operations runbook](./operations.md)
- [Architecture overview](./architecture.md)

## 3) Clone and install

```bash
git clone <your-repo-url> yogurt
cd yogurt
npm install
```

## 4) Configure environment

Copy env template:

```bash
cp .env.example .env
```

Minimum `.env` values:

```bash
GRANOLA_MCP_URL=https://mcp.granola.ai/mcp
IRONCLAW_PROFILE=ironclaw
IRONCLAW_MIN_VERSION=2026.2.15-1.7
```

Optional:

- `TOKEN_ENCRYPTION_KEY` for encrypted desktop token storage
- `GRANOLA_OPENCLAW_LEGACY_DATA_DIR` for one-time legacy import

## 5) Verify local runtime health

From repo root:

```bash
npm run doctor
```

Manual IronClaw checks:

```bash
ironclaw --profile "${IRONCLAW_PROFILE:-ironclaw}" --version
ironclaw --profile "${IRONCLAW_PROFILE:-ironclaw}" gateway status --json
```

If gateway is down:

```bash
ironclaw --profile "${IRONCLAW_PROFILE:-ironclaw}" gateway start
```

## 6) Start Yogurt (correct way)

From repo root:

```bash
npm run dev
```

Or workspace-specific:

```bash
npm run -w @yogurt/desktop dev
```

Important:

- Start from the **Yogurt repo path**, not another project.
- Do **not** use generic `open -a Electron`; that can open Electron default shell or another project app.

## 7) First in-app run

1. Open **Tasks**
2. Click **Connect Granola**
3. Complete browser OAuth and return to the app
4. Click **Sync Granola**
5. Start any task and confirm timeline + final result appear in chat

## 8) Quick troubleshooting

### A) Random Electron app opens

You likely launched Electron from the wrong project.

1. Stop wrong Electron processes
2. Relaunch from Yogurt:

```bash
cd /path/to/yogurt
npm run -w @yogurt/desktop dev
```

### B) Task says connected but doesn’t stream correctly

Run:

```bash
npm run doctor
ironclaw --profile "${IRONCLAW_PROFILE:-ironclaw}" gateway status --json
```

Then in app: **Reconnect** in Tasks runtime area.

### C) Browser pops to foreground unexpectedly

Yogurt runs task execution background-first by default; users can still open IronClaw manually via **Open in IronClaw**.

## 9) Where local data is stored

Yogurt data is saved under:

- `~/Library/Application Support/Yogurt/granola` (macOS Electron userData path)

Files include:

- `granola-token.enc`
- `meetings-cache.json`
- `todo-store.json`
- `task-chat-store.json`

