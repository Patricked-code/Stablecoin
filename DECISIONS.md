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

**Évolution :** étendue le même jour par DEC-2026-09-26-017 (modèle AfricaFunds, réconciliation bornée autorisée par le propriétaire, secrets `S2_*`).


## DEC-2026-09-26-017 — Canal SSH de secours aligné sur le modèle AfricaFunds

**Statut :** `EXTENDS DEC-2026-09-26-016`. Le MCP reste le canal principal pour interroger l'état du serveur et réconcilier GitHub ↔ S2 ; il reste obligatoire pour les actions de matrice de dépôts et les suppressions de dépôts.

**Contexte :** le propriétaire a précisé le modèle d'exploitation : GitHub porte le travail gouverné ; le MCP interroge l'état serveur et réconcilie ; lorsque le MCP est inaccessible, le SSH GitHub Actions prend le relais, comme pour AfricaFunds (`Wealthtechinnovations/api_opcv`). Il a autorisé le fast-forward borné du frontend par ce canal et exigé une évolution sans régression ni suppression de l'existant, sans aucune modification d'AfricaFunds, d'`api_opcv` ni du MCP.

**Décision :**

- reprise adaptée, sans modification des sources, des primitives S2 d'AfricaFunds (`api_opcv@5ac4a313596ee38a8cbce52b794b68649b677dab`) : préparation SSH épinglée, helper SSH read-only avec reprise bornée et son test, garde Git, observation, inventaire des secrets sans valeurs, workflows d'observation, de réconciliation, d'inventaire et de clé d'hôte ;
- la réconciliation reproduit exactement les garanties de la commande bornée MCP (`Patricked-code/MCP src/stablecoin/githubFastForward.ts`) : branche `main`, worktree propre y compris fichiers non suivis, origin exact, SHA serveur attendu exact, SHA cible égal au `main` GitHub, relation fast-forward, zéro fichier applicatif (même liste que le MCP), HTTP front 200 / API 401 / health 401 avant et après, mêmes codes de sortie 20–31. En plus : phrase de confirmation `RECONCILE STABLECOIN S2`, lancement depuis `main` uniquement, sauvegarde de l'état Git dans `/var/backups/stablecoin-governance/<horodatage>/` avant mutation, aucune reprise automatique d'une mutation ;
- aucun build, restart, reset, clean, stash, rebase, pull ni push ; aucune commande libre ; ces interdits sont contrôlés par `scripts/verify-governance-consistency.js` ;
- secrets : `S2_HOST` et `S2_SSH_KEY` (mêmes valeurs qu'`api_opcv`), optionnels `S2_USER` (défaut `root`, comme le MCP — `src/config/env.ts` — et AfricaFunds), `S2_KNOWN_HOSTS`, `S2_REPORT_PASSPHRASE` ; les noms `STABLECOIN_SSH_*` de DEC-016 restent acceptés comme alias ;
- la connexion root est admise pour ce canal (clé S2 partagée) ; `governed-readonly.sh` conserve le refus root par défaut et ne l'admet que sur transmission explicite de `allow_root_shared_s2_key` par son workflow ;
- clé d'hôte épinglée : copie de la clé publique S2 d'AfricaFunds, dont les trois empreintes ont été confirmées identiques par `ssh-keyscan stablecoin.chainsolutions.fr` le 2026-09-26 (`EVID-S2-HOSTKEY-20260926-001`) ;
- tous les fichiers du canal sont placés sous `.github/` afin de rester « non applicatifs » pour le classifieur du fast-forward MCP ; `scripts/ssh/governed-readonly.sh` (DEC-016) est déplacé, historique conservé, en `.github/scripts/s2/governed-readonly.sh` : à son ancien emplacement, il aurait fait refuser tout fast-forward MCP ultérieur (`application_diff_detected`) ;
- dépôt public : l'observation ne publie ni hostname ni kernel et ne lit ni `.env`, ni environnement, ni ligne de commande des processus ; l'inventaire des secrets n'émet jamais de valeur, préfixe, empreinte ni longueur, et son rapport détaillé n'est publié que chiffré (`S2_REPORT_PASSPHRASE`).

**Conséquence :** tant que `S2_HOST` et `S2_SSH_KEY` ne sont pas configurés sur `Patricked-code/Stablecoin`, le canal reste inactif. Toute capacité supplémentaire (build, restart, backend, déploiement applicatif) exige une nouvelle décision.

**Mise en œuvre (2026-09-26) :** `S2_HOST` a la même valeur qu'`api_opcv` (liaison de l'épinglage confirmée, run `36265174755`). Pour `S2_SSH_KEY`, un secret GitHub ne pouvant pas être relu, le propriétaire a créé une clé ed25519 dédiée à Stablecoin et l'a ajoutée aux clés autorisées de `root` sur S2 ; elle est révocable indépendamment de celle d'AfricaFunds. Canal actif : observation read-only réussie (run `36266111300`).

**Cohérence (2026-09-26, passe de conformité) :** la valeur `existingExternalSshBridgePolicy = …_NO_PARALLEL_TRANSPORT` avait été conservée dans `.mcp/manifest.json` alors qu'un transport de secours y était déclaré : contradiction introduite par l'agent le même jour. La politique devient `REUSE_AND_REVALIDATE_EXISTING_WEALTHTECH_SSH_BRIDGE_AS_PRIMARY_GITHUB_ACTIONS_SSH_ONLY_AS_DECLARED_FALLBACK` (ancienne valeur tracée dans `previousExternalSshBridgePolicy`) et le validateur impose désormais cette valeur dès qu'un secours est déclaré.


## DEC-2026-09-26-018 — Claude peut déclencher le fast-forward de gouvernance borné

**Statut :** décision du propriétaire du 2026-09-26 (« Option B »). Elle précise `.mcp/agents.json` sans le contredire : `canDeploy` reste `false` pour tous les agents.

**Contexte :** la passe de conformité a relevé que `.mcp/agents.json` déclare `canDeploy: false` pour Claude, alors que l'agent proposait de lancer lui-même la réconciliation S2. Conformément à `SOURCE_OF_TRUTH.md` §4, la règle la plus restrictive a été appliquée et la décision a été demandée au propriétaire.

**Décision :** Claude (et lui seul à ce stade) peut déclencher le fast-forward borné du frontend S2 — par le chemin MCP borné lorsqu'il est disponible, sinon par `Stablecoin S2 Reconcile` — parce que cette opération n'est pas un déploiement au sens de `canDeploy` : SHA serveur et SHA cible exacts, zéro fichier applicatif (liste du MCP), aucun build, aucun restart, aucune commande libre, refus automatique sinon.

**Conditions cumulatives :** capacité live revérifiée ; préconditions de la garde remplies ; autorisation explicite du propriétaire, dans la session en cours, pour chaque exécution précise (règle WealthTech §4 du poste) ; aucune contrainte de `SUIVI.md` non levée qui interdirait la mutation de S2 ; preuves et post-attestation consignées dans `SUIVI.md`.

**Surface :** `.mcp/agents.json` (`canTriggerBoundedGovernanceFastForward`, `boundedGovernanceFastForwardDecision`, `boundedGovernanceFastForwardRequiresOwnerSessionAuthorization`), `.mcp/manifest.json` (`reconcileTriggeredBy`), invariants contrôlés par `scripts/verify-governance-consistency.js`.

**Conséquence :** tout delta contenant un fichier applicatif reste hors de cette décision et relève d'un chantier de déploiement dédié, avec build et restart gouvernés.
