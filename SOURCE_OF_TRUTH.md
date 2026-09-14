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
| permission autorisée par le dépôt | `GOVERNANCE.md` + `.mcp/permissions.json` |
| capacité réelle d'un agent/connector | observation live de la connexion active |
| autorisation de l'opération courante | tâche/checkpoint courant dans `SUIVI.md` + règles supérieures |

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


## 7. Politique ≠ capacité live ≠ autorisation courante

Une permission déclarée dans `.mcp/permissions.json` ou `.mcp/agents.json` exprime un **plafond de politique repository-side**. Elle ne prouve ni les scopes OAuth/GitHub App, ni le droit effectif de la connexion active, ni l'autorisation d'une mutation donnée.

Avant chaque session d'écriture :

1. observer la capacité live ;
2. la comparer à la politique locale ;
3. vérifier que la tâche courante autorise l'opération ;
4. appliquer l'intersection la plus restrictive.

## 8. Checkpoint et fraîcheur

Le bloc courant de `SUIVI.md` porte la tâche active, la baseline observée, le checkpoint, les preuves et l'action suivante. Le checkpoint est une mémoire de reprise, pas une vérité auto-actualisée : si le HEAD distant, la CI, le runtime ou une autorité supérieure a changé, il doit être classé `STALE` jusqu'à réconciliation.
