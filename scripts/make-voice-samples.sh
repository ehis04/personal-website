#!/usr/bin/env bash
# Makes the ready-made voice previews in public/media/voices/ from a running Worker.
# Usage: scripts/make-voice-samples.sh [base-url]   (default http://localhost:8787, see npm run preview:cf)
# Uses a little of the free daily voice allowance.
set -euo pipefail
cd "$(dirname "$0")/.."
base="${1:-http://localhost:8787}"
out=public/media/voices
mkdir -p "$out"
sample=$(sed -n 's/^export const VOICE_SAMPLE = "\(.*\)";$/\1/p' config/voices.ts)
for id in $(sed -n 's/^  { id: "\([a-z]*\)".*/\1/p' config/voices.ts); do
  curl -fsS -X POST "$base/api/speak" -H 'content-type: application/json' \
    -d "{\"text\":\"$sample\",\"voice\":\"$id\"}" -o "$out/$id.mp3"
  echo "made $out/$id.mp3"
done
