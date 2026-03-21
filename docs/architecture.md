# Architecture

See the product doctrine first: [`docs/yogurt-soul.md`](./yogurt-soul.md).

## Future Architecture Doctrine

The long-term architecture should optimize for one thing above all: living company context.

That means Yogurt should grow toward a system where:

- meetings, chats, docs, tasks, email, and decisions are treated as connected context objects
- AI operates on top of shared context, not isolated prompts
- citations and provenance are first-class
- unstructured context is accepted first, then structured only when useful
- workflow actions sit above the context layer rather than living in disconnected feature silos

In practical terms, the target shape is a work operating layer, not only a task pipeline.

## Current Architecture (Today)

Today, the repo is an early desktop slice of that larger architecture. The strongest implemented path is still the task execution flow, but the app now includes additional context surfaces such as Home, Chat, and Docs.

## Current End-to-End Dataflow

1. User connects Granola via browser OAuth from the Electron app.
2. `GranolaTaskService` syncs meeting data from MCP tools.
3. Synced context is cached locally and exposed to multiple app surfaces:
   - Home / notes
   - cross-meeting chat
   - task extraction and task workflows
4. `GranolaDocsService` manages the local docs workspace state.
5. `@yogurt/granola-pipeline` normalizes meeting context and extracts actionable tasks.
6. Task execution requests are routed to `@yogurt/execution-ironclaw`.
7. IronClaw stream events are translated into realtime task chat events.
8. Renderer consumes feed, chat, docs, and task state through IPC and realtime events.

## Module Boundaries

- `apps/desktop/electron/granolaTasks/task-service.ts`
  Main-process orchestrator for auth lifecycle, meeting sync, task extraction, task chat, Granola chat state, IPC methods, and realtime fanout.

- `apps/desktop/electron/granolaTasks/granola-docs-service.ts`
  Main-process local docs workspace service and persistence layer for the current docs surface.

- `packages/granola-pipeline/src/*`
  Pipeline modules for cache/token/todo stores, meeting sync, extraction helpers, and typed models.

- `packages/execution-ironclaw/src/ironclaw-runtime.ts`
  IronClaw CLI adapter for probe/reconnect/start-run and stream parsing.

- `apps/desktop/src/screens/GranolaHomeScreen.tsx`
  Main desktop shell for Home, Chat, and Tasks surfaces.

- `apps/desktop/src/screens/DocsWorkspace.tsx`
  Docs surface inside the desktop product shell.

## Persistence

Runtime files are saved under Electron `app.getPath('userData')/granola`.

Typical files:

- `granola-token.enc`
- `meetings-cache.json`
- `todo-store.json`
- `task-chat-store.json`
- `granola-chat-store.json`
- `granola-docs-store.json`
- `.legacy-openclaw-import.json`

These stores are still implementation-oriented and local-first. They are not yet a generalized cross-surface context graph, but they already point toward that future model.

## Realtime Contract

Main process emits task events over `tasks:event` channel:

- `task-chat-message`
- `task-chat-delta`
- `task-chat-status`
- `task-run`
- `tasks-feed-updated`

Renderer updates task chat/thread/feed state incrementally from this stream. Home and Chat also use these updates to refresh derived context views. Docs is currently request-response based rather than event-stream based.
