# LOOP_ENGINEERING — Boucle d'évolution continue de Stablecoin

> **Statut :** `CANONICAL`  
> Cette boucle s'applique à toute intervention technique, documentaire, sécurité, runtime ou MCP.

## Boucle obligatoire

```text
DISCOVER
→ BASELINE
→ SELECT
→ IMPACT_ANALYSIS
→ IMPLEMENT_COMPATIBLY
→ VERIFY
→ REGRESSION_CHECK
→ CORRECT_IF_REQUIRED
→ VERIFY_AGAIN
→ PERSIST_STATE
→ COMMIT
→ VERIFY_REMOTE_STATE
→ SELECT_NEXT
```

## 1. DISCOVER

Identifier repo, branche, HEAD, règles, mémoire persistante, architecture pertinente, runtime éventuel, tâche en cours et preuves existantes. Ne pas recommencer un audit si une baseline exploitable existe.

## 2. BASELINE

Établir l'état avant changement : fichiers concernés, tests disponibles, comportement observé, SHA, état runtime si le runtime est dans le scope. Classifier les informations historiques non reverifiées comme `DOCUMENTED_UNVERIFIED`.

## 3. SELECT

Choisir une action bornée, légitime et compatible avec le point de reprise. Une nouvelle idée ne remplace pas silencieusement une tâche déjà engagée.

## 4. IMPACT_ANALYSIS

Identifier consommateurs, routes, contrats, ABI, configuration, dépendances, base/API, runtime, sécurité et documentation potentiellement impactés. Pour une modification à risque, élargir les vérifications avant d'écrire.

## 5. IMPLEMENT_COMPATIBLY

Modifier le minimum nécessaire. Réutiliser l'existant. Préférer migration/adaptateur compatible à remplacement destructif. Ne jamais profiter d'un chantier pour refactorer sans rapport.

## 6. VERIFY

Exécuter les contrôles adaptés : tests, build, lint/typecheck s'ils existent, vérification Git, contrôles HTTP/API/runtime si le scope le nécessite. Une vérification historique ne prouve pas un nouveau SHA.

## 7. REGRESSION_CHECK

Comparer avec la baseline. Distinguer :

- régression introduite ;
- défaut préexistant ;
- limitation connue ;
- vérification non applicable.

## 8. CORRECT_IF_REQUIRED / VERIFY_AGAIN

Toute régression introduite doit être corrigée avant de poursuivre. Rejouer les vérifications pertinentes après correction.

## 9. PERSIST_STATE

Mettre à jour `SUIVI.md`, `TODO.md`, `DECISIONS.md` ou l'architecture lorsque le changement modifie leur vérité. Conserver les preuves et limites.

## 10. COMMIT / VERIFY_REMOTE_STATE

Utiliser `main` pour le travail normal sauf instruction explicite contraire. Après écriture, vérifier le HEAD distant et que les fichiers attendus existent réellement.

## 11. SELECT_NEXT

Si le chantier continue, enregistrer **une prochaine action exacte**, son scope, ses préconditions et ce qui doit être vérifié avant mutation.

## Conditions d'arrêt

La boucle s'arrête lorsqu'il existe :

- une décision humaine réellement nécessaire ;
- une opération irréversible non autorisée ;
- un secret/credential manquant qui ne doit pas être contourné ;
- une contradiction structurante non résolue ;
- un runtime inaccessible alors que l'action exige une preuve live ;
- aucune prochaine action sûre et prouvable.
