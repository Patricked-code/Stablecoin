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
- [x] retirer ce mécanisme parallèle et conserver l'orchestrateur externe MCP ;
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
- [x] obtenir l'autorisation d'opération runtime explicite avant d'exécuter ce fast-forward sur S2 ;\n- [x] activer le WRITE borné GitHub-first via MCP PR #117 et Governed Deploy #54 ;\n- [x] exécuter le fast-forward exact-SHA S2 sans build/restart et obtenir les attestations Git/runtime post-écriture ;\n- [x] après CI du checkpoint, aligner le commit documentaire sur S2 ; preuve fraîche du 2026-09-23 : frontend S2 `main@2a8be8219689e6213ce20f13d69b6b45f3693dfe`, worktree propre, identique au `main` GitHub observé.

## P1 — Réconciliation serveur ↔ GitHub

À exécuter lorsque l'accès/dossier serveur sera fourni :

- [x] identifier précisément le serveur S2 et le vhost frontend actif ;
- [x] confirmer le dossier frontend actif au lieu de présumer le chemin historique ;
- [x] relever branche, HEAD, remotes et working tree du frontend côté serveur ;
- [x] comparer le frontend serveur ↔ `Patricked-code/Stablecoin/main` ;
- [x] identifier la source déclarée et les métadonnées du backend API : dossier live non-Git, package `api.fan-token@1.0.0`, source déclarée `git+https://gitlab.com/wealthtech1/api/api.fan-token.git` ;
- [x] confirmer la configuration DB non secrète : dialecte MySQL et base `db_stablecoin` pour development/test/production ;
- [ ] identifier la révision exacte du source backend déployé et réconcilier son historique avec la source GitLab déclarée ;
- [ ] confirmer l'ownership du process backend et la procédure exacte de restart ; la sonde runtime fraîche du 2026-09-23 ne retrouve pas le cwd backend dans son échantillon borné.
- [x] confirmer les domaines et réponses HTTP/API (`frontend=200`, API racine/health=`401` protégés) ;
- [x] mettre à jour `.mcp/server-map.json`, `ARCHITECTURE.md` et `SUIVI.md` avec les preuves live ;
- [x] préparer et activer la liaison gouvernée GitHub → serveur pour le fast-forward Stablecoin exact-SHA, sans écriture destructive générique.
- [x] restaurer le connecteur SSH GitHub Actions comme canal de secours read-only (DEC-2026-09-26-016) ;
- [ ] (propriétaire) créer un utilisateur S2 dédié non-root + clé SSH, puis configurer les 4 secrets `STABLECOIN_SSH_*` ;
- [ ] exécuter un premier run `Governed SSH Readonly` et attester son résultat dans `SUIVI.md` ;
- [ ] (propriétaire) rétablir les connexions MCP `wealthtech_ssh_bridge` (session locale + connecteur claude.ai).

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
