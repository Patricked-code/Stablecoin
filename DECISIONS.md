# DECISIONS — Décisions durables du projet Stablecoin

> **Statut :** `CANONICAL`  
> Enregistrer ici uniquement les décisions qui doivent survivre aux conversations et aux agents.

## DEC-2026-08-29-001 — Mémoire persistante locale gouvernée

**Décision :** le dépôt possède une mémoire persistante locale versionnée. Une conversation n'est jamais une source de vérité supérieure au dépôt.

**Conséquence :** les agents lisent `GOVERNANCE.md`, `SOURCE_OF_TRUTH.md`, `SUIVI.md`, `TODO.md`, `ARCHITECTURE.md`, le runbook pertinent et l'état Git avant toute mutation.

## DEC-2026-08-29-002 — Évolution additive sans régression

**Décision :** l'organisation existante est conservée et renforcée. Aucun fichier ou mécanisme utile n'est supprimé pour faire ressembler Stablecoin à un autre repo.

**Conséquence :** `docs/STABLECOIN_PLESK_DEPLOYMENT_RUNBOOK.md` reste l'autorité documentaire spécialisée du déploiement ; les nouveaux documents gouvernent et référencent l'existant au lieu de le dupliquer.

## DEC-2026-08-29-003 — Branche canonique

**Décision :** `main` est la branche canonique de travail normal. La création ou le changement de branche exige une instruction explicite du propriétaire.

**Conséquence :** la branche `codex/wealthtech-mcp-conversation-memory` reste historique et n'est ni fusionnée ni supprimée automatiquement.

## DEC-2026-08-29-004 — Ancienne mémoire MCP classée en evidence

**Décision :** le contenu `docs/mcp/*` de la branche `codex/wealthtech-mcp-conversation-memory`, daté du 2026-07-01, est conservé comme `HISTORICAL_EVIDENCE / NOT_CURRENT_PROJECT_AUTHORITY`.

**Motif :** il compile une ancienne conversation WealthTech/S1/S2 et un plan d'audit/migration. Il peut contenir des informations utiles mais ne prouve pas l'état actuel du runtime.

## DEC-2026-08-29-005 — Runtime : documenter sans présumer

**Décision :** les informations runtime du runbook sont classées `DOCUMENTED_UNVERIFIED` jusqu'à une nouvelle observation serveur.

**Conséquence :** aucune action de déploiement, suppression, migration, restart ou modification de configuration ne doit partir du seul runbook sans revalidation live.

## DEC-2026-08-29-006 — Compatibilité MCP côté repository

**Décision :** Stablecoin s'adapte progressivement aux évolutions du MCP au moyen de son contrat local `.mcp/*`. Le dépôt ne recrée aucun Live State, Operational Memory, session engine, task engine ou lock engine.

**Conséquence :** toute nouvelle attente MCP est d'abord confrontée à l'existant ; seuls les gaps réels sont ajoutés.

## DEC-2026-08-29-007 — Sécurité des secrets

**Décision :** aucun secret ou credential réel ne doit être versionné. Toute clé privée blockchain réellement exposée au frontend doit être traitée dans un chantier de sécurité séparé avec vérification et rotation contrôlée.
