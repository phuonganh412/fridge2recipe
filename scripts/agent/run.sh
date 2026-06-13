#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

require_env_file
load_agent_env

MAX_ITERATIONS="${AGENT_MAX_ITERATIONS:-10}"
WALL_CLOCK_MINUTES="${AGENT_WALL_CLOCK_MINUTES:-120}"
START_EPOCH="$(date +%s)"
ITERATION=0

cleanup() {
  echo "Running agent teardown..."
  "$(dirname "${BASH_SOURCE[0]}")/down.sh" || true
}

trap cleanup EXIT

"$(dirname "${BASH_SOURCE[0]}")/up.sh"
"$(dirname "${BASH_SOURCE[0]}")/seed.sh"

while ((ITERATION < MAX_ITERATIONS)); do
  ITERATION=$((ITERATION + 1))
  NOW="$(date +%s)"
  ELAPSED_MINUTES=$(((NOW - START_EPOCH) / 60))

  if ((ELAPSED_MINUTES >= WALL_CLOCK_MINUTES)); then
    echo "Wall clock limit reached (${WALL_CLOCK_MINUTES}m)." >&2
    exit 1
  fi

  echo "Agent iteration ${ITERATION}/${MAX_ITERATIONS} — stack is up. Press Ctrl+C to stop."
  sleep 60
done

echo "Max iterations (${MAX_ITERATIONS}) reached." >&2
exit 0
