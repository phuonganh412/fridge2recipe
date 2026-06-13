#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

require_env_file

# Host-side scripts reach local Supabase on loopback, not the Docker host alias.
if [[ "${SUPABASE_URL:-}" == *"host.docker.internal"* ]]; then
  export SUPABASE_URL="${SUPABASE_URL/host.docker.internal/127.0.0.1}"
fi

node --env-file="$ENV_FILE" "$(dirname "${BASH_SOURCE[0]}")/seed.mjs"
