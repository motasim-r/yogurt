#!/bin/zsh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

if lsof -nP -iTCP:5173 -sTCP:LISTEN >/dev/null 2>&1; then
  npm run -w @yogurt/desktop start:electron-dev
else
  npm run -w @yogurt/desktop dev
fi
