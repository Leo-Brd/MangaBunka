![image](https://github.com/user-attachments/assets/be1158b2-eca8-486e-9aaa-50778adde47a)

# Mangabunka - Quiz Manga & Anime

Mangabunka est un site de quiz interactif sur les mangas et animes. Teste tes connaissances et défie d'autres joueurs dans des parties de 20 questions en mode **"All"** ou selon la difficulté : **Easy**, **Medium** et **Hard**.

## ⚙ Fonctionnalités

- **Compte utilisateur** : Inscription, connexion et personnalisation du profil (photo et pseudo).
- **Modes de jeu** :
  - Mode **All** : 20 questions aléatoires tous niveaux confondus.
  - Mode **Easy, Medium, Hard** : 20 questions adaptées au niveau choisi.
- **Classement** : Suivi des meilleurs joueurs.
- **Statistiques du joueur** : Nombre de parties jouées, score moyen, niveau et XP.
- [**API Open Trivia**](https://opentdb.com/api_config.php) : Génération des questions.

## 🛠️ Technologies utilisées

### Frontend
- **React.js** ⚛️
- **Sass** 🎨

### Backend
- **Node.js & Express.js** 🟢
- **MongoDB** 🍃 (Base de données NoSQL)

## 📦 Installation

### Prérequis
- **Node.js** installé sur votre machine
- **MongoDB** en local ou via un service cloud (MongoDB Atlas)

### 1️⃣ Cloner le projet
```sh
git clone https://github.com/Leo-Brd/mangabunka.git
cd mangabunka
```

### 2️⃣ Installer les dépendances

#### Frontend
```sh
cd frontend
npm install
```

#### Backend
```sh
cd backend
npm install
```

### 3️⃣ Configurer les variables d'environnement
Créer un fichier **.env** dans le dossier **backend** et y ajouter :
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
```

### 4️⃣ Lancer le projet

#### Démarrer le backend
```sh
cd backend
npm start
```

#### Démarrer le frontend
```sh
cd frontend
npm start
```

Le site est maintenant accessible à l'adresse : [http://localhost:3000](http://localhost:3000) 🎉



