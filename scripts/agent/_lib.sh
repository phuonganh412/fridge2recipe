#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="${ROOT}/docker-compose.agent.yml"
ENV_FILE="${ROOT}/.env.agent.local"

cd "$ROOT"

load_agent_env() {
  if [[ -f "$ENV_FILE" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
  fi
  export AGENT_MODE=1
}

require_env_file() {
  if [[ ! -f "$ENV_FILE" ]]; then
    echo "Missing ${ENV_FILE}." >&2
    echo "Copy .env.agent.example to .env.agent.local and fill keys from: supabase status" >&2
    exit 1
  fi
}

compose() {
  docker compose -f "$COMPOSE_FILE" "$@"
}

check_required_env_vars() {
  local missing=()
  for key in NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY SUPABASE_JWT_SECRET; do
    if [[ -z "${!key:-}" ]]; then
      missing+=("$key")
    fi
  done
  if ((${#missing[@]} > 0)); then
    echo "Missing required values in .env.agent.local: ${missing[*]}" >&2
    echo "Run 'supabase status' after 'supabase start' and copy the keys." >&2
    exit 1
  fi
}
