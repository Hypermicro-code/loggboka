import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Bruk denne konfigurasjonen fra Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDVCiUp3qy0hYLQQ3D1jPpfndCVOKEHEZg",
  authDomain: "befaringsappen.firebaseapp.com",
  projectId: "befaringsappen",
  storageBucket: "befaringsappen.appspot.com",  // OBS: Rettet suffix til .appspot.com som er vanlig
  messagingSenderId: "455917300957",
  appId: "1:455917300957:web:f9de52cca26e174c5f7f34",
  databaseURL: "https://befaringsappen-default-rtdb.europe-west1.firebasedatabase.app/"  // Legg alltid til databaseURL manuelt
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, child };
