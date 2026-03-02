# Yogurt Capability Positioning

## What Yogurt Is

Yogurt is a pilot-ready internal desktop copilot for turning Granola meeting context into executable work. It combines Granola MCP ingestion, structured task extraction, and IronClaw execution in one Electron app so operators can connect, sync, run, and review work from a single workflow instead of stitching tools together manually.

## Verified Capability Baseline (Code + Test Backed)

Primary evidence sources:

- `docs/architecture.md`
- `docs/operations.md`
- `apps/desktop/src/shared/types.ts`
- `apps/desktop/electron/granolaTasks/task-service.test.ts`
- `apps/desktop/src/App.test.tsx`
- `packages/execution-ironclaw/src/ironclaw-runtime.test.ts`

### Implemented + Tested

- Granola auth flow with pending authorization handling, redirect validation, stale-auth invalidation, and actionable auth errors.
- Meeting sync with bounded transcript pull strategy, warning deduplication, and rate-limit cooldown handling.
- Task extraction with deterministic fingerprinting/source hashing and duplicate prevention.
- Task persistence across restarts for todos and chat threads.
- Plan-before-run workflow with multiple options, one recommended option, and custom planning guidance.
- IronClaw execution orchestration with global run queueing, per-task session isolation, and run metadata persistence.
- Streaming chat timeline with assistant deltas, thought/tool/source traces, and completion/failure phase events.
- In-app run operations including open dashboard, cancel/clear thread, paginated thread loading, and runtime check/reconnect actions.

### Implemented With Operational Caveat

- End-to-end workflow depends on external services being healthy:
  - Granola MCP endpoint reachability
  - IronClaw binary/profile/gateway readiness
  - local OAuth callback port availability (`127.0.0.1:43110`)
- Desktop runtime is the canonical path; browser fallback intentionally limits capabilities.

### Not Yet Implemented / Future

- Broader deployment model beyond desktop-first local runtime.
- Higher-assurance operational packaging (for example, stronger automatic recovery UX and richer operator diagnostics by default).
- Additional quality controls for output consistency and run observability at team scale.

## What It Can Do Today

- Connect to Granola and sync meetings/notes context from MCP.
- Extract actionable tasks and maintain a local, deduplicated tasks feed.
- Let users review planning options before execution (including custom guidance).
- Run tasks through IronClaw and stream progress/results into in-app task chat.
- Preserve history and traces so users can inspect what happened and why.
- Perform runtime health checks and manual reconnect/recovery actions from the app workflow.

## Demo Flow (5 Steps)

1. Launch Yogurt and click `Connect Granola`.
2. Complete browser OAuth and return to the app.
3. Click `Sync Granola` and verify tasks appear in the feed.
4. Open a task, review plan options (or add planning guidance), then click `Start Task`.
5. Watch timeline/chat streaming, inspect traces/sources, and open the run in IronClaw if needed.

## Operational Reality (Dependencies + Constraints)

- Yogurt is currently desktop-first and optimized for local operator workflows.
- Reliability is coupled to Granola MCP + IronClaw availability and local environment health.
- Port or gateway conflicts can degrade auth/sync/run flows until resolved.
- Health checks and reconnect paths exist, but resilience polish is still an active area.

## Why It’s Valuable to Granola Team Now

- Gives one practical surface to test the full loop from meeting context to executed output.
- Reduces handoff friction between ingestion, extraction, planning, and execution.
- Makes runtime behavior observable with feed/chat/timeline traces for faster debugging and iteration.
- Creates a concrete platform to validate product decisions before broader rollout.

## 90-Day Roadmap (Now / Next / Later)

### Now (0-30 days): Reliability Hardening

- Improve OAuth callback and gateway conflict handling paths.
- Tighten sync/error diagnostics clarity in UI and logs.
- Strengthen deterministic task execution trace quality and replayability.

### Next (31-60 days): Operator Confidence

- Improve failure recovery UX for auth/sync/run interruptions.
- Add stronger task quality controls and guardrails around execution.
- Improve setup and healthcheck ergonomics for faster onboarding/debug cycles.

### Later (61-90 days): Team Adoption

- Improve quality/consistency of generated deliverables and summaries.
- Expand run observability for easier triage and performance tracking.
- Polish workflows for wider internal usage across product/ops/engineering.

## GitHub-Ready Copy Variants

### One-Line Tagline

Desktop copilot for turning Granola meeting context into executable tasks via IronClaw.

### Short Description (2-3 lines)

Yogurt is a pilot-ready internal Electron app that connects Granola MCP context to task extraction, planning, and IronClaw execution.  
It provides a single operator workflow for syncing meetings, running tasks, and reviewing real-time run traces in app.

### What Works Now

- Granola OAuth + sync into a local task feed
- Deduplicated task extraction and persistence
- Plan-before-run task workflow with custom guidance
- IronClaw execution queueing with streaming chat/timeline traces
- Runtime checks and reconnect operations

### What We’re Improving Next

- OAuth/gateway reliability under local environment conflicts
- Clearer sync/run diagnostics and recovery UX
- Stronger output quality controls and run observability
