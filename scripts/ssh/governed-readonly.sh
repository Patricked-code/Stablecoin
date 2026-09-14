#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-}"
TARGET_PATH="${2:-}"
EXPECTED_REPOSITORY="${3:-Patricked-code/Stablecoin}"

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

sanitize_remote() {
  sed -E 's#(https?://)[^/@]+@#\1***@#; s#(https?://)[^:/]+:[^/@]+@#\1***:***@#'
}

inventory() {
  echo "=== SERVER_IDENTITY ==="
  printf 'timestamp='; date -Is 2>/dev/null || date
  printf 'hostname='; hostname
  printf 'user='; id -un
  printf 'uid='; id -u
  printf 'kernel='; uname -sr
  printf 'pwd='; pwd
  if [ "$(id -u)" = "0" ]; then
    echo "policy_violation=root_login"
    exit 20
  fi
}

git_state() {
  echo "=== GIT_STATE ==="
  [ -n "$TARGET_PATH" ] || fail "target path is required"
  [ -d "$TARGET_PATH" ] || fail "target path does not exist"
  cd "$TARGET_PATH"
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "target path is not a git worktree"

  printf 'repo_root='; git rev-parse --show-toplevel
  printf 'branch='; git branch --show-current
  printf 'head='; git rev-parse HEAD

  if git remote get-url origin >/dev/null 2>&1; then
    printf 'origin='
    git remote get-url origin | sanitize_remote
  else
    echo "origin=MISSING"
  fi

  if [ -z "$(git status --porcelain=v1)" ]; then
    echo "worktree=CLEAN"
  else
    echo "worktree=DIRTY"
    git status --porcelain=v1
  fi

  echo "expected_repository=$EXPECTED_REPOSITORY"
  echo "note=No fetch/pull/reset/switch was executed"
}

runtime_processes() {
  echo "=== RUNTIME_PROCESSES ==="
  ps -eo pid=,user=,comm= | awk '
    BEGIN { IGNORECASE=1 }
    $3 ~ /(node|passenger|pm2|nginx|apache2|httpd)/ { print }
  ' | head -n 100 || true
  echo "note=Command-line arguments and environment variables are intentionally omitted"
}

case "$ACTION" in
  inventory)
    inventory
    ;;
  git_state)
    inventory
    git_state
    ;;
  runtime_processes)
    inventory
    runtime_processes
    ;;
  full_readonly)
    inventory
    git_state
    runtime_processes
    ;;
  *)
    fail "action not allowlisted: $ACTION"
    ;;
esac
