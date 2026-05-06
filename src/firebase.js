import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGZ-HxNPKB8U6cGtTRFjjidimACD-a2XQ",
  authDomain: "projeto-de-bloco-45aca.firebaseapp.com",
  projectId: "projeto-de-bloco-45aca",
  storageBucket: "projeto-de-bloco-45aca.firebasestorage.app",
  messagingSenderId: "985710008196",
  appId: "1:985710008196:web:6835385bf11f246813efd1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);