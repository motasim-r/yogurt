#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
EXTRACTED_DIR="${1:-$ROOT_DIR/analysis/granola/raw/extracted-app}"
OUT_DIR="${2:-$ROOT_DIR/analysis/granola/recon}"

mkdir -p "$OUT_DIR"

INDEX_HTML="$EXTRACTED_DIR/dist-app/index.html"
MAIN_ENTRY="$EXTRACTED_DIR/dist-electron/main/index.js"
PRELOAD_ENTRY="$EXTRACTED_DIR/dist-electron/preload/preload.js"

if [[ ! -f "$INDEX_HTML" ]]; then
  echo "error: missing $INDEX_HTML" >&2
  exit 1
fi

renderer_chunks_tmp="$(mktemp)"
ipc_tmp="$(mktemp)"
flags_tmp="$(mktemp)"
cleanup() {
  rm -f "$renderer_chunks_tmp" "$ipc_tmp" "$flags_tmp"
}
trap cleanup EXIT

rg -o 'assets/[A-Za-z0-9._-]+\.(js|css)' "$INDEX_HTML" | sort -u > "$renderer_chunks_tmp"

rg -n --no-messages -o '"[a-zA-Z0-9_.-]+:[a-zA-Z0-9_.:-]+"|\x27[a-zA-Z0-9_.-]+:[a-zA-Z0-9_.:-]+\x27' \
  "$EXTRACTED_DIR/dist-electron" "$EXTRACTED_DIR/dist-app" \
  | sed -E 's/^[^:]+:[0-9]+://' \
  | tr -d '"' \
  | tr -d "'" \
  | sort -u > "$ipc_tmp"

rg -n --no-messages -i 'feature|flag|enable|disable|beta|experiment' \
  "$EXTRACTED_DIR/dist-electron" "$EXTRACTED_DIR/dist-app" \
  > "$flags_tmp" || true

chunk_count="$(wc -l < "$renderer_chunks_tmp" | tr -d ' ')"
ipc_count="$(wc -l < "$ipc_tmp" | tr -d ' ')"
flag_count="$(wc -l < "$flags_tmp" | tr -d ' ')"

{
  echo "# Module Index"
  echo
  echo "## Entrypoints"
  echo '- Renderer HTML: `dist-app/index.html`'
  echo '- Electron main: `dist-electron/main/index.js`'
  echo '- Electron preload: `dist-electron/preload/preload.js`'
  echo
  echo "## Renderer Chunks ($chunk_count)"
  sed 's#^#- `#; s#$#`#' "$renderer_chunks_tmp"
  echo
  echo "## IPC-like Channel Candidates ($ipc_count)"
  sed 's#^#- `#; s#$#`#' "$ipc_tmp"
  echo
  echo "## Feature/Flag Text Hits ($flag_count)"
  if [[ "$flag_count" -gt 0 ]]; then
    sed 's#^#- #g' "$flags_tmp"
  else
    echo "- none detected by text scan"
  fi
  echo
  echo "## Notes"
  echo "- This is a static string scan of bundled artifacts and may include false positives."
  echo "- Original source maps are not present as physical files in the extracted bundle."
} > "$OUT_DIR/module-index.md"

cp "$ipc_tmp" "$OUT_DIR/ipc-strings.txt"
cp "$flags_tmp" "$OUT_DIR/feature-flags.txt"

echo "[done] module index written to $OUT_DIR/module-index.md"
