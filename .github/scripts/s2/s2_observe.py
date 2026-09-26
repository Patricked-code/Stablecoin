#!/usr/bin/env python3
"""Observation read-only de Stablecoin sur S2 (canal de secours du MCP).

Version : v1.0.0 — 2026-09-26 — DEC-2026-09-26-017
Origine : adapté de Wealthtechinnovations/api_opcv scripts/governance/s2_observe.py
          (@5ac4a313, source non modifiée).

Aucune commande arbitraire n'est acceptée. Aucun fetch, aucune écriture, aucun
redémarrage. Aucune valeur secrète n'est lue : ni fichier .env, ni environnement
ni ligne de commande des processus. Le dépôt étant public, le hostname et le
kernel du serveur ne sont pas publiés.

Journal des modifications
  v1.0.0 (2026-09-26) : version initiale (Git frontend, métadonnées backend,
                        processus Stablecoin identifiés par leur cwd, PM2 filtré,
                        sondes HTTP identiques au MCP).
"""
from __future__ import annotations

import json
import os
import pwd
import re
import shutil
import subprocess
import time
from pathlib import Path

# --- 1. Constantes (identiques au MCP et à .mcp/server-map.json) ---------------------
FRONT = Path("/var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin")
BACK = Path("/var/www/vhosts/chainsolutions.fr/api.stablecoin.chainsolutions.fr")
BRANCH = "main"
EXPECTED_REMOTE = "https://github.com/Patricked-code/Stablecoin.git"
NON_APPLICATION = re.compile(
    r"^(\.github/.*|\.mcp/.*|AGENTS\.md|ARCHITECTURE\.md|DECISIONS\.md|GOVERNANCE\.md"
    r"|LOOP_ENGINEERING\.md|README\.md|SOURCE_OF_TRUTH\.md|SUIVI\.md|TODO\.md"
    r"|scripts/verify-governance-consistency\.js)$"
)
HTTP_TARGETS = [
    "https://stablecoin.chainsolutions.fr/",
    "https://api.stablecoin.chainsolutions.fr/",
    "https://api.stablecoin.chainsolutions.fr/health",
]


# --- 2. Utilitaires --------------------------------------------------------------------
def run(cmd, cwd=None, timeout=25):
    try:
        p = subprocess.run(
            cmd,
            cwd=str(cwd) if cwd else None,
            universal_newlines=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=timeout,
            check=False,
        )
        return {"code": p.returncode, "stdout": p.stdout.strip(), "stderr": p.stderr.strip()}
    except Exception as exc:  # pragma: no cover - dépend du serveur
        return {"code": 999, "stdout": "", "stderr": type(exc).__name__}


def sanitize_url(value):
    return re.sub(r"(https?://)[^/@\s]+@", r"\1***@", value or "")


def git(*args, timeout=25):
    return run(["git", *args], cwd=FRONT, timeout=timeout)


# --- 3. Frontend Git ---------------------------------------------------------------------
def frontend_git():
    data = {
        "path": str(FRONT),
        "exists": FRONT.exists(),
        "is_git": (FRONT / ".git").exists(),
        "expected_branch": BRANCH,
    }
    if not data["is_git"]:
        return data
    head = git("rev-parse", "HEAD")
    if head["code"] != 0:
        data["error"] = head["stderr"][:300]
        return data
    head = head["stdout"]
    branch = git("branch", "--show-current")["stdout"]
    origin = git("remote", "get-url", "origin")["stdout"]
    remote = git("ls-remote", "origin", "refs/heads/" + BRANCH)
    remote_head = remote["stdout"].split()[0] if remote["code"] == 0 and remote["stdout"] else None
    status = git("status", "--porcelain=v1", "--untracked-files=all")["stdout"].splitlines()
    tracked = [line[3:] for line in status if line and not line.startswith("?? ")]
    untracked = [line[3:] for line in status if line.startswith("?? ")]

    alignment = "UNKNOWN"
    behind = None
    pending = None
    if remote_head and remote_head == head:
        alignment = "EXACT"
    elif remote_head and git("cat-file", "-e", remote_head + "^{commit}")["code"] == 0:
        if git("merge-base", "--is-ancestor", head, remote_head)["code"] == 0:
            alignment = "BEHIND_FAST_FORWARD_POSSIBLE"
            count = git("rev-list", "--count", head + ".." + remote_head)
            behind = int(count["stdout"] or "0") if count["code"] == 0 else None
            diff = git("diff", "--name-only", head, remote_head)["stdout"].splitlines()
            app = [p for p in diff if p and not NON_APPLICATION.match(p)]
            pending = {"changed_files": len([p for p in diff if p]), "application_files": app}
        else:
            alignment = "DIVERGED"
    elif remote_head:
        alignment = "BEHIND_OR_DIVERGED_REMOTE_OBJECT_NOT_FETCHED"

    data.update({
        "branch": branch,
        "branch_match": branch == BRANCH,
        "head": head,
        "origin": sanitize_url(origin),
        "origin_match": origin == EXPECTED_REMOTE,
        "remote_head": remote_head,
        "remote_alignment": alignment,
        "behind": behind,
        "pending_delta": pending,
        "tracked_dirty": tracked[:200],
        "untracked": untracked[:200],
        "recent_commits": git("log", "-5", "--pretty=format:%H|%cI|%s")["stdout"].splitlines(),
    })
    return data


# --- 4. Backend : métadonnées non secrètes uniquement ------------------------------------
def backend_metadata():
    data = {"path": str(BACK), "exists": BACK.exists(), "is_git": (BACK / ".git").exists()}
    pkg = BACK / "package.json"
    data["package_json_exists"] = pkg.exists()
    if pkg.exists():
        try:
            payload = json.loads(pkg.read_text(encoding="utf-8", errors="ignore"))
            repo = payload.get("repository")
            if isinstance(repo, dict):
                repo = repo.get("url")
            data.update({
                "package_name": payload.get("name"),
                "package_version": payload.get("version"),
                "package_main": payload.get("main"),
                "declared_repository": sanitize_url(repo) if isinstance(repo, str) else None,
            })
        except Exception as exc:
            data["package_error"] = type(exc).__name__
    return data


# --- 5. Processus Stablecoin (identifiés par cwd ; ni cmdline ni environnement) ---------
def stablecoin_processes():
    rows = []
    proc = Path("/proc")
    if not proc.exists():
        return rows
    for entry in proc.iterdir():
        if not entry.name.isdigit():
            continue
        try:
            cwd = os.readlink(str(entry / "cwd"))
        except Exception:
            continue
        if cwd.startswith(str(FRONT)):
            role = "frontend"
        elif cwd.startswith(str(BACK)):
            role = "backend"
        else:
            continue
        try:
            comm = (entry / "comm").read_text(encoding="utf-8", errors="ignore").strip()
        except Exception:
            comm = None
        try:
            user = pwd.getpwuid(entry.stat().st_uid).pw_name
        except Exception:
            user = None
        rows.append({"pid": int(entry.name), "role": role, "comm": comm, "user": user, "cwd": cwd})
    return sorted(rows, key=lambda r: r["pid"])[:100]


def pm2_stablecoin():
    if shutil.which("pm2") is None:
        return {"available": False, "processes": []}
    raw = run(["pm2", "jlist"], timeout=15)
    out = {"available": True, "processes": []}
    if raw["code"] != 0:
        out["error"] = "pm2_jlist_failed"
        return out
    try:
        start = raw["stdout"].find("[")
        rows = json.loads(raw["stdout"][start:]) if start >= 0 else []
    except Exception:
        out["error"] = "pm2_json_invalid"
        return out
    for row in rows:
        env = row.get("pm2_env") or {}
        cwd = env.get("pm_cwd") or ""
        if cwd.startswith(str(FRONT)) or cwd.startswith(str(BACK)):
            out["processes"].append({
                "name": row.get("name"),
                "pid": row.get("pid"),
                "status": env.get("status"),
                "restarts": env.get("restart_time"),
                "cwd": cwd,
            })
    return out


# --- 6. Sondes HTTP (mêmes cibles que le MCP) ------------------------------------------------
def http_probe(url):
    r = run(["curl", "-sS", "-L", "--max-redirs", "3", "--max-time", "20", "-o", "/dev/null",
             "-w", "%{http_code}", url], timeout=25)
    return {"url": url, "http_code": r["stdout"] or None, "command_code": r["code"]}


# --- 7. Point d'entrée ----------------------------------------------------------------------
def main():
    observation = {
        "schema_version": "1.0.0",
        "repository": "Patricked-code/Stablecoin",
        "server_label": "S2",
        "observed_at_epoch": int(time.time()),
        "ssh_user_is_root": os.geteuid() == 0,
        "git": {"frontend": frontend_git()},
        "backend": backend_metadata(),
        "runtime": {
            "processes": stablecoin_processes(),
            "pm2": pm2_stablecoin(),
            "passenger_status_available": shutil.which("passenger-status") is not None,
            "node_version": run(["node", "--version"])["stdout"] if shutil.which("node") else None,
        },
        "http": [http_probe(url) for url in HTTP_TARGETS],
        "safety": {
            "read_only_observer": True,
            "arbitrary_remote_shell": False,
            "git_fetch_performed": False,
            "secret_values_read": False,
            "process_cmdline_or_environment_read": False,
            "production_mutation_performed": False,
        },
    }
    print(json.dumps(observation, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
