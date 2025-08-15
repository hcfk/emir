#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_PATH:?DEPLOY_PATH required}"   # e.g., /var/www/emir-portal
RELEASES="$DEPLOY_PATH/releases"
TS="$(date +%Y%m%d%H%M%S)"
NEW="$RELEASES/$TS"

# --- The workflow already rsyncs the repo into $NEW ---

# 1) Build API
if [ -f "$NEW/api/package.json" ]; then
  cd "$NEW/api"
  # Pick the package manager based on lockfile
  if [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile && pnpm build || true
  elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile && yarn build || true
  else npm ci && npm run build || true
  fi
fi

# 2) Build Web (React)
if [ -f "$NEW/web/package.json" ]; then
  cd "$NEW/web"
  if [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile && pnpm build
  elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile && yarn build
  else npm ci && npm run build
  fi
fi

# 3) Atomic activate
ln -sfn "$NEW" "$DEPLOY_PATH/current"

# 4) Restart API
if systemctl is-active --quiet emir-portal; then
  sudo systemctl restart emir-portal
else
  sudo systemctl start emir-portal
fi

# 5) Keep last 5 releases
ls -1dt "$RELEASES"/* | tail -n +6 | xargs -r rm -rf

echo "Deployed $TS"
