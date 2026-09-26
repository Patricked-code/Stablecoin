# TODO — Stablecoin

> **Statut :** `CANONICAL BACKLOG`  
> Les tâches doivent être réconciliées avec `SUIVI.md`, Git et les preuves runtime avant exécution.

## P0 — Gouvernance / reprise

- [x] Finaliser le contrat `.mcp/*` côté repository.
- [x] Réécrire le haut de `README.md` pour présenter l'état réel et pointer vers la mémoire canonique, sans supprimer les références historiques utiles.
- [x] Vérifier par comparaison Git que le bootstrap n'a modifié aucun fichier applicatif et enregistrer le checkpoint dans `SUIVI.md`.

## P0 — Durcissement gouvernance 2026-09-15

Tâche gouvernée : `STB-TASK-20260915-001`.

- [x] réobserver `main`, le HEAD et la capacité GitHub live avant écriture ;
- [x] formaliser tâche courante, checkpoint, evidence IDs et exact next action dans `SUIVI.md` ;
- [x] distinguer permission repository-side, capacité live et autorisation de l'opération ;
- [x] corriger l'ancre de reprise `.mcp/onboarding.json` et enrichir les rôles sémantiques ;
- [x] renforcer `LOOP_ENGINEERING.md` sans modifier sa boucle canonique ;
- [x] ajouter un validateur dependency-free de cohérence de gouvernance ;
- [x] ajouter GitHub Actions `Governance Consistency` ;
- [x] attester le premier run CI réussi avec son SHA exact et clôturer la tâche dans `SUIVI.md`.

## P0 — Révalidation de la liaison GitHub ↔ serveur existante

Tâche gouvernée : `STB-TASK-20260915-002`.

- [x] retrouver dans le runbook la liaison historique serveur → GitHub via remote `github` ;
- [x] retrouver la procédure historique de mise à jour `git fetch github main` + `git merge --ff-only github/main` ;
- [x] retrouver la preuve historique du pont externe `wealthtech_ssh_bridge` vers S1/S2 ;
- [x] identifier le connecteur GitHub Actions SSH ajouté récemment comme mécanisme parallèle non nécessaire ;
- [x] retirer ce mécanisme parallèle et conserver l'orchestrateur externe MCP ; (2026-09-26 : `CONTRADICTED` par DEC-2026-09-26-016 / 017 — rétabli comme canal de secours déclaré, le MCP restant principal)
- [x] réobserver le MCP central après l'intégration GWC : `Patricked-code/MCP/main@847b775a0b64b42ba3bddfee518ca0a486d810ce` ;
- [x] réconcilier la PR MCP #86 avec le `main` courant : candidat `DIVERGED`, 18 commits ahead / 588 behind, à ne pas fusionner tel quel ;
- [x] confirmer que le MCP `main` courant n'expose plus `stablecoin_frontend` et ne contient pas `CS-STABLECOIN-001` dans le registre actif ;
- [ ] réobserver les autorités MCP live applicables : Governed Work Queue, Governed Session, locks et Live State ;
- [ ] reprendre une tâche compatible si elle existe, sinon enregistrer/claim une tâche Stablecoin dédiée issue de l'intention explicite courante ;
- [ ] porter les invariants utiles de #86 sur une branche gouvernée issue du `main` MCP courant, sans réutiliser son historique stale ;
- [x] valider RED/GREEN, non-régression, CI exact-head et revue du candidat MCP réconcilié via PR #117 ;
- [x] fusionner puis déployer le MCP uniquement via le chemin gouverné GitHub → S1 : `ab9b1aa902aab3efed42ba527847ab48df3c8eaa`, Governed Deploy #54 SUCCESS ;
- [x] après activation, exécuter comme première action Stablecoin un statut Git frontend S2 strictement read-only via GitHub OIDC ;
- [x] établir un chemin read-only GitHub OIDC gouverné vers le MCP sans exposition interactive du bridge ;
- [x] observer S2 en lecture seule : serveur, vhost, dossier actif, remotes, branche, HEAD, working tree, Passenger/Node et HTTP ;
- [x] comparer le HEAD frontend serveur à `Patricked-code/Stablecoin/main` ;
- [x] classifier le frontend : `SERVER_BEHIND` de 57 commits à l'observation `main@678656d8...`, sans divergence, worktree propre, branche/remote corrects ;
- [x] mettre à jour `.mcp/server-map.json`, `ARCHITECTURE.md` et `SUIVI.md` avec les preuves live ;
- [x] préparer un plan de mise à jour non destructif : recheck exact-head/diff, fast-forward strict du checkout frontend seulement, aucun build/restart si le diff reste non applicatif, puis post-attestation ;
- [x] obtenir l'autorisation d'opération runtime explicite avant d'exécuter ce fast-forward sur S2 ;
- [x] activer le WRITE borné GitHub-first via MCP PR #117 et Governed Deploy #54 ;
- [x] exécuter le fast-forward exact-SHA S2 sans build/restart et obtenir les attestations Git/runtime post-écriture ;
- [x] après CI du checkpoint, aligner le commit documentaire sur S2 ; preuve fraîche du 2026-09-23 : frontend S2 `main@2a8be8219689e6213ce20f13d69b6b45f3693dfe`, worktree propre, identique au `main` GitHub observé.

> 2026-09-26 : les quatre lignes ci-dessus étaient fusionnées sur une seule ligne par des `\n` littéraux ; séparation sans modification du contenu (passe de conformité).

## P1 — Réconciliation serveur ↔ GitHub

À exécuter lorsque l'accès/dossier serveur sera fourni :

- [x] identifier précisément le serveur S2 et le vhost frontend actif ;
- [x] confirmer le dossier frontend actif au lieu de présumer le chemin historique ;
- [x] relever branche, HEAD, remotes et working tree du frontend côté serveur ;
- [x] comparer le frontend serveur ↔ `Patricked-code/Stablecoin/main` ;
- [x] identifier la source déclarée et les métadonnées du backend API : dossier live non-Git, package `api.fan-token@1.0.0`, source déclarée `git+https://gitlab.com/wealthtech1/api/api.fan-token.git` ;
- [x] confirmer la configuration DB non secrète : dialecte MySQL et base `db_stablecoin` pour development/test/production ;
- [ ] identifier la révision exacte du source backend déployé et réconcilier son historique avec la source GitLab déclarée ;
- [ ] confirmer l'ownership du process backend et la procédure exacte de restart ; la sonde runtime fraîche du 2026-09-23 ne retrouve pas le cwd backend dans son échantillon borné. — 2026-09-26 : ownership observé (`EVID-S2-BACKEND-PROCESS-20260926-001` : Plesk/Phusion Passenger, utilisateur d'abonnement non root identique au frontend, aucun PM2) ; la procédure exacte de restart reste à vérifier.
- [x] confirmer les domaines et réponses HTTP/API (`frontend=200`, API racine/health=`401` protégés) ;
- [x] mettre à jour `.mcp/server-map.json`, `ARCHITECTURE.md` et `SUIVI.md` avec les preuves live ;
- [x] préparer et activer la liaison gouvernée GitHub → serveur pour le fast-forward Stablecoin exact-SHA, sans écriture destructive générique.
- [x] restaurer le connecteur SSH GitHub Actions comme canal de secours read-only (DEC-2026-09-26-016) ;
- [x] ~~(propriétaire) créer un utilisateur S2 dédié non-root + clé SSH, puis configurer les 4 secrets `STABLECOIN_SSH_*`~~ — remplacé par DEC-2026-09-26-017 : secrets `S2_HOST` / `S2_SSH_KEY` partagés avec AfricaFunds (les noms `STABLECOIN_SSH_*` restent acceptés comme alias) ;
- [ ] exécuter un premier run `Governed SSH Readonly` et attester son résultat dans `SUIVI.md` ;
- [ ] (propriétaire) rétablir les connexions MCP `wealthtech_ssh_bridge` (session locale + connecteur claude.ai).

## P0 — Canal SSH de secours aligné sur AfricaFunds

Tâche gouvernée : `STB-TASK-20260926-003` (DEC-2026-09-26-017).

- [x] reprendre et adapter, sans les modifier, les primitives S2 d'AfricaFunds (`api_opcv@5ac4a313`) : préparation SSH épinglée, helper read-only, garde Git, observation, inventaire des secrets, workflows ;
- [x] réconciliation bornée identique à la commande MCP (exact-SHA, zéro fichier applicatif, HTTP avant/après, codes 20–31), plus phrase de confirmation, lancement depuis `main` et sauvegarde avant mutation ;
- [x] placer tout le canal sous `.github/` (compatibilité avec le classifieur du fast-forward MCP) et déplacer `scripts/ssh/governed-readonly.sh` en conservant son historique ;
- [x] épingler la clé d'hôte S2 (trois empreintes confirmées par `ssh-keyscan stablecoin.chainsolutions.fr`) ;
- [x] tests de la garde Git et du helper SSH read-only, exécutés localement et ajoutés à la CI `Governance Consistency` ;
- [x] contrôles d'invariants du canal ajoutés au validateur de gouvernance ;
- [x] (propriétaire) configurer `S2_HOST` (même adresse qu'`api_opcv`) et `S2_SSH_KEY` (clé ed25519 dédiée à Stablecoin, installée sur S2 par le propriétaire) — 2026-09-26 ;
- [ ] (propriétaire, optionnel) configurer `S2_REPORT_PASSPHRASE` pour obtenir le rapport chiffré de l'inventaire des secrets ;
- [x] exécuter `Stablecoin S2 Host Key Verify` (run `36265174755`) puis `Stablecoin S2 Observe` (run `36266111300`) et attester les résultats dans `SUIVI.md` ;
- [x] réconcilier S2 (`2a8be821` → `main` courant, gouvernance uniquement) après autorisation explicite du propriétaire — `2a8be821` → `65f116ea`, run `36270099807`, 0 fichier applicatif, sans build/restart, post-attesté par le MCP (2026-09-26) ;
- [ ] (P2) si une opération Git doit un jour s'exécuter sous l'utilisateur d'abonnement Plesk, vérifier puis rétablir la propriété des objets et fichiers écrits en `root` par les fast-forward (MCP 2026-09-21, secours 2026-09-26) ;
- [ ] (propriétaire) après validation du canal, ranger la clé privée locale `stablecoin_s2_actions` dans le coffre chiffré ou la supprimer (elle reste dans le secret GitHub) ;
- [ ] exécuter `Stablecoin S2 Secret Inventory` (rapport chiffré) pour savoir, sans exposer de valeur, si `NEXT_PUBLIC_PRIVATE_KEY` est configurée et présente dans le bundle client ;
- [ ] si S2 est en retard sur `main` : réconcilier via le MCP s'il est disponible, sinon via `Stablecoin S2 Reconcile` (observe puis reconcile exact-SHA) ;
- [ ] transmettre ces informations au MCP par intake dès sa reconnexion, sans modifier le dépôt MCP.

## P0 — Passe de conformité gouvernance du 2026-09-26

Tâche gouvernée : `STB-TASK-20260926-003` (checkpoint `STB-CHK-20260926-012`).

- [x] relire en entier l'ordre obligatoire (`GOVERNANCE.md` → `LOOP_ENGINEERING.md`), le runbook et les cinq `.mcp/*` ;
- [x] revérifier et consigner la capacité live (`push=true`, `admin=false`) ;
- [x] relever les contradictions et appliquer la règle la plus restrictive (`SOURCE_OF_TRUTH.md` §4) ;
- [x] résoudre `canDeploy=false` ↔ réconciliation par la décision du propriétaire DEC-2026-09-26-018 (Option B) ;
- [x] corriger la contradiction introduite par l'agent sur `existingExternalSshBridgePolicy` et la rendre impossible par le validateur ;
- [x] annoter, sans les effacer, les énoncés `STALE` / `CONTRADICTED` de `SUIVI.md`, `ARCHITECTURE.md` et `TODO.md` ;
- [x] (propriétaire) trancher la contrainte du 2026-09-23 « ne pas muter S2 tant que la révision backend et la procédure de restart ne sont pas attestées » pour le fast-forward de gouvernance — levée pour ce seul cas, maintenue pour le reste (DEC-2026-09-26-019) ;
- [ ] (propriétaire, optionnel) activer un hook Git local versionné sous `.github/hooks/` (validateur + tests avant chaque commit sur ce poste).

## P0 — Sécurité : exposition web du dossier applicatif (constat 2026-09-26)

- [ ] `EVID-S2-WEB-EXPOSURE-20260926-001` : la racine web sert le dossier de l'application ; `/.git/HEAD`, `/.git/config`, `/.git/logs/HEAD`, `/SUIVI.md`, `/package.json`, `/.gitignore`, `/.next/BUILD_ID` répondent `200` (`/.env.local` = `403`). Chantier dédié, décision et exécution par le propriétaire : pointer la racine web Plesk vers `public/` ou refuser `/.git`, les fichiers cachés et les fichiers de gouvernance, puis revérifier ;
- [ ] vérifier en lecture seule sur S2, sans afficher aucune valeur, si les URL des remotes de `.git/config` contiennent des identifiants (booléen), puis décider d'une rotation si nécessaire.

## P2 — Documentation runtime

- [ ] annoter le runbook §4 (`origin` pointe désormais vers GitHub) dans un lot compatible : `docs/*` est classé applicatif par le fast-forward MCP, qui refuserait alors l'alignement S2 sans build/restart ; à traiter avec un déploiement gouverné ou après extension de la liste MCP par intake ;
- [ ] proposer au MCP par intake : ajouter `docs/*.md` à la liste non applicative du fast-forward Stablecoin.

## P1 — Sécurité

- [ ] vérifier sans exposer sa valeur si une vraie clé privée blockchain est encore injectée via `NEXT_PUBLIC_PRIVATE_KEY` ;
- [ ] si exposition confirmée, planifier retrait frontend, migration des signatures côté serveur et rotation contrôlée ;
- [ ] inventorier les autres secrets publics potentiels sans jamais les copier dans Git.
- [ ] constat 2026-09-26 (dépôt PUBLIC) : chaînes au format clé privée codées en dur dans 10 fichiers suivis (`priv_key` / `RelayerPrivateKey`) et `.env.local` présent dans l'historique (21 commits, 2023-01 → supprimé en `3ef11f5`) ; toute clé réelle est à considérer compromise ;
- [ ] (propriétaire) sauvegarde chiffrée des secrets S2 avant toute neutralisation — décision du propriétaire : conserver les clés, pas de neutralisation avant sauvegarde ;
- [ ] vérifier fonds/rôles E-WARI des adresses publiques dérivées, puis rotation contrôlée par le propriétaire.

## P2 — Qualité / dette technique

- [ ] traiter séparément l'avertissement SSRProvider documenté dans le runbook ;
- [ ] traiter le parsing `productTypes` documenté comme instable ;
- [ ] cartographier les routes frontend/API réellement utilisées ;
- [ ] compléter la documentation backend/base après découverte vérifiée du schéma courant, de la révision déployée et du restart ownership ; les métadonnées package/MySQL/`db_stablecoin` sont déjà attestées.
- [ ] inventorier les contrats/réseaux/déploiements blockchain actuels ;
- [x] CI de cohérence de gouvernance ajoutée et premier run réussi ; toute CI externe éventuelle reste `UNKNOWN` jusqu'à preuve.

## Archive à préserver

La branche `codex/wealthtech-mcp-conversation-memory` et ses documents `docs/mcp/*` ne doivent pas être supprimés ou fusionnés automatiquement. Ils constituent une preuve historique à réconcilier au besoin.
