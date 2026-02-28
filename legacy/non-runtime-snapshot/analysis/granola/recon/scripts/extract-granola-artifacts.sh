#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
RAW_DIR="${1:-$ROOT_DIR/analysis/granola/raw}"
APP_PATH="${2:-/Applications/Granola.app}"

ASAR_PATH="$APP_PATH/Contents/Resources/app.asar"
UNPACKED_PATH="$APP_PATH/Contents/Resources/app.asar.unpacked"
NATIVE_PATH="$APP_PATH/Contents/Resources/native"
INFO_PLIST="$APP_PATH/Contents/Info.plist"

if [[ ! -f "$ASAR_PATH" ]]; then
  echo "error: app.asar not found at $ASAR_PATH" >&2
  exit 1
fi

mkdir -p "$RAW_DIR"
rm -rf "$RAW_DIR/extracted-app" "$RAW_DIR/app-asar-unpacked" "$RAW_DIR/native" "$RAW_DIR/metadata"
mkdir -p "$RAW_DIR/metadata"

echo "[extract] app.asar -> extracted-app"
npx --yes asar extract "$ASAR_PATH" "$RAW_DIR/extracted-app"

echo "[copy] app.asar.unpacked"
if [[ -d "$UNPACKED_PATH" ]]; then
  cp -R "$UNPACKED_PATH" "$RAW_DIR/app-asar-unpacked"
else
  mkdir -p "$RAW_DIR/app-asar-unpacked"
fi

echo "[copy] native modules"
if [[ -d "$NATIVE_PATH" ]]; then
  cp -R "$NATIVE_PATH" "$RAW_DIR/native"
else
  mkdir -p "$RAW_DIR/native"
fi

echo "[metadata] app info"
plutil -convert json -o "$RAW_DIR/metadata/info.plist.json" "$INFO_PLIST"
cp "$RAW_DIR/extracted-app/package.json" "$RAW_DIR/metadata/package.json"

echo "[inventory] manifest.tsv"
{
  printf "path\tsize\tsha256\n"
  while IFS= read -r -d '' file; do
    rel="${file#$RAW_DIR/}"
    size="$(stat -f%z "$file")"
    sha="$(shasum -a 256 "$file" | awk '{print $1}')"
    printf "%s\t%s\t%s\n" "$rel" "$size" "$sha"
  done < <(find "$RAW_DIR" -type f -print0 | LC_ALL=C sort -z)
} > "$RAW_DIR/manifest.tsv"

map_comment_count="$(rg -n --no-messages 'sourceMappingURL=' "$RAW_DIR/extracted-app/dist-electron" "$RAW_DIR/extracted-app/dist-app" | wc -l | tr -d ' ')"
map_file_count="$(find "$RAW_DIR/extracted-app" -type f -name '*.map' | wc -l | tr -d ' ')"
native_count="$(find "$RAW_DIR/native" -type f -name '*.node' | wc -l | tr -d ' ')"

cat > "$RAW_DIR/metadata/critical-truth.md" <<TRUTH
# Critical Truth Snapshot

- Bundled JS assets present: yes
- Source map comments present: ${map_comment_count}
- Physical .map files present: ${map_file_count}
- Native .node modules present: ${native_count}
- Implication: original TS/JSX source is not fully recoverable from this bundle alone.
TRUTH

echo "[done] raw artifacts prepared at $RAW_DIR"
