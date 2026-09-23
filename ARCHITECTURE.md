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

**Classification actuelle :** `PARTIAL_LIVE_VERIFICATION`. Le frontend est vérifié live, aligné sur `Patricked-code/Stablecoin/main@2a8be8219689e6213ce20f13d69b6b45f3693dfe`, worktree propre et HTTP 200. Le backend est joignable en HTTP (`401/401`) et son inventaire de métadonnées est maintenant attesté : package `api.fan-token@1.0.0`, Express/Sequelize/MySQL, base configurée `db_stablecoin`, source déclarée GitLab. En revanche, la révision source réellement déployée, l'ownership du process courant et la procédure exacte de restart restent `UNKNOWN` / `DOCUMENTED_UNVERIFIED`.

## 5. API / données

Le runbook documente un backend Express / Sequelize et un contrôle d'API key via la table `Wtiapikeys`. Les preuves GitHub-first/OIDC du 2026-09-23 confirment que `/var/www/vhosts/chainsolutions.fr/api.stablecoin.chainsolutions.fr` existe, n'est pas un dépôt Git et sert toujours une API protégée (`401` sur la racine et `/health`). L'inventaire borné du dossier révèle `package_name=api.fan-token`, version `1.0.0`, entrypoint déclaré `index.js`, Express `^4.18.1`, Sequelize `^6.20.1`, MySQL (`mysql2`/`mysql`) et une source déclarée `git+https://gitlab.com/wealthtech1/api/api.fan-token.git`. La configuration Sequelize non secrète référence le dialecte `mysql` et la base `db_stablecoin` en development, test et production. Les fichiers historiques `models/wtiapikey.js` et `middlewares/verifyApiKeyWti.js` sont confirmés présents par métadonnées et empreintes SHA-256. Cette source déclarée ne prouve toutefois pas le commit exact déployé. La sonde runtime fraîche ne retrouve pas de process dont le cwd est le dossier backend dans son échantillon borné : l'ownership du process et du restart reste donc inconnu.

## 6. Authentification

Le runbook documente un flux combinant API métier et Magic Link, avec callbacks `/callback/`, `/callback_register/` et route Next `/api/login/`. Toute modification de ce flux doit préserver la compatibilité existante et être testée bout-en-bout.

## 7. Déploiement et Git

Le checkout frontend S2 a d'abord été fast-forwardé de `6216755d318677ed9a56c36731a57531d02bf751` vers `4e946bd523acfbef3d08d9ff7b0b3dd3f074c3a3` par le chemin GitHub-first borné du MCP, avec **0 fichier applicatif** dans le delta et sans build/restart. Le checkpoint documentaire suivant a ensuite été aligné. La preuve read-only fraîche du 2026-09-23 confirme désormais S2 `main@2a8be8219689e6213ce20f13d69b6b45f3693dfe`, worktree propre, origin canonique, frontend HTTP 200 et GitHub `main` au même SHA. Toute écriture future doit refaire les mêmes contrôles exact-SHA et refuser automatiquement si un fichier applicatif apparaît.

### GitHub-first bounded WRITE

Depuis MCP `ab9b1aa902aab3efed42ba527847ab48df3c8eaa`, Stablecoin dispose d'un chemin d'écriture spécialisé : GitHub issue/workflow → OIDC WRITE dédié → endpoint MCP borné → fast-forward S2 exact-SHA. Ce chemin n'est pas un shell générique et n'autorise ni build, restart, stash, rebase, reset, ni fichier applicatif dans le delta.

## 8. MCP

Le repository expose progressivement un contrat `.mcp/*` pour permettre au MCP de découvrir : identité, gouvernance, permissions, agents, onboarding et cartographie runtime. Cette couche ne contient aucun secret et ne remplace pas les preuves live du MCP.

## 9. Mémoire historique

La branche `codex/wealthtech-mcp-conversation-memory` contient une ancienne compilation WealthTech/MCP/S1/S2 créée au-dessus de l'ancien `main@6216755d318677ed9a56c36731a57531d02bf751`.

Elle est conservée comme evidence historique, non comme architecture actuelle.

## 10. Gaps connus

À compléter uniquement avec preuves :

- révision exacte du backend déployé et accessibilité/historique de la source GitLab déclarée `wealthtech1/api/api.fan-token` ;
- schéma courant de `db_stablecoin` et confirmation runtime de la connexion effective à cette base ;
- ownership du process backend et procédure exacte de restart ;
- inventaire actuel des contrats déployés et réseaux ;
- CI réellement utilisée ;
- dépendances inter-repositories ;
- cartographie complète des routes frontend/API ;
- stratégie de backup/restauration actuelle.
