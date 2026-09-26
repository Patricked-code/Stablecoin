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

> Mise à jour 2026-09-26 (`EVID-S2-BACKEND-PROCESS-20260926-001`) : l'ownership du process backend est désormais observé (Plesk/Phusion Passenger, utilisateur d'abonnement non root identique au frontend, aucun PM2). La révision déployée, la procédure exacte de restart et la connexion effective à la base restent inconnues.

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
CURRENT_TASK = STB-TASK-20260926-003
CURRENT_TASK_STATUS = IN_PROGRESS
TASK_BASELINE_SHA = b5955823f30ff60a20d9abb25a40c31988844dff
SOURCE_HEAD_OBSERVED = 1e3ecf503e7f27d82798f8b1083f24f6e940dbc2
LAST_COMPLETED_ACTION = GOVERNANCE_FULL_REREAD_COMPLIANCE_AUDIT_CONTRADICTIONS_RECORDED_OPTION_B_DEC-2026-09-26-018_RECORDED
CURRENT_BLOCKER = OWNER_DECISION_REQUIRED_ON_2026-09-23_S2_MUTATION_PRECONDITION;INTERACTIVE_MCP_BRIDGE_SESSION_INVALID
EXACT_NEXT_ACTION = VALIDATE_THIS_CHECKPOINT_CI_THEN_OWNER_DECIDES_2026-09-23_PRECONDITION_THEN_IF_LIFTED_AND_AUTHORIZED_CLAUDE_RECONCILES_S2_EXPECTED_2a8be8219689e6213ce20f13d69b6b45f3693dfe_TARGET_CURRENT_MAIN_PER_DEC-2026-09-26-018
PARKED_TASKS = STB-TASK-20260915-002(IN_PROGRESS;BLOCKER=BACKEND_DEPLOYED_SOURCE_REVISION_AND_EXACT_RESTART_PROCEDURE_UNKNOWN;PROCESS_OWNERSHIP_ATTESTED_20260926_PASSENGER_NON_ROOT;NEXT=DISCOVER_BACKEND_DEPLOYED_REVISION_AND_RESTART_PROCEDURE_READONLY)
RUNTIME_STATUS = S2_FRONTEND_2a8be821_CLEAN_BEHIND_MAIN_BY_3_GOVERNANCE_ONLY_HTTP_200_BACKEND_PASSENGER_NON_ROOT_HTTP_401_401_OBSERVED_2026-09-26T19:27:32Z
CI_STATUS = PREVIOUS_HEAD_1e3ecf503e7f27d82798f8b1083f24f6e940dbc2_PASS_RUN_36266811342_NEW_CHECKPOINT_REQUIRES_EXACT_SHA_CI
MCP_REGISTRATION_STATUS = GITHUB_OIDC_READONLY_AND_BOUNDED_WRITE_ACTIVE_BACKEND_INVENTORY_PROBE_SUCCESS_RUN_35803784710;INTERACTIVE_BRIDGE_SESSION_INVALID_2026-09-26
SECURITY_WARNINGS = PUBLIC_REPOSITORY;KEY_SHAPED_STRINGS_HARDCODED_IN_10_TRACKED_FILES;ENV_LOCAL_IN_21_HISTORICAL_COMMITS;NEXT_PUBLIC_PRIVATE_KEY_READ_BY_CLIENT_COMPONENTS;ROTATION_BY_OWNER_REQUIRED_IF_REAL_KEYS;WEB_ROOT_SERVES_APP_DIRECTORY_AND_GIT_DIRECTORY_EVID-S2-WEB-EXPOSURE-20260926-001;SEE_SECTION_5
CHECKPOINT_ID = STB-CHK-20260926-012
EVIDENCE_IDS = EVID-GH-HEAD-20260915-001,EVID-GH-PERM-20260915-001,EVID-NONREG-20260915-001,EVID-CI-20260915-001,EVID-LINKAGE-20260915-001,EVID-MCP-BRIDGE-20260915-001,EVID-CORRECTION-20260915-001,EVID-CI-CORRECTION-20260915-001,EVID-S2-FRONTEND-GIT-20260920-001,EVID-S2-BACKEND-PATH-20260920-001,EVID-S2-RUNTIME-HTTP-20260920-001,EVID-S2-DIFF-NONREG-20260920-001,EVID-S2-FAST-FORWARD-20260921-001,EVID-S2-POST-FAST-FORWARD-GIT-20260921-001,EVID-S2-POST-FAST-FORWARD-RUNTIME-20260921-001,EVID-S2-FRONTEND-GIT-20260923-001,EVID-S2-BACKEND-GIT-20260923-001,EVID-S2-RUNTIME-HTTP-20260923-001,EVID-S2-BACKEND-INVENTORY-20260923-001,EVID-MCP-UNAVAILABLE-20260926-001,EVID-SSH-FALLBACK-20260926-001,EVID-SEC-SCAN-20260926-001,EVID-S2-HOSTKEY-20260926-001,EVID-MCP-CLASSIFIER-COMPAT-20260926-001,EVID-S2-GUARD-TESTS-20260926-001,EVID-CI-20260926-58090cc,EVID-S2-HOSTKEY-BINDING-20260926-001,EVID-S2-FALLBACK-OBSERVE-20260926-001,EVID-S2-BACKEND-PROCESS-20260926-001,EVID-CI-20260926-1e3ecf5,EVID-GH-PERM-20260926-001,EVID-GOV-REREAD-20260926-001,EVID-S2-WEB-EXPOSURE-20260926-001
APPLICATION_CODE_MUTATION = NONE
BACKEND_METADATA_DISCOVERY = PACKAGE_api.fan-token_V1.0.0_DECLARED_GITLAB_SOURCE_MYSQL_db_stablecoin_NO_SECRET_VALUES_READ
RUNTIME_MUTATION = S2_FRONTEND_FAST_FORWARD_6216755d318677ed9a56c36731a57531d02bf751_TO_4e946bd523acfbef3d08d9ff7b0b3dd3f074c3a3_NO_BUILD_NO_RESTART
MCP_CORE_MUTATION = PR117_GITHUB_FIRST_BOUNDED_WRITE_MERGED_ab9b1aa902aab3efed42ba527847ab48df3c8eaa_DEPLOYED_S1
```

Le checkpoint est une mémoire de reprise et doit être réconcilié avec Git, la CI et le runtime avant toute nouvelle mutation.

### Portée de la tâche courante

`STB-TASK-20260926-003` (ouverte le 2026-09-26 sur instruction explicite du propriétaire) aligne le canal SSH de secours Stablecoin sur le modèle AfricaFunds et sur les garanties de la commande bornée MCP : observation, inventaire des secrets sans valeurs, vérification de la clé d'hôte et fast-forward borné du frontend, utilisables uniquement lorsque le MCP est indisponible (DEC-2026-09-26-016 / DEC-2026-09-26-017). `STB-TASK-20260915-002` n'est pas abandonnée : elle est parquée (`PARKED_TASKS`) avec son blocker et sa prochaine action inchangés.

`STB-TASK-20260915-002` révalide et gouverne la liaison GitHub ↔ serveur déjà documentée : remote serveur `github` vers `Patricked-code/Stablecoin`, procédure fast-forward documentée, et pont externe `wealthtech_ssh_bridge`. Le connecteur GitHub Actions SSH ajouté récemment est retiré comme mécanisme parallèle non nécessaire.

> Statut 2026-09-26 : `CONTRADICTED` sur ce dernier point par les décisions du propriétaire DEC-2026-09-26-016 / 017 — le connecteur est rétabli comme canal de secours déclaré, utilisable seulement quand le MCP est indisponible. Le texte ci-dessus reste la trace historique du 2026-09-15.

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

**Mise à jour 2026-09-26 (`STB-CHK-20260926-010`) :** la tâche courante est `STB-TASK-20260926-003` ; sa prochaine action est donnée par le Current State Block et par la section « Alignement du canal SSH de secours sur AfricaFunds — 2026-09-26 ». Le paragraphe ci-dessous reste la prochaine action de `STB-TASK-20260915-002`, parquée.

Continuer exclusivement via le fallback GitHub-first/OIDC déjà intégré. La prochaine découverte doit rester strictement read-only et viser deux éléments encore inconnus : la révision exacte du backend déployé issue du dépôt déclaré `gitlab.com/wealthtech1/api/api.fan-token.git`, puis l'ownership/procédure exacte de restart du backend. Ne pas utiliser le bridge, ne pas recréer de transport parallèle et ne pas muter S2 tant que ces deux points ne sont pas attestés.

Le frontend S2 est déjà aligné sur `Patricked-code/Stablecoin/main@2a8be8219689e6213ce20f13d69b6b45f3693dfe`, worktree propre.

> Statut 2026-09-26 : `STALE` — S2 est toujours à `2a8be821`, mais `main` a avancé (delta de gouvernance uniquement) ; voir `EVID-S2-FALLBACK-OBSERVE-20260926-001`. La contrainte « ne pas muter S2 tant que ces deux points ne sont pas attestés » reste en vigueur tant que le propriétaire ne l'a pas levée (voir la passe de conformité du 2026-09-26).

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


### Activation GitHub-first WRITE et fast-forward S2 — 2026-09-21

Autorisation humaine explicite reçue pour poursuivre la mutation runtime bornée.

Le MCP a d'abord été étendu par PR #117 avec une surface WRITE séparée du read-only :

- MCP merge : `ab9b1aa902aab3efed42ba527847ab48df3c8eaa` ;
- MCP CI post-merge #1604 / run `35569573733` : SUCCESS ;
- Governed Deploy #54 / run `35569573744` : SUCCESS sur ce SHA exact ;
- workflow : `Stablecoin Bounded Fast Forward` ;
- OIDC WRITE dédié ; aucune authentification MCP interactive, aucune clé SSH GitHub, aucun shell libre.

Premier fast-forward S2 attesté :

```text
REQUEST_ID = stablecoin-s2-fast-forward-20260921-001
WORKFLOW_RUN = 35569719611
SERVER_BEFORE = 6216755d318677ed9a56c36731a57531d02bf751
SERVER_AFTER = 4e946bd523acfbef3d08d9ff7b0b3dd3f074c3a3
TARGET_SHA = 4e946bd523acfbef3d08d9ff7b0b3dd3f074c3a3
CHANGED_FILES = 16
APPLICATION_FILES = 0
BUILD_EXECUTED = false
RESTART_EXECUTED = false
FRONTEND_HTTP = 200
API_ROOT_HTTP = 401
API_HEALTH_HTTP = 401
```

Post-attestation indépendante, strictement read-only :

- Git : run `35569778860`, artifact `10625840088`, digest `sha256:f1829db1586ed752f728a3e6793b60c455acc69aceadaa5284106bb2f80f00c2` ;
- Git observé : `main@4e946bd523acfbef3d08d9ff7b0b3dd3f074c3a3`, worktree propre, origin fetch/push canonique ;
- Runtime : run `35569783346`, artifact `10625508685`, digest `sha256:57cb62ca4f51e3ad79c5d2b42e000eb36e962a239ec2d23bc90b08ca8ab044f2` ;
- Passenger frontend cwd : `/var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin` ;
- Passenger backend cwd : `/var/www/vhosts/chainsolutions.fr/api.stablecoin.chainsolutions.fr` ;
- HTTP après écriture : frontend `200`, API racine `401`, API health `401`.

Le frontend Stablecoin a donc été aligné sans modifier le code applicatif et sans build/restart.

Ce checkpoint est versionné après l'attestation. Son propre commit ne peut pas contenir son propre SHA ; après CI exact-head, il doit être fast-forwardé sur S2 par le même chemin borné si le delta reste documentaire/non applicatif. L'attestation terminale de ce dernier alignement reste externe à ce document afin d'éviter une boucle auto-référentielle de commits.


### Réconciliation backend S2 par inventaire borné — 2026-09-23

Les preuves ont été collectées exclusivement via le fallback GitHub-first/OIDC du MCP, sans usage du bridge et avec `mutationAllowed=false`.

Preuves fraîches :

- `EVID-S2-FRONTEND-GIT-20260923-001` — MCP run `35794187803`, artifact `10723146851`, digest `sha256:57f4f44de4a0a47bd54cdffc8e0c74ddab641cd7c87eb0d1bde78bd3e8f5fd65`, output SHA-256 `999f7045d739d4070d6e54267bb6742783e43b94cffb1a6fcbf0c8fdcaf5e349` ;
- `EVID-S2-BACKEND-GIT-20260923-001` — MCP run `35794181381`, artifact `10723566187`, digest `sha256:17c8de239f085b627b020741b63cd7ab2abe1948481ffed3c406bf9fbf14c039`, output SHA-256 `c55731f56f2229c3542362fee23b56b4305097975afa1d7b8e0a60929bb81f4f` ;
- `EVID-S2-RUNTIME-HTTP-20260923-001` — MCP run `35794212028`, artifact `10723780966`, digest `sha256:4057aa3261bd99957c18e7b472e5ecbb3fe429ca33125e87cfdd884fb9160307`, output SHA-256 `39bb318dd4eba57f0888573eaaf9e525009fd042fc2388f01052290df29382ba` ;
- `EVID-S2-BACKEND-INVENTORY-20260923-001` — MCP run `35803784710`, artifact `10726298618`, digest `sha256:301b4db911b3ebf03ced5c50288d943fff6d12edb227d18d063d9cec01ca22f4`, output SHA-256 `44816f10def98a9164d3d29c49259db0bbe0098c048207005ea4d1926c7276b2`.

État courant attesté :

```text
FRONTEND_BRANCH = main
FRONTEND_HEAD = 2a8be8219689e6213ce20f13d69b6b45f3693dfe
FRONTEND_WORKTREE_CHANGES = 0
FRONTEND_ORIGIN = https://github.com/Patricked-code/Stablecoin.git
FRONTEND_HTTP = 200

BACKEND_PATH = /var/www/vhosts/chainsolutions.fr/api.stablecoin.chainsolutions.fr
BACKEND_PATH_EXISTS = true
BACKEND_GIT_REPOSITORY = false
BACKEND_PACKAGE_NAME = api.fan-token
BACKEND_PACKAGE_VERSION = 1.0.0
BACKEND_PACKAGE_MAIN = index.js
BACKEND_DECLARED_SOURCE = git+https://gitlab.com/wealthtech1/api/api.fan-token.git
BACKEND_STACK = Express_4.18.1_Sequelize_6.20.1_MySQL
BACKEND_DATABASE_CONFIG = db_stablecoin
BACKEND_HTTP_ROOT = 401
BACKEND_HTTP_HEALTH = 401
BACKEND_CURRENT_PROCESS_CWD_MATCH = NOT_OBSERVED_IN_BOUNDED_SAMPLE
BACKEND_DEPLOYED_REVISION = UNKNOWN
BACKEND_RESTART_OWNERSHIP = UNKNOWN
```

L'inventaire n'a lu aucune valeur de secret : seules les références de variables d'environnement, les métadonnées de package/configuration et des empreintes SHA-256 de fichiers connus ont été exposées. Les fichiers `models/wtiapikey.js` et `middlewares/verifyApiKeyWti.js` sont confirmés présents par métadonnées/empreintes, ce qui relie la preuve live aux éléments historiquement documentés dans le runbook.

La déclaration `package_repository` identifie une source GitLab historique, mais elle ne prouve ni que ce dépôt est encore accessible, ni quel commit exact est déployé sur S2. Le dossier backend actif n'étant pas un dépôt Git, la révision déployée doit être établie par une preuve supplémentaire non destructive. La sonde runtime du 23 septembre ne montre pas de process dont le cwd est le dossier backend Stablecoin dans son échantillon borné ; l'ancienne observation du 21 septembre ne doit donc plus être présentée comme une preuve de process courante.

Aucune mutation applicative ou runtime n'a été effectuée pendant cette réconciliation.

### Canal SSH de secours et constats sécurité — 2026-09-26

Session Claude Code locale (poste de Patrick), sur autorisation explicite du propriétaire.

- `EVID-MCP-UNAVAILABLE-20260926-001` : `wealthtech_ssh_bridge` local = `Invalid or missing MCP session` ; connecteur claude.ai = `connection invalidated`. HTTP public observé depuis le poste : frontend `200`, API `401` (inchangé).
- `EVID-SSH-FALLBACK-20260926-001` : workflow `governed-ssh-readonly.yml` et script `scripts/ssh/governed-readonly.sh` restaurés (DEC-2026-09-26-016), déclarés dans `.mcp/manifest.json`. Secrets GitHub `STABLECOIN_SSH_*` : aucun configuré (`gh secret list` vide) → canal inactif tant que le propriétaire ne les a pas créés.
- `EVID-SEC-SCAN-20260926-001` : dépôt `PUBLIC`. Chaînes au format clé privée codées en dur dans 10 fichiers suivis ; `.env.local` présent dans 21 commits historiques ; `NEXT_PUBLIC_PRIVATE_KEY` utilisée dans ~20 composants client ; `debug.log`/`yarn-error.log` suivis sans motif sensible. Aucune valeur lue ni affichée ; aucune réécriture d'historique.
- Décision propriétaire : conserver les clés (sauvegarde chiffrée hors Git sur S2 par un script fourni hors dépôt, exécuté par le propriétaire) avant toute neutralisation.

```text
EXACT_NEXT_ACTION = OWNER_RUNS_S2_ENCRYPTED_SECRETS_BACKUP_THEN_CONFIGURES_STABLECOIN_SSH_SECRETS_OR_RESTORES_MCP
APPLICATION_CODE_MUTATION = NONE
RUNTIME_MUTATION = NONE
```

> Remplacé le même jour par `STB-CHK-20260926-010` (section suivante et Current State Block).

### Alignement du canal SSH de secours sur AfricaFunds — 2026-09-26

Tâche `STB-TASK-20260926-003`, checkpoint `STB-CHK-20260926-010`, décision `DEC-2026-09-26-017`. Session Claude Code locale (poste de Patrick), sur instruction explicite du propriétaire : reprendre le modèle AfricaFunds sans régression ni suppression de l'existant, sans modifier AfricaFunds, `api_opcv` ni le MCP.

Modèle d'exploitation précisé par le propriétaire : GitHub = travail gouverné ; MCP = interrogation de l'état serveur et réconciliation (obligatoire pour la matrice de dépôts et les suppressions de dépôts) ; SSH GitHub Actions = secours quand le MCP est inaccessible.

Preuves :

- `EVID-S2-HOSTKEY-20260926-001` : `ssh-keyscan stablecoin.chainsolutions.fr` (sans connexion) retourne exactement les trois empreintes épinglées par AfricaFunds : `SHA256:Ady8eJEP8zd8Cs8TxdYtVTgvoO5Bjgylg8YBro/RKUI` (ECDSA), `SHA256:GCZER3VgJrq9YB3QdJo4+rQ+dM4Y+sKxDS0NI/6jngs` (RSA), `SHA256:XxGk6WDdc3pqCBnNvBZoFd4Ugc+3x8hcI0J1o0cEKhw` (ED25519). Le frontend Stablecoin et AfricaFunds sont donc sur le même S2 ; l'épinglage public est copié dans `.github/scripts/s2/`.
- `EVID-MCP-CLASSIFIER-COMPAT-20260926-001` : avec la liste non applicative exacte du MCP (`src/stablecoin/githubFastForward.ts`), le delta `2a8be821` (dernier SHA S2 attesté) → `b5955823` contenait 8 fichiers dont **1 applicatif** (`scripts/ssh/governed-readonly.sh`, ajouté par DEC-016) : tout fast-forward MCP aurait été refusé (`application_diff_detected`). Après déplacement sous `.github/scripts/s2/`, le delta `2a8be821` → état de ce checkpoint compte 24 fichiers dont **0 applicatif**. Régression introduite puis corrigée le même jour.
- `EVID-S2-GUARD-TESTS-20260926-001` : localement (Git Bash, Git 2.35.1), `test_s2_git_guard.sh` = PASS (observation, refus 10/21/22/23/24/25/26/28, succès du fast-forward borné avec sauvegarde, absence de fuite du mode test) et `test_s2_ssh_readonly_retry.sh` = PASS. Contre-épreuves : une garde sabotée (fichiers `pages/*` admis) fait échouer le test ; une copie sabotée (déclencheur `push:`, `reset --hard`) fait échouer le validateur de gouvernance.
- Sources lues sans modification : `Wealthtechinnovations/api_opcv@5ac4a313596ee38a8cbce52b794b68649b677dab` (worktree propre avant et après) et `Patricked-code/MCP@0eb55a5`.

Surface ajoutée ou modifiée (aucun fichier applicatif) :

```text
.github/scripts/s2/          prepare_s2_ssh.sh, s2_ssh_readonly_retry.sh, s2_git_guard.sh,
                             s2_observe.py, s2_secret_inventory.py, governed-readonly.sh (déplacé),
                             tests, épinglage de la clé d'hôte
.github/workflows/           stablecoin-s2-observe.yml, stablecoin-s2-reconcile.yml,
                             stablecoin-s2-secret-inventory.yml, stablecoin-s2-hostkey-verify.yml,
                             governed-ssh-readonly.yml (évolué), governance-consistency.yml (tests ajoutés)
.mcp/manifest.json           fallbackSshTransport étendu (alias STABLECOIN_SSH_* conservés)
scripts/verify-governance-consistency.js   invariants du canal (ajout additif)
```

État et suite :

```text
S2_SSH_FALLBACK = IMPLEMENTED_INACTIVE_UNTIL_S2_HOST_AND_S2_SSH_KEY_CONFIGURED
S2_RECONCILE_SCOPE = FRONTEND_EXACT_SHA_FAST_FORWARD_ZERO_APPLICATION_DIFF_CONFIRMATION_REQUIRED
EXACT_NEXT_ACTION = VALIDATE_THIS_CHECKPOINT_CI_THEN_OWNER_CONFIGURES_S2_HOST_S2_SSH_KEY_THEN_RUN_STABLECOIN_S2_HOSTKEY_VERIFY_AND_STABLECOIN_S2_OBSERVE_AND_ATTEST
PENDING_OWNER_ACTIONS = CONFIGURE_S2_SECRETS;OPTIONAL_S2_REPORT_PASSPHRASE;RUN_ENCRYPTED_SECRETS_BACKUP_SCRIPT;RECONNECT_MCP
MCP_INTAKE = PENDING_UNTIL_MCP_RECONNECTED_NO_MCP_REPOSITORY_MODIFICATION
APPLICATION_CODE_MUTATION = NONE
RUNTIME_MUTATION = NONE
```

> Remplacé le même jour par `STB-CHK-20260926-011` (section suivante et Current State Block).

### Activation du canal de secours et observation S2 — 2026-09-26

Tâche `STB-TASK-20260926-003`, checkpoint `STB-CHK-20260926-011`.

- `EVID-CI-20260926-58090cc` : `Governance Consistency` run `36263708374` = SUCCESS sur le SHA exact `58090cc6760755c918b5dd2085239e69efeac44e`, y compris les étapes de syntaxe et de tests du canal S2 ; GitHub référence les six workflows sans erreur de syntaxe.
- Secrets configurés par le propriétaire, valeurs jamais vues par l'agent : `S2_HOST` (adresse IP de S2) et `S2_SSH_KEY`. Pour `S2_SSH_KEY`, une **clé ed25519 dédiée à Stablecoin** (commentaire `github-actions-stablecoin-s2`) a été créée par le propriétaire et ajoutée aux clés autorisées de `root` sur S2, après sauvegarde `authorized_keys.bak-20260926` et sans toucher aux clés existantes. Un secret GitHub ne pouvant pas être relu, la clé d'`api_opcv` n'est pas réutilisée ; la clé dédiée est révocable séparément.
- `EVID-S2-HOSTKEY-BINDING-20260926-001` : `Stablecoin S2 Host Key Verify` run `36265174755` (SHA `58090cc`) = SUCCESS : `HOST_KEY_FINGERPRINTS=MATCH`, `HOST_PIN_BINDING=MATCHES_S2_HOST` ; aucune connexion SSH.
- MCP réessayé avant usage du secours : `wealthtech_ssh_bridge` = `Invalid or missing MCP session`, connecteur claude.ai = `connection invalidated` (motif transmis au workflow).
- `EVID-S2-FALLBACK-OBSERVE-20260926-001` : `Stablecoin S2 Observe` run `36266111300` (SHA `58090cc`) = SUCCESS, artefact `10913731916`, digest `sha256:e75acc7e16800e670a392aeb67454d7300e44bfb8309aa4ae4db8d84e7e363d0`, sortie SHA-256 `1902b664bcae48711b65c35752b0dee9232d2c29ca294d8d3c6f08751af2bf88`, observé le `2026-09-26T19:27:32Z`.
- `EVID-S2-BACKEND-PROCESS-20260926-001` : le processus backend est désormais observé (cwd = dossier backend) sous Plesk/Phusion Passenger, avec le même utilisateur d'abonnement Plesk non root que le frontend ; aucun processus PM2 Stablecoin. La sonde du 2026-09-23 ne l'avait pas trouvé dans son échantillon borné.

État attesté :

```text
FRONTEND_BRANCH = main
FRONTEND_HEAD = 2a8be8219689e6213ce20f13d69b6b45f3693dfe
FRONTEND_WORKTREE_ENTRIES = 0 (suivis et non suivis)
FRONTEND_ORIGIN = https://github.com/Patricked-code/Stablecoin.git (exact)
GITHUB_MAIN_AT_OBSERVATION = 58090cc6760755c918b5dd2085239e69efeac44e (3 commits d'avance)
PENDING_DELTA_CLASSIFICATION = GOVERNANCE_ONLY_0_APPLICATION_FILE (liste MCP)
FRONTEND_HTTP = 200
BACKEND = api.fan-token@1.0.0, non Git, source déclarée gitlab.com/wealthtech1/api/api.fan-token
BACKEND_PROCESS = Plesk/Phusion Passenger, utilisateur d'abonnement non root (identique au frontend), pas de PM2
BACKEND_HTTP_ROOT = 401
BACKEND_HTTP_HEALTH = 401
BACKEND_DEPLOYED_REVISION = UNKNOWN
BACKEND_RESTART_PROCEDURE = DOCUMENTED_UNVERIFIED
```

Correction de publication : la sonde `s2_observe.py` v1.0.0 publiait le nom de l'utilisateur système des processus dans l'artefact (dépôt public, artefact expirant le 2026-10-26). La v1.0.1 ne publie plus que `user_is_root` et `user_owns_app_dir`. Le nom n'est reporté dans aucun document versionné.

Suite : la réconciliation S2 (`2a8be821` → `main` courant, delta de gouvernance uniquement, sans build ni restart) exige l'autorisation explicite du propriétaire pour cette opération précise ; elle passera par le MCP s'il est reconnecté, sinon par `Stablecoin S2 Reconcile`.

> Remplacé le même jour par `STB-CHK-20260926-012` (section suivante et Current State Block).

### Passe de conformité gouvernance — 2026-09-26

Tâche `STB-TASK-20260926-003`, checkpoint `STB-CHK-20260926-012`. Demande du propriétaire : relire, appliquer et respecter toutes les règles de gouvernance applicables avant d'exécuter l'Option B.

Preuves :

- `EVID-CI-20260926-1e3ecf5` : `Governance Consistency` run `36266811342` = SUCCESS sur le SHA exact `1e3ecf503e7f27d82798f8b1083f24f6e940dbc2`.
- `EVID-GH-PERM-20260926-001` : le `2026-09-26T20:03:59Z`, capacité live de la connexion GitHub active (identité `gh` `Wealthtechinnovations`) : `pull=true`, `push=true`, `triage=true`, `maintain=false`, `admin=false` ; dépôt `public`, branche par défaut `main`. Politique repository-side ∩ capacité live ∩ tâche courante : écriture documentaire sur `main` autorisée.
- `EVID-GOV-REREAD-20260926-001` : relecture intégrale, dans l'ordre obligatoire, de `GOVERNANCE.md`, `SOURCE_OF_TRUTH.md`, `AGENTS.md`, `README.md`, `SUIVI.md`, `DECISIONS.md`, `TODO.md`, `ARCHITECTURE.md`, `LOOP_ENGINEERING.md`, du runbook et des cinq `.mcp/*`. Aucun `00_START_HERE.md`, `CLAUDE.md` de dépôt ni `.governance/` n'existe. HEAD `1e3ecf5` = `origin/main`, aucun commit tiers depuis `9ca23b8`.
- `EVID-S2-WEB-EXPOSURE-20260926-001` : requêtes HEAD uniquement, aucun contenu téléchargé : `/.git/HEAD`, `/.git/config`, `/.git/logs/HEAD`, `/SUIVI.md`, `/package.json`, `/.gitignore`, `/.next/BUILD_ID` = `200` ; `/.env.local` = `403` ; `/.env` = `404`. La racine web sert le dossier de l'application : tout fichier présent dans le checkout S2 est lisible publiquement, y compris le dossier `.git`. Défaut préexistant, à traiter dans un chantier sécurité dédié (`TODO.md`).

Conformité de l'agent (sessions du 2026-09-26) :

```text
ORDRE_DE_LECTURE (AGENTS §1, GOVERNANCE §8)      = NON RESPECTÉ avant b5955823/58090cc/1e3ecf50 → CORRIGÉ (EVID-GOV-REREAD-20260926-001)
CAPACITÉ_LIVE_AVANT_ÉCRITURE (GOVERNANCE §7.1)   = NON CONSIGNÉE avant ces écritures → CORRIGÉ (EVID-GH-PERM-20260926-001)
TÂCHE_ET_CHECKPOINT (LOOP §3)                    = ABSENTS pour b5955823 → CORRIGÉ dès 58090cc
NON_RÉGRESSION (GOVERNANCE §5)                   = RÉGRESSION b5955823 (classifieur MCP) → CORRIGÉE dans 58090cc
CONTRADICTIONS (SOURCE_OF_TRUTH §4)              = voir ci-dessous
ÉNONCÉS_STALE (SOURCE_OF_TRUTH §3, §8)           = NON ANNOTÉS dans 1e3ecf50 → ANNOTÉS (SUIVI §4, §8 ; ARCHITECTURE §4, §5, §7 ; TODO)
BRANCHE / FORCE / HISTORIQUE                     = RESPECTÉ
SECRETS                                          = RESPECTÉ (aucune valeur lue, affichée ou versionnée)
CI_EXACT_SHA                                     = RESPECTÉ
RUNTIME (AGENTS §6)                              = serveur, dossier, Passenger, HEAD/remote, HTTP confirmés ; build/restart non requis (runbook lu)
MCP (AGENTS §7)                                  = NON APPLICABLE tant que le MCP est indisponible ; intake en attente
```

Contradictions relevées :

1. `.mcp/agents.json` `canDeploy=false` pour Claude ↔ proposition de l'agent de lancer la réconciliation S2 : règle restrictive appliquée, décision demandée ; **résolue** par le propriétaire (Option B) → DEC-2026-09-26-018 (`canDeploy` reste `false`).
2. `existingExternalSshBridgePolicy = …_NO_PARALLEL_TRANSPORT` ↔ secours SSH déclaré (introduite par l'agent dans `58090cc`) : **résolue** — politique explicite du secours, ancienne valeur tracée, validateur renforcé.
3. **Contrainte du 2026-09-23** (§ « Action suivante exacte », tâche parquée `STB-TASK-20260915-002`) : « ne pas muter S2 tant que la révision backend et la procédure de restart ne sont pas attestées » ↔ fast-forward de gouvernance autorisé par l'Option B. Elle n'est levée par aucune décision ; elle est plus récente que la consigne du 2026-09-21 (« fast-forwarder les checkpoints documentaires par le chemin borné »). **Non résolue : la règle la plus restrictive s'applique, aucune réconciliation S2 n'est lancée** tant que le propriétaire ne l'a pas explicitement levée ou maintenue.
4. Runbook §4 (`origin` GitLab) ↔ observation live (`origin` = GitHub) : runbook `STALE` sur ce point ; annotation différée car `docs/*` est classé applicatif par le fast-forward MCP (`TODO.md`).
5. Runbook §5 (Node 18.20.8) ↔ Node `v14.16.0` du PATH root : non contradictoire (Node de l'application ≠ Node du compte root).

Correction de forme préexistante : `TODO.md` contenait quatre éléments fusionnés par des `\n` littéraux ; ils sont séparés sans changement de contenu.

Aucune mutation applicative ni runtime dans cette passe.
