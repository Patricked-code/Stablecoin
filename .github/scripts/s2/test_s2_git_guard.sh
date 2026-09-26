#!/usr/bin/env bash
# =============================================================================
# test_s2_git_guard.sh — Tests de la garde Git S2 Stablecoin (dépôts temporaires, sans réseau)
# Version : v1.0.0 — 2026-09-26 — DEC-2026-09-26-017
# Couvre  : observation, refus (arguments, branche, worktree, remote, SHA serveur,
#           SHA cible, fichier applicatif, non fast-forward), succès du fast-forward
#           borné avec sauvegarde, et absence de fuite du mode test hors test.
#
# Journal des modifications
#   v1.0.0 (2026-09-26) : version initiale.
# =============================================================================
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
GUARD="$ROOT/.github/scripts/s2/s2_git_guard.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

UP="$TMP/upstream.git"
SEED="$TMP/seed"
SRV="$TMP/server"
BK="$TMP/backups"

g() {
  git -c user.name=guard-test -c user.email=guard-test@example.invalid \
    -c init.defaultBranch=main -c commit.gpgsign=false -c core.autocrlf=false "$@"
}

fail() {
  echo "FAIL: $*" >&2
  echo "--- stdout" >&2; cat "$TMP/out.txt" >&2 2>/dev/null || true
  echo "--- stderr" >&2; cat "$TMP/err.txt" >&2 2>/dev/null || true
  exit 1
}

# Exécute la garde en mode test ; EXPECTED_REMOTE_FOR_TEST peut être surchargé.
run_guard() {
  STABLECOIN_S2_TEST_MODE=1 \
  STABLECOIN_S2_FRONT_DIR="$SRV" \
  STABLECOIN_S2_EXPECTED_REMOTE="$EXPECTED_REMOTE_FOR_TEST" \
  STABLECOIN_S2_BACKUP_ROOT="$BK" \
    bash "$GUARD" "$@"
}

expect_exit() { # <code attendu> <arguments de la garde...>
  local expected="$1" rc
  shift
  set +e
  run_guard "$@" > "$TMP/out.txt" 2> "$TMP/err.txt"
  rc=$?
  set -e
  [ "$rc" = "$expected" ] || fail "guard $* -> exit $rc, attendu $expected"
}

expect_line() { # <ligne exacte attendue dans la sortie>
  grep -Fxq -- "$1" "$TMP/out.txt" || fail "ligne absente : $1"
}

server_head() { g -C "$SRV" rev-parse HEAD; }

# --- 1. Préparation : upstream nu, dépôt d'amorçage, clone « serveur » -----------------
g init -q --bare "$UP"
g clone -q "$UP" "$SEED" 2>/dev/null
g -C "$SEED" symbolic-ref HEAD refs/heads/main
mkdir -p "$SEED/pages"
echo "app v1" > "$SEED/pages/index.js"
echo "# suivi v1" > "$SEED/SUIVI.md"
g -C "$SEED" add -A
g -C "$SEED" commit -q -m "c1 application + gouvernance"
g -C "$SEED" push -q origin main
C1="$(g -C "$SEED" rev-parse HEAD)"

g clone -q "$UP" "$SRV"
EXPECTED_REMOTE_FOR_TEST="$(g -C "$SRV" remote get-url origin)"

# Commit 2 : gouvernance uniquement (non applicatif au sens du MCP).
echo "# suivi v2" > "$SEED/SUIVI.md"
mkdir -p "$SEED/.github/scripts/s2"
echo "echo outil" > "$SEED/.github/scripts/s2/outil.sh"
g -C "$SEED" add -A
g -C "$SEED" commit -q -m "c2 gouvernance"
g -C "$SEED" push -q origin main
C2="$(g -C "$SEED" rev-parse HEAD)"

# --- 2. Observation initiale : serveur en retard, objet distant non récupéré ----------
expect_exit 0 observe
expect_line "head=$C1"
expect_line "remote_head=$C2"
expect_line "branch_match=YES"
expect_line "origin_match=YES"
expect_line "remote_alignment=BEHIND_OR_DIVERGED_REMOTE_OBJECT_NOT_FETCHED"
expect_line "dirty_entries_all=0"
expect_line "mutation_performed=NO"

# --- 3. Refus avant toute mutation -------------------------------------------------------
expect_exit 10 reconcile zz "$C2"
expect_exit 10 reconcile "$C1" "$C1"
expect_exit 10 unknown_mode
expect_exit 24 reconcile 0000000000000000000000000000000000000000 "$C2"
expect_exit 25 reconcile "$C1" 1111111111111111111111111111111111111111

EXPECTED_REMOTE_FOR_TEST_SAVED="$EXPECTED_REMOTE_FOR_TEST"
EXPECTED_REMOTE_FOR_TEST="https://example.invalid/autre.git"
expect_exit 23 reconcile "$C1" "$C2"
EXPECTED_REMOTE_FOR_TEST="$EXPECTED_REMOTE_FOR_TEST_SAVED"

echo "tmp" > "$SRV/non-suivi.tmp"
expect_exit 22 reconcile "$C1" "$C2"
rm -f "$SRV/non-suivi.tmp"

g -C "$SRV" checkout -q -b autre
expect_exit 21 reconcile "$C1" "$C2"
g -C "$SRV" checkout -q main
g -C "$SRV" branch -q -D autre

[ "$(server_head)" = "$C1" ] || fail "le serveur a bougé pendant les refus"
[ ! -d "$BK" ] || fail "une sauvegarde a été créée pendant un refus"

# --- 4. Succès : fast-forward borné C1 -> C2 (gouvernance uniquement) -------------------
expect_exit 0 reconcile "$C1" "$C2"
expect_line "status=succeeded"
expect_line "server_before=$C1"
expect_line "server_after=$C2"
expect_line "target_sha=$C2"
expect_line "changed_files=2"
expect_line "application_files=0"
expect_line "http_check_before=SKIPPED_TEST_MODE"
expect_line "http_check_after=SKIPPED_TEST_MODE"
expect_line "build_performed=NO"
expect_line "restart_performed=NO"
[ "$(server_head)" = "$C2" ] || fail "HEAD serveur attendu $C2"
ls "$BK"/*/heads.txt >/dev/null 2>&1 || fail "sauvegarde heads.txt absente"
grep -Fxq "server_before=$C1" "$BK"/*/heads.txt || fail "sauvegarde incohérente"

# --- 5. Fichier applicatif dans le delta : refus 28, serveur inchangé -------------------
echo "app v2" > "$SEED/pages/index.js"
g -C "$SEED" add -A
g -C "$SEED" commit -q -m "c3 application"
g -C "$SEED" push -q origin main
C3="$(g -C "$SEED" rev-parse HEAD)"
expect_exit 28 reconcile "$C2" "$C3"
expect_line "application_path=pages/index.js"
[ "$(server_head)" = "$C2" ] || fail "le serveur a bougé malgré un delta applicatif"

# --- 6. Observation avec objet distant présent : delta classé ----------------------------
expect_exit 0 observe
expect_line "remote_alignment=BEHIND_FAST_FORWARD_POSSIBLE"
expect_line "behind=1"
expect_line "application_files=1"
expect_line "application_path=pages/index.js"

# --- 7. Historique divergé : refus 26 --------------------------------------------------------
echo "# local" >> "$SRV/SUIVI.md"
g -C "$SRV" commit -q -am "commit local serveur"
LOCAL="$(server_head)"
expect_exit 26 reconcile "$LOCAL" "$C3"
[ "$(server_head)" = "$LOCAL" ] || fail "le serveur a bougé malgré la divergence"
expect_exit 0 observe
expect_line "remote_alignment=DIVERGED"

# --- 8. Sans mode test, les surcharges sont ignorées (chemin de production absent ici) --
set +e
STABLECOIN_S2_FRONT_DIR="$SRV" bash "$GUARD" observe > "$TMP/out.txt" 2> "$TMP/err.txt"
rc=$?
set -e
[ "$rc" = "20" ] || fail "hors mode test, attendu exit 20 (chemin de production), obtenu $rc"
expect_line "repository=MISSING"

echo "S2_GIT_GUARD_TEST=PASS"
