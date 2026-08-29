# Stablecoin / E-WARI

Dépôt GitHub canonique du frontend Stablecoin / E-WARI et de ses composants associés.

> **Branche canonique de travail normal :** `main`  
> **Gouvernance :** lire `GOVERNANCE.md` avant toute mutation.  
> **Mémoire projet :** `SUIVI.md`  
> **Runbook production :** `docs/STABLECOIN_PLESK_DEPLOYMENT_RUNBOOK.md`

## Démarrage obligatoire pour un agent

Lire dans cet ordre :

1. `GOVERNANCE.md`
2. `SOURCE_OF_TRUTH.md`
3. `AGENTS.md`
4. `README.md`
5. `SUIVI.md`
6. `DECISIONS.md`
7. `TODO.md`
8. `ARCHITECTURE.md`
9. `LOOP_ENGINEERING.md`
10. le runbook de production si le runtime est concerné
11. `.mcp/*` si MCP/orchestration est concerné

Ne jamais reprendre une ancienne conversation comme source de vérité sans la réconcilier avec Git et, pour le runtime, avec l'état live.

## Stack versionnée actuelle

Le `package.json` contient notamment :

- Next.js `10.0.6` ;
- React `17.0.1` ;
- ethers / Web3 ;
- Magic SDK ;
- OpenZeppelin Defender Relayer ;
- Redux ;
- Mapbox / Google Maps ;
- NextUI / Bootstrap.

Le dépôt contient également des ABI et du code Solidity sous `components/Contrats/`.

## Runtime documenté

Le runbook existant documente historiquement :

- frontend : `stablecoin.chainsolutions.fr` ;
- API métier : `api.stablecoin.chainsolutions.fr` ;
- frontend Plesk / Phusion Passenger ;
- backend Express / Sequelize distinct ;
- build historique Next.js 10 sous Node 18 avec `NODE_OPTIONS=--openssl-legacy-provider`.

Ces éléments sont actuellement classés `DOCUMENTED_UNVERIFIED` jusqu'à une nouvelle observation serveur. Ne jamais effectuer de déploiement ou de restart depuis cette seule description.

## Développement local

```bash
npm install
npm run dev
```

Scripts disponibles :

```text
npm run dev
npm run build
npm run start
```

Le `postbuild` appelle `scripts/generate-sitemap.js`.

## Sécurité

Ne jamais committer de secret, clé API, Magic Secret Key, credential base ou clé privée blockchain.

Le runbook documente un risque potentiel autour de `NEXT_PUBLIC_PRIVATE_KEY`. Toute exposition réelle doit être vérifiée et traitée dans un chantier de sécurité séparé avec rotation contrôlée ; ne jamais copier la valeur dans Git ou dans un rapport.

## MCP

Le dossier `.mcp/` expose le contrat repository-side :

- identité du repo ;
- permissions ;
- frontières des agents ;
- onboarding / rôles sémantiques ;
- runtime documenté et état de réconciliation serveur.

MCP reste l'orchestrateur externe. Le dépôt ne recrée aucun Live State, Operational Memory, session engine, task engine ou lock engine.

## Mémoire historique MCP

La branche `codex/wealthtech-mcp-conversation-memory` contient une compilation WealthTech/S1/S2/MCP du 2026-07-01. Elle est conservée comme **evidence historique** et n'est pas la mémoire canonique actuelle du projet.

## Références historiques de développement conservées

Les références spécifiques présentes dans l'ancien README sont conservées ici pour ne pas perdre le contexte :

- Modal Next/Argon Dashboard : https://www.creative-tim.com/learning-lab/nextjs/modal/argon-dashboard
- Tables NextUI : https://nextui.org/docs/components/table
- Chart.js / Next.js : https://towardsdev.com/chart-js-next-js-beautiful-data-driven-dashboards-how-to-create-them-fast-and-efficiently-a59e313a3153
- Google Analytics / Next.js : https://www.makeuseof.com/nextjs-google-analytics/
- Mapbox : https://www.mapbox.com/

L'ancien dépôt/remoting GitLab référencé historiquement était :

```text
https://gitlab.com/wealthtech1/stablecoin/stablecoin.git
```

Le runbook actuel précise que GitHub `Patricked-code/Stablecoin`, branche `main`, est la source utilisée pour les corrections récentes ; vérifier néanmoins les remotes live avant toute synchronisation serveur.

### Note historique Mapbox

L'intégration utilisait `mapbox-gl`, avec un token fourni par configuration et jamais hardcodé. Toute réutilisation doit continuer à charger les credentials depuis un environnement approprié.

### Note historique paiement e-commerce

L'ancien README indiquait le pop-up de paiement en attente e-commerce dans :

```text
Composant/Profil/Payment/PaiementEboutik.js
```

Ce chemin doit être vérifié dans l'arbre courant avant toute modification.

## Boucle de travail

Toute évolution suit :

`DISCOVER → BASELINE → SELECT → IMPACT_ANALYSIS → IMPLEMENT_COMPATIBLY → VERIFY → REGRESSION_CHECK → PERSIST_STATE → VERIFY_REMOTE_STATE → SELECT_NEXT`.

Voir `LOOP_ENGINEERING.md` pour le contrat complet.
