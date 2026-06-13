#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

require_env_file
load_agent_env
check_required_env_vars

echo "Starting local Supabase..."
if supabase status >/dev/null 2>&1; then
  echo "Supabase already running."
else
  supabase start
fi

echo "Starting agent stack (web + api)..."
compose up -d --wait

echo "Agent stack is ready."
echo "  web: http://localhost:3000"
echo "  api: http://localhost:3001/health"
