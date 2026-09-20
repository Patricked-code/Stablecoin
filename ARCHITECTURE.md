# ARCHITECTURE — Stablecoin

> **Statut :** `CURRENT_BASELINE_WITH_KNOWN_GAPS`  
> Cette vue décrit uniquement ce qui est démontré par le dépôt et le runbook actuel. Elle doit évoluer lorsque de nouvelles preuves serveur sont fournies.

## 1. Repository

- GitHub : `Patricked-code/Stablecoin`
- branche canonique : `main`
- application principale versionnée : frontend Next.js historique
- langage principal GitHub : JavaScript

## 2. Frontend

Le `package.json` documente notamment :

- Next.js `10.0.6` ;
- React `17.0.1` ;
- ethers/Web3 ;
- Magic SDK ;
- Auth0 ;
- OpenZeppelin Defender Relayer client ;
- Redux ;
- Mapbox / Google Maps ;
- NextUI / Bootstrap.

Les principaux domaines fonctionnels visibles incluent authentification, profils, paiements, cartes/localisation, cas d'usage et composants blockchain/smart contracts.

## 3. Blockchain

Le dépôt contient des ABI JSON et du code Solidity sous `components/Contrats/`. Les derniers commits de `main` avant la mise en place de la gouvernance concernent notamment le flux E-WARI `metaTransfer` et l'intégration d'un relayer OpenZeppelin côté backend/route sécurisée.

Aucune adresse de contrat, permission on-chain, clé privée ou état de déploiement blockchain ne doit être considéré courant sans preuve dédiée.

## 4. Runtime documenté

Le runbook `docs/STABLECOIN_PLESK_DEPLOYMENT_RUNBOOK.md` documente :

- frontend : `stablecoin.chainsolutions.fr` ;
- API métier : `api.stablecoin.chainsolutions.fr` ;
- frontend servi par Plesk / Phusion Passenger ;
- backend API Express / Sequelize distinct ;
- un dossier frontend historique actif documenté sous `/var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin` ;
- un dossier backend documenté sous `/var/www/vhosts/chainsolutions.fr/api.stablecoin.chainsolutions.fr` ;
- build historique sous Node 18 avec `NODE_OPTIONS=--openssl-legacy-provider` ;
- restart frontend via `tmp/restart.txt`.

**Classification actuelle :** `PARTIAL_LIVE_VERIFICATION`. Le frontend est vérifié live (chemin, branche, HEAD, remotes, worktree, Passenger et HTTP). Le chemin backend et sa joignabilité HTTP sont vérifiés, mais sa source/ownership process, sa procédure de restart et la base attachée restent `UNKNOWN` / `DOCUMENTED_UNVERIFIED`.

## 5. API / données

Le runbook documente un backend Express / Sequelize et un contrôle d'API key via la table `Wtiapikeys`. La preuve live du 2026-09-20 confirme que `/var/www/vhosts/chainsolutions.fr/api.stablecoin.chainsolutions.fr` existe mais n'est pas un dépôt Git. Les réponses `401` sur la racine API et `/health` prouvent une API joignable et protégée, pas une panne. La source exacte, l'ownership process/restart et la base attachée restent à cartographier.

## 6. Authentification

Le runbook documente un flux combinant API métier et Magic Link, avec callbacks `/callback/`, `/callback_register/` et route Next `/api/login/`. Toute modification de ce flux doit préserver la compatibilité existante et être testée bout-en-bout.

## 7. Déploiement et Git

Le checkout frontend S2 est vérifié live sur `main@6216755d318677ed9a56c36731a57531d02bf751`, worktree propre, avec `origin` fetch/push vers `https://github.com/Patricked-code/Stablecoin.git`. Le `main` GitHub observé à `678656d84164f1aa7dadef8a3a627d0b905fe9e4` est 57 commits devant, sans divergence. Le diff observé touche 16 fichiers de gouvernance/.mcp/CI/README et **0 fichier applicatif**. Un futur fast-forward peut donc être préparé sans build ni restart uniquement si une re-comparaison immédiatement avant exécution confirme encore `applicationCodeFilesChanged=0`.

## 8. MCP

Le repository expose progressivement un contrat `.mcp/*` pour permettre au MCP de découvrir : identité, gouvernance, permissions, agents, onboarding et cartographie runtime. Cette couche ne contient aucun secret et ne remplace pas les preuves live du MCP.

## 9. Mémoire historique

La branche `codex/wealthtech-mcp-conversation-memory` contient une ancienne compilation WealthTech/MCP/S1/S2 créée au-dessus de l'ancien `main@6216755d318677ed9a56c36731a57531d02bf751`.

Elle est conservée comme evidence historique, non comme architecture actuelle.

## 10. Gaps connus

À compléter uniquement avec preuves :

- source/ownership Git et process du backend API (le chemin live existe mais n'est pas un dépôt Git) ;
- base de données réellement attachée et schéma courant ;
- ownership/restart du process backend ;
- inventaire actuel des contrats déployés et réseaux ;
- CI réellement utilisée ;
- dépendances inter-repositories ;
- cartographie complète des routes frontend/API ;
- stratégie de backup/restauration actuelle.
