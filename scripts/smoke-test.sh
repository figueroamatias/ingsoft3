#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "Uso: $0 <backend-url> <frontend-url> <expected-sha>" >&2
  exit 2
fi

backend_url="${1%/}"
frontend_url="${2%/}"
expected_sha="$3"
attempts="${SMOKE_ATTEMPTS:-40}"
delay_seconds="${SMOKE_DELAY_SECONDS:-15}"

request() {
  curl --silent --show-error --fail --max-time 10 "$1"
}

check_environment() {
  local health categories frontend version

  health="$(request "${backend_url}/health")" || return 1
  EXPECTED_SHA="$expected_sha" node -e '
    const fs = require("node:fs");
    const data = JSON.parse(fs.readFileSync(0, "utf8"));
    if (data.status !== "ok" || data.database !== "connected" || data.version !== process.env.EXPECTED_SHA) process.exit(1);
  ' <<< "$health" || return 1

  categories="$(request "${backend_url}/api/categories")" || return 1
  node -e '
    const fs = require("node:fs");
    const data = JSON.parse(fs.readFileSync(0, "utf8"));
    if (!Array.isArray(data) || data.length === 0) process.exit(1);
  ' <<< "$categories" || return 1

  frontend="$(request "${frontend_url}/")" || return 1
  grep -F "TP6 · Continuous Delivery" <<< "$frontend" > /dev/null || return 1

  version="$(request "${frontend_url}/version")" || return 1
  EXPECTED_SHA="$expected_sha" node -e '
    const fs = require("node:fs");
    const data = JSON.parse(fs.readFileSync(0, "utf8"));
    if (data.version !== process.env.EXPECTED_SHA) process.exit(1);
  ' <<< "$version"
}

for ((attempt = 1; attempt <= attempts; attempt += 1)); do
  if check_environment; then
    echo "Smoke test correcto: frontend, backend, PostgreSQL y SHA verificados."
    exit 0
  fi

  echo "Intento ${attempt}/${attempts}: el entorno todavía no está listo."
  if (( attempt < attempts )); then
    sleep "$delay_seconds"
  fi
done

echo "El entorno no quedó listo después de ${attempts} intentos." >&2
exit 1
