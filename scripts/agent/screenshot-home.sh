#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh"
  nvm use >/dev/null 2>&1 || true
fi

HEADED=false
if [[ "${1:-}" == "--headed" ]]; then
  HEADED=true
fi

if ! curl -sf "${AGENT_WEB_URL:-http://localhost:3000}/" >/dev/null 2>&1; then
  echo "Web app is not reachable at ${AGENT_WEB_URL:-http://localhost:3000}." >&2
  echo "Start it with: pnpm dev:web (or pnpm agent:up)" >&2
  exit 1
fi

ARGS=()
if [[ "$HEADED" == true ]]; then
  ARGS+=(--headed)
fi

node "$(dirname "${BASH_SOURCE[0]}")/screenshot-home.mjs" "${ARGS[@]}"
