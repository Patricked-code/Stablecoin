# GPT.md — Mémoire persistante IA WealthTech / Stablecoin / MCP

Date : 2026-07-01
Statut : mémoire projet compilée depuis la conversation de pilotage.

---

## 1. Rôle de l’agent IA

Tu es un agent IA expert du projet WealthTech / Stablecoin / EWARI / KOREE / MCP. Tu dois travailler sans régression, sans perte de contexte, sans suppression dangereuse, sans exposition de secrets et avec documentation permanente.

Tu dois toujours distinguer :

- le serveur S1 ;
- le serveur S2 ;
- le serveur MCP ;
- les domaines à conserver ;
- les domaines protégés ;
- les domaines à nettoyer ;
- les domaines à migrer ;
- les applications à copier sans supprimer ;
- les fichiers de mémoire projet ;
- le point de reprise courant.

---

## 2. Serveurs

```text
S1 = root@212.227.212.33
S2 = root@217.160.249.254
MCP = serveur exécutant wealthtech_ssh_bridge ou équivalent
```

S1 est le serveur principal et cible.
S2 est le serveur source et partiellement protégé.
Le serveur MCP sert de passerelle d’audit et d’orchestration.

---

## 3. Domaines S1 à conserver

Ne pas casser :

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

---

## 4. Domaines S2 protégés

Ne jamais toucher ni modifier :

- `africafunds.chainsolutions.fr`
- `api.africafunds.chainsolutions.fr`
- `api.stablecoin.chainsolutions.fr`
- `stablecoin.chainsolutions.fr`
- `brvm.chainsolutions.fr`
- `bvmac.chainsolutions.fr`
- `chainsolutions.fr`
- `Funds.chainsolutions.fr`
- `api.funds.chainsolutions.fr`

---

## 5. Migrations prévues

- `wealthtech.chainsolutions.fr` vers `V2.wealthtechinnovations.com`.
- `evote.chainsolutions.fr` vers `evote.wealthtechinnovations.com`.
- `api.evote.chainsolutions.fr` vers `api.evote.wealthtechinnovations.com`.
- `itic4fima.chainsolutions.fr` vers `evaluations.wealthtechinnovations.com`.
- `api.itic4fima.chainsolutions.fr` vers `api.evaluations.wealthtechinnovations.com`.
- `stablecoin.chainsolutions.fr` vers `stablecoin.wealthtechinnovations.com`, par copie uniquement.
- `api.stablecoin.chainsolutions.fr` vers `api.stablecoin.wealthtechinnovations.com`, par copie uniquement.

Règle Stablecoin : ne jamais supprimer les originaux sur S2.

---

## 6. Objectif final

Créer un écosystème WealthTech unifié avec :

- frontend commun Next.js ;
- backend Node.js modulaire ;
- base MySQL commune ou étendue ;
- Redis ;
- ClickHouse ;
- Docker Compose ;
- microservices progressifs ;
- trajectoire Kubernetes ;
- modules stablecoin, blockchain, tokenfactory, evote, formations, évaluations ;
- monitoring ;
- sauvegarde ;
- sécurité ;
- documentation complète ;
- agents IA travaillant en boucle.

---

## 7. Documentation obligatoire à lire avant action

Avant toute action technique, lire :

1. `GPT.md`
2. `SUIVI.md`
3. `README.md`
4. `README_DEV.md`
5. `ROADMAP.md`
6. `TODO.md`
7. `TASKS.md`
8. `CODE_REVIEW.md`
9. `CHANGELOG.md`
10. `DEPLOYMENT_PRODUCTION.md`
11. `ARCHITECTURE.md`
12. `DATABASE.md`
13. `MIGRATION.md`
14. `DOCKER.md`
15. `SECURITY.md`
16. `AGENTS_ARCHITECTURE.md`
17. `AI_SKILLS.md`

Puis lire spécifiquement :

```md
# POINT DE REPRISE COURANT
```

---

## 8. Règles de sécurité

- Ne jamais supprimer sans inventaire.
- Ne jamais agir sur un domaine protégé.
- Ne jamais pousser de secrets sur GitHub.
- Ne jamais afficher le contenu réel des `.env`.
- Ne jamais modifier S2 protégé.
- Ne jamais supprimer Stablecoin S2.
- Toujours auditer avant nettoyage.
- Toujours auditer avant migration.
- Toujours tester après modification.
- Toujours documenter après intervention.
- Toujours mettre à jour le point de reprise.

---

## 9. Première mission MCP recommandée

La première mission MCP doit être :

```text
Audit global non destructif S1 + S2.
```

Elle doit produire :

- Markdown ;
- HTML ;
- TXT ;
- JSON ;
- archive `.tar.gz` téléchargeable.

Chemin recommandé :

```bash
/opt/wealthtech-audit-mcp/
```

---

## 10. Point de reprise courant

Dernière action : compilation de la conversation en fichiers GitHub dans la branche `codex/wealthtech-mcp-conversation-memory`.

Prochaine action : installer cette mémoire sur le serveur MCP, puis lancer le prompt `AUDIT_GLOBAL_S1_S2_MCP_PROMPT.md` via Claude Code et `wealthtech_ssh_bridge`.
