# Yogurt Capability Positioning

See the doctrine first:

- [`docs/yogurt-soul.md`](./yogurt-soul.md)
- [`docs/yogurt-soul-appendix.md`](./yogurt-soul-appendix.md)

## What Yogurt Is

Yogurt is an AI-native work app built on living company context.

Its long-term job is to turn meetings, chats, docs, email, and decisions into one usable system that helps people think, coordinate, and get work done. The current repo is an early desktop slice of that broader product.

## North-Star Product Direction

The north-star direction is not "better meeting notes." It is:

- one work surface
- shared context across meetings, chat, docs, and tasks
- AI that can reason across that context
- citations and provenance by default
- workflows that move from answer to action

Yogurt is deliberately closer to:

- a context-native work app
- a meeting-first knowledge layer
- an AI-native workspace

than to a single-purpose note or task tool.

## What The Current Build Is

Today, Yogurt is a desktop-first internal product surface that already proves several parts of the larger thesis:

- Granola meeting context can be synced into a local work layer
- context can support multiple surfaces, not just notes
- AI chat can operate across that context
- docs and tasks can live in the same product shell
- execution workflows can be launched from shared context rather than from isolated prompts

That makes the current build narrower than the long-term product, but directionally correct.

## Verified Capability Baseline (Code + Test Backed)

Primary evidence sources:

- `docs/architecture.md`
- `docs/operations.md`
- `apps/desktop/src/shared/types.ts`
- `apps/desktop/electron/granolaTasks/task-service.test.ts`
- `apps/desktop/electron/granolaTasks/granola-docs-service.test.ts`
- `apps/desktop/src/App.test.tsx`
- `packages/execution-ironclaw/src/ironclaw-runtime.test.ts`

### Implemented + Tested

- Granola auth flow with pending authorization handling, redirect validation, stale-auth invalidation, and actionable auth errors.
- Meeting sync with bounded transcript pull strategy, warning deduplication, and rate-limit cooldown handling.
- Home feed and note-detail surfaces backed by synced Granola meeting cache.
- Cross-meeting AI chat plus local persisted chat threads for the in-app chat surface.
- Docs workspace with seeded local docs, search/filter/view modes, block editing, and local persistence.
- Task extraction with deterministic fingerprinting/source hashing and duplicate prevention.
- Task persistence across restarts for todos and task chat threads.
- Plan-before-run workflow with multiple options, one recommended option, and custom planning guidance.
- IronClaw execution orchestration with global run queueing, per-task session isolation, and run metadata persistence.
- Streaming task chat timeline with assistant deltas, thought/tool/source traces, and completion/failure phase events.
- In-app run operations including open dashboard, cancel/clear thread, paginated thread loading, and runtime check/reconnect actions.

### Implemented With Operational Caveat

- End-to-end workflow depends on external services being healthy:
  - Granola MCP endpoint reachability
  - IronClaw binary/profile/gateway readiness
  - local OAuth callback port availability (`127.0.0.1:43110`)
- Desktop runtime is the canonical path; browser fallback intentionally limits capabilities.

### Not Yet Implemented / Future

- Unified email and external context import in the main product flow.
- Shared team-grade collaboration and permissions beyond the current local-first slices.
- A generalized workflow/agent layer that starts work across the whole product, not just task execution.
- Broader deployment model beyond desktop-first local runtime.
- Higher-assurance operational packaging and richer operator diagnostics by default.

## What It Can Do Today

- Connect to Granola and sync meetings and notes context from MCP.
- Browse recent meeting context in Home and open note detail.
- Chat across synced context in the in-app Chat surface.
- Create and edit local docs inside the same desktop shell.
- Extract actionable tasks and maintain a local, deduplicated tasks feed.
- Let users review planning options before task execution.
- Run tasks through IronClaw and stream progress/results into in-app task chat.
- Preserve history and traces so users can inspect what happened and why.

## Why The Current Build Matters

The current build is valuable because it tests the right product loop:

1. context enters the system
2. context is made available across multiple surfaces
3. AI can reason over that context
4. work can begin from that context

This is bigger than a task demo. It is a concrete, runnable test of the claim that centralized company context can become the basis of a work app.

## Operational Reality

- Yogurt is currently desktop-first and optimized for local operator workflows.
- Reliability is still coupled to Granola MCP + IronClaw availability and local environment health.
- Some surfaces are more mature than others, and several are still local-first approximations of future collaborative systems.
- Health checks and reconnect paths exist, but resilience polish is still an active area.

## Near-Term Trajectory

### Now

- Improve OAuth callback and gateway conflict handling.
- Tighten sync and diagnostics clarity.
- Keep the current desktop work surfaces reliable.

### Next

- Make context flow more naturally across notes, chat, docs, and tasks.
- Strengthen the feeling of one work app rather than separate feature islands.
- Add more context imports and richer cross-surface behavior.

### Later

- Make AI more proactive and workflow-oriented.
- Grow the system from context answerer to work starter.
- Expand beyond the current desktop/operator slice into a fuller work system.

## Short Copy Variants

### One-Line Tagline

AI-native work app built on living company context.

### Short Description

Yogurt is an internal desktop product that turns Granola context into a broader work surface for notes, chat, docs, tasks, and execution workflows.
It is an early slice of a larger vision: one AI-native work app where company context becomes shared memory and actionable work.

### What Works Now

- Granola OAuth + sync into a local context layer
- Home, chat, docs, and tasks inside one desktop shell
- Deduplicated task extraction and persistence
- Plan-before-run task workflow with custom guidance
- IronClaw execution queueing with streaming chat/timeline traces

### What We Are Building Toward

- richer shared context
- less tool-switching
- stronger citations and provenance
- more proactive AI assistance
- a truer work app built on living company context
