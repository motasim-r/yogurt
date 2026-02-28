# IPC Contract Draft (From Static Bundle Scan)

This draft is a filtered set of likely IPC/event channels discovered in `dist-electron/main` and `dist-electron/preload`.

## High-confidence channels

- `dock-icon:get`
- `dock-icon:set`
- `eventkit:get-authorization-status`
- `eventkit:get-calendars`
- `eventkit:request-access`
- `eventkit:set-enabled`
- `granola-talk:get-state`
- `granola-talk:start-transcription`
- `granola-talk:stop-transcription`
- `granola-talk:transcription`
- `granola:analytics`
- `granola:event`
- `granola:log`
- `granola:status`
- `meet-consent:set-enabled`
- `navigation:get-history`
- `notch:request_initial_state`
- `notch:visible`
- `nub:request_initial_state`
- `nub:transcript_chunk`
- `preferences:get-item`
- `preferences:set-item`
- `telemetry-session:get`
- `telemetry-session:start`
- `telemetry-session:stop`
- `transcription:get-buffer-state`

## Candidate internal transport channels

- `invoke:request`
- `invoke:reply`

## Notes

- Some channels may be internal pub/sub events instead of renderer-invokable IPC.
- Native module interactions are opaque; channels may fan into `.node` bindings not visible in JS scan.
