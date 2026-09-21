# SUIVI.md — Suivi WealthTech / MCP / Stablecoin

Date : 2026-07-01
Branche : `codex/wealthtech-mcp-conversation-memory`
Dépôt : `Patricked-code/Stablecoin`

---

## 1. Historique chronologique synthétique

### 1.1 Remise en ligne et nettoyage initial S1

Un message précédent indique que `niakara.com`, `www.niakara.com` et `api.niakara.com` ont été remis en ligne, avec `200 OK` pour les deux premiers et `api.niakara.com` redirigé vers une API PM2 existante sur le port `3005` au lieu de planter via Passenger.

Des domaines Node vides ou cassés ont été neutralisés sans suppression, avec réponse `403` au lieu d’erreurs Passenger 500.

### 1.2 Décision S1

L’utilisateur a précisé que seuls les domaines suivants doivent être conservés sur S1 :

- `niakara.com`
- `www.niakara.com`
- `api.niakara.com`
- `wealthtechinnovations.com`
- `api.wealthtechinnovations.com`
- `stablecoin.wealthtechinnovations.com`
- `api.stablecoin.wealthtechinnovations.com`
- `blockchain.wealthtechinnovations.com`
- `tokenfactory.wealthtechinnovations.com`
- `wealthtechinnovation.com`
- `berebytours.com`

Le reste doit être vidé ou nettoyé après inventaire, avec objectif de libérer le maximum d’espace.

### 1.3 Ajout S2

L’utilisateur a demandé de connecter aussi S2 :

```text
S2 = root@217.160.249.254
```

Et de travailler avec les deux serveurs :

```text
S1 = root@212.227.212.33
S2 = root@217.160.249.254
```

### 1.4 Domaines S2 protégés

Les domaines S2 protégés sont :

- `africafunds.chainsolutions.fr`
- `api.africafunds.chainsolutions.fr`
- `api.stablecoin.chainsolutions.fr`
- `stablecoin.chainsolutions.fr`
- `brvm.chainsolutions.fr`
- `bvmac.chainsolutions.fr`
- `chainsolutions.fr`
- `Funds.chainsolutions.fr`
- `api.funds.chainsolutions.fr`

Aucune action ne doit les modifier.

### 1.5 Migrations prévues

- WealthTech S2 vers `V2.wealthtechinnovations.com` sur S1.
- EVOTE S2 vers `evote.wealthtechinnovations.com` et `api.evote.wealthtechinnovations.com` sur S1.
- Formation Blockchain S2 vers `evaluations.wealthtechinnovations.com` et `api.evaluations.wealthtechinnovations.com` sur S1.
- Stablecoin S2 vers S1 par copie uniquement, sans suppression des originaux S2.

### 1.6 Architecture cible

Créer une application ou un écosystème unifié avec base commune étendue, microservices, Docker, Redis, ClickHouse, Kubernetes futur, agents IA, documentation, sécurité et non-régression.

### 1.7 Documentation obligatoire

Les fichiers suivants doivent être créés et maintenus : `GPT.md`, `SUIVI.md`, `README.md`, `README_DEV.md`, `ROADMAP.md`, `TODO.md`, `TASKS.md`, `CODE_REVIEW.md`, `CHANGELOG.md`, `DEPLOYMENT_PRODUCTION.md`, `ARCHITECTURE.md`, `DATABASE.md`, `DOCKER.md`, `KUBERNETES_FUTURE.md`, `SECURITY.md`, `MONITORING.md`, `BACKUP_RESTORE.md`, `MIGRATION.md`, `AGENTS_ARCHITECTURE.md`, `AI_SKILLS.md`.

### 1.8 Demande MCP

L’utilisateur dispose d’un serveur MCP pouvant accéder aux deux serveurs et veut l’utiliser pour :

- analyser S1 et S2 ;
- vérifier toutes les implications de la conversation ;
- produire un état des lieux global ;
- générer un rapport détaillé et commenté ;
- enregistrer le rapport sur le serveur ;
- rendre le rapport téléchargeable.

### 1.9 Action GitHub réalisée

La conversation a été compilée et poussée sur GitHub dans le dépôt `Patricked-code/Stablecoin`, branche `codex/wealthtech-mcp-conversation-memory`, avec les fichiers :

- `docs/mcp/WEALTHTECH_MCP_CONVERSATION_COMPILED.md`
- `docs/mcp/AUDIT_GLOBAL_S1_S2_MCP_PROMPT.md`
- `docs/mcp/MCP_GIT_INSTALLATION_GUIDE.md`
- `docs/mcp/GPT_WEALTHTECH_MCP.md`
- `docs/mcp/SUIVI_WEALTHTECH_MCP.md`

---

# POINT DE REPRISE COURANT

## Date de mise à jour

2026-07-01

## Serveur concerné

MCP / GitHub / S1 / S2

## Projet concerné

WealthTech / Stablecoin / MCP / EWARI / KOREE

## Domaine concerné

Tous les domaines listés dans la mémoire compilée.

## Dernière action terminée

Compilation de la conversation et ajout des fichiers de mémoire MCP dans GitHub.

## État actuel

La mémoire projet est disponible sur GitHub dans une branche dédiée. Le contenu doit maintenant être récupéré sur le serveur MCP dans `/opt/wealthtech-mcp-memory`, puis le prompt d’audit doit être copié dans `/opt/wealthtech-audit-mcp/prompts`.

## Action suivante recommandée

Sur le serveur MCP :

```bash
mkdir -p /opt/wealthtech-mcp-memory
cd /opt/wealthtech-mcp-memory
git clone --branch codex/wealthtech-mcp-conversation-memory https://github.com/Patricked-code/Stablecoin.git stablecoin-memory
mkdir -p /opt/wealthtech-audit-mcp/{reports,prompts,scripts,logs,exports}
cp /opt/wealthtech-mcp-memory/stablecoin-memory/docs/mcp/AUDIT_GLOBAL_S1_S2_MCP_PROMPT.md /opt/wealthtech-audit-mcp/prompts/AUDIT_GLOBAL_S1_S2_MCP.md
cd /opt/wealthtech-audit-mcp
claude
```

Puis demander à Claude Code d’exécuter l’audit non destructif via `wealthtech_ssh_bridge`.

## Domaines à ne pas toucher

Tous les domaines S2 protégés :

- `africafunds.chainsolutions.fr`
- `api.africafunds.chainsolutions.fr`
- `api.stablecoin.chainsolutions.fr`
- `stablecoin.chainsolutions.fr`
- `brvm.chainsolutions.fr`
- `bvmac.chainsolutions.fr`
- `chainsolutions.fr`
- `Funds.chainsolutions.fr`
- `api.funds.chainsolutions.fr`

## Domaines S1 à préserver

- `niakara.com`
- `www.niakara.com`
- `api.niakara.com`
- `wealthtechinnovations.com`
- `api.wealthtechinnovations.com`
- `stablecoin.wealthtechinnovations.com`
- `api.stablecoin.wealthtechinnovations.com`
- `blockchain.wealthtechinnovations.com`
- `tokenfactory.wealthtechinnovations.com`
- `wealthtechinnovation.com`
- `berebytours.com`

## Domaines en cours de migration future

- `wealthtech.chainsolutions.fr` vers `V2.wealthtechinnovations.com`
- `evote.chainsolutions.fr` vers `evote.wealthtechinnovations.com`
- `api.evote.chainsolutions.fr` vers `api.evote.wealthtechinnovations.com`
- `itic4fima.chainsolutions.fr` vers `evaluations.wealthtechinnovations.com`
- `api.itic4fima.chainsolutions.fr` vers `api.evaluations.wealthtechinnovations.com`
- `stablecoin.chainsolutions.fr` vers `stablecoin.wealthtechinnovations.com`
- `api.stablecoin.chainsolutions.fr` vers `api.stablecoin.wealthtechinnovations.com`

## Risques connus

- Suppression accidentelle de domaines protégés.
- Exposition de secrets `.env`.
- Redémarrage involontaire de services critiques.
- Confusion entre S1, S2 et serveur MCP.
- Confusion entre domaines à conserver, domaines à migrer et domaines à nettoyer.
- Nettoyage de sauvegardes avant inventaire.
- Migration Stablecoin S2 suivie d’une suppression interdite.

## Tests déjà effectués

Aucun test serveur réel exécuté depuis ce commit. Les fichiers GitHub ont été créés.

## Résultat des tests

Non applicable à ce stade.

## Fichiers modifiés

- `docs/mcp/WEALTHTECH_MCP_CONVERSATION_COMPILED.md`
- `docs/mcp/AUDIT_GLOBAL_S1_S2_MCP_PROMPT.md`
- `docs/mcp/MCP_GIT_INSTALLATION_GUIDE.md`
- `docs/mcp/GPT_WEALTHTECH_MCP.md`
- `docs/mcp/SUIVI_WEALTHTECH_MCP.md`

## Bases de données concernées

Aucune base de données modifiée.

## PM2 / Docker / Passenger concernés

Aucun service modifié.

## Décision de reprise

Reprendre par installation de la mémoire GitHub sur le serveur MCP, puis audit non destructif S1 + S2 avant toute suppression ou migration.
