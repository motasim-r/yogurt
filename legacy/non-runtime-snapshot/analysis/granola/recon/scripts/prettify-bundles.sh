#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
RAW_DIR="${1:-$ROOT_DIR/analysis/granola/raw/extracted-app}"
OUT_DIR="${2:-$ROOT_DIR/analysis/granola/recon/prettified}"

if [[ ! -d "$RAW_DIR" ]]; then
  echo "error: extracted app directory not found at $RAW_DIR" >&2
  exit 1
fi

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

count=0
while IFS= read -r -d '' src; do
  rel="${src#$RAW_DIR/}"
  dst="$OUT_DIR/$rel"
  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
  count=$((count + 1))
done < <(
  find "$RAW_DIR/dist-electron/main" "$RAW_DIR/dist-electron/preload" "$RAW_DIR/dist-app/assets" "$RAW_DIR/dist-app" \
    -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) -print0
)

if command -v npx >/dev/null 2>&1; then
  find "$OUT_DIR" -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) -print0 \
    | xargs -0 npx --yes prettier --log-level warn --write >/dev/null 2>&1 || true
fi

echo "[done] prettified files: $count"
echo "[out] $OUT_DIR"
