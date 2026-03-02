# AGENTS.md

## Scope

Instructions in this file apply to the entire `yogurt` repository.

## UI-First Runtime Policy (Desktop)

When a request references UI behavior or elements in `apps/desktop`, treat runtime inspection as mandatory first step.

### Trigger Conditions

Apply this policy when the request mentions any of:

- UI element behavior (buttons, inputs, lists, panels, layout)
- visual regression/rendering issue
- navigation/click flow issue
- "what I am seeing in the app"
- flaky runtime interaction in the desktop UI

### Required Sequence

1. Launch app with CDP:
   - `npm run -w @yogurt/desktop dev:cdp`
2. If blocked (for example, `5173` busy), fallback:
   - `npm run -w @yogurt/desktop start:cdp`
3. Capture context bundle before changing code:
   - `npm run -w @yogurt/desktop cdp:capture -- --label <task-slug>`
4. Connect and inspect with agent-browser:
   - `npx -y agent-browser --cdp 9222 snapshot -i`
5. Perform requested interaction(s), then capture post-action evidence:
   - `npx -y agent-browser --cdp 9222 screenshot apps/desktop/artifacts/<timestamp-task>/after.png`
   - `npx -y agent-browser --cdp 9222 snapshot --json > apps/desktop/artifacts/<timestamp-task>/after.json`
6. In the response, include:
   - Observed in app
   - Evidence files
   - Likely failing UI step

Prefer the `electron` skill for this workflow.

### Fallback Rule (Blocked Runtime)

If runtime inspection cannot start (CDP/port/startup issues), continue with code/tests and explicitly report:

- attempted runtime commands
- blocking error
- fallback validation path taken

## Test vs Runtime Decision Rules

- Use `vitest` (`npm run -w @yogurt/desktop test`) when the issue is logic/data behavior with clear unit boundaries.
- Use CDP runtime inspection first for all trigger conditions above.
- Use both when runtime repro is required and the fix should be protected by tests.
- For non-UI tasks, use normal code-first workflow and do not force runtime launch.

## Reference

- Detailed runbook: `docs/electron-cdp-debugging.md`
