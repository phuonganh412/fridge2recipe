#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

FULL=false
if [[ "${1:-}" == "--full" ]]; then
  FULL=true
fi

if [[ -f "$COMPOSE_FILE" ]]; then
  echo "Stopping agent containers..."
  compose down --remove-orphans || true
fi

if [[ "$FULL" == true ]]; then
  echo "Stopping local Supabase..."
  supabase stop || true
fi

echo "Agent stack stopped."
