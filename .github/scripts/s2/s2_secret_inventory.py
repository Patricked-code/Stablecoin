#!/usr/bin/env python3
"""Inventaire read-only des secrets et configurations Stablecoin sur S2.

Version : v1.0.0 — 2026-09-26 — DEC-2026-09-26-017
Origine : adapté de Wealthtechinnovations/api_opcv scripts/governance/s2_secret_inventory.py
          (@5ac4a313, source non modifiée).

N'émet JAMAIS de valeur, de préfixe, d'empreinte ni de longueur de secret :
uniquement des noms de variables, des métadonnées de fichiers et des états
ABSENT / EMPTY / PLACEHOLDER / SET. Les valeurs ne restent qu'en mémoire, sur S2,
le temps de calculer ces états et de vérifier leur présence dans le bundle client
Next.js (.next/static). Le rapport décrit une posture de sécurité : dans ce dépôt
public, le workflow ne le publie que chiffré.

Journal des modifications
  v1.0.0 (2026-09-26) : version initiale (frontend Git + backend non Git, fichiers
                        .env*, config/config.json, noms de variables Plesk/Passenger,
                        présence de valeurs sensibles dans le bundle client).
"""
from __future__ import annotations

import grp
import json
import pwd
import re
import stat
import subprocess
from pathlib import Path

# --- 1. Constantes --------------------------------------------------------------------------
FRONT = Path("/var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin")
BACK = Path("/var/www/vhosts/chainsolutions.fr/api.stablecoin.chainsolutions.fr")
VHOST_CONF_DIRS = [
    Path("/var/www/vhosts/system/stablecoin.chainsolutions.fr/conf"),
    Path("/var/www/vhosts/system/api.stablecoin.chainsolutions.fr/conf"),
]
SENSITIVE = re.compile(r"(PASSWORD|PASSWD|SECRET|TOKEN|PRIVATE_KEY|API_KEY|MNEMONIC|SEED|CREDENTIAL)", re.I)
PLACEHOLDER = re.compile(
    r"^(?:$|CHANGER(?:_|$).*|CHANGE(?:_|$).*|YOUR(?:_|$).*|EXAMPLE(?:_|$).*|"
    r"PLACEHOLDER(?:_|$).*|<[^>]+>|\$\{[^}]+\}|X{3,})$",
    re.I,
)
PRIVATE_KEY_SHAPE = re.compile(r"^(0x)?[0-9a-fA-F]{64}$")
ENV_DIRECTIVE = re.compile(r"^\s*(?:PassengerEnvVar|passenger_env_var|SetEnv|env)\s+([A-Za-z_][A-Za-z0-9_]*)")
MIN_BUNDLE_NEEDLE = 16


# --- 2. Utilitaires ------------------------------------------------------------------------------
def parse_env(path):
    """Retourne {nom: valeur} ; les valeurs ne quittent jamais ce processus."""
    values = {}
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        text = line.strip()
        if not text or text.startswith("#") or "=" not in text:
            continue
        if text.startswith("export "):
            text = text[len("export "):]
        key, value = text.split("=", 1)
        values[key.strip()] = value.strip().strip("\"'")
    return values


def state(value):
    if value is None:
        return "ABSENT"
    if value == "":
        return "EMPTY"
    if PLACEHOLDER.match(value):
        return "PLACEHOLDER"
    return "SET"


def git_tracked(rel):
    p = subprocess.run(["git", "ls-files", "--error-unmatch", rel], cwd=str(FRONT),
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
    return p.returncode == 0


def file_meta(path):
    st = path.stat()
    try:
        owner = pwd.getpwuid(st.st_uid).pw_name
    except Exception:
        owner = None
    try:
        group = grp.getgrgid(st.st_gid).gr_name
    except Exception:
        group = None
    return {"mode": oct(stat.S_IMODE(st.st_mode)), "owner": owner, "group": group}


# --- 3. Fichiers .env* ---------------------------------------------------------------------------
def env_files(root, is_git_repo):
    reports, values_by_file = [], {}
    if not root.exists():
        return reports, values_by_file
    for path in sorted(p for p in root.glob(".env*") if p.is_file()):
        values = parse_env(path)
        values_by_file[path.name] = values
        report = {"path": path.name, "exists": True}
        report.update(file_meta(path))
        report.update({
            "tracked_by_git": git_tracked(path.name) if is_git_repo else None,
            "keys": sorted(values),
            "sensitive_keys_state": {k: state(v) for k, v in sorted(values.items()) if SENSITIVE.search(k)},
            "values_exposed": False,
        })
        if "NEXT_PUBLIC_PRIVATE_KEY" in values:
            report["next_public_private_key"] = {
                "state": state(values["NEXT_PUBLIC_PRIVATE_KEY"]),
                "looks_like_private_key": bool(PRIVATE_KEY_SHAPE.match(values["NEXT_PUBLIC_PRIVATE_KEY"])),
            }
        reports.append(report)
    return reports, values_by_file


def backend_config_json():
    path = BACK / "config" / "config.json"
    out = {"path": "config/config.json", "exists": path.is_file()}
    if not out["exists"]:
        return out
    out.update(file_meta(path))
    try:
        payload = json.loads(path.read_text(encoding="utf-8", errors="ignore"))
    except Exception as exc:
        out["parse_error"] = type(exc).__name__
        return out
    envs = {}
    if isinstance(payload, dict):
        for env_name, section in payload.items():
            if isinstance(section, dict):
                envs[env_name] = {
                    "keys": sorted(section),
                    "password_state": state(section.get("password") if isinstance(section.get("password"), str) else None),
                }
    out.update({"environments": envs, "values_exposed": False})
    return out


# --- 4. Variables déclarées dans la configuration Plesk / Passenger (noms seulement) --------------
def vhost_env_names():
    rows = []
    for conf_dir in VHOST_CONF_DIRS:
        if not conf_dir.is_dir():
            continue
        for path in sorted(conf_dir.glob("*.conf")):
            try:
                lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
            except Exception:
                continue
            names = sorted({m.group(1) for m in (ENV_DIRECTIVE.match(l) for l in lines) if m})
            if names:
                rows.append({"file": str(path), "names": names, "values_exposed": False})
    return rows


# --- 5. Présence de valeurs sensibles dans le bundle client ---------------------------------------
def client_bundle_exposure(frontend_values):
    static = FRONT / ".next" / "static"
    result = {"bundle_dir_exists": static.is_dir(), "files_scanned": 0, "keys": {}}
    needles = {}
    for values in frontend_values.values():
        for key, value in values.items():
            if SENSITIVE.search(key) and state(value) == "SET" and len(value) >= MIN_BUNDLE_NEEDLE:
                needles[key] = value
    if not static.is_dir() or not needles:
        return result
    found = {key: False for key in needles}
    for path in static.rglob("*.js"):
        try:
            text = path.read_bytes().decode("utf-8", errors="ignore")
        except Exception:
            continue
        result["files_scanned"] += 1
        for key, value in needles.items():
            if not found[key] and value in text:
                found[key] = True
    result["keys"] = {
        key: {
            "public_by_design": key.startswith("NEXT_PUBLIC_"),
            "client_bundle": "PRESENT" if hit else "NOT_FOUND",
        }
        for key, hit in sorted(found.items())
    }
    return result


# --- 6. Point d'entrée -------------------------------------------------------------------------------
def main():
    front_reports, front_values = env_files(FRONT, (FRONT / ".git").exists())
    back_reports, _back_values = env_files(BACK, False)
    report = {
        "schema_version": "1.0.0",
        "repository": "Patricked-code/Stablecoin",
        "server_label": "S2",
        "frontend": {"root_exists": FRONT.exists(), "env_files": front_reports},
        "backend": {
            "root_exists": BACK.exists(),
            "env_files": back_reports,
            "config_json": backend_config_json(),
        },
        "plesk_passenger_env_names": vhost_env_names(),
        "client_bundle_exposure": client_bundle_exposure(front_values),
        "rotation_required_if_exposed": True,
        "safety": {
            "read_only": True,
            "values_exposed": False,
            "hashes_of_secret_values_exposed": False,
            "lengths_or_prefixes_exposed": False,
            "files_modified": False,
            "services_restarted": False,
        },
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
