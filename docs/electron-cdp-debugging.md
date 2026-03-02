# Electron CDP Debugging

Use this runbook to debug runtime/UI issues in the Yogurt Electron app with `agent-browser` over Chrome DevTools Protocol (CDP).

## Prerequisites

- Install dependencies: `npm install`
- Electron app available in this repo (`apps/desktop`)
- Electron skill installed for Codex:
  - `npx skills add vercel-labs/agent-browser --skill electron -g -y`

## Start Yogurt with CDP Enabled

From repo root:

```bash
npm run -w @yogurt/desktop dev:cdp
```

For built/runtime behavior (non-dev server):

```bash
npm run -w @yogurt/desktop start:cdp
```

Default CDP port is `9222`.

## Connect and Inspect

In another terminal:

```bash
npx -y agent-browser --cdp 9222 snapshot -i
```

Common interactions:

```bash
npx -y agent-browser --cdp 9222 tab
npx -y agent-browser --cdp 9222 tab 2
npx -y agent-browser --cdp 9222 click @e10
npx -y agent-browser --cdp 9222 fill @e3 "example input"
npx -y agent-browser --cdp 9222 press Enter
npx -y agent-browser --cdp 9222 snapshot -i
```

## Mandatory Context Bundle

Before proposing a fix for UI issues, always capture a context bundle.

From repo root:

```bash
npm run -w @yogurt/desktop cdp:capture -- --label <task-slug>
```

The command creates:

- `apps/desktop/artifacts/<timestamp>-<task-slug>/before.png`
- `apps/desktop/artifacts/<timestamp>-<task-slug>/before.json`
- `apps/desktop/artifacts/<timestamp>-<task-slug>/manifest.json`

After interactions, capture post-action files in the same folder:

```bash
npx -y agent-browser --cdp 9222 screenshot apps/desktop/artifacts/<timestamp>-<task-slug>/after.png
npx -y agent-browser --cdp 9222 snapshot --json > apps/desktop/artifacts/<timestamp>-<task-slug>/after.json
```

## Required Response Format

For UI issue responses, include these sections:

- `Observed in app`
  - what was seen in runtime state and key element refs
- `Evidence files`
  - exact paths to `before/after` screenshots and snapshots
- `Likely failing UI step`
  - specific interaction or transition where behavior diverges

## Troubleshooting

- App already running without CDP:
  - Quit the app and relaunch with `npm run -w @yogurt/desktop dev:cdp` or `start:cdp`.
- `dev:cdp` fails because `5173` is already in use:
  - Use `npm run -w @yogurt/desktop start:cdp` instead.
- CDP connection fails on `9222`:
  - Wait 2-5 seconds after app launch.
  - Check port usage: `lsof -i :9222`.
  - Retry command using explicit CDP flag:
    - `npx -y agent-browser --cdp 9222 snapshot -i`
- Wrong window/webview:
  - Run `npx -y agent-browser --cdp 9222 tab` and switch with `... tab <index>`.
- Need code-level verification after runtime repro:
  - `npm run -w @yogurt/desktop test`
  - `npm run -w @yogurt/desktop typecheck`
