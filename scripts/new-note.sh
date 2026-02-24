#!/bin/bash

# Create a new note with pre-filled frontmatter
# Usage: npm run new <topic> <slug>
# Example: npm run new crypto zk-rollups
# Example: npm run new psychology dunning-kruger
# Example: npm run new uncategorized random-thought

# Read topics from the single source of truth in src/types/content.ts
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TYPES_FILE="$SCRIPT_DIR/../src/types/content.ts"
TOPICS=$(sed -n '/^const TOPIC_CONFIG/,/^}/p' "$TYPES_FILE" | grep '^\s*[a-z]' | grep -v '=' | sed 's/:.*//' | sed 's/^[[:space:]]*//' | tr '\n' ' ')
TODAY=$(date +%Y-%m-%d)

# --- Parse args ---
TOPIC="$1"
SLUG="$2"

if [ -z "$TOPIC" ]; then
  echo ""
  echo "  🌱 New note"
  echo ""
  echo "  Usage: npm run new <topic> <slug>"
  echo ""
  echo "  Topics: $TOPICS"
  echo ""
  echo "  Examples:"
  echo "    npm run new crypto zk-rollups"
  echo "    npm run new psychology dunning-kruger"
  echo "    npm run new philosophy free-will"
  echo "    npm run new technology local-first"
  echo "    npm run new uncategorized showers-thoughts"
  echo ""
  exit 1
fi

# Validate topic
if ! echo "$TOPICS" | grep -qw "$TOPIC"; then
  echo "  Error: unknown topic \"$TOPIC\""
  echo "  Valid topics: $TOPICS"
  exit 1
fi

if [ -z "$SLUG" ]; then
  echo "  Error: please provide a slug (e.g. zk-rollups)"
  echo "  Usage: npm run new $TOPIC <slug>"
  exit 1
fi

FILE="content/notes/$TOPIC/$SLUG.mdx"

if [ -f "$FILE" ]; then
  echo "  Error: $FILE already exists"
  exit 1
fi

# Auto-create topic directory if it doesn't exist
mkdir -p "content/notes/$TOPIC"

# Create the note
cat > "$FILE" << EOF
---
title: "${SLUG//-/ }"
date: $TODAY
stage: seedling
topic: $TOPIC
tags: []
connections: []
---

Write your thoughts here...
EOF

echo ""
echo "  🌱 Created: $FILE"
echo ""
echo "  Next steps:"
echo "    1. Update the title in the frontmatter"
echo "    2. Add tags: [tag1, tag2, tag3]"
echo "    3. Update stage: (seedling, budding, evergreen)"
echo "    4. Write your note below the ---"
echo "    5. Connections will be auto-discovered from shared tags"
echo ""
