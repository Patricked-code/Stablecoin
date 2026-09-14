# Guide d’installation — Mémoire WealthTech MCP depuis GitHub

Date : 2026-07-01
Dépôt : `Patricked-code/Stablecoin`
Branche : `codex/wealthtech-mcp-conversation-memory`

Ce guide explique comment récupérer la mémoire compilée de la conversation WealthTech / MCP / Stablecoin sur le serveur MCP, comment la placer dans un dossier de mémoire persistante, et comment lancer Claude Code avec le prompt d’audit global.

---

## 1. Préparer le dossier de mémoire sur le serveur MCP

Se connecter au serveur MCP puis exécuter :

```bash
mkdir -p /opt/wealthtech-mcp-memory
mkdir -p /opt/wealthtech-audit-mcp/{reports,prompts,scripts,logs,exports}
chmod -R 750 /opt/wealthtech-mcp-memory /opt/wealthtech-audit-mcp
```

---

## 2. Récupérer la branche GitHub sur le serveur MCP

### Option A — Cloner directement la branche dédiée

```bash
cd /opt/wealthtech-mcp-memory

git clone --branch codex/wealthtech-mcp-conversation-memory https://github.com/Patricked-code/Stablecoin.git stablecoin-memory
```

### Option B — Si le dépôt existe déjà

```bash
cd /opt/wealthtech-mcp-memory/stablecoin-memory

git fetch origin codex/wealthtech-mcp-conversation-memory

git checkout codex/wealthtech-mcp-conversation-memory

git pull origin codex/wealthtech-mcp-conversation-memory
```

---

## 3. Copier le prompt d’audit dans le dossier Claude/MCP

```bash
cp /opt/wealthtech-mcp-memory/stablecoin-memory/docs/mcp/AUDIT_GLOBAL_S1_S2_MCP_PROMPT.md \
   /opt/wealthtech-audit-mcp/prompts/AUDIT_GLOBAL_S1_S2_MCP.md
```

Vérifier :

```bash
ls -lah /opt/wealthtech-audit-mcp/prompts/
```

---

## 4. Vérifier Claude Code et MCP

```bash
which claude
claude --version
claude mcp list
```

Si le MCP n’est pas encore ajouté, utiliser la commande adaptée.

### MCP HTTP

```bash
claude mcp add --transport http wealthtech_ssh_bridge https://TON-DOMAINE-MCP/mcp
```

### MCP HTTP avec token

```bash
claude mcp add --transport http wealthtech_ssh_bridge https://TON-DOMAINE-MCP/mcp \
  --header "Authorization: Bearer TON_TOKEN_MCP"
```

### MCP stdio local

```bash
claude mcp add --transport stdio wealthtech_ssh_bridge -- node /opt/mcp-server/index.js
```

Puis :

```bash
claude mcp list
```

Si nécessaire :

```bash
claude mcp login wealthtech_ssh_bridge
```

---

## 5. Lancer Claude Code depuis le dossier d’audit

```bash
cd /opt/wealthtech-audit-mcp
claude
```

Dans Claude Code, taper :

```text
/mcp
```

Vérifier que `wealthtech_ssh_bridge` apparaît.

Puis envoyer à Claude Code :

```text
Lis le fichier /opt/wealthtech-audit-mcp/prompts/AUDIT_GLOBAL_S1_S2_MCP.md et exécute strictement cette mission via le MCP wealthtech_ssh_bridge.

Tu dois faire uniquement un audit non destructif.
Tu ne dois rien supprimer, rien vider, rien modifier, rien redémarrer, rien migrer, rien déployer.
Tu dois produire les rapports demandés dans /opt/wealthtech-audit-mcp/reports et créer l’archive téléchargeable dans /opt/wealthtech-audit-mcp/exports.
À la fin, donne-moi les chemins exacts et la commande SCP.
```

---

## 6. Lancer en mode prompt direct si disponible

```bash
cd /opt/wealthtech-audit-mcp
export MAX_MCP_OUTPUT_TOKENS=50000
claude -p "$(cat /opt/wealthtech-audit-mcp/prompts/AUDIT_GLOBAL_S1_S2_MCP.md)"
```

---

## 7. Télécharger le rapport depuis ton ordinateur

Si le serveur MCP est S1 :

```bash
scp root@212.227.212.33:/opt/wealthtech-audit-mcp/exports/AUDIT_GLOBAL_S1_S2_WEALTHTECH.tar.gz .
```

Si le serveur MCP est S2 :

```bash
scp root@217.160.249.254:/opt/wealthtech-audit-mcp/exports/AUDIT_GLOBAL_S1_S2_WEALTHTECH.tar.gz .
```

Si le serveur MCP est une troisième machine :

```bash
scp root@IP_DU_SERVEUR_MCP:/opt/wealthtech-audit-mcp/exports/AUDIT_GLOBAL_S1_S2_WEALTHTECH.tar.gz .
```

---

## 8. Commandes utiles de vérification après audit

```bash
ls -lah /opt/wealthtech-audit-mcp/reports
ls -lah /opt/wealthtech-audit-mcp/exports
```

Vérifier le contenu de l’archive :

```bash
tar -tzf /opt/wealthtech-audit-mcp/exports/AUDIT_GLOBAL_S1_S2_WEALTHTECH.tar.gz | head -100
```

---

## 9. Règle de sécurité

L’audit global est la première étape. La séquence correcte est :

1. Audit global non destructif.
2. Validation humaine du rapport.
3. Nettoyage contrôlé.
4. Migration contrôlée.
5. Documentation et Loop Engineering.
6. Architecture unifiée WealthTech.

Aucune suppression ni migration ne doit être lancée avant validation humaine du rapport d’audit.
