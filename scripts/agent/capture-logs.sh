#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_lib.sh"

load_agent_env

RUN_ID="$(date -u +"%Y-%m-%dT%H-%M-%SZ")"
AUDIT_DIR="${ROOT}/.agent/audit/${RUN_ID}"
SINCE="${AGENT_LOG_SINCE:-15m}"
PLAYWRIGHT_REPORT="${PLAYWRIGHT_REPORT:-}"
FAILED_SPECS_JSON="${FAILED_SPECS:-[]}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

cat >"${AUDIT_DIR}/manifest.json" <<EOF
{
  "timestamp": "${TIMESTAMP}",
  "runId": "${RUN_ID}",
  "testCommand": "${AGENT_TEST_COMMAND:-manual}",
  "playwrightReport": "${PLAYWRIGHT_REPORT}",
  "failedSpecs": ${FAILED_SPECS_JSON},
  "serverLogs": {
    "api": "server-api.log",
    "web": "server-web.log"
  }
}
EOF

echo "Wrote failure audit bundle: ${AUDIT_DIR}"
