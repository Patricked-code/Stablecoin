# AUDIT GLOBAL MCP — S1 + S2 — WEALTHTECH / STABLECOIN / LOOP ENGINEERING

## 0. Mission

Tu es Claude Code connecté au serveur MCP `wealthtech_ssh_bridge`, capable d’accéder aux deux serveurs :

- S1 : `root@212.227.212.33`
- S2 : `root@217.160.249.254`

Tu dois produire un audit global, détaillé, commenté, non destructif, enregistré et téléchargeable.

Cette mission est exclusivement une mission de lecture, diagnostic, inventaire, comparaison, commentaire et génération de rapports.

## 1. Interdictions absolues

Pendant cet audit, tu ne dois pas :

- supprimer ;
- vider ;
- modifier ;
- redémarrer ;
- migrer ;
- déplacer ;
- désactiver ;
- corriger ;
- nettoyer ;
- installer ;
- déployer ;
- modifier Plesk ;
- modifier Nginx ;
- modifier Apache ;
- modifier PM2 ;
- modifier Passenger ;
- modifier Docker ;
- modifier MySQL ;
- modifier ClickHouse ;
- modifier Redis ;
- modifier les `.env` ;
- afficher des secrets ;
- pousser du code ;
- interrompre un service.

Commandes interdites : `rm`, `mv` en production, `truncate`, `systemctl restart`, `systemctl stop`, `pm2 stop`, `pm2 delete`, `docker stop`, `docker rm`, `docker compose down`, `DROP`, `DELETE`, `UPDATE`, `plesk bin domain --remove`, `certbot delete`.

Si une commande peut être destructive, ne l’exécute pas et indique dans le rapport : `NON EXÉCUTÉ — RISQUE DE MODIFICATION`.

## 2. Commandes de lecture autorisées

Tu peux utiliser uniquement des commandes de lecture, par exemple :

```bash
hostname
whoami
date
uptime
uname -a
cat /etc/os-release
df -h
df -ih
free -h
lsblk
ss -tulpn
systemctl status nginx --no-pager || true
systemctl status apache2 --no-pager || true
systemctl status httpd --no-pager || true
systemctl status mysql --no-pager || true
systemctl status mariadb --no-pager || true
systemctl status docker --no-pager || true
pm2 list || true
pm2 jlist || true
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" || true
docker compose ls || true
plesk version || true
plesk bin domain --list || true
plesk bin subscription --list || true
mysql -e "SHOW DATABASES;" || true
curl -k -I -L --max-time 15 https://DOMAINE || true
```

## 3. Domaines S1 à conserver

Sur S1, vérifier et protéger :

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

## 4. Domaines S1 futurs ou de migration

Vérifier existence, absence ou état de préparation :

- `V2.wealthtechinnovations.com`
- `evote.wealthtechinnovations.com`
- `api.evote.wealthtechinnovations.com`
- `evaluations.wealthtechinnovations.com`
- `api.evaluations.wealthtechinnovations.com`

## 5. Domaines S2 protégés

Sur S2, ne jamais modifier :

- `africafunds.chainsolutions.fr`
- `api.africafunds.chainsolutions.fr`
- `api.stablecoin.chainsolutions.fr`
- `stablecoin.chainsolutions.fr`
- `brvm.chainsolutions.fr`
- `bvmac.chainsolutions.fr`
- `chainsolutions.fr`
- `Funds.chainsolutions.fr`
- `api.funds.chainsolutions.fr`

## 6. Domaines S2 à supprimer ou vider plus tard, pas maintenant

Inventorier seulement :

- `api.pccet.wealthtechinnovations.ci`
- `api.wealthtechinnovations.ci`
- `evote.wealthtechinnovations.ci`
- `pccet.wealthtechinnovations.ci`
- `wealthtechinnovations.ci`
- `opcvm.chainsolutions.fr`

## 7. Sauvegardes S2 à nettoyer plus tard, pas maintenant

Inventorier sauvegardes liées à :

- `fantokenafrica.club`
- `api.fantokenafrica.club`
- `lysfc.fantokenafrica.club`
- `iso20022.chainsolutions.fr`
- `mutualfunds.chainsolutions.fr`
- `opcvm.chainsolutions.fr`
- `robot.funds.chainsolutions.fr`
- `api-mutualfunds.chainsolutions.fr`

## 8. Migrations à vérifier

### WealthTech

- Source : `wealthtech.chainsolutions.fr`
- Destination : `V2.wealthtechinnovations.com`

### EVOTE

- Sources : `evote.chainsolutions.fr`, `api.evote.chainsolutions.fr`
- Destinations : `evote.wealthtechinnovations.com`, `api.evote.wealthtechinnovations.com`

### Formation Blockchain / Évaluations

- Sources : `itic4fima.chainsolutions.fr`, `api.itic4fima.chainsolutions.fr`
- Destinations : `evaluations.wealthtechinnovations.com`, `api.evaluations.wealthtechinnovations.com`

### Stablecoin

- Sources : `stablecoin.chainsolutions.fr`, `api.stablecoin.chainsolutions.fr`
- Destinations : `stablecoin.wealthtechinnovations.com`, `api.stablecoin.wealthtechinnovations.com`

Règle : Stablecoin S2 doit être copié vers S1 plus tard mais jamais supprimé de S2.

## 9. Inventaire attendu par serveur

Pour S1 et S2, produire :

- hostname ;
- OS ;
- kernel ;
- uptime ;
- timezone ;
- CPU/RAM/SWAP ;
- disque ;
- inodes ;
- partitions ;
- plus gros dossiers ;
- plus gros fichiers ;
- sauvegardes ;
- logs volumineux ;
- `node_modules` volumineux ;
- caches ;
- dumps SQL ;
- archives ;
- services ;
- ports ouverts ;
- processus écoutant ;
- Plesk ;
- PM2 ;
- Passenger ;
- Docker ;
- bases de données ;
- certificats ;
- fichiers `.env` sans contenu ;
- risques.

## 10. Inventaire attendu par domaine

Pour chaque domaine trouvé :

- serveur ;
- domaine ;
- statut : conservé / protégé / à migrer / à nettoyer plus tard / inconnu ;
- dossier web ;
- taille ;
- technologie ;
- framework ;
- package manager ;
- scripts `package.json` si présent ;
- PM2 ;
- Docker ;
- Passenger ;
- port ;
- base probable ;
- `.env` présent ou non sans contenu ;
- HTTP ;
- HTTPS ;
- certificat ;
- logs ;
- dernière modification ;
- recommandation ;
- risque.

## 11. Documentation à vérifier

Vérifier l’existence des fichiers :

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

Vérifier si `SUIVI.md` contient :

```md
# POINT DE REPRISE COURANT
```

Ne crée aucun fichier pendant cet audit. Signale uniquement ce qui manque.

## 12. Rapports attendus

Créer sur la machine MCP :

```bash
/opt/wealthtech-audit-mcp/reports/AUDIT_GLOBAL_S1_S2_WEALTHTECH.md
/opt/wealthtech-audit-mcp/reports/AUDIT_GLOBAL_S1_S2_WEALTHTECH.html
/opt/wealthtech-audit-mcp/reports/AUDIT_GLOBAL_S1_S2_WEALTHTECH.txt
/opt/wealthtech-audit-mcp/reports/AUDIT_GLOBAL_S1_S2_WEALTHTECH.json
/opt/wealthtech-audit-mcp/reports/AUDIT_GLOBAL_S1_S2_WEALTHTECH_COMMANDS.log
```

Puis créer :

```bash
/opt/wealthtech-audit-mcp/exports/AUDIT_GLOBAL_S1_S2_WEALTHTECH.tar.gz
```

## 13. Structure du rapport Markdown

Le rapport doit contenir :

1. Résumé exécutif.
2. Périmètre.
3. Méthodologie.
4. Commandes exécutées.
5. Commandes non exécutées car risquées.
6. État S1.
7. État S2.
8. Inventaire domaines S1.
9. Inventaire domaines S2.
10. Plesk.
11. PM2.
12. Passenger.
13. Docker.
14. Bases de données.
15. `.env` sans secrets.
16. Certificats.
17. Sauvegardes.
18. Fichiers volumineux.
19. Logs.
20. HTTP/HTTPS.
21. Domaines protégés.
22. Domaines à conserver.
23. Domaines à migrer.
24. Domaines à nettoyer plus tard.
25. Documentation existante/manquante.
26. `POINT DE REPRISE COURANT`.
27. Conformité aux instructions.
28. Écarts.
29. Risques.
30. Espace libérable estimé.
31. Préparation migration.
32. Préparation architecture unifiée.
33. Recommandations immédiates.
34. Recommandations différées.
35. Actions interdites sans validation.
36. Plan de prochaine boucle.

## 14. Résultat final attendu

À la fin, fournir :

- chemin du rapport Markdown ;
- chemin du rapport HTML ;
- chemin du rapport JSON ;
- chemin de l’archive `.tar.gz` ;
- commande SCP ;
- résumé S1 ;
- résumé S2 ;
- risques ;
- écarts ;
- prochaines actions ;
- confirmation qu’aucune action destructive n’a été effectuée.
