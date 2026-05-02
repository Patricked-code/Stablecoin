# Stablecoin — Runbook de déploiement Plesk, Magic Link et API backend

Ce document fixe les spécificités réelles observées sur le serveur de production afin d'éviter de reproduire les mêmes erreurs lors des prochaines mises à jour du dépôt `Patricked-code/Stablecoin`.

Aucune clé secrète, clé API, clé Magic, clé privée blockchain ou valeur sensible ne doit être copiée dans ce document ni dans GitHub.

## 1. Domaines de production

Le projet utilise deux sous-domaines distincts :

```text
stablecoin.chainsolutions.fr
api.stablecoin.chainsolutions.fr
```

- `stablecoin.chainsolutions.fr` sert le frontend Next.js.
- `api.stablecoin.chainsolutions.fr` sert l'API métier Express / Sequelize.

## 2. Dossiers serveur identifiés

Frontend actif Plesk / Passenger :

```text
/var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin
```

Backend API métier :

```text
/var/www/vhosts/chainsolutions.fr/api.stablecoin.chainsolutions.fr
```

Autres anciens dossiers présents sur le serveur, mais non actifs pour le frontend courant :

```text
/var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoinNO3
/var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoinNo4
```

Le dossier actif doit toujours être confirmé avec :

```bash
PID=$(ps -eo pid,cmd --cols 3000 | grep -i "Passenger NodeApp" | grep -i "stablecoin" | grep -v grep | awk '{print $1}' | head -1)
readlink -f /proc/$PID/cwd
pwdx $PID
```

## 3. Mode d'exécution

Le frontend n'est pas piloté par PM2. Il est servi par Plesk / Phusion Passenger.

Après un build réussi, le redémarrage se fait avec :

```bash
mkdir -p tmp
touch tmp/restart.txt
```

Ne pas utiliser `pm2 restart all` pour ce projet frontend.

## 4. Dépôts Git

Le serveur avait historiquement :

```text
origin = https://gitlab.com/wealthtech1/stablecoin/stablecoin.git
```

Les corrections récentes ont été appliquées sur :

```text
github = https://github.com/Patricked-code/Stablecoin.git
```

Le dépôt GitHub `Patricked-code/Stablecoin`, branche `main`, est la source à utiliser pour les corrections récentes.

Commande de mise à jour recommandée depuis le frontend actif :

```bash
cd /var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin
git fetch github main
git merge --ff-only github/main
```

Éviter `git pull origin main` tant que `origin` pointe vers l'ancien GitLab.

## 5. Stack frontend observée

Le frontend utilise un socle ancien :

```text
Next.js 10.0.6
React 17.0.1
Node.js 18.20.8 sur le serveur
Plesk / Passenger 6.1.2
```

À cause de cette combinaison, le build nécessite :

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

En cas de segmentation fault ou de build instable, refaire un build propre avec :

```bash
rm -rf .next/cache
NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=4096" npm run build
```

## 6. Correctif PostCSS obligatoire

Le projet Next.js 10 rencontre une incompatibilité avec PostCSS sous Node 18.

Le dépôt a été corrigé pour pinner :

```text
postcss = 8.2.15
```

Commit de référence :

```text
36c1e88 Pin PostCSS for Next 10 build compatibility
```

Si l'erreur suivante réapparaît :

```text
ERR_PACKAGE_PATH_NOT_EXPORTED: Package subpath './lib/parser' is not defined by exports in node_modules/next/node_modules/postcss/package.json
```

alors vérifier s'il existe un PostCSS imbriqué dans Next :

```bash
ls -ld node_modules/next/node_modules/postcss
```

Si présent, le déplacer afin que Next résolve le PostCSS racine compatible :

```bash
mv node_modules/next/node_modules/postcss "node_modules/next/node_modules/postcss.backup-$(date +%Y%m%d-%H%M%S)"
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

## 7. Variables frontend obligatoires

Le frontend actif doit contenir dans `.env.local` au minimum les variables suivantes :

```text
NEXT_PUBLIC_URL_API=
NEXT_PUBLIC_API_KEY_STABLECOIN=
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=
MAGIC_SECRET_KEY=
```

Valeurs réelles à ne jamais committer.

Notes importantes :

- `NEXT_PUBLIC_URL_API` pointe vers `https://api.stablecoin.chainsolutions.fr`.
- `NEXT_PUBLIC_API_KEY_STABLECOIN` doit contenir une clé réellement autorisée par le backend dans la table `Wtiapikeys`.
- `MAGIC_SECRET_KEY` doit être la Secret Key Magic côté serveur.
- Sur le serveur, la variable historique `SC` ressemble à une Secret Key Magic et a été utilisée comme source pour créer l'alias `MAGIC_SECRET_KEY`.
- Toute modification d'une variable `NEXT_PUBLIC_*` nécessite un rebuild Next.js.

## 8. API key backend réellement attendue

Le backend ne valide pas `x-api-key` depuis une variable `.env` simple. Il valide la clé dans la base de données via le modèle Sequelize :

```text
models/wtiapikey.js
```

Le middleware concerné :

```text
middlewares/verifyApiKeyWti.js
```

Logique observée :

```text
Wtiapikey.findOne({ where: { key: apiKey } })
```

La table Sequelize est :

```text
Wtiapikeys
```

Clés observées en base, sans valeurs complètes :

```text
id=1 partner=Stablecoin accessLevel=admin
id=2 partner=Opcvm accessLevel=usersOpcvm
id=3 partner=E-vote accessLevel=usersEvote
```

Pour le frontend de connexion / inscription, la clé utilisée doit permettre les routes :

```text
/api/user/find-all-way-profile
/api/user/find-user-by-email
/api/session/login
/api/session/register
/api/user/send-password-reset-link
/api/user/password-reset/*
```

La clé `id=2`, `partner=Opcvm`, `accessLevel=usersOpcvm`, a été testée avec succès sur :

```text
GET https://api.stablecoin.chainsolutions.fr/api/user/find-all-way-profile
```

et doit être copiée dans le frontend sous :

```text
NEXT_PUBLIC_API_KEY_STABLECOIN=
```

sans jamais afficher ni committer sa valeur.

## 9. Magic Link et callback

Le frontend utilise Magic Link avec :

```text
/callback/
/callback_register/
```

Le fichier `next.config.js` active :

```text
trailingSlash: true
```

Les URLs à autoriser dans Magic Dashboard sont donc :

```text
https://stablecoin.chainsolutions.fr/callback
https://stablecoin.chainsolutions.fr/callback/
https://stablecoin.chainsolutions.fr/callback_register
https://stablecoin.chainsolutions.fr/callback_register/
```

La route Next.js de validation Magic est :

```text
/api/login/
```

À cause de `trailingSlash: true`, l'appel sans slash :

```text
/api/login
```

renvoie une redirection `308` vers :

```text
/api/login/
```

Test attendu sans token Magic :

```bash
curl -i https://stablecoin.chainsolutions.fr/api/login/
```

Réponse normale attendue :

```json
{"authenticated":false,"message":"Token Magic manquant ou mal formé."}
```

Ce `401` est normal quand aucun token Magic n'est transmis. Il prouve que `MAGIC_SECRET_KEY` est bien chargée et que la route répond.

## 10. Flux de connexion à respecter

Le formulaire de connexion / inscription est dans :

```text
components/Authentication/RegisterForm.js
```

Le flux attendu est :

```text
1. L'utilisateur saisit son email.
2. Le frontend appelle /api/user/find-user-by-email avec x-api-key.
3. Si l'utilisateur existe, le formulaire affiche le mot de passe.
4. Le frontend appelle /api/session/login avec x-api-key.
5. Si l'API métier renvoie un token, il est stocké dans localStorage sous tokenEnCours.
6. Magic Link est déclenché vers /callback/ ou /callback_register/.
7. Le callback récupère le DID token Magic.
8. Le callback appelle /api/login/ côté Next.js.
9. /api/login/ valide le DID token avec MAGIC_SECRET_KEY.
10. Redirection vers /profil/dashboard/ ou /account/firstEdition.
```

## 11. Vérifications de déploiement recommandées

Après toute mise à jour :

```bash
cd /var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin
NODE_OPTIONS=--openssl-legacy-provider npm run build
mkdir -p tmp
touch tmp/restart.txt
```

Puis vérifier :

```bash
curl -I https://stablecoin.chainsolutions.fr/
curl -I https://stablecoin.chainsolutions.fr/auth/authentication/
curl -I https://stablecoin.chainsolutions.fr/callback/
curl -I https://stablecoin.chainsolutions.fr/callback_register/
curl -i https://stablecoin.chainsolutions.fr/api/login/
```

Tester aussi l'API métier avec la clé frontend, sans afficher la clé :

```bash
FRONT_ENV="/var/www/vhosts/chainsolutions.fr/stablecoin.chainsolutions.fr/stablecoin/.env.local"
API_URL=$(grep "^NEXT_PUBLIC_URL_API=" "$FRONT_ENV" | head -1 | cut -d= -f2- | sed 's:/*$::')
API_KEY=$(grep "^NEXT_PUBLIC_API_KEY_STABLECOIN=" "$FRONT_ENV" | head -1 | cut -d= -f2-)

curl -sS -i \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  "$API_URL/api/user/find-all-way-profile" | head -80

unset API_KEY
```

La réponse attendue est `HTTP/2 200` avec les profils disponibles.

## 12. Avertissements non bloquants observés

Pendant le build, les avertissements suivants peuvent apparaître :

```text
When server rendering, you must wrap your application in an <SSRProvider>
```

et :

```text
Erreur lors du parsing de productTypes: SyntaxError: Unexpected token u in JSON at position 0
```

Ils ne bloquent pas actuellement la génération du build, mais ils doivent être traités plus tard dans une correction dédiée.

## 13. Sécurité blockchain à traiter séparément

Le serveur contient une variable :

```text
NEXT_PUBLIC_PRIVATE_KEY=
```

Si cette valeur est une vraie clé privée blockchain, elle est exposée au navigateur et doit être considérée comme compromise.

À traiter dans une étape séparée :

```text
1. retirer toute clé privée du frontend ;
2. déplacer les signatures et opérations sensibles côté backend ;
3. rotater la clé si elle a réellement été exposée ;
4. vérifier les rôles on-chain et les permissions des contrats.
```

Ne pas corriger cela de manière improvisée dans le flux de réparation Magic Link, car cela peut casser les modules blockchain existants.

## 14. Règle de travail pour les prochaines modifications

Pour ce projet ancien :

```text
- une action à la fois ;
- pas de branche parallèle sauf décision explicite ;
- ne jamais committer les secrets ;
- toujours confirmer le dossier Passenger actif ;
- toujours builder avec NODE_OPTIONS=--openssl-legacy-provider ;
- toujours tester /api/login/ avec slash final ;
- toujours tester la clé Wtiapikey backend avant de conclure que le frontend est cassé.
```
