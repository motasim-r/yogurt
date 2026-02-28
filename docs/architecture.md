# Architecture

## End-to-End Dataflow

1. User connects Granola via browser OAuth from the Electron app.
2. `GranolaTaskService` syncs meeting data from MCP tools.
3. `@yogurt/granola-pipeline` normalizes context and extracts actionable tasks.
4. Tasks and auth/cache state are persisted in local app data.
5. Task execution requests are routed to `@yogurt/execution-ironclaw`.
6. IronClaw stream events are translated into realtime chat events.
7. Renderer consumes events and renders in-app task chat streaming UI.

## Module Boundaries

- `apps/desktop/electron/granolaTasks/task-service.ts`
  Main-process orchestrator, auth lifecycle, scheduling, IPC methods, realtime fanout.

- `packages/granola-pipeline/src/*`
  Pipeline modules for cache/token/todo stores, meeting sync, extraction helpers, typed models.

- `packages/execution-ironclaw/src/ironclaw-runtime.ts`
  IronClaw CLI adapter for probe/reconnect/start-run and stream parsing.

- `apps/desktop/src/screens/GranolaHomeScreen.tsx`
  Primary product UI for task list and task chat workflow.

## Persistence

Runtime files are saved under Electron `app.getPath('userData')/granola`.

Typical files:

- `granola-token.enc`
- `meetings-cache.json`
- `todo-store.json`
- `task-chat-store.json`
- `.legacy-openclaw-import.json`

## Realtime Contract

Main process emits task events over `tasks:event` channel:

- `task-chat-message`
- `task-chat-delta`
- `task-chat-status`
- `task-run`
- `tasks-feed-updated`

Renderer updates chat/thread/feed state incrementally from this stream.
