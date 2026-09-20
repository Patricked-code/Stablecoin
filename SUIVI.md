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

**État de preuve actuel :** `PARTIAL_LIVE_VERIFICATION` sous un statut global conservateur `DOCUMENTED_UNVERIFIED`. Le frontend Git/Passenger/HTTP, le chemin backend et la joignabilité HTTP sont vérifiés live. La source/ownership process du backend, son restart et la base attachée restent inconnus.

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
SOURCE_HEAD_OBSERVED = 678656d84164f1aa7dadef8a3a627d0b905fe9e4
LAST_COMPLETED_ACTION = S2_LIVE_FRONTEND_BACKEND_RUNTIME_HTTP_AND_DIFF_SCOPE_ATTESTED_NO_RUNTIME_MUTATION
CURRENT_BLOCKER = RUNTIME_WRITE_NOT_IN_CURRENT_TASK_SCOPE_PLAN_ONLY
EXACT_NEXT_ACTION = REOBSERVE_EXACT_MAIN_AND_DIFF_THEN_REQUEST_RUNTIME_WRITE_AUTHORIZATION_FOR_METADATA_ONLY_FAST_FORWARD_NO_BUILD_NO_RESTART_IF_APP_DIFF_ZERO
RUNTIME_STATUS = FRONTEND_GIT_PASSENGER_HTTP_CURRENT_BACKEND_PATH_HTTP_CURRENT_BACKEND_GIT_NOT_APPLICABLE_PROCESS_OWNERSHIP_UNKNOWN
CI_STATUS = PASS_FOR_STABLECOIN_MAIN_SHA_678656d84164f1aa7dadef8a3a627d0b905fe9e4_RUN_35532249854
MCP_REGISTRATION_STATUS = GITHUB_OIDC_READONLY_ACTIVE_MCP_MAIN_bb81baf7f8424bcb32c3e87b22018335461b1189_S1_ATTESTED
SECURITY_WARNINGS = SEE_SECTION_5_REQUIRES_SEPARATE_VERIFICATION
CHECKPOINT_ID = STB-CHK-20260920-007
EVIDENCE_IDS = EVID-GH-HEAD-20260915-001,EVID-GH-PERM-20260915-001,EVID-NONREG-20260915-001,EVID-CI-20260915-001,EVID-LINKAGE-20260915-001,EVID-MCP-BRIDGE-20260915-001,EVID-CORRECTION-20260915-001,EVID-CI-CORRECTION-20260915-001,EVID-S2-FRONTEND-GIT-20260920-001,EVID-S2-BACKEND-PATH-20260920-001,EVID-S2-RUNTIME-HTTP-20260920-001,EVID-S2-DIFF-NONREG-20260920-001
APPLICATION_CODE_MUTATION = NONE
RUNTIME_MUTATION = NONE
MCP_CORE_MUTATION = GOVERNED_READONLY_EVIDENCE_CAPABILITY_UPDATED_AND_DEPLOYED_ON_MCP_MAIN
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
- `2026-09-15 / EVID-CI-CORRECTION-20260915-001` : GitHub Actions `Governance Consistency` run `34906458393` a validé le SHA `36bf94fa0bf041be0e7128af2d53d335e1a449b5` après retrait complet du mécanisme SSH parallèle.

### Réconciliation inter-repository du 2026-09-20

- `Patricked-code/Stablecoin/main` réobservé au SHA exact `fc935852da22d0fc7125464081935cc4e9c079db`; GitHub Actions `Governance Consistency` run `34906495480` = SUCCESS sur ce SHA exact.
- `Patricked-code/MCP/main` réobservé au SHA exact `847b775a0b64b42ba3bddfee518ca0a486d810ce` après l'intégration terminale GWC et la PR #98.
- La PR MCP #86 `feat(stablecoin): add governed S2 SSH sync and deploy recipe` reste OPEN/DRAFT, non fusionnée, head `5f54b78c87ae3a5e8a402ac80af42355a7f4ec08`, base historique `555a51d0648ef796eba4868282942055a2f67a65`.
- Comparaison fraîche de #86 avec MCP `main` : `DIVERGED`, `ahead_by=18`, `behind_by=588`. La PR historique ne doit donc pas être fusionnée telle quelle.
- Le code MCP `main@847b775a...` a été vérifié : `src/tools/writeScoped.ts` n'expose actuellement que `api_opcv`, `front_end_opcvm`, `legacy_funds_frontend`, `legacy_funds_api`, `brvmchainsolution`; aucune entrée `stablecoin_frontend`. Le registre actif `data/mcp-git-registry.json` ne contient ni `CS-STABLECOIN-001` ni `chainsolutions.stablecoin`.
- La PR #86 reste néanmoins une preuve de conception exploitable : elle contient le mapping `stablecoin_frontend`, `CS-STABLECOIN-001`, remote `github`, branche `main`, fast-forward strict, build Next.js legacy et restart Passenger, avec backend conservé en `LIVE_DISCOVERY_REQUIRED`.
- La mémoire canonique MCP courante est désormais en mode `POST_INTEGRATION_OPERATIONAL_CONTINUITY` et exige avant mutation : GitHub main + Work Queue + Governed Session + Live State, puis reprise d'une tâche compatible ou création d'une nouvelle tâche issue de l'intention explicite.
- Dans la présente session, GitHub est accessible mais `wealthtech_ssh_bridge` n'est pas exposé comme outil exécutable. Aucun transport SSH parallèle n'a été recréé et aucune mutation serveur/runtime n'a été exécutée.
- Conséquence : la prochaine intégration Stablecoin doit porter l'intention de #86 sur le MCP actuel, sous une tâche/session/locks live réobservés, puis passer CI/review/merge/governed deploy exact-SHA. Seulement après activation runtime, la première action S2 doit rester `git_status_project_s2(stablecoin_frontend)` en lecture seule.

### Action suivante exacte

Reconnecter le `wealthtech_ssh_bridge` existant puis observer S2 en lecture seule. Vérifier le vhost/dossier Passenger actif, `git remote -v`, la présence et l'URL du remote `github`, la branche, le HEAD, le working tree, le process Passenger/Node et les réponses HTTP. Comparer ensuite le HEAD serveur au `main` GitHub courant.

Aucune commande `git fetch`, `git merge`, build, restart ou autre mutation serveur n'est autorisée avant cette attestation. Si le bridge n'est pas accessible, conserver `RUNTIME_STATUS = DOCUMENTED_UNVERIFIED` et s'arrêter au blocker au lieu de créer un transport parallèle.

Le checkpoint n'embarque volontairement pas son propre SHA de commit : le HEAD Git distant observé reste l'autorité pour la version du checkpoint. Toute nouvelle session doit donc réobserver Git et la CI avant écriture.

Le HEAD courant doit toujours être relu depuis Git au début d'une nouvelle session ; il ne doit jamais être déduit de ce document.

### Réconciliation S2 live via GitHub OIDC — 2026-09-20

Preuve fraîche, strictement read-only :

- `EVID-S2-FRONTEND-GIT-20260920-001`
- transport : `github_oidc_mcp_readonly`
- MCP workflow run : `35531961849`
- artifact : `10612095179`
- artifact digest : `sha256:85ce72d897d1ce7c805d89a86e15ae82322af9ee6eddb8aac6fac217d82efefb`
- mutation serveur : `false`

État observé du checkout frontend Stablecoin S2 :

```text
PATH = /var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin
BRANCH = main
SERVER_HEAD = 6216755d318677ed9a56c36731a57531d02bf751
WORKING_TREE_CHANGES = 0
ORIGIN_FETCH = https://github.com/Patricked-code/Stablecoin.git
ORIGIN_PUSH = https://github.com/Patricked-code/Stablecoin.git
GITHUB_MAIN = 7c6e64d3486658feca9192bae7602b195f0537f8
COMPARE_SERVER_TO_GITHUB = ahead
GITHUB_AHEAD_BY = 53
SERVER_AHEAD_BY = 0
MERGE_BASE = SERVER_HEAD
CLASSIFICATION = SERVER_BEHIND
```

Conséquences :

- le chemin historique du frontend est confirmé live ;
- le checkout est propre ;
- la branche est correcte ;
- le remote GitHub est correct ;
- il n'y a aucune divergence Git : le serveur est un ancêtre direct de `main` ;
- un fast-forward est techniquement possible, mais reste non autorisé à ce stade tant que backend, process Passenger/Node et HTTP/API ne sont pas attestés live ;
- aucune commande `git fetch`, `git merge`, build ou restart n'a été exécutée.

Le blocker précédent `WEALTHTECH_SSH_BRIDGE_NOT_EXPOSED...` est dépassé pour les preuves read-only : GitHub Actions OIDC fournit maintenant un canal gouverné sans exposition interactive du bridge.

Prochaine action exacte : étendre/consommer les probes read-only pour attester le backend API Stablecoin, le process Passenger/Node et les réponses HTTP, puis décider si le fast-forward frontend documenté peut être préparé.


### Réconciliation S2 live complète — 2026-09-20

Preuves read-only fraîches via GitHub OIDC :

- `EVID-S2-FRONTEND-GIT-20260920-001` — run `35531961849`, artifact `10612095179`, digest `sha256:85ce72d897d1ce7c805d89a86e15ae82322af9ee6eddb8aac6fac217d82efefb` ;
- `EVID-S2-BACKEND-PATH-20260920-001` — run `35533714750`, artifact `10611638096`, digest `sha256:34dfa858c9664908424ea4d6432b8bafe5b2f2422f24bd05ce6350623bead22f` ;
- `EVID-S2-RUNTIME-HTTP-20260920-001` — run `35533765848`, artifact `10612397117`, digest `sha256:78ba9a228aad34a54a2cb566533a67514058233f7944361c18fa548713ca51b6` ;
- `EVID-S2-DIFF-NONREG-20260920-001` — comparaison serveur `6216755d...` → GitHub `678656d8...`.

État live consolidé :

```text
FRONTEND_PATH = /var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin
FRONTEND_BRANCH = main
FRONTEND_SERVER_HEAD = 6216755d318677ed9a56c36731a57531d02bf751
FRONTEND_WORKTREE = CLEAN
FRONTEND_ORIGIN = https://github.com/Patricked-code/Stablecoin.git
FRONTEND_PASSENGER_CWD = /var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin
FRONTEND_HTTP = 200

BACKEND_PATH = /var/www/vhosts/chainsolutions.fr/api.stablecoin.chainsolutions.fr
BACKEND_PATH_EXISTS = true
BACKEND_GIT_REPOSITORY = false
BACKEND_HTTP_ROOT = 401
BACKEND_HTTP_HEALTH = 401
BACKEND_REACHABILITY = REACHABLE_AUTH_PROTECTED
BACKEND_PROCESS_OWNERSHIP = UNKNOWN

GITHUB_MAIN_OBSERVED = 678656d84164f1aa7dadef8a3a627d0b905fe9e4
GITHUB_AHEAD_BY = 57
SERVER_AHEAD_BY = 0
MERGE_BASE = SERVER_HEAD
DIFF_CHANGED_FILES = 16
APPLICATION_CODE_FILES_CHANGED = 0
DIFF_SCOPE = GOVERNANCE_DOCS_MCP_CI_README_ONLY
```

Conséquence de non-régression : le fast-forward frontend est techniquement possible et, **sur le diff observé**, ne modifierait aucun fichier applicatif. Le plan de mise à jour devient donc :

1. reobserver immédiatement avant exécution le HEAD GitHub exact, le HEAD S2, le worktree et le diff ;
2. exiger encore `behind_by=0`, `merge_base=SERVER_HEAD`, worktree propre et `APPLICATION_CODE_FILES_CHANGED=0` ;
3. exécuter uniquement un fast-forward strict du checkout frontend via son remote GitHub existant ;
4. **ne pas lancer npm install, build ni restart Passenger** si le diff reste non applicatif ;
5. réattester HEAD/worktree, frontend HTTP 200 et API protégée/joignable après le fast-forward ;
6. si un fichier applicatif apparaît dans le diff au préflight, annuler ce plan et revenir à une procédure build/restart dédiée.

Aucune mutation S2 n'a été exécutée pendant cette réconciliation. L'opération runtime reste hors du scope courant tant qu'elle n'est pas explicitement autorisée.
