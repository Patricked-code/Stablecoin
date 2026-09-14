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

Une comparaison Git fraîche entre la baseline applicative `6216755d318677ed9a56c36731a57531d02bf751` et le HEAD observé avant durcissement `1ade2609cb14f0ec8f1a3c916e1fe5f446a46d81` montre :

```text
STATUS = ahead
COMMITS = 16
APPLICATION_CODE_FILES_CHANGED = 0
GOVERNANCE_DOCS_AND_MCP_FILES_ONLY = true
```

Les changements sont limités aux documents de gouvernance/mémoire, au README et aux cinq fichiers `.mcp/*`. Aucun fichier JavaScript, Solidity, ABI, route ou configuration applicative existante n'a été modifié.

## 8. Point de reprise courant

### Current State Block

```text
CURRENT_WORKSTREAM = GOVERNED_REPOSITORY_EVOLUTION
CURRENT_TASK = STB-TASK-20260915-002
CURRENT_TASK_STATUS = IN_PROGRESS
TASK_BASELINE_SHA = 45f440d304022dd06d9f7f68e98fb38bc568488a
SOURCE_HEAD_OBSERVED = 45f440d304022dd06d9f7f68e98fb38bc568488a
LAST_COMPLETED_ACTION = PARALLEL_SSH_MECHANISM_IDENTIFIED_AND_REMOVAL_IN_PROGRESS
CURRENT_BLOCKER = EXISTING_WEALTHTECH_SSH_BRIDGE_NOT_AVAILABLE_IN_CURRENT_SESSION
EXACT_NEXT_ACTION = RECONNECT_EXISTING_WEALTHTECH_SSH_BRIDGE_AND_REOBSERVE_S2_STABLECOIN_RUNTIME
RUNTIME_STATUS = DOCUMENTED_UNVERIFIED
CI_STATUS = PASS_FOR_IMPLEMENTATION_SHA_be144938ae325cfc2348228b645dfada80b8b12d
MCP_REGISTRATION_STATUS = READY_NOT_LIVE_ATTESTED
SECURITY_WARNINGS = SEE_SECTION_5_REQUIRES_SEPARATE_VERIFICATION
CHECKPOINT_ID = STB-CHK-20260915-004
EVIDENCE_IDS = EVID-GH-HEAD-20260915-001,EVID-GH-PERM-20260915-001,EVID-NONREG-20260915-001,EVID-CI-20260915-001,EVID-LINKAGE-20260915-001,EVID-MCP-BRIDGE-20260915-001,EVID-CORRECTION-20260915-001
APPLICATION_CODE_MUTATION = NONE
RUNTIME_MUTATION = NONE
MCP_CORE_MUTATION = NONE
```

Le checkpoint est une mémoire de reprise et doit être réconcilié avec Git, la CI et le runtime avant toute nouvelle mutation.

### Portée de la tâche courante

`STB-TASK-20260915-002` révalide et gouverne la liaison GitHub ↔ serveur déjà documentée : remote serveur `github` vers `Patricked-code/Stablecoin`, procédure fast-forward documentée, et pont externe `wealthtech_ssh_bridge`. Le connecteur GitHub Actions SSH ajouté récemment est retiré comme mécanisme parallèle non nécessaire.

### Work log gouverné

- `2026-09-15 / EVID-GH-HEAD-20260915-001` : `main` observé à `1ade2609cb14f0ec8f1a3c916e1fe5f446a46d81` avant écriture.
- `2026-09-15 / EVID-GH-PERM-20260915-001` : connexion GitHub active observée avec `pull=true`, `push=true`, `admin=false` ; preuve limitée à la session.
- `2026-09-15 / EVID-NONREG-20260915-001` : baseline applicative vers HEAD pré-durcissement = gouvernance uniquement, aucun fichier applicatif modifié.
- `2026-09-15 / EVID-CI-20260915-001` : GitHub Actions `Governance Consistency` run `34905505739` = SUCCESS pour le SHA exact `be144938ae325cfc2348228b645dfada80b8b12d` ; l'étape `Verify governance consistency` = SUCCESS.
- `2026-09-15 / EVID-LINKAGE-20260915-001` : le runbook `main` documente un remote serveur `github = https://github.com/Patricked-code/Stablecoin.git` et une mise à jour `git fetch github main` + `git merge --ff-only github/main`.
- `2026-09-15 / EVID-MCP-BRIDGE-20260915-001` : la branche historique documente `wealthtech_ssh_bridge` comme pont externe vers S1/S2 ; cette preuve reste historique jusqu'à reconnexion live.
- `2026-09-15 / EVID-CORRECTION-20260915-001` : le transport GitHub Actions SSH ajouté ensuite est classé mécanisme parallèle non nécessaire et retiré conformément à la gouvernance existante.

### Action suivante exacte

Reconnecter le `wealthtech_ssh_bridge` existant puis observer S2 en lecture seule. Vérifier le vhost/dossier Passenger actif, `git remote -v`, la présence et l'URL du remote `github`, la branche, le HEAD, le working tree, le process Passenger/Node et les réponses HTTP. Comparer ensuite le HEAD serveur au `main` GitHub courant.

Aucune commande `git fetch`, `git merge`, build, restart ou autre mutation serveur n'est autorisée avant cette attestation. Si le bridge n'est pas accessible, conserver `RUNTIME_STATUS = DOCUMENTED_UNVERIFIED` et s'arrêter au blocker au lieu de créer un transport parallèle.

Le checkpoint n'embarque volontairement pas son propre SHA de commit : le HEAD Git distant observé reste l'autorité pour la version du checkpoint. Toute nouvelle session doit donc réobserver Git et la CI avant écriture.

Le HEAD courant doit toujours être relu depuis Git au début d'une nouvelle session ; il ne doit jamais être déduit de ce document.
