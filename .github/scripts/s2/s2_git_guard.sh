#!/usr/bin/env bash
# =============================================================================
# s2_git_guard.sh — Garde Git gouvernée du frontend Stablecoin sur S2 (canal de secours)
# Version : v1.0.0 — 2026-09-26 — DEC-2026-09-26-017
# Origine : adapté de Wealthtechinnovations/api_opcv scripts/governance/s2_git_guard.sh
#           (@5ac4a313) et de la commande bornée du MCP
#           (Patricked-code/MCP src/stablecoin/githubFastForward.ts) ; sources non modifiées.
# Usage   : s2_git_guard.sh observe
#           s2_git_guard.sh reconcile <expected_server_sha> <target_sha>
# Garanties (identiques au MCP) : branche main, worktree propre y compris fichiers non
#   suivis, origin exact, SHA serveur exact, SHA cible égal à main GitHub, relation
#   fast-forward, zéro fichier applicatif dans le delta, HTTP front 200 / API 401 /
#   health 401 avant et après. En plus : sauvegarde de l'état Git avant mutation.
#   Opérations Git limitées à : lecture, fetch de main, fusion en avance rapide seule.
#   Aucun build ni redémarrage de service ; aucune commande libre.
# Codes de sortie (alignés MCP) : 20 repository_missing, 21 wrong_branch,
#   22 dirty_worktree, 23 remote_mismatch, 24 server_head_mismatch,
#   25 target_sha_mismatch, 26 non_fast_forward, 27 fast_forward_failed,
#   28 application_diff_detected, 29 postcondition_failed,
#   30 preflight_health_failed, 31 postflight_health_failed.
#   Spécifiques : 10 invalid_arguments, 32 backup_failed.
#
# Journal des modifications
#   v1.0.0 (2026-09-26) : version initiale.
# =============================================================================
set -euo pipefail

MODE="${1:-}"
EXPECTED_SERVER_SHA="${2:-}"
TARGET_SHA="${3:-}"

# --- 1. Constantes (identiques à la commande bornée MCP) -------------------------------
FRONT_DIR="/var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin"
EXPECTED_REMOTE="https://github.com/Patricked-code/Stablecoin.git"
BRANCH="main"
BACKUP_ROOT="/var/backups/stablecoin-governance"
FRONT_URL="https://stablecoin.chainsolutions.fr/"
API_ROOT_URL="https://api.stablecoin.chainsolutions.fr/"
API_HEALTH_URL="https://api.stablecoin.chainsolutions.fr/health"
TEST_MODE=0
CHANGED_FILES=0
APPLICATION_FILES=0
HEALTH_OK=0

# --- 2. Mode test (local/CI uniquement) -------------------------------------------------
# Les variables d'environnement du runner ne sont pas transmises par SSH : sur S2, les
# constantes ci-dessus s'appliquent toujours.
if [ "${STABLECOIN_S2_TEST_MODE:-}" = "1" ]; then
  TEST_MODE=1
  FRONT_DIR="${STABLECOIN_S2_FRONT_DIR:?STABLECOIN_S2_FRONT_DIR requis en mode test}"
  EXPECTED_REMOTE="${STABLECOIN_S2_EXPECTED_REMOTE:?STABLECOIN_S2_EXPECTED_REMOTE requis en mode test}"
  BACKUP_ROOT="${STABLECOIN_S2_BACKUP_ROOT:?STABLECOIN_S2_BACKUP_ROOT requis en mode test}"
fi

# --- 3. Utilitaires ---------------------------------------------------------------------
sanitize_url() {
  sed -E 's#(https?://)[^/@]+@#\1***@#'
}

# Liste identique à Patricked-code/MCP src/stablecoin/githubFastForward.ts :
# tout autre chemin est considéré comme applicatif (build/restart requis).
is_non_application_path() {
  case "$1" in
    .github/*|.mcp/*|AGENTS.md|ARCHITECTURE.md|DECISIONS.md|GOVERNANCE.md|LOOP_ENGINEERING.md|README.md|SOURCE_OF_TRUTH.md|SUIVI.md|TODO.md|scripts/verify-governance-consistency.js)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

classify_delta() { # <from> <to> ; positionne CHANGED_FILES et APPLICATION_FILES
  local from="$1" to="$2" list path changed=0 app=0
  list="$(git diff --name-only "$from" "$to")"
  while IFS= read -r path; do
    [ -n "$path" ] || continue
    changed=$((changed + 1))
    if ! is_non_application_path "$path"; then
      app=$((app + 1))
      printf 'application_path=%s\n' "$path"
    fi
  done <<< "$list"
  CHANGED_FILES="$changed"
  APPLICATION_FILES="$app"
  printf 'changed_files=%s\n' "$changed"
  printf 'application_files=%s\n' "$app"
}

http_code() {
  curl --silent --location --max-time 15 --output /dev/null --write-out '%{http_code}' "$1" || true
}

report_health() { # <phase> ; positionne HEALTH_OK
  local phase="$1" front api_root api_health
  HEALTH_OK=0
  if [ "$TEST_MODE" = "1" ]; then
    echo "http_check_${phase}=SKIPPED_TEST_MODE"
    HEALTH_OK=1
    return 0
  fi
  front="$(http_code "$FRONT_URL")"
  api_root="$(http_code "$API_ROOT_URL")"
  api_health="$(http_code "$API_HEALTH_URL")"
  echo "frontend_http_${phase}=${front}"
  echo "api_root_http_${phase}=${api_root}"
  echo "api_health_http_${phase}=${api_health}"
  if [ "$front" = "200" ] && [ "$api_root" = "401" ] && [ "$api_health" = "401" ]; then
    HEALTH_OK=1
  fi
}

# --- 4. Observation (lecture seule, aucun fetch) ------------------------------------------
observe() {
  local branch head origin remote_head dirty_all tracked_dirty
  echo "=== STABLECOIN_S2_GIT_GUARD observe ==="
  echo "test_mode=${TEST_MODE}"
  echo "path=${FRONT_DIR}"
  if [ ! -d "$FRONT_DIR/.git" ]; then
    echo "repository=MISSING"
    exit 20
  fi
  cd "$FRONT_DIR"
  echo "repository=PRESENT"

  branch="$(git branch --show-current)"
  head="$(git rev-parse HEAD)"
  origin="$(git remote get-url origin 2>/dev/null || echo MISSING)"
  remote_head="$(git ls-remote origin "refs/heads/${BRANCH}" 2>/dev/null | awk '{print $1}' | head -1)" || remote_head=""
  dirty_all="$(git status --porcelain=v1 --untracked-files=all | wc -l | tr -d ' ')"
  tracked_dirty="$(git status --porcelain=v1 --untracked-files=no | wc -l | tr -d ' ')"

  echo "branch=${branch}"
  echo "expected_branch=${BRANCH}"
  if [ "$branch" = "$BRANCH" ]; then echo "branch_match=YES"; else echo "branch_match=NO"; fi
  echo "head=${head}"
  echo "origin=$(printf '%s' "$origin" | sanitize_url)"
  if [ "$origin" = "$EXPECTED_REMOTE" ]; then echo "origin_match=YES"; else echo "origin_match=NO"; fi
  echo "remote_head=${remote_head:-UNKNOWN}"

  if [ -z "$remote_head" ]; then
    echo "remote_alignment=UNKNOWN"
  elif [ "$remote_head" = "$head" ]; then
    echo "remote_alignment=EXACT"
  elif git cat-file -e "${remote_head}^{commit}" 2>/dev/null; then
    if git merge-base --is-ancestor "$head" "$remote_head"; then
      echo "remote_alignment=BEHIND_FAST_FORWARD_POSSIBLE"
      echo "behind=$(git rev-list --count "${head}..${remote_head}")"
      classify_delta "$head" "$remote_head"
    else
      echo "remote_alignment=DIVERGED"
    fi
  else
    echo "remote_alignment=BEHIND_OR_DIVERGED_REMOTE_OBJECT_NOT_FETCHED"
  fi

  echo "dirty_entries_all=${dirty_all}"
  echo "tracked_dirty_entries=${tracked_dirty}"
  report_health observe
  if [ "$HEALTH_OK" = "1" ]; then echo "health_observe=OK"; else echo "health_observe=DEGRADED"; fi
  echo "mutation_performed=NO"
}

# --- 5. Réconciliation bornée (fast-forward exact-SHA) --------------------------------------
reconcile() {
  local sha_re='^[0-9a-f]{40}$' current_branch dirty_count remote_url current_sha
  local remote_sha fetched_sha final_sha final_dirty ts backup

  [[ "$EXPECTED_SERVER_SHA" =~ $sha_re ]] || { echo "invalid expected_server_sha" >&2; exit 10; }
  [[ "$TARGET_SHA" =~ $sha_re ]] || { echo "invalid target_sha" >&2; exit 10; }
  [ "$EXPECTED_SERVER_SHA" != "$TARGET_SHA" ] || { echo "expected_server_sha equals target_sha" >&2; exit 10; }

  echo "=== STABLECOIN_S2_GIT_GUARD reconcile ==="
  echo "test_mode=${TEST_MODE}"
  test -d "$FRONT_DIR/.git" || { echo "repository=MISSING" >&2; exit 20; }
  cd "$FRONT_DIR"

  current_branch="$(git branch --show-current)"
  [ "$current_branch" = "$BRANCH" ] || { echo "wrong_branch=${current_branch}" >&2; exit 21; }

  dirty_count="$(git status --porcelain=v1 --untracked-files=all | wc -l | tr -d ' ')"
  if [ "$dirty_count" != "0" ]; then
    echo "working tree Stablecoin non propre (${dirty_count} entrées)" >&2
    exit 22
  fi

  remote_url="$(git remote get-url origin 2>/dev/null || true)"
  [ "$remote_url" = "$EXPECTED_REMOTE" ] || { echo "remote_mismatch" >&2; exit 23; }

  current_sha="$(git rev-parse HEAD)"
  [ "$current_sha" = "$EXPECTED_SERVER_SHA" ] || { echo "server_head=${current_sha}" >&2; exit 24; }

  remote_sha="$(git ls-remote origin "refs/heads/${BRANCH}" | awk '{print $1}' | head -1)" || remote_sha=""
  [ "$remote_sha" = "$TARGET_SHA" ] || { echo "remote_main=${remote_sha:-UNKNOWN}" >&2; exit 25; }

  git fetch --no-tags origin "$BRANCH"
  fetched_sha="$(git rev-parse FETCH_HEAD)"
  [ "$fetched_sha" = "$TARGET_SHA" ] || { echo "fetched=${fetched_sha}" >&2; exit 25; }

  git merge-base --is-ancestor "$current_sha" "$TARGET_SHA" || { echo "non_fast_forward" >&2; exit 26; }

  classify_delta "$current_sha" "$TARGET_SHA"
  if [ "$APPLICATION_FILES" != "0" ]; then
    echo "application_diff_detected : build/restart requis, hors périmètre du canal de secours" >&2
    exit 28
  fi

  report_health before
  [ "$HEALTH_OK" = "1" ] || { echo "preflight_health_failed" >&2; exit 30; }

  # Sauvegarde de l'état Git avant mutation (hors dépôt, réservée à root).
  ts="$(date -u '+%Y%m%dT%H%M%SZ')"
  backup="${BACKUP_ROOT}/${ts}"
  { mkdir -p "$backup" && chmod 700 "$BACKUP_ROOT" "$backup"; } || { echo "backup_failed" >&2; exit 32; }
  printf 'server_before=%s\ntarget_sha=%s\n' "$current_sha" "$TARGET_SHA" > "$backup/heads.txt" || exit 32
  git status -sb > "$backup/status-before.txt" || exit 32
  git log --format='%H | %cI | %s' -n 50 > "$backup/log-before.txt" || exit 32
  echo "backup_path=${backup}"

  git merge --ff-only "$TARGET_SHA" || { echo "fast_forward_failed" >&2; exit 27; }

  final_sha="$(git rev-parse HEAD)"
  [ "$final_sha" = "$TARGET_SHA" ] || { echo "postcondition_failed head=${final_sha}" >&2; exit 29; }
  final_dirty="$(git status --porcelain=v1 --untracked-files=all | wc -l | tr -d ' ')"
  [ "$final_dirty" = "0" ] || { echo "postcondition_failed dirty=${final_dirty}" >&2; exit 29; }

  report_health after
  [ "$HEALTH_OK" = "1" ] || { echo "postflight_health_failed" >&2; exit 31; }

  printf 'status=succeeded\n'
  printf 'server_before=%s\n' "$current_sha"
  printf 'server_after=%s\n' "$final_sha"
  printf 'target_sha=%s\n' "$TARGET_SHA"
  printf 'changed_files=%s\n' "$CHANGED_FILES"
  printf 'application_files=0\n'
  printf 'build_performed=NO\n'
  printf 'restart_performed=NO\n'
}

# --- 6. Point d'entrée ---------------------------------------------------------------------
case "$MODE" in
  observe) observe ;;
  reconcile) reconcile ;;
  *)
    echo "usage: s2_git_guard.sh observe | reconcile <expected_server_sha> <target_sha>" >&2
    exit 10
    ;;
esac
