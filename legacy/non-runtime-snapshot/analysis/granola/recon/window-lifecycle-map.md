# Window Lifecycle Map

## Observed runtime (current machine)

- Process present: `Granola`
- Window count via Accessibility: `1`
- Visible top-level window title: `Granola`

## Inferred window families from bundled names/events

- Main app window (meeting list / notes workspace)
- Notch overlay window (`notch:*` events)
- Nub/banner surfaces (`nub:*`, `nub-banner:*` events)
- Potential consent/transcription UI surfaces (`meet-consent:*`, `granola-talk:*`)

## Lifecycle notes

- Main app likely owns primary navigation and detail panes.
- Overlay windows are probably ephemeral and event-driven.
- Telemetry/session channels imply startup bootstrap and periodic heartbeat activity.
