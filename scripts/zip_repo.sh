#!/usr/bin/env bash
set -e

REPO_NAME=$(basename "$(pwd)")
OUTPUT="../${REPO_NAME}.zip"

zip -r "$OUTPUT" . \
  -x "*/node_modules/*" \
     "*/.next/*" \
     "*/dist/*" \
     "*/.git/*"

echo "Created $OUTPUT"
