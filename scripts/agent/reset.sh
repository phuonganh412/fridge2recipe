#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

require_env_file
load_agent_env

"$(dirname "${BASH_SOURCE[0]}")/down.sh"

echo "Resetting local database..."
supabase db reset --local

echo "Seeding agent test user..."
"$(dirname "${BASH_SOURCE[0]}")/seed.sh"

"$(dirname "${BASH_SOURCE[0]}")/up.sh"

echo "Agent stack reset complete."
