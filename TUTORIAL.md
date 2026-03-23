# Tutoriel : Mise en place complète de Firebase pour AURA Parfums

Félicitations, le code source de la boutique est désormais prêt ! 
Les fonctionnalités d'Authentification (création de compte/connexion), de sauvegarde de paniers en temps réel (pour suivre les paniers abandonnés), et le Dashboard Admin ont été intégrées.

Cependant, pour que tout cela fonctionne, vous devez connecter le site à **votre propre projet Firebase**. Ce tutoriel ultra détaillé vous guidera pas à pas.

---

## Étape 1 : Créer le Projet Firebase
1. Rendez-vous sur la console Firebase : [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Connectez-vous avec votre compte Google.
3. Cliquez sur **"Créer un projet"** (ou "Ajouter un projet").
4. Entrez le nom du projet (ex: `aura-parfums-prod`).
5. (Optionnel) Activez ou désactivez Google Analytics, puis cliquez sur **"Créer le projet"**.
6. Attendez quelques secondes et cliquez sur "Continuer".

---

## Étape 2 : Activer l'Authentification
1. Dans le menu de gauche de la Console Firebase, cliquez sur **"Créer"** (Build) > **"Authentication"**.
2. Cliquez sur **"Commencer"**.
3. Dans l'onglet **"Sign-in method"** (Modes de connexion), cliquez sur le fournisseur **"Adresse e-mail/Mot de passe"**.
4. Cochez la première case "**Activer**" et cliquez sur **"Enregistrer"**.
5. (Optionnel) Pour tester le Dashboard Admin plus tard, allez dans l'onglet **"Users"** (Utilisateurs) et cliquez sur **"Ajouter un utilisateur"** pour créer directement votre compte Administrateur avec votre email et un mot de passe.

---

## Étape 3 : Configurer la base de données (Cloud Firestore)
Pour sauvegarder les paniers et générer les statistiques du Dashboard :
1. Dans le menu de gauche, sous "Créer" (Build), cliquez sur **"Firestore Database"**.
2. Cliquez sur **"Créer une base de données"**.
3. Choisissez l'emplacement du serveur (ex: **`eur3 (Europe)`** pour que ce soit proche de la France) et faites **Suivant**.
4. Au moment de choisir les règles de sécurité, sélectionnez **"Démarrer en mode test"** (*Start in test mode*) et cliquez sur **"Activer"**. 
   *(Le mode test permet à n'importe quel visiteur d'écrire dans la base pendant 30 jours, c'est idéal pour vérifier que tout marche avant de sécuriser pour la production).*

---

## Étape 4 : Obtenir vos clés de configuration secrètes
1. Retournez sur la page d'accueil (Vue d'ensemble) de votre projet Firebase en cliquant sur l'icône de la petite maison en haut à gauche, ou sur "Project Overview".
2. Sous le nom de votre projet au centre de l'écran, cliquez sur l'icône **Web** `</>`.
3. Donnez un pseudo à votre application (ex: `aura-web`) et cliquez sur **"Enregistrer l'application"**. Ne cochez pas Firebase Hosting car votre site est sur GitHub.
4. Un bloc de code s'affiche avec votre objet `firebaseConfig`. Copiez **uniquement l'intérieur** de la constante `firebaseConfig`. Cela ressemble à ça :
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "aura-parfums.firebaseapp.com",
  projectId: "aura-parfums",
  storageBucket: "aura-parfums.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abcd123"
};
```

---

## Étape 5 : Coller les clés dans votre code
1. Ouvrez le dossier de votre site : `/Volumes/Lexar/BUT MMI/S4/SAE401/aura site final/`.
2. Ouvrez le fichier **`firebase-config.js`** dans votre éditeur de code.
3. Remplacez l'objet fictif `firebaseConfig` par les clés que vous venez de copier depuis Firebase (attention aux guillemets et aux virgules).
4. Sauvegardez le fichier.

---

## Étape 6 : Tester et Déployer
1. **Test local d'abord :** À cause des modules Javascript modernes (`type="module"`), lancer le fichier directement depuis vos dossiers (`file:///`) bloquera certains scripts (Erreur CORS). **Pour tester en local sur votre Mac**, utilisez une extension comme *Live Server* sur VSCode.
   - Ajoutez des articles au panier.
   - Créez un compte via la page Connexion.
   - Allez sur Firebase > Firestore Database, vous verrez une collection `carts` apparaître en direct avec vos paniers !
   - Allez sur la page `/admin-dashboard.html` pour voir les statistiques.
2. **Déploiement sur GitHub :** Puisque le code est prêt et que le config est injecté, il vous suffit de publier les changements :
   - Ouvrez votre terminal (ou l'onglet source control de VSCode).
   - Validez vos changements : `git add .` puis `git commit -m "Intégration Firebase et Dashboard Admin"`.
   - Poussez la mise à jour : `git push origin main` (ou votre branche actuelle).
3. Attendez quelques minutes que GitHub Pages se mette à jour, et **votre boutique en ligne est 100% opérationnelle avec base de données !**

> **Note - Accès au Dashboard** : Le `/admin-dashboard.html` fait appel à l'authentification Firebase. Si vous vous y rendez en étant connecté à n'importe quel compte client, le tableau de bord s'affichera. Lorsque vous voudrez sécuriser ça en production réelle, vous devrez rajouter une vérification du rôle (Custom Claims ou collection Firestore `admins`) pour ne laisser passer que *vous*.

Félicitations pour le lancement public de AURA ! 🚀
