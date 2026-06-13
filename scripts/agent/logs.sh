#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

SINCE="${AGENT_LOG_SINCE:-15m}"
LEVEL=""
SAVE_DIR=""
SERVICES=(api web)

while [[ $# -gt 0 ]]; do
  case "$1" in
    --since)
      SINCE="$2"
      shift 2
      ;;
    --level)
      LEVEL="$2"
      shift 2
      ;;
    --save)
      SAVE_DIR="$2"
      shift 2
      ;;
    --service)
      SERVICES=("$2")
      shift 2
      ;;
    *)
      echo "Unknown option: $1" >&2
      echo "Usage: logs.sh [--since 15m] [--level error] [--save dir] [--service api|web]" >&2
      exit 1
      ;;
  esac
done

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "No agent compose stack found. Run pnpm agent:up first." >&2
  exit 1
fi

write_logs() {
  local service="$1"
  local dest="$2"
  compose logs "$service" --since "$SINCE" --no-color >"$dest" 2>&1 || true
}

stream_logs() {
  local output
  output="$(compose logs "${SERVICES[@]}" --since "$SINCE" --no-color 2>&1 || true)"
  if [[ -n "$LEVEL" ]]; then
    echo "$output" | grep -i "$LEVEL" || true
  else
    echo "$output"
  fi
}

if [[ -n "$SAVE_DIR" ]]; then
  mkdir -p "$SAVE_DIR"
  write_logs api "${SAVE_DIR}/server-api.log"
  write_logs web "${SAVE_DIR}/server-web.log"
  exit 0
fi

stream_logs
