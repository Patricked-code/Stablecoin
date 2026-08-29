# SOURCE_OF_TRUTH — Hiérarchie des vérités du dépôt Stablecoin

> **Statut :** `CANONICAL`  
> Ce document définit comment résoudre les contradictions entre mémoire, Git, CI et runtime.

## 1. Principe

Aucun fichier Markdown, aucune conversation et aucune mémoire MCP ne peut à lui seul prouver l'état technique actuel d'un système vivant.

La règle générale est : **preuve la plus proche du fait observé + fraîcheur vérifiée + portée explicite**.

## 2. Hiérarchie par type de fait

| Type de fait | Autorité prioritaire |
|---|---|
| contenu versionné, historique, HEAD, branche | GitHub / Git du dépôt |
| règle de travail du repo | `GOVERNANCE.md`, puis décision durable la plus récente |
| procédure agent | `AGENTS.md` |
| état projet et point de reprise | `SUIVI.md`, réconcilié avec Git |
| travail restant | `TODO.md`, réconcilié avec Git et `SUIVI.md` |
| décision durable | `DECISIONS.md` |
| architecture versionnée connue | code + `ARCHITECTURE.md` |
| procédure de déploiement documentée | `docs/STABLECOIN_PLESK_DEPLOYMENT_RUNBOOK.md` |
| état runtime actuel | observation live du serveur concerné |
| état CI actuel | run CI lié au SHA observé |
| état MCP | Governed Context / Current-State / Live State du MCP lorsqu'ils sont disponibles |

## 3. Fraîcheur

Toute affirmation d'état peut être classée :

- `CURRENT` : vérifiée sur l'état actuel pertinent ;
- `DOCUMENTED_UNVERIFIED` : documentée mais non reverifiée live ;
- `STALE` : vraie à une ancienne baseline mais dépassée ;
- `CONTRADICTED` : contredite par une preuve plus forte/fraîche ;
- `UNKNOWN` : aucune preuve suffisante ;
- `NOT_APPLICABLE` : non pertinent pour ce scope.

Ne jamais promouvoir automatiquement `DOCUMENTED_UNVERIFIED` vers `CURRENT`.

## 4. Contradictions

En cas de contradiction structurante :

1. ne pas la résoudre silencieusement ;
2. identifier chaque source et sa date/SHA/portée ;
3. vérifier la source la plus proche du fait ;
4. appliquer la règle la plus restrictive tant que la contradiction n'est pas résolue ;
5. enregistrer la résolution dans `SUIVI.md` et, si durable, `DECISIONS.md`.

## 5. Ancienne mémoire MCP

La branche `codex/wealthtech-mcp-conversation-memory` contient une compilation de conversation, un suivi MCP, un ancien manifeste et des prompts/audits S1/S2 datés du 2026-07-01. Elle est classée :

`HISTORICAL_EVIDENCE / NOT_CURRENT_PROJECT_AUTHORITY`.

Elle doit être consultée lorsqu'elle apporte une information historique, mais aucune action serveur actuelle ne doit être exécutée sur sa seule base.

## 6. Runtime Stablecoin

Le runbook de production documente notamment des domaines, chemins Plesk/Passenger, variables attendues et procédures de build/restart. Lors d'une future connexion serveur, ces éléments servent de **baseline à confirmer**, pas de vérité live présumée.
