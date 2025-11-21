// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBEgUqxsgjw8Lpw65y806pUS0Bn1vUrFOc",
    authDomain: "cycloconnect.firebaseapp.com",
    projectId: "cycloconnect",
    storageBucket: "cycloconnect.firebasestorage.app",
    messagingSenderId: "536101435592",
    appId: "1:536101435592:web:fc7d9953b0565047b74dfd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Persistencia recomendada para web: mantiene sesión tras recargar pestaña
// Se configura de forma asíncrona sin await top-level
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting auth persistence:", error);
});

export { app, auth };