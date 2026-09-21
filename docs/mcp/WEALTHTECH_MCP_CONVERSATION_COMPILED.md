# WEALTHTECH / STABLECOIN — Mémoire compilée de conversation MCP

Date de compilation : 2026-07-01
Branche GitHub : `codex/wealthtech-mcp-conversation-memory`
Dépôt : `Patricked-code/Stablecoin`
Objet : compiler la conversation de travail liée à WealthTech, Stablecoin, EWARI/KOREE, S1, S2, MCP, migration, audit serveur, documentation projet et boucle d’ingénierie IA.

---

## 1. Contexte général

Le projet concerne un écosystème WealthTech / Stablecoin / Blockchain / Paiement / TokenFactory / EVOTE / Évaluations / Formation Blockchain. L’objectif est de transformer les applications existantes en un écosystème cohérent, documenté, sécurisé, versionné dans GitHub, pilotable par des agents IA et exploitable via un serveur MCP capable d’accéder aux serveurs S1 et S2.

Le projet utilise ou vise les technologies suivantes :

- Backend : Node.js.
- Base principale : MySQL.
- Analytics et requêtes lourdes : ClickHouse.
- Cache, queues et workers : Redis.
- Frontend : Next.js.
- Architecture : modulaire, microservices progressifs, Docker, trajectoire Kubernetes.
- Design frontend : Atomic Design.
- Blockchain : stablecoin, smart contracts, TokenFactory, infrastructure POA.
- DevOps : Plesk, PM2, Passenger, Docker, Nginx/Apache selon l’existant.
- Documentation projet : Markdown, mémoire persistante, suivi, roadmap, changelog, audit, déploiement production.

---

## 2. Serveurs concernés

### 2.1 Serveur S1

```text
S1 = root@212.227.212.33
```

Rôle : serveur principal, destination de migration, serveur à nettoyer, futur serveur cible de l’écosystème WealthTech.

Domaines à conserver avec contenu et configuration :

- `niakara.com`
- `www.niakara.com`
- `api.niakara.com`
- `wealthtechinnovations.com`
- `api.wealthtechinnovations.com`
- `stablecoin.wealthtechinnovations.com`
- `api.stablecoin.wealthtechinnovations.com`
- `blockchain.wealthtechinnovations.com`
- `tokenfactory.wealthtechinnovations.com`
- `wealthtechinnovation.com`
- `berebytours.com`

Domaines à créer ou recevoir sur S1 :

- `V2.wealthtechinnovations.com`
- `evote.wealthtechinnovations.com`
- `api.evote.wealthtechinnovations.com`
- `evaluations.wealthtechinnovations.com`
- `api.evaluations.wealthtechinnovations.com`

Règle S1 : tout ce qui n’est pas listé comme conservé ou destiné à recevoir une migration doit être inventorié puis pourra être vidé ou nettoyé après validation humaine. Le nettoyage doit libérer le maximum d’espace possible sans casser les domaines conservés.

### 2.2 Serveur S2

```text
S2 = root@217.160.249.254
```

Rôle : serveur source, serveur de migration, serveur à nettoyer sélectivement.

Domaines S2 strictement protégés, à ne pas toucher :

- `africafunds.chainsolutions.fr`
- `api.africafunds.chainsolutions.fr`
- `api.stablecoin.chainsolutions.fr`
- `stablecoin.chainsolutions.fr`
- `brvm.chainsolutions.fr`
- `bvmac.chainsolutions.fr`
- `chainsolutions.fr`
- `Funds.chainsolutions.fr`
- `api.funds.chainsolutions.fr`

Règle S2 : aucune action ne doit modifier, casser, vider, désactiver ou redémarrer ce qui impacte ces domaines protégés.

---

## 3. Nettoyage demandé

### 3.1 Nettoyage S1

Sur S1, ne garder que les domaines listés dans la section S1. Le reste doit être vidé ou nettoyé après inventaire. Les sauvegardes Plesk inutiles, notamment liées à `wealthtechinnovations.com` et aux anciens projets, doivent être identifiées pour suppression ultérieure validée.

Le nettoyage doit viser :

- anciens domaines ;
- anciens sous-domaines ;
- anciennes applications Node cassées ;
- dossiers vides ;
- erreurs Passenger ;
- anciens builds ;
- `node_modules` inutiles ;
- caches ;
- logs volumineux ;
- sauvegardes Plesk obsolètes ;
- dumps SQL inutiles ;
- archives lourdes ;
- apps PM2 ou Passenger abandonnées.

### 3.2 Domaines S1 précédemment identifiés comme à vider ou à supprimer plus tard

- `api.fan-token.wealthtechinnovations.com`
- `api.sadiaaf.wealthtechinnovations.com`
- `apiv3.liquidity.wealthtechinnovations.com`
- `dapps.liquidity.wealthtechinnovations.com`
- `liquidity.wealthtechinnovations.com`
- `lys.wealthtechinnovations.com`
- `sadiaaf.wealthtechinnovations.com`
- `pnci.wealthtechinnovations.com`
- `api.pnci.wealthtechinnovations.com`
- `awards.pnci-ci.wealthtechinnovations.com`
- `liquidity-test.wealthtechinnovations.com`
- `liquidityv1.wealthtechinnovations.com`

Ces éléments doivent être inventoriés avant tout vidage. Les domaines explicitement conservés ne doivent pas être impactés.

### 3.3 Nettoyage S2 demandé plus tard

Applications à vider ou supprimer après inventaire :

- `api.pccet.wealthtechinnovations.ci`
- `api.wealthtechinnovations.ci`
- `evote.wealthtechinnovations.ci`
- `pccet.wealthtechinnovations.ci`
- `wealthtechinnovations.ci`
- `opcvm.chainsolutions.fr`

Sauvegardes à nettoyer plus tard :

- `fantokenafrica.club`
- `api.fantokenafrica.club`
- `lysfc.fantokenafrica.club`
- `iso20022.chainsolutions.fr`
- `mutualfunds.chainsolutions.fr`
- `opcvm.chainsolutions.fr`
- `robot.funds.chainsolutions.fr`
- `api-mutualfunds.chainsolutions.fr`

---

## 4. Migrations S2 vers S1

### 4.1 WealthTech

Source S2 :

- `wealthtech.chainsolutions.fr`

Destination S1 :

- `V2.wealthtechinnovations.com`

Action future : sauvegarder sur GitHub, transférer code, configuration, logique, base de données, variables, dépendances et déployer sur le nouveau sous-domaine S1.

### 4.2 EVOTE

Sources S2 :

- `evote.chainsolutions.fr`
- `api.evote.chainsolutions.fr`

Destinations S1 :

- `evote.wealthtechinnovations.com`
- `api.evote.wealthtechinnovations.com`

Action future : vider les contenus existants sur S1 pour ces destinations si nécessaire, puis migrer totalement depuis S2.

### 4.3 Formation Blockchain / Évaluations

Sources S2 :

- `itic4fima.chainsolutions.fr`
- `api.itic4fima.chainsolutions.fr`

Destinations S1 :

- `evaluations.wealthtechinnovations.com`
- `api.evaluations.wealthtechinnovations.com`

Action future : créer et paramétrer les sous-domaines sur S1, migrer code, API, configuration, base et dépendances.

### 4.4 Stablecoin

Sources S2 :

- `stablecoin.chainsolutions.fr`
- `api.stablecoin.chainsolutions.fr`

Destinations S1 :

- `stablecoin.wealthtechinnovations.com`
- `api.stablecoin.wealthtechinnovations.com`

Règle absolue : copier vers S1 mais ne jamais supprimer les originaux stablecoin sur S2.

---

## 5. Écosystème cible WealthTech

Les applications suivantes ont vocation à devenir les modules d’une seule application ou d’un seul écosystème harmonisé avec base de données commune étendue :

- `wealthtechinnovations.com`
- `api.wealthtechinnovations.com`
- `stablecoin.wealthtechinnovations.com`
- `api.stablecoin.wealthtechinnovations.com`
- `blockchain.wealthtechinnovations.com`
- `tokenfactory.wealthtechinnovations.com`
- `V2.wealthtechinnovations.com`
- `evote.wealthtechinnovations.com`
- `api.evote.wealthtechinnovations.com`
- `evaluations.wealthtechinnovations.com`
- `api.evaluations.wealthtechinnovations.com`

La version la plus avancée est considérée comme `stablecoin`. Elle doit servir de référence pour l’architecture fonctionnelle, la logique métier et la structuration progressive de l’écosystème.

Architecture cible :

- frontend commun Next.js ;
- backend Node.js modulaire ;
- MySQL commun ou étendu ;
- ClickHouse pour analytics, logs, reporting, requêtes lourdes ;
- Redis pour cache, sessions, queues et workers ;
- Docker Compose ;
- architecture microservices progressive ;
- préparation Kubernetes future ;
- monitoring ;
- sauvegarde et restauration ;
- sécurité, RBAC, audit logs, gestion des secrets ;
- agents IA documentés travaillant en boucle.

---

## 6. Documentation projet obligatoire

Les fichiers suivants doivent exister dans le projet et être tenus à jour :

- `GPT.md`
- `SUIVI.md`
- `README.md`
- `README_DEV.md`
- `ROADMAP.md`
- `TODO.md`
- `TASKS.md`
- `CODE_REVIEW.md`
- `CHANGELOG.md`
- `DEPLOYMENT_PRODUCTION.md`
- `ARCHITECTURE.md`
- `DATABASE.md`
- `DOCKER.md`
- `KUBERNETES_FUTURE.md`
- `SECURITY.md`
- `MONITORING.md`
- `BACKUP_RESTORE.md`
- `MIGRATION.md`
- `AGENTS_ARCHITECTURE.md`
- `AI_SKILLS.md`

`SUIVI.md` est le fichier central. Il doit contenir :

```md
# POINT DE REPRISE COURANT
```

Ce point de reprise doit être mis à jour après chaque session ou intervention.

---

## 7. Loop Engineering

La boucle d’ingénierie demandée est :

1. Lire la mémoire projet.
2. Lire le point de reprise.
3. Identifier serveur, domaine, module et objectif.
4. Inventorier l’existant.
5. Évaluer les risques.
6. Planifier.
7. Exécuter prudemment.
8. Tester.
9. Documenter.
10. Mettre à jour `SUIVI.md`, `CHANGELOG.md`, `TASKS.md`, `TODO.md`.
11. Mettre à jour le `POINT DE REPRISE COURANT`.
12. Recommencer.

Aucune modification lourde ne doit être faite sans lecture préalable des fichiers mémoire.

---

## 8. Agents IA à documenter

Agents recommandés :

- Agent Architecte Écosystème ;
- Agent Migration ;
- Agent Nettoyage Serveur ;
- Agent Sécurité / Secrets ;
- Agent Base de Données ;
- Agent DevOps / Docker ;
- Agent Blockchain / Stablecoin ;
- Agent Documentation ;
- Agent Tests / Non-régression.

Chaque agent doit : lire la mémoire, identifier le contexte, inventorier, agir prudemment, tester, documenter et mettre à jour le point de reprise.

---

## 9. MCP et audit global

Le serveur MCP doit servir de pont contrôlé vers S1 et S2. La première mission à lui confier doit être un audit global non destructif.

Objectif de l’audit :

- état système S1/S2 ;
- domaines ;
- Plesk ;
- PM2 ;
- Passenger ;
- Docker ;
- bases de données ;
- fichiers `.env` sans exposer les secrets ;
- certificats ;
- logs ;
- sauvegardes ;
- fichiers volumineux ;
- espace disque libérable ;
- domaines protégés ;
- domaines à conserver ;
- domaines à migrer ;
- domaines à vider plus tard ;
- fichiers de documentation existants ou manquants ;
- état de préparation de la migration ;
- risques ;
- actions recommandées.

Règle : l’audit ne doit rien modifier, rien supprimer, rien redémarrer, rien migrer.

---

## 10. Projet EWARI / KOREE / Stablecoin

EWARI, KOREE et le projet Stablecoin désignent le même projet ou des variantes historiques du même projet.

Objectif : créer un stablecoin XOF adossé au Franc CFA de l’Afrique de l’Ouest, émis sous forme de monnaie électronique ou porté dans un cadre d’expérimentation / partenariat avec une institution financière.

Partenaire important : WITTI FINANCES.

Rôle envisagé : WITTI FINANCES comme institution financière partenaire pour le cadre réglementaire, WealthTech comme partenaire technique/fournisseur de solution technique.

Cas d’usage :

- transferts d’argent ;
- paiements ;
- e-commerce ;
- démarches administratives ;
- factures ;
- investissement tokenisé ;
- OPCVM tokenisés ;
- crowdfunding ;
- épargne à taux fixe ;
- épargne bloquée ;
- comptes numériques ;
- réception salaire ;
- prélèvements ;
- cartes ;
- paiements entreprises ;
- encaissements marchands ;
- paiements fournisseurs ;
- impôts ;
- micro-crédit ;
- placement de trésorerie ;
- épargne salariale ;
- dispositifs ONG, mutuelles, institutions et associations.

---

## 11. Dossier BCEAO / agrément EME

Le dossier doit être construit conformément à l’instruction BCEAO applicable aux Établissements Émetteurs de Monnaie Électronique et au guide promoteur.

Documents à produire :

A. Dispositif de contrôle interne avec risques bruts et dispositif de gestion.
B. Dispositifs d’analyse, d’alerte et de suivi des risques BC/FT.
C. Procédure de gestion de la monnaie électronique.
D. Procédure de gestion de la relation clientèle.
E. Procédure de gestion du réseau de distribution.
F. Procédure de gestion des incidents et réclamations.
G. Formulaire d’enrôlement client.
H. Formulaire de création de monnaie électronique.
I. Formulaire de destruction de monnaie électronique.
J. Présentation détaillée de l’activité.
K. Projections financières sur au moins trois ans avec hypothèses de sensibilité.
L. Investissements prévus.
M. Plan de financement.
N. Politique de coût.
O. Structure tarifaire.
P. Projet de convention de services monnaie électronique.
Q. Projet de convention distributeur.
R. Projet de convention marchand/accepteur.
S. Projet de convention détenteur de monnaie électronique.
T. Projet de convention facturier.

---

## 12. Smart contracts et documentation technique

Les contrats existants comprennent des éléments ERC20, AccessControl, Pausable, Permit/EIP712, mint, burn, transfer, transferFrom, allowance, approve, increaseAllowance, decreaseAllowance, asyncTransfer, rôles MINTER_ROLE, PAUSER_ROLE, BURNER_ROLE, ASYNC_ROLE, TRANSFER_ROLE, TRANSFERFROM_ROLE, PERMITER_ROLE.

Point important : le contrôle d’accès existe aussi sur les fonctions de transfert (`transfer` avec `TRANSFER_ROLE`, `transferFrom` avec `TRANSFERFROM_ROLE`). Toute documentation technique doit corriger les réponses antérieures incomplètes qui avaient omis ce point.

---

## 13. Règles de reprise

Avant toute nouvelle intervention :

1. Lire ce fichier.
2. Lire `GPT.md`.
3. Lire `SUIVI.md`.
4. Lire `POINT DE REPRISE COURANT`.
5. Vérifier la branche Git.
6. Vérifier que les secrets ne sont pas exposés.
7. Vérifier que les domaines protégés ne sont pas impactés.
8. Procéder uniquement par audit / inventaire avant toute suppression ou migration.

---

## 14. Point de reprise courant

Dernière action documentée : compilation de la conversation WealthTech/MCP/Stablecoin dans GitHub sur la branche `codex/wealthtech-mcp-conversation-memory`.

Action suivante recommandée : déployer ces fichiers de mémoire sur le serveur MCP dans un dossier de travail dédié, par exemple :

```bash
/opt/wealthtech-mcp-memory/
```

Puis utiliser le prompt d’audit global non destructif pour demander à Claude Code via MCP d’analyser S1 et S2.
