// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO : Remplacez cet objet par la configuration de votre projet Firebase !
// Vous trouverez ces clés dans votre Console Firebase > Paramètres du projet.
// Consultez le fichier TUTORIAL.md pour plus de détails.
const firebaseConfig = {
  apiKey: "AIzaSyCOkHREzZXOwCQnWrDUSqJ1-DNWioO2k8I",
  authDomain: "aura-parfums-prod.firebaseapp.com",
  projectId: "aura-parfums-prod",
  storageBucket: "aura-parfums-prod.firebasestorage.app",
  messagingSenderId: "736250257275",
  appId: "1:736250257275:web:a1a6632f4c43b3e7dfa7de",
  measurementId: "G-H69P4912T5"
};

// Initialisation de Firebase
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Erreur lors de l'initialisation de Firebase : ", error);
  console.warn("N'oubliez pas d'ajouter vos clés Firebase dans firebase-config.js !");
}

export { auth, db };
