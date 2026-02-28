#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
BASE_RAW="$ROOT_DIR/analysis/granola/raw"
EXTRACT_SCRIPT="$ROOT_DIR/analysis/granola/recon/scripts/extract-granola-artifacts.sh"

if [[ ! -f "$BASE_RAW/manifest.tsv" ]]; then
  echo "error: baseline manifest missing at $BASE_RAW/manifest.tsv" >&2
  exit 1
fi

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

"$EXTRACT_SCRIPT" "$tmpdir"

baseline_hash="$(shasum -a 256 "$BASE_RAW/manifest.tsv" | awk '{print $1}')"
trial_hash="$(shasum -a 256 "$tmpdir/manifest.tsv" | awk '{print $1}')"

if [[ "$baseline_hash" != "$trial_hash" ]]; then
  echo "manifest mismatch"
  echo "baseline: $baseline_hash"
  echo "trial:    $trial_hash"
  exit 1
fi

echo "manifest reproducibility: ok"
echo "hash: $baseline_hash"
