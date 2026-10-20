#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Uso: $0 <deploy-hook-url> <image-url>" >&2
  exit 2
fi

deploy_hook_url="$1"
image_url="$2"

if [[ -z "$deploy_hook_url" || -z "$image_url" ]]; then
  echo "El deploy hook y la imagen son obligatorios." >&2
  exit 2
fi

separator="?"
if [[ "$deploy_hook_url" == *"?"* ]]; then
  separator="&"
fi

encoded_image="$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "$image_url")"

curl \
  --silent \
  --show-error \
  --fail-with-body \
  --max-time 30 \
  --request POST \
  "${deploy_hook_url}${separator}imgURL=${encoded_image}" \
  > /dev/null

echo "Deploy solicitado para una imagen inmutable."
