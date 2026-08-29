# SUIVI — Mémoire persistante du projet Stablecoin

> **Statut :** `CANONICAL PROJECT MEMORY`  
> **Dépôt :** `Patricked-code/Stablecoin`  
> **Branche canonique :** `main`

## 1. Baseline de reprise

Le bootstrap `governed-repository-evolution` a commencé le 2026-08-29 depuis :

```text
BASELINE_MAIN_SHA = 6216755d318677ed9a56c36731a57531d02bf751
BASELINE_COMMIT = Fix E-WARI metaTransfer relayer API key runtime loading
```

À cette baseline, `main` contenait déjà :

- l'application frontend Next.js historique ;
- les composants et ABI/contrats blockchain ;
- les dernières corrections E-WARI/OpenZeppelin Relayer ;
- `docs/STABLECOIN_PLESK_DEPLOYMENT_RUNBOOK.md`, mémoire technique détaillée du runtime/déploiement documenté ;
- un README largement hérité d'un template GitLab.

## 2. Travail historique réconcilié

La branche :

`codex/wealthtech-mcp-conversation-memory`

est une descendante de l'ancienne baseline `main@6216755d...` et ajoute une série de commits documentaires datés du 2026-07-01, dont :

- compilation d'une conversation WealthTech/MCP/S1/S2 ;
- prompt d'audit non destructif ;
- guide d'installation MCP ;
- suivi MCP ;
- ancien manifeste MCP.

**Classification :** `HISTORICAL_EVIDENCE / NOT_CURRENT_PROJECT_AUTHORITY`.

Elle ne doit être ni supprimée, ni fusionnée, ni utilisée pour déclencher une action serveur sans réconciliation.

## 3. Gouvernance installée

Le 2026-08-29, le dépôt a reçu une mémoire locale gouvernée inspirée des invariants éprouvés sur les autres repos matures, sans copier leur structure :

- `GOVERNANCE.md` ;
- `SOURCE_OF_TRUTH.md` ;
- `AGENTS.md` ;
- `LOOP_ENGINEERING.md` ;
- `DECISIONS.md` ;
- `ARCHITECTURE.md` ;
- `TODO.md` ;
- le présent `SUIVI.md`.

Principes adoptés :

- évolution additive ;
- zéro régression ;
- lecture de l'existant avant création ;
- `main` comme branche de travail normal ;
- branche nouvelle uniquement sur instruction explicite ;
- preuve avant affirmation ;
- états `CURRENT`, `DOCUMENTED_UNVERIFIED`, `STALE`, `CONTRADICTED`, `UNKNOWN`, `NOT_APPLICABLE` ;
- Loop Engineering obligatoire ;
- point de reprise persistant ;
- MCP reste l'orchestrateur externe, aucun mécanisme MCP parallèle n'est recréé ici.

## 4. État applicatif documenté

### Frontend

Le dépôt documente un frontend Next.js 10 / React 17 avec composants d'authentification, paiement, profil, cartographie et blockchain.

### Production / runtime

Le runbook documente notamment :

- `stablecoin.chainsolutions.fr` pour le frontend ;
- `api.stablecoin.chainsolutions.fr` pour l'API métier ;
- Plesk / Phusion Passenger pour le frontend ;
- un backend Express / Sequelize distinct ;
- des chemins serveur historiques et une procédure de build/restart.

**État de preuve actuel :** `DOCUMENTED_UNVERIFIED`.

Aucune connexion live au serveur n'a été exécutée dans ce bootstrap. Les chemins, HEAD déployés, remotes, services et réponses HTTP doivent être reverifiés avant mutation runtime.

## 5. Sécurité connue

Le runbook documente un risque potentiel autour d'une variable `NEXT_PUBLIC_PRIVATE_KEY`. Aucune valeur n'est enregistrée ici.

**Statut :** `REQUIRES_SEPARATE_SECURITY_VERIFICATION`.

Ne pas corriger ou rotater de clé sans observation live et plan dédié.

## 6. Contrat MCP repository-side

Les cinq fichiers attendus par la procédure repo bootstrap actuellement documentée côté MCP sont présents :

- `.mcp/manifest.json` ;
- `.mcp/permissions.json` ;
- `.mcp/agents.json` ;
- `.mcp/server-map.json` ;
- `.mcp/onboarding.json`.

Ils exposent l'identité, les rôles sémantiques, les permissions, les frontières agents et une cartographie serveur bornée par la preuve.

**Statut :** `REPOSITORY_READY_FOR_MCP_RECONCILIATION / LIVE_MCP_REGISTRATION_NOT_ATTESTED_IN_THIS_CHANGE`.

Le contrat distingue :

- runtime documenté ;
- runtime vérifié ;
- runtime actuellement inconnu ;
- droits de mutation ;
- branche canonique locale.

## 7. Vérification du bootstrap

Une comparaison Git fraîche entre la baseline applicative `6216755d318677ed9a56c36731a57531d02bf751` et le checkpoint `b124f3526033d96073240cad226875f8347888e3` montre :

```text
STATUS = ahead
COMMITS = 14
APPLICATION_CODE_FILES_CHANGED = 0
GOVERNANCE_DOCS_AND_MCP_FILES_ONLY = true
```

Les changements sont limités aux documents de gouvernance/mémoire, au README et aux cinq fichiers `.mcp/*`. Aucun fichier JavaScript, Solidity, ABI, route ou configuration applicative existante n'a été modifié.

## 8. Point de reprise courant

```text
WORKSTREAM = GOVERNED_REPOSITORY_EVOLUTION
STATE = READY_FOR_SERVER_RECONCILIATION
NEXT = RECONCILE_LIVE_SERVER_FOLDER_WITH_GITHUB_MAIN_AND_UPDATE_SERVER_MAP
MCP_REPOSITORY_CONTRACT = READY_NOT_LIVE_ATTESTED
APPLICATION_CODE_MUTATION = NONE
RUNTIME_MUTATION = FORBIDDEN_UNTIL_FRESH_SERVER_VERIFICATION
```

### Prochaine action exacte

Lorsque les informations/accès serveur sont fournis :

1. identifier serveur, vhost et dossier réellement actifs ;
2. relever branche, HEAD, remotes et working tree ;
3. comparer serveur ↔ `Patricked-code/Stablecoin/main` ;
4. identifier le backend API réellement actif et son repo/HEAD ;
5. vérifier Passenger/Node et les réponses HTTP/API ;
6. mettre à jour `.mcp/server-map.json`, `ARCHITECTURE.md` et le présent `SUIVI.md` avec les preuves live ;
7. préparer la liaison gouvernée GitHub → serveur consommable par MCP, sans synchronisation destructive.

Le HEAD courant doit toujours être relu depuis Git au début d'une nouvelle session ; il ne doit jamais être déduit de ce document.
