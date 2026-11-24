#!/usr/bin/env bash
# Turn any video into the site's standard web clip + poster.
#
# Usage:   scripts/make-clip.sh <source-video> <name> [start-seconds] [portrait|landscape]
# Example: scripts/make-clip.sh ~/Videos/match.mp4 match-a 12 landscape
#
# Output:  public/media/<name>.mp4  (6 s, no audio, H.264 crf 28, faststart)
#          public/media/<name>.jpg  (poster frame taken at 1 s)
#
# ffmpeg: uses $FFMPEG if set, else `ffmpeg` on PATH. If neither exists, see
# HANDOFF.md Appendix B (pip install imageio-ffmpeg in a throwaway venv).
set -euo pipefail

SRC="${1:-}"; NAME="${2:-}"; START="${3:-0}"; ORIENT="${4:-portrait}"

if [[ -z "$SRC" || -z "$NAME" ]]; then
  sed -n '2,11p' "$0" | sed 's/^# \{0,1\}//'; exit 1
fi
[[ -f "$SRC" ]] || { echo "Source file not found: $SRC" >&2; exit 1; }
[[ "$NAME" =~ ^[a-z0-9-]+$ ]] || { echo "Name must be lowercase letters, digits and dashes." >&2; exit 1; }
[[ "$START" =~ ^[0-9]+(\.[0-9]+)?$ ]] || { echo "Start must be a number of seconds." >&2; exit 1; }

case "$ORIENT" in
  portrait)  SCALE="540:960" ;;
  landscape) SCALE="960:540" ;;
  *) echo "Orientation must be 'portrait' or 'landscape'." >&2; exit 1 ;;
esac

FF="${FFMPEG:-$(command -v ffmpeg || true)}"
if [[ -z "$FF" ]]; then
  echo "ffmpeg not found. Install it, or set FFMPEG=/path/to/ffmpeg." >&2
  echo "No-root option: see HANDOFF.md Appendix B (imageio-ffmpeg)." >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/media"; mkdir -p "$OUT"

if [[ -e "$OUT/$NAME.mp4" || -e "$OUT/$NAME.jpg" ]]; then
  echo "Refusing to overwrite existing public/media/$NAME.{mp4,jpg}. Pick another name." >&2
  exit 1
fi

# Scale to cover the frame, then centre-crop, so odd aspect ratios don't distort.
VF="scale=${SCALE}:force_original_aspect_ratio=increase,crop=${SCALE},format=yuv420p"

"$FF" -hide_banner -loglevel error -ss "$START" -i "$SRC" -t 6 -an -vf "$VF" \
  -c:v libx264 -preset medium -crf 28 -movflags +faststart "$OUT/$NAME.mp4"
"$FF" -hide_banner -loglevel error -ss 1 -i "$OUT/$NAME.mp4" -frames:v 1 -q:v 4 "$OUT/$NAME.jpg"

echo "Created:"
ls -l "$OUT/$NAME.mp4" "$OUT/$NAME.jpg" | awk '{print "  " $5 " bytes  " $9}'
