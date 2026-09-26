#!/usr/bin/env bash
# =============================================================================
# prepare_s2_ssh.sh — Préparation SSH stricte vers S2 (canal de secours Stablecoin)
# Version : v1.0.0 — 2026-09-26 — DEC-2026-09-26-017
# Origine : adapté de Wealthtechinnovations/api_opcv
#           scripts/governance/prepare_s2_ssh.sh @5ac4a313 (source non modifiée).
# Entrées : S2_HOST, S2_SSH_KEY ; optionnel S2_KNOWN_HOSTS.
# Épinglage de secours : .github/scripts/s2/s2_known_hosts.tofu (clé d'hôte publique).
# Effets  : écrit ~/.ssh/id_deploy et ~/.ssh/known_hosts sur le runner éphémère
#           uniquement ; aucune connexion SSH n'est ouverte ici.
#
# Journal des modifications
#   v1.0.0 (2026-09-26) : version initiale (chemins Stablecoin, même modèle de
#                         confiance qu'AfricaFunds, contrôle de l'identité du dépôt).
# =============================================================================
set -euo pipefail

# --- 1. Entrées -------------------------------------------------------------------
ROOT="${STABLECOIN_REPO_ROOT:-$(pwd)}"
HOST="${S2_HOST:-}"
KEY="${S2_SSH_KEY:-}"
SECRET_PIN="${S2_KNOWN_HOSTS:-}"
REPO_PIN="$ROOT/.github/scripts/s2/s2_known_hosts.tofu"
TRUST_FILE="$ROOT/.github/scripts/s2/s2_hostkey_trust.json"

test -n "$HOST" || { echo "::error::S2_HOST missing"; exit 10; }
test -n "$KEY" || { echo "::error::S2_SSH_KEY missing"; exit 11; }

# --- 2. Clé privée éphémère ---------------------------------------------------------
mkdir -p ~/.ssh
chmod 700 ~/.ssh
printf '%s\n' "$KEY" > ~/.ssh/id_deploy
chmod 600 ~/.ssh/id_deploy

# --- 3. Clé d'hôte : secret prioritaire, sinon épinglage versionné --------------------
if [ -n "$SECRET_PIN" ]; then
  printf '%s\n' "$SECRET_PIN" > ~/.ssh/known_hosts
  TRUST_SOURCE="SECRET_PIN"
elif [ -s "$REPO_PIN" ]; then
  cp "$REPO_PIN" ~/.ssh/known_hosts
  TRUST_SOURCE="TOFU_PINNED_PENDING_OOB"
else
  echo "::error::No S2 host-key pin available (secret or repository TOFU pin)."
  exit 12
fi
chmod 600 ~/.ssh/known_hosts

if ! ssh-keygen -F "$HOST" -f ~/.ssh/known_hosts >/dev/null 2>&1; then
  echo "::error::Pinned known_hosts does not contain S2_HOST."
  exit 13
fi

# --- 4. Contrôle du modèle de confiance de l'épinglage versionné ----------------------
if [ "$TRUST_SOURCE" = "TOFU_PINNED_PENDING_OOB" ]; then
  test -s "$TRUST_FILE" || { echo "::error::TOFU trust metadata missing"; exit 14; }
  python3 - "$TRUST_FILE" <<'PY'
import json, sys
p = json.load(open(sys.argv[1], encoding="utf-8"))
assert p["repository"] == "Patricked-code/Stablecoin"
assert p["trust_model"] == "TOFU_PINNED_PENDING_OOB"
assert p["strict_host_key_checking_required"] is True
assert p["automatic_key_rotation"] is False
PY
fi

echo "S2_SSH_TRUST_SOURCE=$TRUST_SOURCE"
echo "S2_STRICT_HOST_KEY_CHECKING=YES"
echo "S2_ARBITRARY_HOSTKEY_REFRESH=FORBIDDEN"
