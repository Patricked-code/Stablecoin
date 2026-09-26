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


## DEC-2026-09-15-013 — Réutiliser la liaison serveur/MCP existante, ne pas créer de canal SSH parallèle

**Statut :** `SUPERSEDES DEC-2026-09-15-012`.

**Décision :** après réinspection du dépôt, Stablecoin possède déjà deux éléments historiques à réconcilier : un remote serveur `github` pointant vers `Patricked-code/Stablecoin` avec mise à jour fast-forward documentée, et un pont externe `wealthtech_ssh_bridge` vers les serveurs. Le workflow GitHub Actions SSH ajouté le 2026-09-15 est donc retiré afin de respecter l'interdiction des mécanismes MCP/SSH parallèles.

**Conséquence :** la suite réobserve et gouverne l'existant. Aucune nouvelle clé SSH GitHub Actions n'est à configurer pour Stablecoin à ce stade. Toute mutation serveur reste interdite jusqu'à observation live du remote, de la branche, du HEAD, du working tree et du runtime.


## DEC-2026-09-20-014 — Fast-forward frontend conditionné au diff applicatif

**Décision :** un fast-forward du checkout frontend S2 peut omettre build et restart Passenger uniquement si le préflight immédiatement avant exécution démontre un worktree propre, une relation fast-forward sans divergence et zéro fichier applicatif modifié entre le HEAD serveur et le HEAD GitHub ciblé.

**Preuve courante :** au 2026-09-20, `S2@6216755d318677ed9a56c36731a57531d02bf751` est 57 commits derrière `GitHub main@678656d84164f1aa7dadef8a3a627d0b905fe9e4`, avec 16 fichiers modifiés exclusivement dans la gouvernance, `.mcp`, CI, scripts de vérification et README ; zéro fichier applicatif.

**Conséquence :** ce constat n'est pas une autorisation permanente. Toute évolution ultérieure de `main` impose une nouvelle comparaison. Si le diff applicatif devient non nul, le plan sans build/restart est automatiquement invalidé.


## DEC-2026-09-21-015 — GitHub-first bounded WRITE pour Stablecoin

**Décision :** pour le frontend Stablecoin S2, une mutation peut être autorisée depuis GitHub sans exposition interactive de `wealthtech_ssh_bridge` uniquement via la surface MCP dédiée et bornée introduite par PR #117.

**Contraintes durables :** SHA serveur attendu exact, SHA cible exact, branche `main`, worktree propre, origin canonique, relation fast-forward, zéro fichier applicatif dans le diff, aucune commande libre, aucun build/restart/stash/rebase/reset. Le canal read-only reste séparé et ne peut jamais autoriser un WRITE.

**Preuve d'activation :** MCP `ab9b1aa902aab3efed42ba527847ab48df3c8eaa` déployé sur S1 par Governed Deploy #54, puis fast-forward S2 `6216755d... → 4e946bd...` réussi via run `35569719611`, suivi de deux attestations read-only Git/runtime SUCCESS.

**Conséquence :** ce mécanisme n'est pas une permission générique d'écriture serveur. Toute autre opération ou tout diff applicatif exige son propre chantier gouverné.


## DEC-2026-09-26-016 — Connecteur SSH GitHub Actions restauré comme canal de secours read-only

**Statut :** `AMENDS DEC-2026-09-15-013` (sans le révoquer : le MCP reste le canal principal).

**Contexte :** le 2026-09-26, les deux accès MCP au pont `wealthtech_ssh_bridge` étaient indisponibles (`Invalid or missing MCP session` côté local ; `connection invalidated` côté connecteur claude.ai). Le propriétaire (Patrick) a demandé explicitement le rétablissement d'un moyen d'accès au serveur de déploiement lorsque le MCP ne passe pas.

**Décision :** `.github/workflows/governed-ssh-readonly.yml` et `scripts/ssh/governed-readonly.sh` sont restaurés depuis `44874fa` / `8d5dcb6` comme **canal de secours** : déclenchement manuel `workflow_dispatch` uniquement, motif d'indisponibilité MCP obligatoire (`mcp_unavailable_reason`), actions allowlistées strictement read-only, clé d'hôte vérifiée, connexion root refusée, matériel SSH éphémère supprimé en fin de job. La surface est déclarée dans `.mcp/manifest.json` (`mcpIntegration.fallbackSshTransport`).

**Contraintes :** aucune écriture, aucun déploiement, aucun restart via ce canal. Toute évolution vers une capacité d'écriture exige une nouvelle décision. Les secrets `STABLECOIN_SSH_PRIVATE_KEY`, `STABLECOIN_SSH_KNOWN_HOSTS`, `STABLECOIN_SSH_HOST`, `STABLECOIN_SSH_USER` restent exclusivement dans GitHub Actions Secrets ; ils ne sont pas configurés au 2026-09-26 et doivent l'être par le propriétaire avec un utilisateur S2 dédié non-root.
