# Operations

## Prerequisites

1. Node.js 22+
2. IronClaw installed globally (`ironclaw` on PATH)
3. A valid IronClaw profile (default: `ironclaw`)
4. Granola MCP endpoint reachability (default: `https://mcp.granola.ai/mcp`)

## Environment Variables

Yogurt reads runtime configuration from environment variables:

- `GRANOLA_MCP_URL` (default: `https://mcp.granola.ai/mcp`)
- `GRANOLA_OPENCLAW_LEGACY_DATA_DIR` (optional legacy import source)
- `IRONCLAW_PROFILE` (default: `ironclaw`)
- `IRONCLAW_MIN_VERSION` (default: `2026.2.15-1.7`)
- `TOKEN_ENCRYPTION_KEY` (recommended for token encryption)

## Health Checks

Run:

```bash
npm run doctor
```

This validates:

- IronClaw binary/version/profile/gateway state
- Granola MCP endpoint reachability
- OAuth callback port availability (`127.0.0.1:43110`)
- App data path readability
- Legacy source availability for one-time migration

## Connect + Sync Runbook

1. Start Yogurt (`npm run dev` from repo root).
2. Click sidebar `Connect Granola`.
3. Complete OAuth in browser and return to app.
4. Sidebar button becomes `Sync Granola`.
5. Click `Sync Granola` and verify tasks appear in Tasks list.

## Legacy Import Behavior

On first desktop launch only, Yogurt can import prior task state if configured source exists.

Imported files:

- `granola-token.enc`
- `meetings-cache.json`
- `todo-store.json`

Migration marker:

- `.legacy-openclaw-import.json`

## Common Fixes

1. IronClaw gateway not reachable:

```bash
ironclaw --profile "$IRONCLAW_PROFILE" gateway start
```

2. Validate gateway status:

```bash
ironclaw --profile "$IRONCLAW_PROFILE" gateway status --json
```

3. Validate dashboard URL:

```bash
ironclaw --profile "$IRONCLAW_PROFILE" dashboard --no-open
```
