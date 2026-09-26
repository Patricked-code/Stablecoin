#!/usr/bin/env bash
# =============================================================================
# test_s2_ssh_readonly_retry.sh — Tests du helper SSH read-only (sans réseau)
# Version : v1.0.0 — 2026-09-26 — DEC-2026-09-26-017
# Origine : adapté de Wealthtechinnovations/api_opcv
#           scripts/governance/test_s2_ssh_readonly_retry.sh @5ac4a313 (non modifié).
#
# Journal des modifications
#   v1.0.0 (2026-09-26) : version initiale.
# =============================================================================
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
HELPER="$ROOT/.github/scripts/s2/s2_ssh_readonly_retry.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
COUNT="$TMP/count"
INPUT="$TMP/input"
FAKE="$TMP/fake-ssh"
echo "payload" > "$INPUT"

# --- 1. Faux client SSH piloté par TEST_MODE --------------------------------------------
cat > "$FAKE" <<'FAKE'
#!/usr/bin/env bash
set -euo pipefail
n=0
[ ! -s "${TEST_COUNT_FILE:?}" ] || n="$(cat "$TEST_COUNT_FILE")"
n=$((n+1))
echo "$n" > "$TEST_COUNT_FILE"
cat >/dev/null || true
case "${TEST_MODE:?}" in
  transient_then_success)
    if [ "$n" -eq 1 ]; then
      echo "kex_exchange_identification: read: Connection reset by peer" >&2
      exit 255
    fi
    echo "OK"
    ;;
  auth_failure)
    echo "Permission denied (publickey)." >&2
    exit 255
    ;;
  ambiguous_output)
    echo "PARTIAL"
    echo "Connection reset by peer" >&2
    exit 255
    ;;
  *)
    exit 2
    ;;
esac
FAKE
chmod +x "$FAKE"

export STABLECOIN_SSH_OPERATION_CLASS=READ_ONLY
export SSH_BIN="$FAKE"
export S2_SSH_READONLY_BACKOFF_SECONDS=0
export S2_SSH_READONLY_ATTEMPTS=4
export TEST_COUNT_FILE="$COUNT"

# --- 2. Erreur transitoire puis succès : une reprise ------------------------------------
: > "$COUNT"
export TEST_MODE=transient_then_success
out="$(bash "$HELPER" root@example "python3 -" "$INPUT")"
test "$out" = "OK"
test "$(cat "$COUNT")" = "2"

# --- 3. Échec d'authentification : aucune reprise ----------------------------------------
: > "$COUNT"
export TEST_MODE=auth_failure
if bash "$HELPER" root@example "python3 -" "$INPUT" >/dev/null 2>&1; then exit 1; fi
test "$(cat "$COUNT")" = "1"

# --- 4. Sortie distante partielle : exécution ambiguë, aucune reprise -------------------
: > "$COUNT"
export TEST_MODE=ambiguous_output
if bash "$HELPER" root@example "python3 -" "$INPUT" >/dev/null 2>&1; then exit 1; fi
test "$(cat "$COUNT")" = "1"

# --- 5. Classe d'opération absente : refus -------------------------------------------------
unset STABLECOIN_SSH_OPERATION_CLASS
if bash "$HELPER" root@example "python3 -" "$INPUT" >/dev/null 2>&1; then exit 1; fi

echo "S2_READONLY_SSH_RETRY_TEST=PASS"
