#!/usr/bin/env bash
set -euo pipefail

missing=0
for cmd in ffmpeg ffprobe node npm; do
  if command -v "$cmd" >/dev/null 2>&1; then
    printf "%-8s %s\n" "$cmd" "$(command -v "$cmd")"
  else
    printf "%-8s MISSING\n" "$cmd"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  echo "Install missing tools before rendering videos."
  exit 1
fi

echo "Video environment looks ready."
