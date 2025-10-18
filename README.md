# Test technique Kresus

Application de todo list.

## Accès rapide

- [Prérequis](#prérequis)
- [Installation](#installation)
  - [Backend (NestJS)](#backend-nestjs)
  - [Frontend (Vue 3)](#frontend-vue-3)
- [Utilisation](#utilisation)

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 22.17.1)


## Installation

### Backend (NestJS)

1. **Aller dans le dossier backend**

```bash
cd backend
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Initialiser la base de données avec Prisma**

```bash
pnpm run migrate:dev

pnpm run seed
```

4. **Démarrer l'application**

```bash
pnpm run start:dev
```

### Frontend (Vue 3)

1. **Aller dans le dossier frontend**

```bash
cd frontend
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Créer le fichier `.env`**

Créez un fichier `.env` à la racine du dossier `frontend` en copiant le fichier `.env.example` :

```env
VUE_APP_API_URL="http://localhost:3000"
```

4. **Démarrer l'application**

```bash
pnpm run serve
```

## Utilisation

1. **Accédez au frontend** : `http://localhost:8080`
2. **(Optionnel) Se créer un compte** : Se créer un compte en cliquant sur `S'enregistrer`
2. **Connectez-vous** : Se connecter en utilisant les identifiants de votre compte ou bien ceux de l'utilisateur de test => email : `toto@kresus.eu` et mot de passe : `test`
