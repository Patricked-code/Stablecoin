# GOVERNANCE — Contrat supérieur du dépôt Stablecoin

> **Statut :** `CANONICAL / APPLICABLE`  
> **Dépôt :** `Patricked-code/Stablecoin`  
> **Branche canonique de travail normal :** `main`

## 1. Contrat machine-readable humain

```text
REPOSITORY = Patricked-code/Stablecoin
CANONICAL_WORK_BRANCH = main
NEW_BRANCH_CREATION = OWNER_EXPLICIT_ONLY
BRANCH_SWITCH = OWNER_EXPLICIT_ONLY
FORCE_PUSH = FORBIDDEN
HISTORY_REWRITE = FORBIDDEN
IMPROVEMENT_ONLY = REQUIRED
ZERO_REGRESSION = REQUIRED
PERSISTENT_MEMORY = REQUIRED
LOOP_ENGINEERING = REQUIRED
READ_EXISTING_BEFORE_CREATE = REQUIRED
DOCUMENT_ROLE_ANALYSIS = REQUIRED
VERIFY_BEFORE_WRITE = REQUIRED
VERIFY_AFTER_WRITE = REQUIRED
SECRETS_IN_GIT = FORBIDDEN
RUNTIME_MUTATION_WITHOUT_FRESH_VERIFICATION = FORBIDDEN
MCP_CORE_MODIFICATION_FROM_THIS_REPO = FORBIDDEN_UNLESS_EXPLICITLY_REQUESTED
```

## 2. Principe général

Le dépôt doit évoluer en continu sans réinitialiser, remplacer ou simplifier aveuglément l'existant. Toute évolution suit l'ordre :

`READ → MAP → RECONCILE → GAP → EVOLVE → VERIFY → PERSIST`.

Préférer toujours :

`REUSE → COMPLETE → EXTEND → COMPATIBLE MIGRATION`.

Une conversation, un ancien prompt ou une mémoire externe ne remplace jamais l'état versionné du dépôt et les preuves Git/runtime.

## 3. Hiérarchie et rôles documentaires

Lire `SOURCE_OF_TRUTH.md` pour l'autorité détaillée. Les documents principaux sont :

- `GOVERNANCE.md` : règles supérieures du dépôt ;
- `AGENTS.md` : procédure obligatoire pour les agents ;
- `SOURCE_OF_TRUTH.md` : hiérarchie des vérités et gestion des contradictions ;
- `SUIVI.md` : état courant, historique synthétique, preuves et point de reprise ;
- `TODO.md` : travail restant ;
- `DECISIONS.md` : décisions durables ;
- `ARCHITECTURE.md` : architecture connue et limites de connaissance ;
- `LOOP_ENGINEERING.md` : boucle d'intervention ;
- `docs/STABLECOIN_PLESK_DEPLOYMENT_RUNBOOK.md` : runbook de runtime/déploiement documenté ;
- `docs/mcp/*` sur l'ancienne branche `codex/wealthtech-mcp-conversation-memory` : archive historique et evidence, non autorité courante.

Un recouvrement de sujet ne suffit jamais à conclure qu'un document est un doublon.

## 4. Git et branche

Pour le travail normal :

1. rester sur `main` ;
2. ne pas créer de branche sans instruction explicite du propriétaire ;
3. ne jamais forcer un push ;
4. ne jamais réécrire l'historique ;
5. vérifier le HEAD avant et après une mutation ;
6. traiter les autres branches comme travail historique ou concurrent jusqu'à réconciliation explicite.

La branche `codex/wealthtech-mcp-conversation-memory` est conservée comme archive/evidence historique. Elle ne doit pas être fusionnée ou supprimée automatiquement.

## 5. Non-régression

Il est interdit de :

- remplacer une architecture fonctionnelle sans analyse d'impact ;
- casser une route, un contrat, une ABI, un flux d'authentification, une convention de runtime ou un format supporté ;
- supprimer un fichier, une preuve ou un historique uniquement parce qu'il paraît ancien ;
- masquer une régression en supprimant un test ou une vérification ;
- déclarer un succès qui n'a pas été vérifié ;
- déduire l'état runtime actuel d'un document historique sans contrôle live.

Toute migration doit préserver la compatibilité ou documenter explicitement la rupture autorisée.

## 6. Runtime et production

Le runbook `docs/STABLECOIN_PLESK_DEPLOYMENT_RUNBOOK.md` documente un frontend Next.js servi par Plesk/Passenger et un backend API distinct. Ces éléments sont des faits documentés, mais toute intervention runtime doit d'abord confirmer l'état live, le dossier actif, le HEAD déployé, les remotes et les services réellement en cours.

Les secrets, clés API, clés Magic et clés privées blockchain ne doivent jamais être copiés dans Git.

## 7. MCP

MCP est l'autorité d'orchestration externe. Ce dépôt s'adapte au contrat MCP via `.mcp/*` sans recréer Live State, Operational Memory, sessions, locks, task engine ou autre mécanisme MCP.

Les informations `.mcp/server-map.json` doivent distinguer ce qui est documenté de ce qui est actuellement vérifié. Une information serveur non vérifiée est `DOCUMENTED_UNVERIFIED`, jamais `PRODUCTION_VERIFIED`.

## 8. Definition of Done minimale

Une intervention n'est terminée que si :

- le repo, la branche et le HEAD ont été vérifiés ;
- l'existant pertinent a été lu et réutilisé ;
- l'impact et les risques ont été analysés ;
- les vérifications applicables ont été exécutées ;
- les régressions introduites sont absentes ou corrigées ;
- les limitations et échecs préexistants sont distingués ;
- `SUIVI.md` et, si nécessaire, `TODO.md` / `DECISIONS.md` sont synchronisés ;
- un point de reprise exact existe si le chantier continue ;
- aucune réussite, donnée, infrastructure ou validation n'a été inventée.
