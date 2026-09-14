# DECISIONS — Décisions durables du projet Stablecoin

> **Statut :** `CANONICAL`  
> Enregistrer ici uniquement les décisions qui doivent survivre aux conversations et aux agents.

## DEC-2026-08-29-001 — Mémoire persistante locale gouvernée

**Décision :** le dépôt possède une mémoire persistante locale versionnée. Une conversation n'est jamais une source de vérité supérieure au dépôt.

**Conséquence :** les agents lisent `GOVERNANCE.md`, `SOURCE_OF_TRUTH.md`, `SUIVI.md`, `TODO.md`, `ARCHITECTURE.md`, le runbook pertinent et l'état Git avant toute mutation.

## DEC-2026-08-29-002 — Évolution additive sans régression

**Décision :** l'organisation existante est conservée et renforcée. Aucun fichier ou mécanisme utile n'est supprimé pour faire ressembler Stablecoin à un autre repo.

**Conséquence :** `docs/STABLECOIN_PLESK_DEPLOYMENT_RUNBOOK.md` reste l'autorité documentaire spécialisée du déploiement ; les nouveaux documents gouvernent et référencent l'existant au lieu de le dupliquer.

## DEC-2026-08-29-003 — Branche canonique

**Décision :** `main` est la branche canonique de travail normal. La création ou le changement de branche exige une instruction explicite du propriétaire.

**Conséquence :** la branche `codex/wealthtech-mcp-conversation-memory` reste historique et n'est ni fusionnée ni supprimée automatiquement.

## DEC-2026-08-29-004 — Ancienne mémoire MCP classée en evidence

**Décision :** le contenu `docs/mcp/*` de la branche `codex/wealthtech-mcp-conversation-memory`, daté du 2026-07-01, est conservé comme `HISTORICAL_EVIDENCE / NOT_CURRENT_PROJECT_AUTHORITY`.

**Motif :** il compile une ancienne conversation WealthTech/S1/S2 et un plan d'audit/migration. Il peut contenir des informations utiles mais ne prouve pas l'état actuel du runtime.

## DEC-2026-08-29-005 — Runtime : documenter sans présumer

**Décision :** les informations runtime du runbook sont classées `DOCUMENTED_UNVERIFIED` jusqu'à une nouvelle observation serveur.

**Conséquence :** aucune action de déploiement, suppression, migration, restart ou modification de configuration ne doit partir du seul runbook sans revalidation live.

## DEC-2026-08-29-006 — Compatibilité MCP côté repository

**Décision :** Stablecoin s'adapte progressivement aux évolutions du MCP au moyen de son contrat local `.mcp/*`. Le dépôt ne recrée aucun Live State, Operational Memory, session engine, task engine ou lock engine.

**Conséquence :** toute nouvelle attente MCP est d'abord confrontée à l'existant ; seuls les gaps réels sont ajoutés.

## DEC-2026-08-29-007 — Sécurité des secrets

**Décision :** aucun secret ou credential réel ne doit être versionné. Toute clé privée blockchain réellement exposée au frontend doit être traitée dans un chantier de sécurité séparé avec vérification et rotation contrôlée.


## DEC-2026-09-15-008 — Regulatory est une référence de maturité, pas une source métier

**Décision :** `chainsolutions-wealthtech/Regulatory` peut servir à comparer la maturité générique de gouvernance d'ingénierie. Aucun métier ou workflow propre à Regulatory ne doit être transféré dans Stablecoin.

**Conséquence :** la méthode est `READ → REOBSERVE → RECONCILE → MAP → COMPARE → GAP_ANALYSIS → STRENGTHEN → VERIFY → PERSIST`, jamais une copie structurelle aveugle.

## DEC-2026-09-15-009 — Permission repository-side distincte de la capacité live

**Décision :** les champs `directMainPush` et `canWriteCanonicalBranch` expriment un plafond de politique locale. Ils ne prouvent pas les scopes ou permissions de la connexion active.

**Conséquence :** toute session d'écriture revalide la capacité live et applique l'intersection la plus restrictive entre gouvernance, capacité réelle et scope de la tâche courante.

## DEC-2026-09-15-010 — Pas de famille documentaire parallèle

**Décision :** Stablecoin ne crée pas `STATUS.md`, `NEXT_ACTION.md`, `CURRENT_ITERATION.md`, `HANDOFF.md` ou `WORK_LOG.md` uniquement pour imiter un autre dépôt tant que leurs rôles sont correctement portés par `SUIVI.md`, `TODO.md`, `AGENTS.md` et Git.

**Conséquence :** le bloc courant, les checkpoints et le work log borné restent dans `SUIVI.md`.

## DEC-2026-09-15-011 — Cohérence de gouvernance vérifiée automatiquement

**Décision :** Stablecoin possède un validateur dependency-free et une GitHub Action dédiés à la cohérence de ses autorités repository-side.

**Conséquence :** ce contrôle vérifie la cohérence de gouvernance mais ne remplace pas les tests applicatifs, blockchain, paiement, authentification ou runtime.


## DEC-2026-09-15-012 — Connecteur SSH gouverné en lecture seule d'abord

**Décision :** Stablecoin utilise un transport SSH gouverné via GitHub Actions avec actions allowlistées, vérification stricte de la clé d'hôte et aucun shell distant arbitraire.

**Conséquence :** les secrets SSH restent exclusivement dans GitHub Actions Secrets. Le dépôt ne contient ni clé privée, ni mot de passe, ni valeur secrète. Les actions de déploiement, restart, synchronisation ou mutation runtime restent désactivées jusqu'à réconciliation live complète et plan de mutation approuvé.

**Surface :** `.mcp/ssh-connector.json`, `.mcp/ssh-ruleset.json`, `scripts/ssh/governed-readonly.sh`, `.github/workflows/governed-ssh-readonly.yml`.
