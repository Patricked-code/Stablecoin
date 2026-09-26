#!/usr/bin/env bash
# =============================================================================
# s2_ssh_readonly_retry.sh — Exécution SSH read-only vers S2 avec reprise bornée
# Version : v1.0.0 — 2026-09-26 — DEC-2026-09-26-017
# Origine : adapté de Wealthtechinnovations/api_opcv
#           scripts/governance/s2_ssh_readonly_retry.sh @5ac4a313 (source non modifiée).
# Usage   : STABLECOIN_SSH_OPERATION_CLASS=READ_ONLY \
#             s2_ssh_readonly_retry.sh <user@host> '<commande distante fixe>' <script stdin>
# Règles  : réservé aux opérations READ_ONLY ; reprise uniquement sur une erreur réseau
#           transitoire AVANT toute sortie distante ; aucune reprise sur échec
#           d'authentification ou de clé d'hôte ; jamais utilisé pour une mutation.
#
# Journal des modifications
#   v1.0.0 (2026-09-26) : version initiale (variable de classe Stablecoin, port
#                         optionnel S2_SSH_PORT, IdentitiesOnly=yes).
# =============================================================================
set -euo pipefail

# --- 1. Entrées -------------------------------------------------------------------
TARGET="${1:-}"
REMOTE_COMMAND="${2:-}"
STDIN_FILE="${3:-/dev/null}"

test -n "$TARGET" || { echo "::error::SSH target missing" >&2; exit 64; }
test -n "$REMOTE_COMMAND" || { echo "::error::Remote command missing" >&2; exit 64; }
test "${STABLECOIN_SSH_OPERATION_CLASS:-}" = "READ_ONLY" || {
  echo "::error::s2_ssh_readonly_retry.sh is restricted to READ_ONLY operations" >&2
  exit 64
}
test -r "$STDIN_FILE" || { echo "::error::stdin file not readable: $STDIN_FILE" >&2; exit 66; }

SSH_BIN="${SSH_BIN:-ssh}"
SSH_PORT="${S2_SSH_PORT:-22}"
MAX_ATTEMPTS="${S2_SSH_READONLY_ATTEMPTS:-4}"
BACKOFF="${S2_SSH_READONLY_BACKOFF_SECONDS:-3}"

case "$SSH_PORT" in (*[!0-9]*|'') echo "::error::invalid SSH port" >&2; exit 64;; esac
case "$MAX_ATTEMPTS" in (*[!0-9]*|'') echo "::error::invalid attempt count" >&2; exit 64;; esac
case "$BACKOFF" in (*[!0-9]*|'') echo "::error::invalid backoff" >&2; exit 64;; esac
[ "$MAX_ATTEMPTS" -ge 1 ] || { echo "::error::attempt count must be >=1" >&2; exit 64; }

# --- 2. Classification des erreurs ------------------------------------------------------
TRANSIENT_RE='kex_exchange_identification|banner exchange|Connection reset by peer|Connection timed out|Connection closed by remote host|Connection closed by .* port [0-9]+'
FATAL_RE='Permission denied|Host key verification failed|REMOTE HOST IDENTIFICATION HAS CHANGED|WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED'

# --- 3. Boucle de tentatives --------------------------------------------------------------
last_rc=255
for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  out="$(mktemp)"
  err="$(mktemp)"
  set +e
  "$SSH_BIN" -p "$SSH_PORT" -i ~/.ssh/id_deploy -o BatchMode=yes -o IdentitiesOnly=yes \
    -o StrictHostKeyChecking=yes -o ConnectTimeout=15 -o ServerAliveInterval=10 \
    -o ServerAliveCountMax=1 "$TARGET" "$REMOTE_COMMAND" < "$STDIN_FILE" > "$out" 2> "$err"
  rc=$?
  set -e
  last_rc=$rc

  cat "$out"
  cat "$err" >&2

  if [ "$rc" -eq 0 ]; then
    rm -f "$out" "$err"
    exit 0
  fi
  if grep -Eqi "$FATAL_RE" "$err"; then
    echo "::error::SSH fatal trust/authentication failure; no retry" >&2
    rm -f "$out" "$err"
    exit "$rc"
  fi
  if [ -s "$out" ]; then
    echo "::error::SSH failed after remote output; execution ambiguous, no retry" >&2
    rm -f "$out" "$err"
    exit "$rc"
  fi
  if ! grep -Eqi "$TRANSIENT_RE" "$err"; then
    echo "::error::SSH failure is not an approved transient pre-auth signature; no retry" >&2
    rm -f "$out" "$err"
    exit "$rc"
  fi
  rm -f "$out" "$err"
  if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
    delay=$((BACKOFF * attempt))
    echo "S2_READONLY_SSH_TRANSIENT_RETRY attempt=$attempt next_delay_seconds=$delay" >&2
    sleep "$delay"
  fi
done
echo "::error::S2 read-only SSH exhausted $MAX_ATTEMPTS attempts" >&2
exit "$last_rc"
