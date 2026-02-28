# Renderer Route and State Map

## Directly observed from runtime screenshot

- Left navigation with primary sections (`Home`, shared/chat-like sections, note spaces)
- Main content timeline/list of meeting note entries
- Quick actions in top-right area

## Inferred from static bundle scan

- React Router present (`Router`, `AppRouter`, `InnerLayoutRouter`, `OuterLayoutRouter` symbols)
- Note-centric API endpoints in renderer bundle:
  - `claim-primary-event-note`
  - `get-note-opengraph-data`
  - `search-meetings-turbopuffer`
  - `send-notes-notification`
  - `transfer-notes`
- Settings and telemetry plumbing present in renderer bundle

## Prototype mapping used in milestone 1

- `dashboard`: list/timeline of notes + summary stats
- `note_detail`: selected note editor/detail panel
- `settings`: user preferences and toggles
