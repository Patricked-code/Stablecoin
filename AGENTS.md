# AGENTS — Règles universelles des agents pour Stablecoin

> S'applique à ChatGPT, Claude, Codex, Copilot et tout autre agent automatisé travaillant sur ce dépôt.

## 1. Ordre de lecture obligatoire

Avant toute mutation :

1. `GOVERNANCE.md`
2. `SOURCE_OF_TRUTH.md`
3. `AGENTS.md`
4. `README.md`
5. `SUIVI.md`
6. `DECISIONS.md`
7. `TODO.md`
8. `ARCHITECTURE.md`
9. `LOOP_ENGINEERING.md`
10. `docs/STABLECOIN_PLESK_DEPLOYMENT_RUNBOOK.md` si le chantier touche runtime/déploiement/authentification
11. `.mcp/*` si MCP/orchestration est concerné
12. le HEAD, les commits récents et les fichiers réellement impactés

## 2. Reprise obligatoire

Ne jamais repartir de zéro. Avant d'agir :

- vérifier `main` et le HEAD actuel ;
- lire le point de reprise de `SUIVI.md` ;
- vérifier si les commits récents ont déjà réalisé tout ou partie du travail ;
- réutiliser les structures, routes, conventions, ABI, scripts et documents existants ;
- distinguer état documenté et état live.

## 3. Branche

Le travail normal se fait sur `main`.

- ne créer aucune branche sans instruction explicite du propriétaire ;
- ne pas basculer sur une branche historique par habitude ;
- ne jamais force-push ni réécrire l'historique ;
- la branche `codex/wealthtech-mcp-conversation-memory` est une archive/evidence, pas la branche canonique de travail.

## 4. Non-régression

Avant une modification : identifier les consommateurs, dépendances et risques. Après la modification : exécuter les contrôles applicables et vérifier l'absence de régression.

Pour le code ou les comportements, utiliser une démarche test-first lorsque cela est applicable. Ne jamais supprimer un test pour faire passer une modification.

## 5. Secrets et blockchain

Ne jamais committer ou afficher :

- secrets `.env` ;
- clés API ;
- clés Magic ;
- credentials base de données ;
- clés privées blockchain ;
- tokens de relayer ;
- dumps contenant des données sensibles.

Toute clé privée réellement exposée au frontend doit être traitée comme un chantier de sécurité séparé avec rotation/migration contrôlée ; ne pas improviser une correction lors d'un autre chantier.

## 6. Runtime

Ne jamais supposer que les chemins ou services historiques sont encore actifs. Avant une action serveur :

- confirmer le serveur ;
- confirmer le vhost/dossier actif ;
- confirmer le process Passenger/Node actif ;
- confirmer le HEAD déployé et les remotes ;
- confirmer les commandes de build/restart ;
- faire les contrôles HTTP/API appropriés sans exposer de secret.

## 7. MCP

MCP orchestre ; ce repo ne recrée pas ses mécanismes. Adapter `.mcp/*` aux capacités MCP disponibles et conserver les règles locales du repo.

Aucune évolution de ce dépôt ne doit servir de prétexte à modifier le cœur MCP sans demande explicite.

## 8. Boucle

Toute intervention suit `LOOP_ENGINEERING.md` :

`DISCOVER → BASELINE → SELECT → IMPACT_ANALYSIS → IMPLEMENT_COMPATIBLY → VERIFY → REGRESSION_CHECK → PERSIST_STATE → VERIFY_REMOTE_STATE → SELECT_NEXT`.

## 9. Fin de chantier

Avant de déclarer terminé :

- vérifier l'état Git distant ;
- vérifier les résultats réellement exécutés ;
- mettre à jour `SUIVI.md` ;
- mettre à jour `TODO.md` / `DECISIONS.md` si nécessaire ;
- écrire un point de reprise exact si du travail reste.
