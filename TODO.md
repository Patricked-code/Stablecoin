# TODO — Stablecoin

> **Statut :** `CANONICAL BACKLOG`  
> Les tâches doivent être réconciliées avec `SUIVI.md`, Git et les preuves runtime avant exécution.

## P0 — Gouvernance / reprise

- [x] Finaliser le contrat `.mcp/*` côté repository.
- [x] Réécrire le haut de `README.md` pour présenter l'état réel et pointer vers la mémoire canonique, sans supprimer les références historiques utiles.
- [x] Vérifier par comparaison Git que le bootstrap n'a modifié aucun fichier applicatif et enregistrer le checkpoint dans `SUIVI.md`.

## P1 — Réconciliation serveur ↔ GitHub

À exécuter lorsque l'accès/dossier serveur sera fourni :

- [ ] identifier précisément le serveur et le vhost actifs ;
- [ ] confirmer le dossier frontend actif au lieu de présumer le chemin historique ;
- [ ] relever branche, HEAD, remotes et working tree côté serveur ;
- [ ] comparer serveur ↔ `Patricked-code/Stablecoin/main` ;
- [ ] identifier le backend API réellement actif, son repo/remote/HEAD et son ownership ;
- [ ] confirmer le process Passenger/Node actif et la procédure de restart ;
- [ ] confirmer les domaines et réponses HTTP/API ;
- [ ] mettre à jour `.mcp/server-map.json`, `ARCHITECTURE.md` et `SUIVI.md` avec les preuves live ;
- [ ] préparer la liaison gouvernée GitHub → serveur adaptée au modèle MCP, sans écriture destructive.

## P1 — Sécurité

- [ ] vérifier sans exposer sa valeur si une vraie clé privée blockchain est encore injectée via `NEXT_PUBLIC_PRIVATE_KEY` ;
- [ ] si exposition confirmée, planifier retrait frontend, migration des signatures côté serveur et rotation contrôlée ;
- [ ] inventorier les autres secrets publics potentiels sans jamais les copier dans Git.

## P2 — Qualité / dette technique

- [ ] traiter séparément l'avertissement SSRProvider documenté dans le runbook ;
- [ ] traiter le parsing `productTypes` documenté comme instable ;
- [ ] cartographier les routes frontend/API réellement utilisées ;
- [ ] documenter la base de données et le backend après découverte vérifiée ;
- [ ] inventorier les contrats/réseaux/déploiements blockchain actuels ;
- [ ] clarifier la CI actuellement utilisée ou son absence.

## Archive à préserver

La branche `codex/wealthtech-mcp-conversation-memory` et ses documents `docs/mcp/*` ne doivent pas être supprimés ou fusionnés automatiquement. Ils constituent une preuve historique à réconcilier au besoin.
