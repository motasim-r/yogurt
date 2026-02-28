#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
OUT_DIR="${1:-$ROOT_DIR/analysis/granola/recon/runtime}"
APP_NAME="${2:-Granola}"
APP_SLUG="$(printf '%s' "$APP_NAME" | tr '[:upper:] ' '[:lower:]-')"

mkdir -p "$OUT_DIR"
REPORT="$OUT_DIR/runtime-observation.md"
SHOT="$OUT_DIR/${APP_SLUG}-screen-test.png"

open -a "$APP_NAME" || true
sleep 2

process_present="$(osascript -e "tell application \"System Events\" to (name of processes) contains \"$APP_NAME\"" 2>/dev/null || true)"
accessibility_probe="$(osascript <<APPLE 2>/dev/null || true
try
  tell application "System Events"
    if exists process "$APP_NAME" then
      tell process "$APP_NAME"
        return "WINDOWS:" & (count of windows)
      end tell
    end if
  end tell
on error errMsg number errNum
  return "ERR:" & errNum & ":" & errMsg
end try
APPLE
)"

screenshot_status="ok"
if ! screencapture -x "$SHOT" 2>/dev/null; then
  screenshot_status="failed"
fi

{
  echo "# Runtime Observation"
  echo
  echo "- App process detected: ${process_present:-unknown}"
  echo "- Accessibility probe: ${accessibility_probe:-unknown}"
  echo "- Screenshot capture status: ${screenshot_status}"
  if [[ "$screenshot_status" == "ok" ]]; then
    echo "- Screenshot path: \`$SHOT\`"
  else
    echo "- Screenshot path: unavailable (permission or display capture issue)"
  fi
} > "$REPORT"

echo "[done] runtime report: $REPORT"
