# Contributing

Thanks for contributing to Yogurt.

## Setup

1. Install Node.js 22+.
2. Run `npm install` from repo root.
3. Run `npm run doctor`.
4. Start dev environment with `npm run dev`.

## Development Standards

- Keep Tasks UI and chat UX changes accessible and test-covered.
- Preserve existing IPC contracts unless explicitly versioned.
- Prefer additive migrations for persisted data formats.
- Use strict TypeScript and keep `npm run typecheck` clean.

## Validation Before PR

Run from repo root:

```bash
npm run typecheck
npm run test
npm run build
npm run doctor
```

## Scope Guidance

- `apps/desktop`: product UI + Electron wiring
- `packages/granola-pipeline`: ingestion and extraction logic
- `packages/execution-ironclaw`: execution adapter

## Security Notes

- Never commit private auth tokens.
- Keep OAuth callback behavior local-only (`127.0.0.1`).
- Review any external-link handling changes in Electron main process.
