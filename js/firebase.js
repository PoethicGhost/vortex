// ===== CONEXIÓN CON FIREBASE =====
// Este archivo conecta la página con la base de datos (Firestore) y el login (Authentication).
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

// Estos datos identifican tu proyecto. No son secretos:
// la seguridad la dan las reglas de Firestore, no esta clave.
const firebaseConfig = {
  apiKey: "AIzaSyD-jaXy6UaD3wgxatlOG5qIMKqjCKON0Ak",
  authDomain: "vortex-505.firebaseapp.com",
  projectId: "vortex-505",
  storageBucket: "vortex-505.firebasestorage.app",
  messagingSenderId: "82782007208",
  appId: "1:82782007208:web:711d70875c51fa5449f79d"
};

const app = initializeApp(firebaseConfig);

// Estas dos se usarán en las siguientes páginas
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("Firebase conectado al proyecto:", app.options.projectId);